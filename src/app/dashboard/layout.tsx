'use client';

import React from 'react';
import ParticlesBackground from '@/components/shared/ParticlesBackground';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      {/* Partículas animadas */}
      <ParticlesBackground />
      
      {/* Grid pattern sutil */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      
      {/* Gradientes de fundo premium */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl animate-pulse delay-500" />
      
      {/* Main Content */}
      <div className="relative z-40">
        {children}
      </div>
    </div>
  );
}
