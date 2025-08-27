'use client';

import React, { useState } from 'react';
import { Task } from '@/types';
import { TaskCard } from './TaskCard';
import { useAppStore } from '@/lib/store';
import { getAccessToken } from '@/lib/auth';

interface TaskKanbanProps {
  tasks: Task[];
}

export function TaskKanban({ tasks }: TaskKanbanProps) {
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
  const { updateTask } = useAppStore();
  const columns = [
    { 
      id: 'todo', 
      title: 'A fazer', 
      borderColor: 'border-slate-500',
      bgColor: 'bg-slate-800/20'
    },
    { 
      id: 'in_progress', 
      title: 'Em andamento', 
      borderColor: 'border-blue-500',
      bgColor: 'bg-blue-500/5'
    },
    { 
      id: 'done', 
      title: 'Concluído', 
      borderColor: 'border-blue-600',
      bgColor: 'bg-blue-600/5'
    },
  ];

  const getTasksByStatus = (status: string) => {
    return tasks.filter(task => task.status === status);
  };

  const handleDragStart = (e: React.DragEvent, task: Task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', task.id);
  };

  const handleDragOver = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverColumn(columnId);
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = async (e: React.DragEvent, newStatus: string) => {
    e.preventDefault();
    setDragOverColumn(null);
    
    if (!draggedTask || draggedTask.status === newStatus) {
      setDraggedTask(null);
      return;
    }

    try {
      // Atualização otimista
      updateTask(draggedTask.id, { status: newStatus as Task['status'] });
      
      // Atualizar no backend
      const token = await getAccessToken();
      if (token) {
        const res = await fetch('/api/tasks', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ 
            id: draggedTask.id, 
            status: newStatus 
          }),
        });
        
        if (!res.ok) {
          // Rollback simples: recarregar página se falhar
          window.location.reload();
        }
      }
    } catch {
      // Rollback simples
      window.location.reload();
    } finally {
      setDraggedTask(null);
    }
  };

  return (
    <div className="flex gap-6 p-6 h-full overflow-x-auto">
      {columns.map((column) => {
        const columnTasks = getTasksByStatus(column.id);
        
        return (
          <div key={column.id} className="flex-shrink-0 w-80">
            <div 
              className={`backdrop-blur-sm ${column.bgColor} border border-slate-700/30 rounded-2xl p-6 h-full shadow-xl shadow-black/20 relative transition-all duration-300 ${
                dragOverColumn === column.id ? 'ring-2 ring-blue-500/50 border-blue-500/30' : ''
              }`}
              onDragOver={(e) => handleDragOver(e, column.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-white">{column.title}</h3>
                <span className="text-sm text-slate-400 bg-slate-800/50 px-3 py-1 rounded-full border border-slate-600/30">
                  {columnTasks.length}
                </span>
              </div>
              
              {/* Indicador sutil na parte superior */}
              <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r ${column.borderColor} to-transparent`} />
              
              <div className="space-y-4">
                {columnTasks.map((task) => (
                  <div 
                    key={task.id} 
                    className="backdrop-blur-xl bg-slate-700/20 border border-slate-600/20 hover:border-slate-500/30 rounded-xl transition-all duration-300 cursor-move"
                    draggable
                    onDragStart={(e) => handleDragStart(e, task)}
                  >
                    <TaskCard task={task} />
                  </div>
                ))}
                
                {columnTasks.length === 0 && (
                  <div className="text-center py-12 text-slate-500">
                    <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-slate-800/50 flex items-center justify-center">
                      <span className="text-2xl">📋</span>
                    </div>
                    <p className="text-sm font-medium">Nenhuma tarefa</p>
                    <p className="text-xs text-slate-600 mt-1">Arraste tarefas aqui</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
