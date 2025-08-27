'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/components/auth/AuthProvider';
import StatsCards from '@/components/dashboard/StatsCards';
import { TaskViewSwitcher } from '@/components/tasks/TaskViewSwitcher';
import CreateTaskModal from '@/components/dashboard/CreateTaskModal';
import { useAppStore } from '@/lib/store';
import { getAccessToken } from '@/lib/auth';
import { useTasks } from '@/hooks/useTasks';
import ChatInput from '@/components/chat/ChatInput';
import { WorkspaceSelector } from '@/components/dashboard/WorkspaceSelector';
import { ProjectList } from '@/components/dashboard/ProjectList';
import { TaskList } from '@/components/tasks/TaskList';

import { DashboardLoadingSpinner, InitializationSpinner, LogoutSpinner } from '@/components/shared/LoadingSpinner';

export default function DashboardPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [loadingTimeout, setLoadingTimeout] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  const { user, loading, logout, updateAuthState } = useAuthContext();
  const router = useRouter();
  const { currentWorkspace, currentProject } = useAppStore();
  const { refresh: refreshTasks } = useTasks({
    workspaceId: currentWorkspace?.id,
    projectId: currentProject?.id,
  });
  
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

  // Se não estiver autenticado, mostrar fallback amigável com CTA
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="mb-4 text-yellow-400">ℹ️</div>
          <p className="mb-4">Você não está autenticado.</p>
          <button 
            onClick={() => router.push('/login')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            Ir para Login
          </button>
        </div>
      </div>
    );
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
        <div className="flex h-screen text-slate-50 min-h-[720px] md:min-h-[760px] lg:min-h-[800px] min-w-0 overflow-auto">
          {/* Sidebar - Workspaces/Projetos com Liquid Glass */}
          <motion.aside 
            className={`${sidebarCollapsed ? 'w-16' : 'w-64'} shrink-0 backdrop-blur-[40px] bg-gradient-to-b from-slate-900/80 to-slate-800/60 border-r border-white/10 transition-all duration-300 flex flex-col relative z-30 overflow-hidden`}
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
                <WorkspaceSelector />
                <ProjectList />

                <motion.button 
                  className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 px-4 rounded-lg font-medium hover:from-purple-600 hover:to-blue-600 transition-all duration-300 shadow-lg group relative overflow-hidden"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsCreateModalOpen(true)}
                >
                  {/* Shimmer Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  <span className="relative z-10">+ New Task</span>
                </motion.button>
              </motion.div>
            )}
          </motion.aside>

          {/* Área principal */}
          <main className="flex-1 flex flex-col min-w-0 min-h-0 overflow-hidden">
            {/* Header */}
            <motion.header 
              className="p-4 md:p-6 lg:p-6 border-b border-white/10 backdrop-blur-[20px] bg-white/5 relative overflow-hidden"
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
              className="p-3 md:p-4 lg:p-5"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <StatsCards />
            </motion.section>

            {/* Main content */}
            <div className="flex-1 flex flex-col lg:flex-row p-3 md:p-4 lg:p-5 gap-4 lg:gap-5 min-h-0 min-w-0 overflow-hidden">
              {/* Chat conversacional com Glassmorphism */}
              <motion.section 
                className="w-full lg:w-96 backdrop-blur-[20px] bg-white/5 border border-white/20 rounded-2xl flex flex-col shadow-2xl shadow-black/20 relative overflow-hidden group min-h-0"
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
                <div className="flex-1 p-4 overflow-auto min-h-0">
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
                className="flex-1 flex flex-col backdrop-blur-[20px] bg-white/5 border border-white/20 rounded-2xl shadow-2xl shadow-black/20 relative overflow-hidden group min-w-0 min-h-0"
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
                
                <div className="relative z-10 p-3 md:p-4 border-b border-white/10">
                  <TaskViewSwitcher />
                </div>
                <div className="flex-1 overflow-auto p-3 md:p-4 min-h-0">
                  <TaskList />
                </div>
              </motion.section>
            </div>
          </main>
        </div>
      </div>

      {/* Create Task Modal */}
      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        workspaceId={currentWorkspace?.id}
        projectId={currentProject?.id || null}
        onSubmit={async (taskData) => {
          try {
            console.log('Workspace atual:', currentWorkspace);
            console.log('Projeto atual:', currentProject);
            await createTaskRequest(taskData);
          } catch (e) {
            console.error('Erro no onSubmit:', e);
            alert('Erro ao criar tarefa: ' + (e instanceof Error ? e.message : 'Erro desconhecido'));
          } finally {
            // Revalidar lista após criar
            if (typeof refreshTasks === 'function') {
              refreshTasks();
            }
          }
        }}
      />
    </div>
  );
}

async function createTaskRequest(payload: any) {
  console.log('Payload sendo enviado:', payload);
  const token = await getAccessToken();
  if (!token) throw new Error('Sem token de autenticação');
  
  const res = await fetch('/api/tasks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  
  console.log('Response status:', res.status);
  
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    console.error('Erro da API:', err);
    throw new Error(err?.error || `Falha ao criar tarefa (${res.status})`);
  }
  return res.json();
}
