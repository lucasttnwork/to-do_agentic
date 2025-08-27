import { useState, useEffect, useRef } from 'react';

export function usePageVisibility() {
  // Verificar se estamos no cliente antes de acessar document
  const [isVisible, setIsVisible] = useState(true);
  const [visibilityState, setVisibilityState] = useState<'visible' | 'hidden'>('visible');
  
  // Refs para controlar mudanças desnecessárias
  const lastVisibilityState = useRef<'visible' | 'hidden'>('visible');
  const visibilityChangeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Só executar no cliente
    if (typeof window === 'undefined') return;

    // Inicializar com valores corretos do cliente
    setIsVisible(!document.hidden);
    setVisibilityState(document.visibilityState);
    lastVisibilityState.current = document.visibilityState;

    const handleVisibilityChange = () => {
      const newVisibilityState = document.visibilityState;
      const newIsVisible = !document.hidden;
      
      // Só atualizar se realmente houver mudança
      if (newVisibilityState !== lastVisibilityState.current) {
        console.log('Mudança de visibilidade detectada:', newVisibilityState);
        
        // Debounce para evitar mudanças muito frequentes
        if (visibilityChangeTimeout.current) {
          clearTimeout(visibilityChangeTimeout.current);
        }
        
        visibilityChangeTimeout.current = setTimeout(() => {
          setIsVisible(newIsVisible);
          setVisibilityState(newVisibilityState);
          lastVisibilityState.current = newVisibilityState;
        }, 100);
      }
    };

    // Adicionar listeners para diferentes eventos de visibilidade
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Para navegadores mais antigos
    document.addEventListener('webkitvisibilitychange', handleVisibilityChange);
    document.addEventListener('msvisibilitychange', handleVisibilityChange);

    // Listener para quando a janela ganha foco (útil para mudanças de aba)
    const handleFocus = () => {
      // Só atualizar se realmente estiver mudando de hidden para visible
      if (lastVisibilityState.current === 'hidden') {
        console.log('Janela ganhou foco, atualizando visibilidade');
        setIsVisible(true);
        setVisibilityState('visible');
        lastVisibilityState.current = 'visible';
      }
    };

    const handleBlur = () => {
      // Só atualizar se realmente estiver mudando de visible para hidden
      if (lastVisibilityState.current === 'visible') {
        console.log('Janela perdeu foco, atualizando visibilidade');
        setIsVisible(false);
        setVisibilityState('hidden');
        lastVisibilityState.current = 'hidden';
      }
    };

    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);

    return () => {
      if (visibilityChangeTimeout.current) {
        clearTimeout(visibilityChangeTimeout.current);
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('webkitvisibilitychange', handleVisibilityChange);
      document.removeEventListener('msvisibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);

  return {
    isVisible,
    visibilityState,
    isHidden: !isVisible
  };
}
