'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, CheckCircle, AlertCircle, ArrowRight, Trash2 } from 'lucide-react';
import { Task } from '@/types';
import { useAppStore } from '@/lib/store';
import { getAccessToken } from '@/lib/auth';

interface TaskCardProps {
  task: Task;
  onClick?: () => void;
  onUpdated?: () => void;
  onDeleted?: () => void;
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

export function TaskCard({ task, onClick, onUpdated, onDeleted }: TaskCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { updateTask, deleteTask } = useAppStore();
  const priority = priorityColors[task.priority as keyof typeof priorityColors] || priorityColors[3];
  const status = statusColors[task.status as keyof typeof statusColors] || statusColors['todo'];
  const PriorityIcon = priority.icon;

  async function handleUpdate(updates: Partial<Task>) {
    try {
      setIsUpdating(true);
      const token = await getAccessToken();
      if (!token) return;
      // Otimista
      updateTask(task.id, updates);
      const res = await fetch('/api/tasks', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: task.id, ...updates }),
      });
      if (!res.ok) {
        // Sem rollback complexo: força revalidação externa
      }
      if (onUpdated) {
        onUpdated();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsUpdating(false);
    }
  }

  async function handleDelete() {
    try {
      setIsDeleting(true);
      const token = await getAccessToken();
      if (!token) return;
      // Otimista
      deleteTask(task.id);
      const res = await fetch(`/api/tasks?id=${encodeURIComponent(task.id)}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        // Ignorar e revalidar
      }
      if (onDeleted) {
        onDeleted();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <motion.div
      className="group relative overflow-hidden rounded-xl md:rounded-2xl cursor-pointer bg-white/5 border border-white/10"
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
      <div className="absolute inset-0 backdrop-blur-[16px] border border-white/10 rounded-2xl" />
      
      {/* Gradient Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${priority.bg} opacity-10 group-hover:opacity-15 transition-opacity duration-500 rounded-2xl`} />
      
      {/* Shimmer Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 rounded-2xl pointer-events-none" />
      
      {/* Border Luminosa Superior */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Content */}
      <div className="relative z-10 p-3 md:p-4">
        {/* Header com Priority e Status */}
        <div className="flex items-start justify-between mb-3 md:mb-3.5">
          <div className="flex items-center space-x-3">
            <div className={`p-1.5 md:p-2 rounded-lg md:rounded-xl bg-gradient-to-r ${priority.bg} bg-opacity-20 border border-white/20`}>
              <PriorityIcon className={`w-4 h-4 md:w-5 md:h-5 ${priority.text}`} />
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
          <div className="flex items-center gap-2">
            <select
              disabled={isUpdating}
              value={task.status}
              onChange={(e) => handleUpdate({ status: e.target.value as Task['status'] })}
              className="bg-white/5 border border-white/10 text-slate-300 rounded-md px-2 py-1 text-xs hover:border-blue-500/30 focus:outline-none"
            >
              <option value="todo">A fazer</option>
              <option value="in_progress">Em andamento</option>
              <option value="done">Concluído</option>
              <option value="archived">Arquivado</option>
            </select>
            <select
              disabled={isUpdating}
              value={String(task.priority)}
              onChange={(e) => handleUpdate({ priority: parseInt(e.target.value, 10) as 1 | 2 | 3 })}
              className="bg-white/5 border border-white/10 text-slate-300 rounded-md px-2 py-1 text-xs hover:border-blue-500/30 focus:outline-none"
            >
              <option value="1">P1</option>
              <option value="2">P2</option>
              <option value="3">P3</option>
            </select>
            <button
              disabled={isDeleting}
              onClick={(e) => { e.stopPropagation(); handleDelete(); }}
              className="p-1.5 rounded-md hover:bg-white/10 text-slate-300 border border-white/10"
              aria-label="Deletar tarefa"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            {/* Floating Arrow */}
            <motion.div
              animate={{ x: isHovered ? 4 : 0 }}
              transition={{ duration: 0.3 }}
              className="text-white/40 group-hover:text-white/60 transition-colors"
            >
              <ArrowRight className="w-5 h-5" />
            </motion.div>
          </div>
        </div>
        
        {/* Task Title */}
        <h3 className="text-sm md:text-base font-semibold text-white mb-2 group-hover:text-white/90 transition-colors break-words">
          {task.title}
        </h3>
        
        {/* Task Description */}
        {task.description && (
          <p className="text-slate-300 text-xs md:text-sm mb-2 md:mb-3 line-clamp-2 break-words">
            {task.description}
          </p>
        )}
        
        {/* Task Details */}
        <div className="space-y-1.5 md:space-y-2.5 mb-2 md:mb-3">
          {/* Due Date */}
          {task.due_date && (
            <div className="flex items-center space-x-2 text-xs md:text-sm text-slate-400">
              <Calendar className="w-3.5 h-3.5 md:w-4 md:h-4" />
              <span>Prazo: {new Date(task.due_date).toLocaleDateString('pt-BR')}</span>
            </div>
          )}
          
          {/* Estimated Time */}
          {task.effort_minutes && (
            <div className="flex items-center space-x-2 text-xs md:text-sm text-slate-400">
              <Clock className="w-3.5 h-3.5 md:w-4 md:h-4" />
              <span>Tempo estimado: {Math.round(task.effort_minutes / 60 * 10) / 10}h</span>
            </div>
          )}
        </div>
        

        

        
        {/* Creation Date */}
        <div className="mt-2 md:mt-3 text-[10px] md:text-xs text-slate-500">
          Criado em {new Date(task.created_at).toLocaleDateString('pt-BR')}
        </div>
      </div>
      
      {/* Hover Shadow Enhancement */}
      <div className="absolute inset-0 rounded-2xl shadow-2xl shadow-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </motion.div>
  );
}
