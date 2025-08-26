'use client';

import { Task } from '@/types';
import { TaskCard } from './TaskCard';

interface TaskKanbanProps {
  tasks: Task[];
}

export function TaskKanban({ tasks }: TaskKanbanProps) {
  const columns = [
    { id: 'todo', title: 'A fazer', color: 'bg-gray-900 border border-gray-800' },
    { id: 'in_progress', title: 'Em andamento', color: 'bg-gray-900 border border-gray-800' },
    { id: 'done', title: 'Concluído', color: 'bg-gray-900 border border-gray-800' },
  ];

  const getTasksByStatus = (status: string) => {
    return tasks.filter(task => task.status === status);
  };

  return (
    <div className="flex gap-4 p-4 h-full overflow-x-auto">
      {columns.map((column) => {
        const columnTasks = getTasksByStatus(column.id);
        
        return (
          <div key={column.id} className="flex-shrink-0 w-80">
            <div className={`${column.color} rounded-lg p-4 h-full`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium">{column.title}</h3>
                <span className="text-sm text-gray-300 bg-gray-800 px-2 py-1 rounded-full border border-gray-700">
                  {columnTasks.length}
                </span>
              </div>
              
              <div className="space-y-3">
                {columnTasks.map((task) => (
                  <div key={task.id} className="bg-card rounded-lg border border-gray-800">
                    <TaskCard task={task} />
                  </div>
                ))}
                
                {columnTasks.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <p className="text-sm">Nenhuma tarefa</p>
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
