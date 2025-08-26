'use client';

import { useState } from 'react';
import { Plus, ChevronLeft, ChevronRight, Home, MessageSquare, Calendar, Settings, Brain } from 'lucide-react';
import { motion } from 'framer-motion';
import Sidebar from './Sidebar';

export function MainDashboard() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedWorkspace, setSelectedWorkspace] = useState('NTEX');
  const [selectedProject, setSelectedProject] = useState('Todos os projetos');

  const menuItems = [
    { icon: Home, label: 'Dashboard', active: true },
    { icon: MessageSquare, label: 'Chat', active: false },
    { icon: Calendar, label: 'Calendar', active: false },
    { icon: Settings, label: 'Settings', active: false }
  ];

  return (
    <div className="min-h-screen bg-slate-900 relative">
      {/* Background Premium com Profundidade */}
      <div className="fixed inset-0 -z-10">
        {/* Gradient Base */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900/20 via-purple-900/20 to-slate-900" />
        
        {/* Floating Orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-2xl animate-pulse delay-1000" />
        <div className="absolute top-3/4 left-1/3 w-32 h-32 bg-gradient-to-r from-green-500/15 to-blue-500/15 rounded-full blur-2xl animate-pulse delay-500" />
      </div>
      
      {/* Layout Principal */}
      <div className="relative z-0 flex h-screen text-slate-50">
        {/* Sidebar Component */}
        <Sidebar />

        {/* Área principal */}
        <main className="flex-1 flex flex-col relative z-20">
            {/* Header */}
            <header className="p-8 border-b border-white/10 backdrop-blur-[20px] bg-white/5">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">
                    Welcome back, Lucas
                  </h1>
                  <p className="text-slate-400">
                    Ready to organize your tasks with AI
                  </p>
                </div>
                <button
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                  aria-label="Alternar sidebar"
                >
                  <span className="text-slate-400 text-xl">
                    {sidebarCollapsed ? '→' : '←'}
                  </span>
                </button>
              </div>
            </header>

            {/* Stats Cards Premium */}
            <section className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-6 rounded-2xl shadow-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm font-medium">Total Tasks</p>
                      <p className="text-white text-3xl font-bold">24</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                      <div className="w-6 h-6 bg-white rounded-full"></div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-green-600 to-green-700 p-6 rounded-2xl shadow-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm font-medium">Completed</p>
                      <p className="text-white text-3xl font-bold">18</p>
                    </div>
                    <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                      <div className="w-6 h-6 bg-white rounded-full"></div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-purple-600 to-purple-700 p-6 rounded-2xl shadow-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm font-medium">In Progress</p>
                      <p className="text-white text-3xl font-bold">4</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                      <div className="w-6 h-6 bg-white rounded-full"></div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-red-600 to-red-700 p-6 rounded-2xl shadow-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-red-100 text-sm font-medium">High Priority</p>
                      <p className="text-white text-3xl font-bold">2</p>
                    </div>
                    <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
                      <div className="w-6 h-6 bg-white rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Main content */}
            <div className="flex-1 flex p-8 gap-8">
              {/* Chat conversacional */}
              <section className="w-96 backdrop-blur-[20px] bg-white/5 border border-white/20 rounded-3xl flex flex-col shadow-2xl shadow-black/20">
                <div className="p-6 border-b border-white/10">
                  <h3 className="text-lg font-semibold text-white">AI Assistant</h3>
                  <p className="text-slate-400 text-sm">{selectedWorkspace} • {selectedProject}</p>
                </div>
                <div className="flex-1 p-6">
                  <div className="space-y-4">
                    <div className="bg-slate-700/50 p-4 rounded-xl">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                          <div className="w-4 h-4 bg-yellow-400 rounded-full"></div>
                        </div>
                        <span className="text-slate-300 text-sm">Digite ou grave uma mensagem para criar tarefas automaticamente</span>
                      </div>
                    </div>
                    <div className="bg-slate-700/50 p-4 rounded-xl">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                          <div className="w-4 h-4 bg-blue-400 rounded-full"></div>
                        </div>
                        <span className="text-slate-300 text-sm">Bem-vindo ao seu assistente IA! Comece digitando ou gravando uma mensagem</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-6 border-t border-white/10">
                  <div className="flex items-center space-x-3 bg-slate-700/50 rounded-xl p-3">
                    <input 
                      type="text" 
                      placeholder="Digite ou segure para falar" 
                      className="flex-1 bg-transparent text-white placeholder-slate-400 outline-none"
                    />
                    <button className="p-2 hover:bg-slate-600 rounded-lg transition-colors">
                      <div className="w-5 h-5 bg-blue-500 rounded-full"></div>
                    </button>
                  </div>
                </div>
              </section>

              {/* Lista/Kanban/Timeline de tarefas */}
              <section className="flex-1 flex flex-col backdrop-blur-[20px] bg-white/5 border border-white/20 rounded-3xl shadow-2xl shadow-black/20">
                <div className="p-6 border-b border-white/10">
                  <div className="flex items-center space-x-4">
                    <button className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium">Lista</button>
                    <button className="px-4 py-2 text-slate-400 hover:text-white transition-colors">Kanban</button>
                    <button className="px-4 py-2 text-slate-400 hover:text-white transition-colors">Timeline</button>
                  </div>
                </div>
                <div className="flex-1 overflow-auto p-6">
                  <div className="bg-slate-700/50 p-6 rounded-xl">
                    <h3 className="text-lg font-semibold text-white mb-2">Criar campanha Instagram Academia SP</h3>
                    <p className="text-slate-300 mb-4">Desenvolver campanha para redes sociais da academia</p>
                    <div className="flex items-center space-x-4 mb-4">
                      <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">P2 - Normal</span>
                      <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm">Concluído</span>
                      <span className="text-slate-400 text-sm">21/02/2025 • 4h</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-slate-300">
                        <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                        <span>Briefing com cliente</span>
                      </div>
                      <div className="flex items-center space-x-2 text-slate-300">
                        <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                        <span>Criar conceito visual</span>
                      </div>
                      <div className="flex items-center space-x-2 text-slate-300">
                        <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                        <span>Produzir conteúdo</span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </main>
      </div>
    </div>
  );
}
