'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '../components/auth/AuthProvider';

export default function Home() {
  const { user, loading } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center text-white">
        <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          TaskFlow AI
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          Gerenciamento inteligente de tarefas com IA conversacional
        </p>
        <p className="text-lg text-gray-400 mb-12">
          Crie, organize e priorize suas tarefas usando linguagem natural. 
          Nossa IA entende o que você precisa e organiza automaticamente.
        </p>
        
        <div className="space-x-4">
          <a
            href="/login"
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-medium text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 inline-block shadow-lg hover:shadow-xl"
          >
            Fazer Login
          </a>
          <a
            href="/register"
            className="bg-transparent border-2 border-white/30 text-white px-8 py-4 rounded-lg font-medium text-lg hover:bg-white/10 transition-all duration-200 inline-block"
          >
            Criar Conta
          </a>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="text-3xl mb-3">🤖</div>
            <h3 className="text-lg font-semibold mb-2">IA Conversacional</h3>
            <p className="text-gray-300 text-sm">
              Crie tarefas conversando naturalmente com nossa IA
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="text-3xl mb-3">⚡</div>
            <h3 className="text-lg font-semibold mb-2">Tempo Real</h3>
            <p className="text-gray-300 text-sm">
              Sincronização automática entre todos os dispositivos
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="text-3xl mb-3">🎯</div>
            <h3 className="text-lg font-semibold mb-2">Organização Inteligente</h3>
            <p className="text-gray-300 text-sm">
              Priorização automática e organização por contexto
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
