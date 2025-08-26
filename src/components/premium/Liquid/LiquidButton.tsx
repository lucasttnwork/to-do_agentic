'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { clsx } from 'clsx';

interface LiquidButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  loading?: boolean;
}

export const LiquidButton = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  className,
  loading = false
}: LiquidButtonProps) => {
  const variants = {
    primary: 'from-blue-500 via-purple-500 to-pink-500',
    secondary: 'from-gray-500 via-gray-600 to-gray-700',
    accent: 'from-green-400 via-cyan-500 to-blue-500'
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  return (
    <motion.button
      className={clsx(
        'relative overflow-hidden rounded-2xl font-semibold text-white transition-all duration-300',
        'focus:outline-none focus:ring-2 focus:ring-white/50',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        sizes[size],
        className
      )}
      onClick={onClick}
      disabled={loading}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Liquid Background */}
      <div className={clsx(
        'absolute inset-0 liquid-shape bg-gradient-to-r',
        variants[variant]
      )} />
      
      {/* Hover Overlay */}
      <motion.div
        className="absolute inset-0 bg-white/20"
        initial={{ scale: 0, opacity: 0 }}
        whileHover={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Loading Spinner */}
      {loading && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        </motion.div>
      )}
      
      {/* Content */}
      <span className={clsx(
        'relative z-10 transition-opacity duration-200',
        loading ? 'opacity-0' : 'opacity-100'
      )}>
        {children}
      </span>
    </motion.button>
  );
};
