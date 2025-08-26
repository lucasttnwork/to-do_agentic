'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
import { Task } from '@/types';

interface TaskCardProps {
  task: Task;
  onClick?: () => void;
}

const priorityColors = {
  1: { bg: 'from-red-500 to-pink-500', text: 'text-red-400', icon: AlertCircle },
  2: { bg: 'from-orange-500 to-yellow-500', text: 'text-orange-400', icon: AlertCircle },
  3: { bg: 'from-blue-500 to-cyan-500', text: 'text-blue-400', icon: CheckCircle },
  4: { bg: 'from-green-500 to-emerald-500', text: 'text-green-400', icon: CheckCircle },
  5: { bg: 'from-slate-500 to-gray-500', text: 'text-slate-400', icon: CheckCircle }
};

const statusColors = {
  'todo': { bg: 'from-yellow-500 to-orange-500', text: 'text-yellow-400' },
  'in_progress': { bg: 'from-blue-500 to-cyan-500', text: 'text-blue-400' },
  'done': { bg: 'from-green-500 to-emerald-500', text: 'text-green-400' },
  'archived': { bg: 'from-slate-500 to-gray-500', text: 'text-slate-400' }
};

export function TaskCard({ task, onClick }: TaskCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const priority = priorityColors[task.priority as keyof typeof priorityColors] || priorityColors[3];
  const status = statusColors[task.status as keyof typeof statusColors] || statusColors['todo'];
  const PriorityIcon = priority.icon;

  return (
    <motion.div
      className="group relative overflow-hidden rounded-2xl cursor-pointer"
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ type: "spring", stiffness: 300 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onClick}
      style={{
        transform: isHovered ? 'perspective(1000px) rotateX(2deg) rotateY(2deg)' : 'none',
        transition: 'transform 0.3s ease'
      }}
    >
      {/* Glassmorphism Background */}
      <div className="absolute inset-0 bg-white/5 backdrop-blur-[20px] border border-white/20 rounded-2xl" />
      
      {/* Gradient Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${priority.bg} opacity-10 group-hover:opacity-20 transition-opacity duration-500 rounded-2xl`} />
      
      {/* Shimmer Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 rounded-2xl" />
      
      {/* Border Luminosa Superior */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Content */}
      <div className="relative z-10 p-6">
        {/* Header com Priority e Status */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-xl bg-gradient-to-r ${priority.bg} bg-opacity-20 border border-white/20`}>
              <PriorityIcon className={`w-5 h-5 ${priority.text}`} />
            </div>
            <div className="flex flex-col">
              <span className={`text-xs font-medium ${priority.text} uppercase tracking-wider`}>
                P{task.priority} - {task.priority === 1 ? 'Crítica' : task.priority === 2 ? 'Alta' : task.priority === 3 ? 'Normal' : task.priority === 4 ? 'Baixa' : 'Muito Baixa'}
              </span>
              <span className={`text-xs font-medium ${status.text} uppercase tracking-wider`}>
                {task.status === 'todo' ? 'Pendente' : task.status === 'in_progress' ? 'Em Progresso' : task.status === 'done' ? 'Concluído' : 'Arquivado'}
              </span>
            </div>
          </div>
          
          {/* Floating Arrow */}
          <motion.div
            animate={{ x: isHovered ? 4 : 0 }}
            transition={{ duration: 0.3 }}
            className="text-white/40 group-hover:text-white/60 transition-colors"
          >
            <ArrowRight className="w-5 h-5" />
          </motion.div>
        </div>
        
        {/* Task Title */}
        <h3 className="text-lg font-semibold text-white mb-3 group-hover:text-white/90 transition-colors">
          {task.title}
        </h3>
        
        {/* Task Description */}
        {task.description && (
          <p className="text-slate-300 text-sm mb-4 line-clamp-2">
            {task.description}
          </p>
        )}
        
        {/* Task Details */}
        <div className="space-y-3 mb-4">
          {/* Due Date */}
          {task.due_date && (
            <div className="flex items-center space-x-2 text-sm text-slate-400">
              <Calendar className="w-4 h-4" />
              <span>Prazo: {new Date(task.due_date).toLocaleDateString('pt-BR')}</span>
            </div>
          )}
          
          {/* Estimated Time */}
          {task.effort_minutes && (
            <div className="flex items-center space-x-2 text-sm text-slate-400">
              <Clock className="w-4 h-4" />
              <span>Tempo estimado: {Math.round(task.effort_minutes / 60 * 10) / 10}h</span>
            </div>
          )}
        </div>
        

        

        
        {/* Creation Date */}
        <div className="mt-4 text-xs text-slate-500">
          Criado em {new Date(task.created_at).toLocaleDateString('pt-BR')}
        </div>
      </div>
      
      {/* Hover Shadow Enhancement */}
      <div className={`absolute inset-0 rounded-2xl shadow-2xl shadow-${priority.bg.split('-')[1]}-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
    </motion.div>
  );
}
