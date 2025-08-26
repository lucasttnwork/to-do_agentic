'use client';

import { useState } from 'react';
import { Plus, ChevronLeft, ChevronRight, Home, MessageSquare, Calendar, Settings, Brain } from 'lucide-react';
import { motion } from 'framer-motion';

export function MainDashboard() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const menuItems = [
    { icon: Home, label: 'Dashboard', active: true },
    { icon: MessageSquare, label: 'Chat', active: false },
    { icon: Calendar, label: 'Calendar', active: false },
    { icon: Settings, label: 'Settings', active: false }
  ];

  return (
    <div className="min-h-screen bg-slate-900 relative overflow-hidden">
      {/* Background Premium com Profundidade */}
      <div className="fixed inset-0 -z-10">
        {/* Gradient Base */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900/20 via-purple-900/20 to-slate-900" />
        
        {/* Floating Orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-2xl animate-pulse delay-1000" />
        <div className="absolute top-3/4 left-1/3 w-32 h-32 bg-gradient-to-r from-green-500/15 to-blue-500/15 rounded-full blur-2xl animate-pulse delay-500" />
      </div>
      
      {/* Main content */}
      <div className="relative z-10">
        <div className="flex h-screen text-slate-50">
          {/* Sidebar - Workspaces/Projetos com Liquid Glass Melhorado */}
          <aside className={`${sidebarCollapsed ? 'w-20' : 'w-80'} relative z-50 bg-slate-800 border-r border-slate-600 transition-all duration-300 flex flex-col shadow-2xl shadow-black/50`}>
            {/* Header da Sidebar com Logo */}
            <div className="p-6 border-b border-slate-600 bg-slate-700">
              {!sidebarCollapsed ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                      <Brain className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                      TaskFlow AI
                    </span>
                  </div>
                  <button
                    onClick={() => setSidebarCollapsed(true)}
                    className="p-2 rounded-lg hover:bg-slate-600 transition-colors text-slate-300 hover:text-white"
                    aria-label="Recolher sidebar"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <button
                    onClick={() => setSidebarCollapsed(false)}
                    className="p-2 rounded-lg hover:bg-slate-600 transition-colors text-slate-300 hover:text-white"
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
                <div className="px-4 py-4 bg-slate-700">
                  <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-widest mb-4 px-2">
                    Navegação
                  </h3>
                  <div className="space-y-2">
                    {menuItems.map((item, index) => (
                      <motion.button
                        key={item.label}
                        whileHover={{ x: 6, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`w-full flex items-center space-x-4 px-4 py-3 rounded-xl transition-all duration-200 relative overflow-hidden group cursor-pointer ${
                          item.active 
                            ? 'bg-gradient-to-r from-blue-500/30 to-purple-500/30 border border-blue-500/50 text-white shadow-lg shadow-blue-500/30' 
                            : 'hover:bg-slate-600 text-slate-200 hover:text-white'
                        }`}
                      >
                        {/* Active indicator glow */}
                        {item.active && (
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full" />
                        )}
                        
                        <item.icon className="w-5 h-5 relative z-10" />
                        <span className="font-medium relative z-10">{item.label}</span>
                        
                        {/* Hover glow */}
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Workspaces */}
                <div className="flex-1 overflow-y-auto bg-slate-700 p-4">
                  <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-widest mb-4 px-2">
                    Workspaces
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-slate-600 text-slate-200 cursor-pointer">
                      <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                      <span className="font-medium">NTEX</span>
                    </div>
                    <div className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-slate-600 text-slate-200 cursor-pointer">
                      <div className="w-3 h-3 rounded-full bg-slate-400"></div>
                      <span className="font-medium">Pessoal</span>
                    </div>
                    <div className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-slate-600 text-slate-200 cursor-pointer">
                      <div className="w-3 h-3 rounded-full bg-slate-400"></div>
                      <span className="font-medium">Kabbatec</span>
                    </div>
                  </div>
                  
                  <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-widest mb-4 px-2 mt-6">
                    Projetos
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-slate-600 text-slate-200 cursor-pointer">
                      <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                      <span className="font-medium">Todos os projetos</span>
                    </div>
                    <div className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-slate-600 text-slate-200 cursor-pointer">
                      <div className="w-3 h-3 rounded-full bg-slate-400"></div>
                      <span className="font-medium">Academia SP</span>
                    </div>
                    <div className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-slate-600 text-slate-200 cursor-pointer">
                      <div className="w-3 h-3 rounded-full bg-slate-400"></div>
                      <span className="font-medium">Kabbatec</span>
                    </div>
                  </div>
                </div>

                {/* Botão New Task */}
                <div className="p-4 border-t border-slate-600 bg-slate-700">
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-xl font-medium shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    <Plus className="w-5 h-5" />
                    <span>New Task</span>
                  </motion.button>
                </div>
              </>
            )}

            {/* Sidebar Collapsed - Apenas ícones */}
            {sidebarCollapsed && (
              <div className="flex-1 flex flex-col items-center py-4 space-y-6 bg-slate-700">
                {/* Navigation Icons */}
                {menuItems.map((item, index) => (
                  <motion.button
                    key={item.label}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className={`p-3 rounded-xl transition-all duration-200 relative ${
                      item.active 
                        ? 'bg-gradient-to-r from-blue-500/30 to-purple-500/30 border border-blue-500/50 text-white shadow-lg shadow-blue-500/30' 
                        : 'hover:bg-slate-600 text-slate-200 hover:text-white'
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
                  className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300"
                  title="New Task"
                >
                  <Plus className="w-5 h-5" />
                </motion.button>
              </div>
            )}
          </aside>

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
                  <p className="text-slate-400 text-sm">NTEX • Academia SP</p>
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
    </div>
  );
}
