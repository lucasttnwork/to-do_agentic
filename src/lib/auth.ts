import { supabase } from './supabase/client';
import { User, Session } from '@supabase/supabase-js';

export interface AuthUser {
  id: string;
  email: string;
  full_name?: string;
  preferences?: Record<string, any>;
}

export interface AuthState {
  user: AuthUser | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
}

// Função para obter usuário atual
export async function getCurrentUser(): Promise<AuthUser | null> {
  // Só executar no cliente
  if (typeof window === 'undefined') return null;

  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      return null;
    }

    // Buscar dados adicionais do usuário na tabela users
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (userError) {
      // Verificar se é um erro de tabela não encontrada
      if (userError.code === 'PGRST116' || userError.message?.includes('relation "users" does not exist')) {
        console.warn('Tabela users não encontrada. Criando perfil básico do usuário...');
        
        // Tentar criar o perfil do usuário
        try {
          await createOrUpdateUserProfile(user);
          
          // Retornar dados básicos após criar o perfil
          return {
            id: user.id,
            email: user.email || '',
            full_name: user.user_metadata?.full_name,
            preferences: {}
          };
        } catch (createError) {
          console.error('Erro ao criar perfil do usuário:', createError);
          // Retornar dados básicos mesmo se falhar
          return {
            id: user.id,
            email: user.email || '',
            full_name: user.user_metadata?.full_name,
            preferences: {}
          };
        }
      } else {
        console.error('Erro ao buscar dados do usuário:', userError);
        // Retornar dados básicos se não conseguir buscar dados adicionais
        return {
          id: user.id,
          email: user.email || '',
          full_name: user.user_metadata?.full_name,
          preferences: {}
        };
      }
    }

    return {
      id: userData.id,
      email: userData.email,
      full_name: userData.full_name,
      preferences: userData.preferences || {}
    };
  } catch (error) {
    console.error('Erro ao obter usuário atual:', error);
    return null;
  }
}

// Função para obter sessão atual
export async function getCurrentSession(): Promise<Session | null> {
  // Só executar no cliente
  if (typeof window === 'undefined') return null;

  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Erro ao obter sessão:', error);
      return null;
    }

    return session;
  } catch (error) {
    console.error('Erro ao obter sessão:', error);
    return null;
  }
}

// Função para fazer login
export async function signIn(email: string, password: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      return { success: false, error: error.message };
    }

    if (data.user) {
      // Criar ou atualizar registro na tabela users
      await createOrUpdateUserProfile(data.user);
    }

    return { success: true };
  } catch (error) {
    console.error('Erro no login:', error);
    return { success: false, error: 'Erro interno do servidor' };
  }
}

// Função para fazer registro
export async function signUp(email: string, password: string, fullName?: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName
        }
      }
    });

    if (error) {
      return { success: false, error: error.message };
    }

    if (data.user) {
      // Criar perfil do usuário na tabela users
      await createOrUpdateUserProfile(data.user, fullName);
    }

    return { success: true };
  } catch (error) {
    console.error('Erro no registro:', error);
    return { success: false, error: 'Erro interno do servidor' };
  }
}

// Função para fazer logout
export async function signOut(): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Erro no logout:', error);
    return { success: false, error: 'Erro interno do servidor' };
  }
}

// Função para criar ou atualizar perfil do usuário
async function createOrUpdateUserProfile(user: User, fullName?: string): Promise<void> {
  // Só executar no cliente
  if (typeof window === 'undefined') return;

  try {
    const { error } = await supabase
      .from('users')
      .upsert({
        id: user.id,
        email: user.email || '',
        full_name: fullName || user.user_metadata?.full_name,
        preferences: {}
      }, {
        onConflict: 'id'
      });

    if (error) {
      console.error('Erro ao criar/atualizar perfil do usuário:', error);
    }
  } catch (error) {
    console.error('Erro ao criar/atualizar perfil do usuário:', error);
  }
}

// Função para verificar se usuário está autenticado
export async function isAuthenticated(): Promise<boolean> {
  try {
    const session = await getCurrentSession();
    return !!session;
  } catch (error) {
    return false;
  }
}

// Função para obter token de acesso
export async function getAccessToken(): Promise<string | null> {
  try {
    const session = await getCurrentSession();
    return session?.access_token || null;
  } catch (error) {
    return null;
  }
}

// Função para renovar sessão
export async function refreshSession(): Promise<{ success: boolean; error?: string }> {
  try {
    const { data, error } = await supabase.auth.refreshSession();
    
    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Erro ao renovar sessão:', error);
    return { success: false, error: 'Erro interno do servidor' };
  }
}
