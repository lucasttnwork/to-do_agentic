'use client';

import { Brain, Home, MessageSquare, Calendar, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

interface SidebarProps {
  onClose?: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  const workspaces = [
    { id: 1, name: 'Personal', type: 'personal', icon: '🏠' },
    { id: 2, name: 'NTEX', type: 'client', icon: '🏢' },
    { id: 3, name: 'Kabbatec', type: 'client', icon: '🏢' }
  ];

  const menuItems = [
    { icon: Home, label: 'Dashboard', active: true },
    { icon: MessageSquare, label: 'Chat', active: false },
    { icon: Calendar, label: 'Calendar', active: false },
    { icon: Settings, label: 'Settings', active: false }
  ];

  return (
    <div className="w-80 h-full p-4">
      <div className="h-full backdrop-blur-xl bg-slate-800/20 border border-slate-700/30 rounded-3xl p-6 shadow-2xl shadow-black/20 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-blue-500/5 to-transparent pointer-events-none" />
        
        {/* Logo com glow */}
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            TaskFlow AI
          </span>
        </div>
        
        {/* Navigation items com hover premium */}
        {menuItems.map((item, index) => (
          <motion.div
            key={item.label}
            whileHover={{ x: 6, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`flex items-center space-x-4 px-4 py-3 rounded-xl mb-2 transition-all duration-200 relative overflow-hidden group cursor-pointer ${
              item.active 
                ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 text-white shadow-lg shadow-blue-500/10' 
                : 'hover:bg-blue-500/5 text-slate-400 hover:text-blue-200 backdrop-blur-sm'
            }`}
          >
            {/* Active indicator glow */}
            {item.active && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full" />
            )}
            
            <item.icon className="w-5 h-5 relative z-10" />
            <span className="font-medium relative z-10">{item.label}</span>
            
            {/* Hover glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
          </motion.div>
        ))}
        
        {/* Workspaces com visual premium - TODOS com mesma cor */}
        <div className="mt-8 pt-6 border-t border-slate-700/30">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4 px-2">
            Workspaces
          </h3>
          {workspaces.map((workspace, index) => (
            <motion.div
              key={workspace.id}
              whileHover={{ x: 6 }}
              className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-blue-500/5 transition-all cursor-pointer group mb-1"
            >
              <div className="w-3 h-3 rounded-full bg-blue-500/50 group-hover:bg-blue-400/70 transition-colors shadow-lg" />
              <span className="text-slate-400 group-hover:text-blue-200 transition-colors font-medium">
                {workspace.name}
              </span>
              <span className="text-xs text-slate-500 ml-auto">
                {workspace.icon}
              </span>
            </motion.div>
          ))}
        </div>
        
        {/* Quick Actions */}
        <div className="mt-auto pt-6">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-xl font-medium shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300"
          >
            + New Task
          </motion.button>
        </div>
      </div>
    </div>
  );
}
