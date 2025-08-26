'use client';

import { useState } from 'react';
import ParticlesBackground from '@/components/shared/ParticlesBackground';
import Sidebar from '@/components/dashboard/Sidebar';
import { Menu } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      {/* Partículas animadas */}
      <ParticlesBackground />
      
      {/* Grid pattern sutil */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      
      {/* Gradientes de fundo */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl animate-pulse delay-500" />
      
      <div className="relative z-40 flex h-screen">
        {/* Animated Sidebar */}
        {sidebarOpen && (
          <div className="w-80 flex-shrink-0">
            <Sidebar onClose={() => setSidebarOpen(false)} />
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
