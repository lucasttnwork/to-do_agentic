'use client';

import { Task } from '@/types';
import { formatDate, getPriorityColor, getPriorityLabel } from '@/lib/utils';
import { Calendar, Clock } from 'lucide-react';

interface TaskTimelineProps {
  tasks: Task[];
}

function getRelativeDate(dateString: string): string {
  const date = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  
  // Reset horas para comparação precisa
  const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const tomorrowOnly = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate());
  const yesterdayOnly = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());
  
  if (dateOnly.getTime() === todayOnly.getTime()) return 'Hoje';
  if (dateOnly.getTime() === tomorrowOnly.getTime()) return 'Amanhã';
  if (dateOnly.getTime() === yesterdayOnly.getTime()) return 'Ontem';
  
  const diffDays = Math.ceil((dateOnly.getTime() - todayOnly.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffDays > 0 && diffDays <= 7) return `Em ${diffDays} dia${diffDays > 1 ? 's' : ''}`;
  if (diffDays < 0 && diffDays >= -7) return `${Math.abs(diffDays)} dia${Math.abs(diffDays) > 1 ? 's' : ''} atrás`;
  
  return formatDate(dateString);
}

export function TaskTimeline({ tasks }: TaskTimelineProps) {
  // Agrupar tarefas por data com labels relativos
  const tasksByDate = tasks.reduce((acc, task) => {
    const dateKey = task.due_date ? task.due_date : 'no-date';
    const dateLabel = task.due_date ? getRelativeDate(task.due_date) : 'Sem prazo';
    
    if (!acc[dateKey]) {
      acc[dateKey] = { label: dateLabel, tasks: [], originalDate: task.due_date };
    }
    acc[dateKey].tasks.push(task);
    return acc;
  }, {} as Record<string, { label: string; tasks: Task[]; originalDate?: string }>);

  // Ordenar grupos por data
  const sortedDateKeys = Object.keys(tasksByDate).sort((a, b) => {
    if (a === 'no-date') return 1;
    if (b === 'no-date') return -1;
    const dateA = new Date(tasksByDate[a].originalDate || '');
    const dateB = new Date(tasksByDate[b].originalDate || '');
    return dateA.getTime() - dateB.getTime();
  });

  return (
    <div className="p-4">
      <div className="max-w-4xl mx-auto">
        {sortedDateKeys.map((dateKey) => {
          const group = tasksByDate[dateKey];
          const isOverdue = group.originalDate && new Date(group.originalDate) < new Date() && !group.label.includes('Hoje');
          
          return (
            <div key={dateKey} className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-3 h-3 rounded-full ${
                  isOverdue ? 'bg-red-500' : 
                  group.label === 'Hoje' ? 'bg-yellow-500' : 
                  group.label === 'Amanhã' ? 'bg-green-500' : 'bg-blue-500'
                }`}></div>
                <h3 className={`text-lg font-medium ${
                  isOverdue ? 'text-red-400' : 'text-white'
                }`}>
                  {group.label}
                  {isOverdue && ' (Atrasada)'}
                </h3>
                <span className="text-sm text-slate-400">
                  {group.tasks.length} tarefa{group.tasks.length !== 1 ? 's' : ''}
                </span>
              </div>
              
              <div className="ml-6 space-y-3">
                {group.tasks.map((task) => (
                  <div key={task.id} className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-white mb-1">{task.title}</h4>
                        {task.description && (
                          <p className="text-sm text-slate-400 mb-2">{task.description}</p>
                        )}
                        
                        <div className="flex items-center gap-3">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                            {getPriorityLabel(task.priority)}
                          </span>
                          
                          {task.effort_minutes && (
                            <div className="flex items-center gap-1 text-xs text-slate-400">
                              <Clock className="w-3 h-3" />
                              {task.effort_minutes}min
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="text-right text-xs text-slate-400">
                        <div className="flex items-center gap-1 mb-1">
                          <Calendar className="w-3 h-3" />
                          Criado em {formatDate(task.created_at)}
                        </div>
                        {task.ai_confidence && (
                          <span>IA: {Math.round(task.ai_confidence * 100)}%</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        
        {tasks.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            <Calendar className="w-12 h-12 mx-auto mb-4 text-slate-400" />
            <h3 className="text-lg font-medium mb-2">Nenhuma tarefa agendada</h3>
            <p className="text-sm">Crie tarefas com prazos para vê-las na timeline</p>
          </div>
        )}
      </div>
    </div>
  );
}
