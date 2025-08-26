'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { clsx } from 'clsx';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover3D?: boolean;
  gradient?: string;
  glow?: boolean;
}

export const GlassCard = ({ 
  children, 
  className, 
  hover3D = true, 
  gradient = 'from-blue-500/20 via-purple-500/20 to-pink-500/20',
  glow = false 
}: GlassCardProps) => {
  return (
    <motion.div
      className={clsx(
        'glass-card relative group cursor-pointer overflow-hidden',
        className
      )}
      whileHover={hover3D ? { 
        scale: 1.02, 
        rotateX: 5, 
        rotateY: 5,
        z: 50 
      } : undefined}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.6, 
        type: "spring", 
        stiffness: 100 
      }}
    >
      {/* Gradient Background */}
      <div className={clsx(
        'absolute inset-0 bg-gradient-to-br opacity-30 group-hover:opacity-50 transition-opacity duration-500',
        gradient
      )} />
      
      {/* Glow Effect */}
      {glow && (
        <div className={clsx(
          'absolute -inset-0.5 bg-gradient-to-r opacity-0 group-hover:opacity-30 transition-opacity duration-500 blur-lg',
          gradient
        )} />
      )}
      
      {/* Shimmer Effect */}
      <div className="absolute inset-0 shimmer-effect animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      
      {/* Content */}
      <div className="relative z-10 p-6">
        {children}
      </div>
    </motion.div>
  );
};
