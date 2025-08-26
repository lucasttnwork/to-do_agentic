'use client';

import { ReactNode } from 'react';
import { FloatingElements } from '../3D/FloatingElements';
import { motion, AnimatePresence } from 'framer-motion';

interface PremiumLayoutProps {
  children: ReactNode;
  showFloatingElements?: boolean;
}

export const PremiumLayout = ({ 
  children, 
  showFloatingElements = true 
}: PremiumLayoutProps) => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* 3D Background Elements */}
      {showFloatingElements && <FloatingElements />}
      
      {/* Gradient Overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 z-0" />
      
      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.main
          className="relative z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {children}
        </motion.main>
      </AnimatePresence>
      
      {/* Noise Texture Overlay */}
      <div 
        className="fixed inset-0 opacity-[0.015] pointer-events-none z-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
};
