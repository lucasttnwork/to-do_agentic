'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/components/auth/AuthProvider';
import StatsCards from '@/components/dashboard/StatsCards';
import ChatInput from '@/components/chat/ChatInput';

import { DashboardLoadingSpinner, InitializationSpinner, LogoutSpinner } from '@/components/shared/LoadingSpinner';

export default function DashboardPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedWorkspace, setSelectedWorkspace] = useState('NTEX');
  const [selectedProject, setSelectedProject] = useState('Academia SP');
  const [loadingTimeout, setLoadingTimeout] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  const { user, loading, logout, updateAuthState } = useAuthContext();
  const router = useRouter();
  
  // Refs para controlar verificações desnecessárias
  const hasInitialized = useRef(false);
  const lastAuthCheck = useRef<number>(0);
  const correctionAttempts = useRef(0);

  // Marcar quando o componente está no cliente para evitar hidratação
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Timeout de segurança para evitar loading infinito
  useEffect(() => {
    if (loading) {
      const timeout = setTimeout(() => {
        console.log('Timeout de loading atingido, forçando estado...');
        setLoadingTimeout(true);
      }, 5000); // Timeout reduzido para 5s

      return () => clearTimeout(timeout);
    } else {
      setLoadingTimeout(false);
    }
  }, [loading]);

  // Verificação inteligente para estados inconsistentes
  useEffect(() => {
    if (loading && user) {
      console.log('Estado inconsistente detectado no dashboard: loading=true mas user existe');
      
      // Tentar corrigir o estado
      const timer = setTimeout(() => {
        if (loading && user) {
          updateAuthState();
        }
      }, 200);
      
      return () => clearTimeout(timer);
    }
  }, [loading, user, updateAuthState]);

  // Verificar autenticação quando necessário
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Marcar como inicializado quando o usuário for carregado
  useEffect(() => {
    if (user) {
      console.log('Dashboard inicializado com sucesso para usuário:', user.email);
    }
  }, [user]);

  // Função de logout otimizada
  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      const result = await logout();
      
      if (result.success) {
        // Redirecionar para login após logout bem-sucedido
        router.push('/login');
      } else {
        // Se houver erro, ainda redirecionar mas mostrar mensagem
        console.error('Erro no logout:', result.error);
        router.push('/login');
      }
    } catch (error) {
      console.error('Erro inesperado no logout:', error);
      // Redirecionar mesmo com erro
      router.push('/login');
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Renderizar loading apenas no cliente para evitar hidratação
  if (!isClient) {
    return <InitializationSpinner />;
  }

  // Mostrar loading quando necessário
  if (loading) {
    return <DashboardLoadingSpinner />;
  }

  // Mostrar spinner de logout se estiver fazendo logout
  if (isLoggingOut) {
    return <LogoutSpinner />;
  }

  // Fallback se o loading demorar muito
  if (loadingTimeout && !user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="mb-4 text-red-400">⚠️</div>
          <p className="mb-4">Problema ao carregar o dashboard</p>
          <button 
            onClick={() => updateAuthState()} 
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors mr-2"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  // Se não estiver autenticado, redirecionar para login
  if (!user) {
    router.push('/login');
    return null;
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Premium com Profundidade */}
      <div className="fixed inset-0 -z-10">
        {/* Gradient Base */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900/20 via-purple-900/20 to-slate-900" />
        
        {/* Floating Orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-2xl animate-pulse delay-1000" />
        <div className="absolute top-3/4 left-1/3 w-32 h-32 bg-gradient-to-r from-green-500/15 to-blue-500/15 rounded-full blur-2xl animate-pulse delay-500" />
        
        {/* Noise Texture */}
        <div className="absolute inset-0 opacity-[0.02] bg-[url('data:image/svg+xml,%3Csvg%20viewBox%3D%220%200%20256%20256%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cfilter%20id%3D%22noiseFilter%22%3E%3CfeTurbulence%20type%3D%22fractalNoise%22%20baseFrequency%3D%220.9%22%20numOctaves%3D%224%22%20stitchTiles%3D%22stitch%22/%3E%3C/filter%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20filter%3D%22url%28%23noiseFilter%29%22/%3E%3C/svg%3E')]" />
      </div>
      
      {/* Main content */}
      <div className="relative z-20">
        <div className="flex h-screen text-slate-50">
          {/* Sidebar - Workspaces/Projetos com Liquid Glass */}
          <motion.aside 
            className={`${sidebarCollapsed ? 'w-16' : 'w-64'} backdrop-blur-[40px] bg-gradient-to-b from-slate-900/80 to-slate-800/60 border-r border-white/10 transition-all duration-300 flex flex-col relative z-30 overflow-hidden`}
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Liquid Glass Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 to-slate-800/60 backdrop-blur-[40px] pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-transparent pointer-events-none" />
            
            {/* Floating Elements Internos */}
            <div className="absolute top-1/4 left-1/4 w-20 h-20 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-xl animate-pulse pointer-events-none" />
            <div className="absolute bottom-1/3 right-1/4 w-16 h-16 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-lg animate-pulse delay-1000 pointer-events-none" />
            
            <div className="relative z-10 p-4 border-b border-white/10">
              <motion.button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-white/10 transition-colors group"
                aria-label="Alternar sidebar"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.span 
                  className="text-slate-400 text-xl"
                  animate={{ rotate: sidebarCollapsed ? 0 : 180 }}
                  transition={{ duration: 0.3 }}
                >
                  {sidebarCollapsed ? '→' : '←'}
                </motion.span>
              </motion.button>
            </div>

            {!sidebarCollapsed && (
              <motion.div 
                className="flex-1 overflow-y-auto p-4 relative z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="mb-6">
                  <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">WORKSPACES</h3>
                  <div className="space-y-2">
                    <motion.div 
                      className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/10 cursor-pointer transition-colors group"
                      whileHover={{ x: 6, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="w-6 h-6 bg-gradient-to-r from-red-400 to-pink-400 rounded-full group-hover:scale-110 transition-transform" />
                      <span className="text-slate-200">Pessoal</span>
                    </motion.div>
                    <motion.div 
                      className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/10 cursor-pointer transition-colors group"
                      whileHover={{ x: 6, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="w-6 h-6 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full group-hover:scale-110 transition-transform" />
                      <span className="text-slate-200">NTEX</span>
                    </motion.div>
                    <motion.div 
                      className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/10 cursor-pointer transition-colors group"
                      whileHover={{ x: 6, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-blue-400 rounded-full group-hover:scale-110 transition-transform" />
                      <span className="text-slate-200">Kabbatec</span>
                    </motion.div>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">PROJETOS</h3>
                  <div className="space-y-2">
                    <motion.div 
                      className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/10 cursor-pointer transition-colors group"
                      whileHover={{ x: 6, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className="text-slate-200">Todos os projetos</span>
                    </motion.div>
                    <motion.div 
                      className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/10 cursor-pointer transition-colors group"
                      whileHover={{ x: 6, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className="text-slate-200">Kabbatec</span>
                    </motion.div>
                    <motion.div 
                      className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/10 cursor-pointer transition-colors group"
                      whileHover={{ x: 6, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className="text-slate-200">Cartório</span>
                    </motion.div>
                    <motion.div 
                      className="flex items-center space-x-3 p-2 rounded-lg bg-blue-500/20 border border-blue-500/30 cursor-pointer group"
                      whileHover={{ x: 6, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className="text-blue-300">Academia SP</span>
                    </motion.div>
                  </div>
                </div>

                <motion.button 
                  className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 px-4 rounded-lg font-medium hover:from-purple-600 hover:to-blue-600 transition-all duration-300 shadow-lg group relative overflow-hidden"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Shimmer Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  <span className="relative z-10">+ New Task</span>
                </motion.button>
              </motion.div>
            )}
          </motion.aside>

          {/* Área principal */}
          <main className="flex-1 flex flex-col">
            {/* Header */}
            <motion.header 
              className="p-8 border-b border-white/10 backdrop-blur-[20px] bg-white/5 relative overflow-hidden"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              {/* Header Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent" />
              
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <motion.h1 
                    className="text-3xl font-bold text-white mb-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    Welcome back, {user.full_name || user.email}
                  </motion.h1>
                  <motion.p 
                    className="text-slate-400"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    Ready to organize your tasks with AI
                  </motion.p>
                </div>
                <div className="flex items-center space-x-4">
                  <motion.button
                    onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                    className="p-2 rounded-lg hover:bg-white/10 transition-colors group"
                    aria-label="Alternar sidebar"
                    whileHover={{ scale: 1.05, rotate: 180 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="text-slate-400 text-xl group-hover:text-white transition-colors">
                      {sidebarCollapsed ? '→' : '←'}
                    </span>
                  </motion.button>
                  
                  <motion.button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-colors border border-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: isLoggingOut ? 1 : 1.05 }}
                    whileTap={{ scale: isLoggingOut ? 1 : 0.95 }}
                  >
                    {isLoggingOut ? 'Saindo...' : 'Logout'}
                  </motion.button>
                </div>
              </div>
            </motion.header>

            {/* Stats Cards Premium */}
            <motion.section 
              className="p-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <StatsCards />
            </motion.section>

            {/* Main content */}
            <div className="flex-1 flex p-8 gap-8">
              {/* Chat conversacional com Glassmorphism */}
              <motion.section 
                className="w-96 backdrop-blur-[20px] bg-white/5 border border-white/20 rounded-3xl flex flex-col shadow-2xl shadow-black/20 relative overflow-hidden group"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                whileHover={{ scale: 1.02, y: -5 }}
              >
                {/* Glassmorphism Background */}
                <div className="absolute inset-0 bg-white/5 backdrop-blur-[20px] rounded-3xl" />
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-transparent rounded-3xl" />
                
                {/* Shimmer Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 rounded-3xl" />
                
                <div className="relative z-10 p-6 border-b border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-2">AI Assistant</h3>
                  <p className="text-slate-400 text-sm">NTEX • Academia SP</p>
                </div>
                <div className="flex-1 p-6">
                  <div className="bg-white/5 rounded-lg p-4 mb-4 border border-white/10 backdrop-blur-sm">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-yellow-400">💡</span>
                      <span className="text-slate-300 text-sm">Digite ou grave uma mensagem para criar tarefas automaticamente. Ex: 'Cliente Kabbatec precisa de orçamento até sexta'</span>
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4 mb-4 border border-white/10 backdrop-blur-sm">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-blue-400">💬</span>
                      <span className="text-slate-300 text-sm">Bem-vindo ao seu assistente IA! Comece digitando ou gravando uma mensagem para o sistema irá analisar e organizar suas tarefas de forma inteligente.</span>
                    </div>
                  </div>
                </div>
                <div className="p-6 border-t border-white/10">
                  <ChatInput />
                </div>
              </motion.section>

              {/* Lista de tarefas com Glassmorphism */}
              <motion.section 
                className="flex-1 flex flex-col backdrop-blur-[20px] bg-white/5 border border-white/20 rounded-3xl shadow-2xl shadow-black/20 relative overflow-hidden group"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.0, duration: 0.8 }}
                whileHover={{ scale: 1.01, y: -3 }}
              >
                {/* Glassmorphism Background */}
                <div className="absolute inset-0 bg-white/5 backdrop-blur-[20px] rounded-3xl" />
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-blue-500/5 to-transparent rounded-3xl" />
                
                {/* Shimmer Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 rounded-3xl" />
                
                <div className="relative z-10 p-6 border-b border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-1">
                      <motion.button 
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium shadow-lg shadow-blue-500/25"
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Lista
                      </motion.button>
                      <motion.button 
                        className="px-4 py-2 text-slate-400 hover:text-white rounded-lg text-sm font-medium transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Kanban
                      </motion.button>
                      <motion.button 
                        className="px-4 py-2 text-slate-400 hover:text-white rounded-lg text-sm font-medium transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Timeline
                      </motion.button>
                    </div>
                    <div className="flex space-x-2">
                      <select className="bg-white/5 text-slate-300 text-sm rounded-lg px-3 py-2 border border-white/10 backdrop-blur-sm focus:border-white/30 focus:outline-none transition-colors">
                        <option>Todas as prioridades</option>
                      </select>
                      <select className="bg-white/5 text-slate-300 text-sm rounded-lg px-3 py-2 border border-white/10 backdrop-blur-sm focus:border-white/30 focus:outline-none transition-colors">
                        <option>Todos os status</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="flex-1 overflow-auto p-6">
                  <motion.div 
                    className="bg-white/5 rounded-lg p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 backdrop-blur-sm group cursor-pointer"
                    whileHover={{ scale: 1.02, y: -3 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-white mb-2">Criar campanha Instagram Academia SP</h4>
                        <p className="text-slate-300 mb-3">Desenvolver campanha para redes sociais da academia</p>
                        <div className="flex items-center space-x-4 text-sm text-slate-400">
                          <span>P2 - Normal</span>
                          <span className="text-green-400">Concluído</span>
                          <span>21/02/2025</span>
                          <span>4h</span>
                        </div>
                      </div>
                      <div className="w-24 h-2 bg-slate-600 rounded-full overflow-hidden">
                        <div className="w-full h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full shadow-lg shadow-blue-500/25" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-sm">
                        <span className="text-green-400">✓</span>
                        <span className="text-slate-300">Briefing com cliente</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <span className="text-green-400">✓</span>
                        <span className="text-slate-300">Criar conceito visual</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <span className="text-green-400">✓</span>
                        <span className="text-slate-300">Produzir conteúdo</span>
                      </div>
                    </div>
                    <div className="mt-4 text-xs text-slate-500">
                      Criado em 19/02/2025, 15:10
                    </div>
                  </motion.div>
                </div>
              </motion.section>
            </div>
          </main>
        </div>
      </div>


    </div>
  );
}
