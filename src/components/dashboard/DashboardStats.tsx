'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, Clock, AlertTriangle, Target } from 'lucide-react';
import { motion } from 'framer-motion';
import { Task } from '@/types';

interface DashboardStatsProps {
  tasks: Task[];
}

// Componente de contador animado
function AnimatedCounter({ value, duration = 1000 }: { value: number, duration?: number }) {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    const startTime = Date.now();
    const endTime = startTime + duration;
    
    const updateCount = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      setCount(Math.floor(progress * value));
      
      if (now < endTime) {
        requestAnimationFrame(updateCount);
      }
    };
    
    updateCount();
  }, [value, duration]);
  
  return <span>{count}</span>;
}

export default function DashboardStats({ tasks }: DashboardStatsProps) {
  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'done').length,
    inProgress: tasks.filter(t => t.status === 'in_progress').length,
    pending: tasks.filter(t => t.status === 'todo').length,
    highPriority: tasks.filter(t => t.priority === 1).length,
    overdue: tasks.filter(t => {
      if (!t.due_date) return false;
      return new Date(t.due_date) < new Date() && t.status !== 'done';
    }).length
  };

  const statCards = [
    {
      title: 'Total Tasks',
      value: stats.total,
      icon: Target,
      gradient: 'from-blue-500 to-blue-600',
      delay: 0
    },
    {
      title: 'Completed',
      value: stats.completed,
      icon: CheckCircle,
      gradient: 'from-blue-600 to-blue-700',
      delay: 0.1
    },
    {
      title: 'In Progress',
      value: stats.inProgress,
      icon: Clock,
      gradient: 'from-purple-500 to-purple-600',
      delay: 0.2
    },
    {
      title: 'High Priority',
      value: stats.highPriority,
      icon: AlertTriangle,
      gradient: 'from-red-500 to-purple-500',
      delay: 0.3
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {statCards.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: stat.delay }}
          whileHover={{ y: -5, scale: 1.02 }}
          className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 shadow-2xl shadow-black/20 hover:border-white/20 hover:shadow-blue-500/10 transition-all duration-300 relative overflow-hidden group"
        >
          {/* Shimmer effect */}
          <div className="absolute inset-0 -top-10 -left-10 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent rotate-12 transform scale-x-150 group-hover:animate-pulse" />
          
          {/* Icon com gradiente */}
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.gradient} flex items-center justify-center mb-4 shadow-lg`}>
            <stat.icon className="w-6 h-6 text-white" />
          </div>
          
          {/* Número */}
          <div className="text-3xl font-bold text-white mb-2">
            <AnimatedCounter value={stat.value} />
          </div>
          
          {/* Título */}
          <div className="text-slate-400 font-medium">
            {stat.title}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
