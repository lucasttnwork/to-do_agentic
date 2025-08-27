import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase/client';
import { 
  AuthUser, 
  AuthState, 
  getCurrentUser, 
  getCurrentSession,
  signIn as authSignIn,
  signUp as authSignUp,
  signOut as authSignOut,
  isAuthenticated
} from '../lib/auth';
import { Session } from '@supabase/supabase-js';

// Chave para persistência local
const AUTH_STORAGE_KEY = 'taskflow_auth_state';

// Função para salvar estado no localStorage
const saveAuthState = (state: AuthState) => {
  if (typeof window === 'undefined') return;
  
  try {
    const stateToSave = {
      user: state.user,
      session: state.session,
      timestamp: Date.now()
    };
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(stateToSave));
  } catch (error) {
    console.warn('Erro ao salvar estado de auth no localStorage:', error);
  }
};

// Função para carregar estado do localStorage
const loadAuthState = (): Partial<AuthState> | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    const saved = localStorage.getItem(AUTH_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Verificar se o estado não é muito antigo (mais de 1 hora)
      if (Date.now() - parsed.timestamp < 3600000) {
        return {
          user: parsed.user,
          session: parsed.session
        };
      }
    }
  } catch (error) {
    console.warn('Erro ao carregar estado de auth do localStorage:', error);
  }
  
  return null;
};

// Função para limpar estado do localStorage
const clearAuthState = () => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  } catch (error) {
    console.warn('Erro ao limpar estado de auth do localStorage:', error);
  }
};

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>(() => {
    // Inicializar com estado padrão para evitar hidratação
    return {
      user: null,
      session: null,
      loading: true,
      error: null
    };
  });

  // Refs para controlar o estado e evitar verificações desnecessárias
  const isInitialized = useRef(false);
  const lastAuthCheck = useRef<number>(0);
  const authCheckTimeout = useRef<NodeJS.Timeout | null>(null);
  const isClient = useRef(false);

  // Função para atualizar o estado de autenticação com throttling reduzido
  const updateAuthState = useCallback(async (force = false) => {
    // Só executar no cliente
    if (typeof window === 'undefined') return;

    // Throttling reduzido: não executar mais de uma vez a cada 500ms (era 2s)
    const now = Date.now();
    if (!force && now - lastAuthCheck.current < 500) {
      console.log('Throttling: ignorando verificação de auth muito frequente');
      return;
    }

    // Se já temos dados válidos e não é forçado, não atualizar
    if (!force && authState.user && authState.session && !authState.loading) {
      console.log('Auth state já está atualizado, ignorando verificação');
      return;
    }

    try {
      lastAuthCheck.current = now;
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      
      const [user, session] = await Promise.all([
        getCurrentUser(),
        getCurrentSession()
      ]);

      const newState = {
        user,
        session,
        loading: false,
        error: null
      };

      setAuthState(newState);
      
      // Salvar estado no localStorage se tiver usuário
      if (user && isClient.current) {
        saveAuthState(newState);
      }
    } catch (error) {
      console.error('Erro ao atualizar estado de autenticação:', error);
      
      // Verificar se é um erro relacionado à tabela users
      if (error instanceof Error && error.message.includes('relation "users" does not exist')) {
        const errorState = {
          user: null,
          session: null,
          loading: false,
          error: 'Configuração do banco de dados incompleta. Entre em contato com o administrador.'
        };
        setAuthState(errorState);
        if (isClient.current) {
          clearAuthState();
        }
      } else {
        const errorState = {
          user: null,
          session: null,
          loading: false,
          error: 'Erro ao carregar autenticação. Tente fazer login novamente.'
        };
        setAuthState(errorState);
        if (isClient.current) {
          clearAuthState();
        }
      }
    }
  }, [authState.user, authState.session, authState.loading]);

  // Função para fazer login - otimizada para ser mais rápida
  const login = useCallback(async (email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      
      const result = await authSignIn(email, password);
      
      if (result.success) {
        // Login bem-sucedido - atualizar estado imediatamente
        await updateAuthState(true);
        return { success: true };
      } else {
        setAuthState(prev => ({ ...prev, loading: false, error: result.error || 'Erro no login' }));
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Erro no login:', error);
      setAuthState(prev => ({ ...prev, loading: false, error: 'Erro interno do servidor' }));
      return { success: false, error: 'Erro interno do servidor' };
    }
  }, [updateAuthState]);

  // Função para fazer registro
  const register = useCallback(async (email: string, password: string, fullName?: string) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      
      const result = await authSignUp(email, password, fullName);
      
      if (result.success) {
        await updateAuthState(true); // Forçar atualização após registro
        return { success: true };
      } else {
        setAuthState(prev => ({ ...prev, loading: false, error: result.error || 'Erro no registro' }));
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Erro no registro:', error);
      setAuthState(prev => ({ ...prev, loading: false, error: 'Erro interno do servidor' }));
      return { success: false, error: 'Erro interno do servidor' };
    }
  }, [updateAuthState]);

  // Função para fazer logout - corrigida para não travar
  const logout = useCallback(async () => {
    try {
      // Limpar estado imediatamente para feedback visual
      const logoutState = {
        user: null,
        session: null,
        loading: false,
        error: null
      };
      setAuthState(logoutState);
      
      // Limpar localStorage imediatamente
      if (isClient.current) {
        clearAuthState();
      }
      
      // Executar logout do Supabase em background
      const result = await authSignOut();
      
      if (result.success) {
        console.log('Logout realizado com sucesso');
        return { success: true };
      } else {
        console.error('Erro no logout:', result.error);
        // Mesmo com erro, o estado já foi limpo
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Erro no logout:', error);
      // Mesmo com erro, o estado já foi limpo
      return { success: false, error: 'Erro interno do servidor' };
    }
  }, []);

  // Função para limpar erro
  const clearError = useCallback(() => {
    setAuthState(prev => ({ ...prev, error: null }));
  }, []);

  // Função para verificar se está autenticado
  const checkAuth = useCallback(async () => {
    try {
      const authenticated = await isAuthenticated();
      if (!authenticated) {
        const unauthenticatedState = {
          user: null,
          session: null,
          loading: false,
          error: null
        };
        setAuthState(unauthenticatedState);
        if (isClient.current) {
          clearAuthState();
        }
      }
      return authenticated;
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
      return false;
    }
  }, []);

  // Efeito para inicializar autenticação apenas uma vez
  useEffect(() => {
    if (isInitialized.current) return;
    
    console.log('Inicializando hook de autenticação...');
    isInitialized.current = true;
    isClient.current = true;
    
    // Carregar estado salvo se disponível
    const savedState = loadAuthState();
    if (savedState?.user && savedState?.session) {
      console.log('Usando estado de auth salvo, verificando validade...');
      setAuthState(prev => ({
        ...prev,
        user: savedState.user,
        session: savedState.session,
        loading: false
      }));
      // Verificar se a sessão ainda é válida em background
      updateAuthState(true);
    } else {
      updateAuthState();
    }

    // Listener para mudanças de autenticação com debouncing reduzido
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Mudança de estado de autenticação:', event, session);
        
        // Limpar timeout anterior se existir
        if (authCheckTimeout.current) {
          clearTimeout(authCheckTimeout.current);
        }
        
        // Debounce reduzido: aguardar 200ms antes de executar (era 500ms)
        authCheckTimeout.current = setTimeout(async () => {
          if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
            // Só atualizar se realmente houver mudança
            if (!authState.user || !authState.session) {
              await updateAuthState(true);
            }
          } else if (event === 'SIGNED_OUT') {
            const signedOutState = {
              user: null,
              session: null,
              loading: false,
              error: null
            };
            setAuthState(signedOutState);
            if (isClient.current) {
              clearAuthState();
            }
          }
        }, 200);
      }
    );

    return () => {
      if (authCheckTimeout.current) {
        clearTimeout(authCheckTimeout.current);
      }
      subscription.unsubscribe();
    };
  }, [updateAuthState, authState.user, authState.session]);

  // Cleanup ao desmontar
  useEffect(() => {
    return () => {
      if (authCheckTimeout.current) {
        clearTimeout(authCheckTimeout.current);
      }
    };
  }, []);

  return {
    ...authState,
    login,
    register,
    logout,
    clearError,
    checkAuth,
    updateAuthState
  };
}
