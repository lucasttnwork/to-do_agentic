'use client';

import { motion } from 'framer-motion';

export default function TestGlassmorphism() {
  return (
    <div className="p-8 space-y-8">
      {/* Test Card 1: Basic Glassmorphism */}
      <div className="glass-card p-6">
        <h3 className="text-white text-xl mb-4">Teste Glassmorphism Básico</h3>
        <p className="text-slate-300">Este card deve ter efeito glassmorphism com blur e transparência.</p>
      </div>

      {/* Test Card 2: Premium Stats Card */}
      <motion.div
        className="group relative overflow-hidden rounded-3xl cursor-pointer min-h-[160px] transform transition-all duration-300 hover:scale-[1.02] hover:-translate-y-2 hover:shadow-2xl"
        whileHover={{ scale: 1.02, y: -8 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        {/* Glassmorphism Background */}
        <div className="absolute inset-0 bg-white/10 backdrop-blur-[20px] saturate-180 border border-white/20 rounded-3xl" />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-blue-600 to-purple-500 opacity-20 group-hover:opacity-30 transition-opacity duration-500 rounded-3xl" />
        
        {/* Glow Effect */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-blue-600 to-purple-500 rounded-3xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
        
        {/* Shimmer Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 rounded-3xl" />
        
        {/* Content */}
        <div className="relative z-10 p-6">
          <h3 className="text-3xl font-bold text-white mb-2">24</h3>
          <p className="text-white/70 text-sm">Total Tasks</p>
        </div>
      </motion.div>

      {/* Test Card 3: Liquid Glass */}
      <div className="liquid-glass p-6 rounded-3xl">
        <h3 className="text-white text-xl mb-4">Teste Liquid Glass</h3>
        <p className="text-slate-300">Este card deve ter efeito liquid glass com animação interna.</p>
      </div>

      {/* Test Card 4: Premium Button */}
      <button className="premium-button">
        Teste Premium Button
      </button>

      {/* Test Card 5: Premium Input */}
      <input 
        type="text" 
        placeholder="Teste Premium Input" 
        className="premium-input w-full"
      />
    </div>
  );
}
