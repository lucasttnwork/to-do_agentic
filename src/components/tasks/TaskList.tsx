'use client';

import { useEffect, useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Task } from '@/types';
import { TaskCard } from './TaskCard';
import { TaskKanban } from './TaskKanban';
import { TaskTimeline } from './TaskTimeline';
import { Loader2 } from 'lucide-react';
import { mockTasks } from '@/lib/mock-data';

export function TaskList() {
  const { viewMode, currentWorkspace, currentProject, tasks, setTasks } = useAppStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (currentWorkspace) {
      loadTasks();
    }
  }, [currentWorkspace, currentProject]);

  const loadTasks = async () => {
    if (!currentWorkspace) return;

    setIsLoading(true);
    try {
      // Tentar carregar do banco primeiro
      const params = new URLSearchParams({
        workspace_id: currentWorkspace.id,
      });

      if (currentProject) {
        params.append('project_id', currentProject.id);
      }

      const response = await fetch(`/api/tasks?${params}`);
      const result = await response.json();

      if (result.success) {
        setTasks(result.tasks);
      } else {
        // Fallback para dados mockados
        const filteredTasks = mockTasks.filter(task => 
          task.workspace_id === currentWorkspace.id &&
          (!currentProject || task.project_id === currentProject.id)
        );
        setTasks(filteredTasks);
      }
    } catch (error) {
      console.error('Erro ao carregar tarefas, usando dados mockados:', error);
      // Fallback para dados mockados
      const filteredTasks = mockTasks.filter(task => 
        task.workspace_id === currentWorkspace.id &&
        (!currentProject || task.project_id === currentProject.id)
      );
      setTasks(filteredTasks);
    } finally {
      setIsLoading(false);
    }
  };

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
      <div className="flex flex-col items-center justify-center h-64 text-center text-gray-400">
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
        <div className="p-4 space-y-3">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      );
  }
}
