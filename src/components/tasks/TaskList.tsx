'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { TaskCard } from './TaskCard';
import { TaskKanban } from './TaskKanban';
import { TaskTimeline } from './TaskTimeline';
import { Loader2, Clock, Calendar } from 'lucide-react';
import { useTasks } from '@/hooks/useTasks';

export function TaskList() {
  const { viewMode, currentWorkspace, currentProject, taskFilters, tasks, setTasks } = useAppStore();
  const { tasks: swrTasks, isLoading, refresh } = useTasks({
    workspaceId: currentWorkspace?.id,
    projectId: currentProject?.id,
    status: taskFilters.status === 'all' ? undefined : taskFilters.status,
    priority: taskFilters.priority === 'all' ? undefined : taskFilters.priority,
  });

  useEffect(() => {
    if (!swrTasks) return;
    // Evitar updates desnecessários que podem causar loops de renderização
    const sameLength = tasks.length === swrTasks.length;
    const sameIds = sameLength && tasks.every((t, i) => t.id === swrTasks[i]?.id);
    if (!sameIds) {
      setTasks(swrTasks);
    }
  }, [swrTasks, setTasks, tasks]);

  // Cards de exemplo premium para preencher espaço vazio
  const renderExampleCards = () => (
    <div className="space-y-4">
      {/* Card de exemplo 1 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -4, scale: 1.01 }}
        className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl shadow-black/10 hover:shadow-blue-500/10 transition-all duration-300 relative overflow-hidden group"
      >
        {/* Background glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
        
        {/* Priority indicator - sutil */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-t-2xl" />
        
        <div className="relative z-10">
          {/* Header da task */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-2">
                Reunião planejamento NTEX
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Definir roadmap do próximo trimestre
              </p>
            </div>
            
            {/* Status badge */}
            <div className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-xs font-medium border border-blue-500/30 backdrop-blur-sm">
              P1 • Alta
            </div>
          </div>
          
          {/* Metadata */}
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              Hoje, 14:00
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              1h
            </span>
          </div>
        </div>
      </motion.div>

      {/* Card de exemplo 2 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        whileHover={{ y: -4, scale: 1.01 }}
        className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl shadow-black/10 hover:shadow-blue-500/10 transition-all duration-300 relative overflow-hidden group"
      >
        {/* Background glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
        
        {/* Priority indicator - sutil */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-t-2xl" />
        
        <div className="relative z-10">
          {/* Header da task */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-2">
                Desenvolver landing page Kabbatec
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Criar página de captura para campanha de marketing
              </p>
            </div>
            
            {/* Status badge */}
            <div className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-xs font-medium border border-purple-500/30 backdrop-blur-sm">
              P2 • Normal
            </div>
          </div>
          
          {/* Metadata */}
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              Amanhã, 10:00
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              3h
            </span>
          </div>
        </div>
      </motion.div>

      {/* Card de exemplo 3 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        whileHover={{ y: -4, scale: 1.01 }}
        className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl shadow-black/10 hover:shadow-blue-500/10 transition-all duration-300 relative overflow-hidden group"
      >
        {/* Background glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
        
        {/* Priority indicator - sutil */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-purple-500 rounded-t-2xl" />
        
        <div className="relative z-10">
          {/* Header da task */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-2">
                Revisar proposta comercial
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Finalizar e enviar proposta para cliente potencial
              </p>
            </div>
            
            {/* Status badge */}
            <div className="bg-red-500/20 text-red-300 px-3 py-1 rounded-full text-xs font-medium border border-red-500/30 backdrop-blur-sm">
              P1 • Urgente
            </div>
          </div>
          
          {/* Metadata */}
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              Hoje, 17:00
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              2h
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-2 text-gray-400">
          <Loader2 className="w-5 h-5 animate-spin" />
          Carregando tarefas...
        </div>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col items-center justify-center h-32 text-center text-gray-400">
          <div className="w-16 h-16 bg-gray-900 border border-gray-800 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-lg font-medium mb-2">Nenhuma tarefa encontrada</h3>
          <p className="text-sm max-w-md text-gray-300">
            {currentProject 
              ? `Nenhuma tarefa criada para o projeto "${currentProject.name}" ainda.`
              : 'Comece criando tarefas através do chat ou adicionando manualmente.'
            }
          </p>
        </div>
        
        {/* Cards de exemplo para preencher espaço */}
        {renderExampleCards()}
      </div>
    );
  }

  // Renderizar baseado no modo de visualização
  switch (viewMode) {
    case 'kanban':
      return <TaskKanban tasks={tasks} />;
    case 'timeline':
      return <TaskTimeline tasks={tasks} />;
    default:
      return (
        <div className="space-y-3 md:space-y-3.5">
          {tasks.map((task) => (
            <TaskCard 
              key={task.id} 
              task={task}
              onUpdated={() => typeof refresh === 'function' && refresh()}
              onDeleted={() => typeof refresh === 'function' && refresh()}
            />
          ))}
          {tasks.length < 3 && renderExampleCards()}
        </div>
      );
  }
}
