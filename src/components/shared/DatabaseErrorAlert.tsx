import React from 'react';
import { Database, ExternalLink } from 'lucide-react';

interface DatabaseErrorAlertProps {
  error: string;
  onRetry?: () => void;
}

export function DatabaseErrorAlert({ error, onRetry }: DatabaseErrorAlertProps) {
  const isDatabaseError = error.includes('Configuração do banco de dados') || 
                         error.includes('relation "users" does not exist');

  if (!isDatabaseError) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-red-100 rounded-full">
            <Database className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Erro de Configuração</h3>
            <p className="text-sm text-gray-600">Banco de dados não configurado</p>
          </div>
        </div>
        
        <p className="text-gray-700 mb-4">
          O sistema detectou que as tabelas necessárias não foram criadas no Supabase. 
          Isso é necessário para o funcionamento correto do sistema.
        </p>

        <div className="space-y-3">
          <a
            href="https://supabase.com/dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Acessar Supabase Dashboard
          </a>
          
          {onRetry && (
            <button
              onClick={onRetry}
              className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Tentar Novamente
            </button>
          )}
        </div>

        <div className="mt-4 p-3 bg-gray-50 rounded-md">
          <p className="text-xs text-gray-600">
            <strong>Projeto:</strong> kdlvebimzmwsyfcrevng<br />
            <strong>Passo:</strong> Execute o SQL fornecido no arquivo SETUP_SUPABASE.md
          </p>
        </div>
      </div>
    </div>
  );
}
