'use client';

import { Brain, Home, MessageSquare, Calendar, Settings, X } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import { cn } from '@/lib/utils';

interface SidebarProps {
  onClose: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  const workspaces = [
    { id: 1, name: 'Personal', type: 'personal', color: 'blue' },
    { id: 2, name: 'NTEX', type: 'client', color: 'purple' },
    { id: 3, name: 'Kabbatec', type: 'client', color: 'green' }
  ];

  const menuItems = [
    { icon: Home, label: 'Dashboard', active: true },
    { icon: MessageSquare, label: 'Chat', active: false },
    { icon: Calendar, label: 'Calendar', active: false },
    { icon: Settings, label: 'Settings', active: false }
  ];

  return (
    <div className="h-full p-4">
      <GlassCard className="h-full p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold">TaskFlow AI</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/10 rounded transition-colors lg:hidden"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="space-y-2 mb-8">
          {menuItems.map((item) => (
            <a
              key={item.label}
              href="#"
              className={cn(
                'flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200',
                item.active 
                  ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 text-white' 
                  : 'hover:bg-white/5 text-slate-300 hover:text-white'
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </a>
          ))}
        </nav>

        {/* Workspaces */}
        <div>
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
            Workspaces
          </h3>
          <div className="space-y-2">
            {workspaces.map((workspace) => (
              <div
                key={workspace.id}
                className="flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-white/5 transition-all cursor-pointer"
              >
                <div className={`w-3 h-3 rounded-full bg-${workspace.color}-500`} />
                <span className="text-slate-300 hover:text-white transition-colors">
                  {workspace.name}
                </span>
                <span className="text-xs text-slate-500 ml-auto">
                  {workspace.type === 'client' ? '👔' : '🏠'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-auto pt-6">
          <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200">
            + New Task
          </button>
        </div>
      </GlassCard>
    </div>
  );
}
