'use client';

import { motion } from 'framer-motion';
import { ReactNode, useState } from 'react';
import { clsx } from 'clsx';

interface PremiumStatsCardProps {
  title: string;
  value: number | string | ReactNode;
  icon: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  gradient?: string;
  glowColor?: string;
}

export const PremiumStatsCard = ({
  title,
  value,
  icon,
  trend,
  gradient = 'from-blue-500 via-purple-500 to-pink-500',
  glowColor = 'blue'
}: PremiumStatsCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  // Mapeamento de gradientes específicos conforme solicitado
  const getGradientClasses = (title: string) => {
    switch (title) {
      case 'Total Tasks':
        return 'from-blue-500 via-blue-600 to-purple-500';
      case 'Completed':
        return 'from-green-400 via-blue-400 to-cyan-400';
      case 'In Progress':
        return 'from-purple-500 via-pink-500 to-purple-600';
      case 'High Priority':
        return 'from-orange-400 via-red-400 to-pink-400';
      default:
        return gradient;
    }
  };

  const gradientClasses = getGradientClasses(title);

  return (
    <motion.div
      className="group relative overflow-hidden rounded-3xl cursor-pointer min-h-[160px] transform transition-all duration-300 hover:scale-[1.02] hover:-translate-y-2 hover:shadow-2xl"
      whileHover={{ scale: 1.02, y: -8 }}
      transition={{ type: "spring", stiffness: 300 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      style={{
        transform: isHovered ? 'perspective(1000px) rotateX(5deg) rotateY(5deg)' : 'none',
        transition: 'transform 0.3s ease',
        willChange: 'transform, opacity'
      }}
    >
      {/* Glassmorphism Background */}
      <div className="absolute inset-0 bg-white/10 backdrop-blur-[20px] saturate-180 border border-white/20 rounded-3xl" />
      
      {/* Gradient Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradientClasses} opacity-20 group-hover:opacity-30 transition-opacity duration-500 rounded-3xl`} />
      
      {/* Glow Effect */}
      <div className={`absolute -inset-0.5 bg-gradient-to-r ${gradientClasses} rounded-3xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />
      
      {/* Shimmer Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 rounded-3xl" />
      
      {/* Border Luminosa Superior */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Content */}
      <div className="relative z-10 p-6">
        <div className="flex items-center justify-between mb-4">
          {/* Icon Container */}
          <motion.div
            className="p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.8 }}
          >
            {icon}
          </motion.div>
          
          {/* Floating Orb */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className={`w-3 h-3 rounded-full bg-gradient-to-r ${gradientClasses} shadow-lg`}
          />
        </div>
        
        {/* Stats Value */}
        <motion.h3
          className="text-3xl font-bold text-white mb-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {value}
        </motion.h3>
        
        {/* Stats Title */}
        <motion.p
          className="text-white/70 text-sm font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {title}
        </motion.p>
        
        {/* Trend Indicator */}
        {trend && (
          <motion.div
            className={clsx(
              'flex items-center space-x-1 text-sm font-medium mt-2',
              trend.isPositive ? 'text-green-400' : 'text-red-400'
            )}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <span>{trend.isPositive ? '↗' : '↘'}</span>
            <span>{Math.abs(trend.value)}%</span>
          </motion.div>
        )}
      </div>
      
      {/* Hover Shadow Enhancement */}
      <div className={`absolute inset-0 rounded-3xl shadow-2xl shadow-${glowColor}-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
    </motion.div>
  );
};
