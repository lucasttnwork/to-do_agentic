'use client';

import React, { createContext, useContext, ReactNode, useEffect, useRef } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { AuthUser, AuthState } from '../../lib/auth';
import { DatabaseErrorAlert } from '../shared/DatabaseErrorAlert';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, fullName?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<{ success: boolean; error?: string }>;
  clearError: () => void;
  checkAuth: () => Promise<boolean>;
  updateAuthState: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const auth = useAuth();
  const lastUserState = useRef<AuthUser | null>(null);
  const lastLoadingState = useRef<boolean>(true);
  const correctionAttempts = useRef(0);

  // Verificação inteligente para evitar estado de loading preso
  useEffect(() => {
    // Só executar se houver mudança real no estado
    const userChanged = lastUserState.current !== auth.user;
    const loadingChanged = lastLoadingState.current !== auth.loading;
    
    if (userChanged || loadingChanged) {
      lastUserState.current = auth.user;
      lastLoadingState.current = auth.loading;
      
      // Se está carregando mas já tem usuário, há um problema de estado
      if (auth.loading && auth.user && !loadingChanged) {
        // Evitar console em produção
        
        // Limitar tentativas de correção para evitar loops infinitos
        if (correctionAttempts.current < 3) {
          correctionAttempts.current++;
          
          // Forçar atualização do estado com delay para evitar loop
          const timer = setTimeout(() => {
            if (auth.loading && auth.user) {
              auth.updateAuthState(true);
            }
          }, 500); // Reduzido de 1000ms para 500ms
          
          return () => clearTimeout(timer);
        } else {
          // Evitar console em produção
          // Forçar estado final
          correctionAttempts.current = 0;
        }
      } else {
        // Resetar contador se não há problema
        correctionAttempts.current = 0;
      }
    }
  }, [auth.loading, auth.user, auth.updateAuthState]);

  return (
    <AuthContext.Provider value={auth}>
      {children}
      <DatabaseErrorAlert 
        error={auth.error || ''} 
        onRetry={auth.updateAuthState}
      />
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuthContext deve ser usado dentro de um AuthProvider');
  }
  
  return context;
}
