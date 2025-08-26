'use client';

import { Task } from '@/types';
import { formatDate, getPriorityColor, getPriorityLabel } from '@/lib/utils';
import { Calendar, Clock } from 'lucide-react';

interface TaskTimelineProps {
  tasks: Task[];
}

export function TaskTimeline({ tasks }: TaskTimelineProps) {
  // Agrupar tarefas por data
  const tasksByDate = tasks.reduce((acc, task) => {
    const date = task.due_date ? formatDate(task.due_date) : 'Sem prazo';
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(task);
    return acc;
  }, {} as Record<string, Task[]>);

  // Ordenar datas
  const sortedDates = Object.keys(tasksByDate).sort((a, b) => {
    if (a === 'Sem prazo') return 1;
    if (b === 'Sem prazo') return -1;
    return new Date(a).getTime() - new Date(b).getTime();
  });

  return (
    <div className="p-4">
      <div className="max-w-4xl mx-auto">
        {sortedDates.map((date) => (
          <div key={date} className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <h3 className="text-lg font-medium text-gray-900">{date}</h3>
              <span className="text-sm text-gray-500">
                {tasksByDate[date].length} tarefa{tasksByDate[date].length !== 1 ? 's' : ''}
              </span>
            </div>
            
            <div className="ml-6 space-y-3">
              {tasksByDate[date].map((task) => (
                <div key={task.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">{task.title}</h4>
                      {task.description && (
                        <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                      )}
                      
                      <div className="flex items-center gap-3">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                          {getPriorityLabel(task.priority)}
                        </span>
                        
                        {task.effort_minutes && (
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Clock className="w-3 h-3" />
                            {task.effort_minutes}min
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right text-xs text-gray-500">
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
        ))}
        
        {tasks.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium mb-2">Nenhuma tarefa agendada</h3>
            <p className="text-sm">Crie tarefas com prazos para vê-las na timeline</p>
          </div>
        )}
      </div>
    </div>
  );
}
