import { useState, useEffect } from 'react';

interface LoadingSpinnerProps {
  message?: string;
  subMessage?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'premium' | 'minimal';
}

export function LoadingSpinner({ 
  message = 'Carregando...', 
  subMessage,
  size = 'md',
  variant = 'default'
}: LoadingSpinnerProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Renderizar estado inicial consistente para evitar hidratação
  if (!isClient) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>{message}</p>
        </div>
      </div>
    );
  }

  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16'
  };

  const variantClasses = {
    default: 'border-b-2 border-blue-600',
    premium: 'border-4 border-blue-500/30 border-t-blue-500',
    minimal: 'border-2 border-white/20 border-t-white'
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="text-center text-white">
        <div className={`animate-spin rounded-full ${sizeClasses[size]} ${variantClasses[variant]} mx-auto mb-4`}></div>
        <p className="text-lg font-medium">{message}</p>
        {subMessage && (
          <p className="text-sm text-slate-400 mt-2 max-w-md mx-auto">
            {subMessage}
          </p>
        )}
      </div>
    </div>
  );
}

// Componente específico para dashboard
export function DashboardLoadingSpinner() {
  return (
    <LoadingSpinner
      message="Carregando dashboard..."
      subMessage="Se demorar muito, tente recarregar a página"
      size="lg"
      variant="premium"
    />
  );
}

// Componente para inicialização
export function InitializationSpinner() {
  return (
    <LoadingSpinner
      message="Inicializando..."
      size="md"
      variant="minimal"
    />
  );
}

// Componente para logout - mais responsivo
export function LogoutSpinner() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="text-center text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500/30 border-t-blue-500 mx-auto mb-4"></div>
        <p className="text-lg font-medium">Fazendo logout...</p>
        <p className="text-sm text-slate-400 mt-2">Redirecionando para a página de login</p>
      </div>
    </div>
  );
}

// Componente de loading inline para ações específicas
export function InlineSpinner({ size = 'sm', message }: { size?: 'sm' | 'md'; message?: string }) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6'
  };

  return (
    <div className="flex items-center space-x-2">
      <div className={`animate-spin rounded-full ${sizeClasses[size]} border-2 border-blue-500/30 border-t-blue-500`}></div>
      {message && <span className="text-sm text-slate-400">{message}</span>}
    </div>
  );
}
