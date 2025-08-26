'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface SimpleStatsCardProps {
  title: string;
  value: number | string | ReactNode;
  icon: ReactNode;
  gradient: string;
}

export const SimpleStatsCard = ({
  title,
  value,
  icon,
  gradient
}: SimpleStatsCardProps) => {
  return (
    <motion.div
      className="group relative overflow-hidden rounded-3xl cursor-pointer min-h-[160px] bg-white/10 backdrop-blur-[20px] border border-white/20"
      whileHover={{ scale: 1.02, y: -8 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      {/* Gradient Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-20 group-hover:opacity-30 transition-opacity duration-500 rounded-3xl`} />
      
      {/* Shimmer Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 rounded-3xl" />
      
      {/* Content */}
      <div className="relative z-10 p-6">
        <div className="flex items-center justify-between mb-4">
          {/* Icon Container */}
          <div className="p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
            {icon}
          </div>
          
          {/* Floating Orb */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className={`w-3 h-3 rounded-full bg-gradient-to-r ${gradient}`}
          />
        </div>
        
        {/* Stats Value */}
        <h3 className="text-3xl font-bold text-white mb-2">
          {value}
        </h3>
        
        {/* Stats Title */}
        <p className="text-white/70 text-sm font-medium">
          {title}
        </p>
      </div>
    </motion.div>
  );
};
