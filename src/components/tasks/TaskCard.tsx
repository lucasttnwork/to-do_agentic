'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Task } from '@/types';
import { formatDate, formatDateTime, formatDuration, getPriorityLabel, getStatusLabel } from '@/lib/utils';
import { Check, MoreHorizontal, Clock, Calendar, User } from 'lucide-react';

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const completedSubtasks = task.subtasks?.filter(st => st.status === 'done').length || 0;
  const totalSubtasks = task.subtasks?.length || 0;
  const progress = totalSubtasks ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 1: return 'from-red-500 to-purple-500';
      case 2: return 'from-blue-500 to-purple-500';
      case 3: return 'from-purple-500 to-blue-500';
      default: return 'from-blue-500 to-purple-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'done': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'in_progress': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      default: return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.01 }}
      className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl shadow-black/10 hover:shadow-blue-500/10 transition-all duration-300 relative overflow-hidden group"
    >
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
      
      {/* Priority indicator - sutil */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${getPriorityColor(task.priority)} rounded-t-2xl`} />
      
      <div className="relative z-10">
        {/* Header da task */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white mb-2">
              {task.title}
            </h3>
            {task.description && (
              <p className="text-slate-400 text-sm leading-relaxed">
                {task.description}
              </p>
            )}
          </div>
          
          {/* Status badge */}
          <div className={`px-3 py-1 rounded-full text-xs font-medium border backdrop-blur-sm ${getStatusColor(task.status)}`}>
            {getPriorityLabel(task.priority)} • {getStatusLabel(task.status)}
          </div>
        </div>
        
        {/* Metadata */}
        <div className="flex items-center justify-between text-xs text-slate-400 mb-4">
          {task.due_date && (
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formatDate(task.due_date)}
            </span>
          )}
          {task.effort_minutes && (
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatDuration(task.effort_minutes)}
            </span>
          )}
        </div>
        
        {/* Subtasks checklist */}
        {totalSubtasks > 0 && (
          <div className="space-y-2 mb-4">
            {task.subtasks!.slice(0, 3).map((sub) => (
              <div key={sub.id} className="flex items-center space-x-3">
                <div className={`w-4 h-4 ${sub.status === 'done' ? 'bg-green-500/20 border-green-500/50' : 'border-slate-600'} border rounded flex items-center justify-center`}>
                  {sub.status === 'done' && <Check className="w-3 h-3 text-green-400" />}
                </div>
                <span className={`text-slate-300 text-sm ${sub.status === 'done' ? 'line-through opacity-60' : ''}`}>
                  {sub.title}
                </span>
              </div>
            ))}
            {totalSubtasks > 3 && (
              <div className="text-xs text-slate-500 pl-7">
                +{totalSubtasks - 3} mais...
              </div>
            )}
          </div>
        )}
        
        {/* Progress bar */}
        {totalSubtasks > 0 && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>Progresso</span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" style={{width: `${progress}%`}}></div>
            </div>
          </div>
        )}
        
        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <User className="w-3 h-3 text-white" />
            </div>
            <span className="text-slate-400 text-sm">{task.source_type || 'Manual'}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
              <MoreHorizontal className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
