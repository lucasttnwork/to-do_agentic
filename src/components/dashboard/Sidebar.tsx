'use client';

import { Brain, Home, MessageSquare, Calendar, Settings, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import '../../styles/isolated-sidebar.css';

interface SidebarProps {
  onClose?: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedWorkspace, setSelectedWorkspace] = useState('NTEX');
  const [selectedProject, setSelectedProject] = useState('Todos os projetos');

  const workspaces = [
    { id: 1, name: 'Pessoal', type: 'personal', color: 'bg-red-500' },
    { id: 2, name: 'NTEX', type: 'client', color: 'bg-purple-500' },
    { id: 3, name: 'Kabbatec', type: 'client', color: 'bg-blue-500' }
  ];

  const projects = [
    { id: 1, name: 'Todos os projetos', color: 'bg-blue-500' },
    { id: 2, name: 'Kabbatec', color: 'bg-purple-500' },
    { id: 3, name: 'Cartório', color: 'bg-green-500' },
    { id: 4, name: 'Academia SP', color: 'bg-orange-500' }
  ];

  const menuItems = [
    { icon: Home, label: 'Dashboard', active: true },
    { icon: MessageSquare, label: 'Chat', active: false },
    { icon: Calendar, label: 'Calendar', active: false },
    { icon: Settings, label: 'Settings', active: false }
  ];

  return (
    <div className={`${sidebarCollapsed ? 'w-20' : 'w-80'} h-full transition-all duration-300 ease-in-out relative z-40`}>
      {/* Sidebar Container com Estilos Isolados */}
      <div className="h-full isolated-sidebar">
        
        {/* Header da Sidebar */}
        <div className="p-6 border-b border-slate-600/50 isolated-sidebar-header relative z-10">
          {!sidebarCollapsed ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 isolated-sidebar-logo rounded-xl flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold isolated-sidebar-logo-text">
                  TaskFlow AI
                </span>
              </div>
              <button
                onClick={() => setSidebarCollapsed(true)}
                className="p-2 rounded-lg isolated-sidebar-collapse-btn text-slate-300 hover:text-white"
                aria-label="Recolher sidebar"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-4">
              <div className="w-10 h-10 isolated-sidebar-logo rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <button
                onClick={() => setSidebarCollapsed(false)}
                className="p-2 rounded-lg isolated-sidebar-collapse-btn text-slate-300 hover:text-white"
                aria-label="Expandir sidebar"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {!sidebarCollapsed && (
          <>
            {/* Navigation Menu Principal */}
            <div className="px-4 py-4 relative z-10">
              <h3 className="text-xs font-semibold isolated-sidebar-section-title uppercase tracking-widest mb-4 px-2">
                Navegação
              </h3>
              <div className="space-y-2">
                {menuItems.map((item, index) => (
                  <motion.button
                    key={item.label}
                    whileHover={{ x: 6, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full flex items-center space-x-4 px-4 py-3 rounded-xl transition-all duration-200 relative overflow-hidden group cursor-pointer isolated-sidebar-nav-item ${
                      item.active ? 'active' : ''
                    }`}
                  >
                    <item.icon className="w-5 h-5 relative z-10" />
                    <span className="font-medium relative z-10 isolated-sidebar-text-primary">{item.label}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Workspaces */}
            <div className="flex-1 overflow-y-auto px-4 py-4 isolated-sidebar-scroll relative z-10">
              <h3 className="text-xs font-semibold isolated-sidebar-section-title uppercase tracking-widest mb-4 px-2">
                Workspaces
              </h3>
              <div className="space-y-2">
                {workspaces.map((workspace) => (
                  <div 
                    key={workspace.id}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 group isolated-sidebar-workspace-item ${
                      selectedWorkspace === workspace.name ? 'selected' : ''
                    }`}
                    onClick={() => setSelectedWorkspace(workspace.name)}
                  >
                    <div className={`w-3 h-3 rounded-full ${workspace.color} isolated-sidebar-workspace-dot`}></div>
                    <span className="font-medium isolated-sidebar-text-primary">{workspace.name}</span>
                  </div>
                ))}
              </div>
              
              <h3 className="text-xs font-semibold isolated-sidebar-section-title uppercase tracking-widest mb-4 px-2 mt-6">
                Projetos
              </h3>
              <div className="space-y-2">
                {projects.map((project) => (
                  <div 
                    key={project.id}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 group isolated-sidebar-workspace-item ${
                      selectedProject === project.name ? 'selected' : ''
                    }`}
                    onClick={() => setSelectedProject(project.name)}
                  >
                    <div className={`w-3 h-3 rounded-full ${project.color} isolated-sidebar-workspace-dot`}></div>
                    <span className="font-medium isolated-sidebar-text-primary">{project.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Botão New Task */}
            <div className="p-4 border-t border-slate-600/50 relative z-10">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full isolated-sidebar-new-task-btn text-white py-3 px-4 rounded-xl font-medium flex items-center justify-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>New Task</span>
              </motion.button>
            </div>
          </>
        )}

        {/* Sidebar Collapsed - Apenas ícones */}
        {sidebarCollapsed && (
          <div className="flex-1 flex flex-col items-center py-4 space-y-6">
            {/* Navigation Icons */}
            {menuItems.map((item, index) => (
              <motion.button
                key={item.label}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={`p-3 rounded-xl transition-all duration-200 relative isolated-sidebar-nav-item ${
                  item.active ? 'active' : ''
                }`}
                title={item.label}
              >
                <item.icon className="w-5 h-5" />
              </motion.button>
            ))}
            
            {/* New Task Button Collapsed */}
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-3 isolated-sidebar-new-task-btn text-white rounded-xl"
              title="New Task"
            >
              <Plus className="w-5 h-5" />
            </motion.button>
          </div>
        )}
      </div>
    </div>
  );
}