'use client';

import { useState } from 'react';

export default function DashboardPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-bg-primary relative overflow-hidden">
      {/* Grid pattern overlay */}
      <div className="fixed inset-0 bg-grid-pattern opacity-5 z-10" />
      
      {/* Gradient overlays */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse z-10" />
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000 z-10" />
      
      {/* Main content */}
      <div className="relative z-20">
        <div className="flex h-screen text-slate-50">
          {/* Sidebar - Workspaces/Projetos */}
          <aside className={`${sidebarCollapsed ? 'w-16' : 'w-64'} backdrop-blur-xl bg-slate-800/20 border-r border-slate-700/30 transition-all duration-300 flex flex-col`}>
            <div className="p-4 border-b border-slate-700/30">
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-blue-500/10 transition-colors"
                aria-label="Alternar sidebar"
              >
                {sidebarCollapsed ? (
                  <span className="text-slate-400">→</span>
                ) : (
                  <span className="text-slate-400">←</span>
                )}
              </button>
            </div>

            {!sidebarCollapsed && (
              <div className="flex-1 overflow-y-auto p-4">
                <div className="mb-6">
                  <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">WORKSPACES</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-700/30 cursor-pointer">
                      <div className="w-6 h-6 bg-gradient-to-r from-red-400 to-pink-400 rounded-full"></div>
                      <span className="text-slate-200">Pessoal</span>
                    </div>
                    <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-700/30 cursor-pointer">
                      <div className="w-6 h-6 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"></div>
                      <span className="text-slate-200">NTEX</span>
                    </div>
                    <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-700/30 cursor-pointer">
                      <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-blue-400 rounded-full"></div>
                      <span className="text-slate-200">Kabbatec</span>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">PROJETOS</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-700/30 cursor-pointer">
                      <span className="text-slate-200">Todos os projetos</span>
                    </div>
                    <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-700/30 cursor-pointer">
                      <span className="text-slate-200">Kabbatec</span>
                    </div>
                    <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-700/30 cursor-pointer">
                      <span className="text-slate-200">Cartório</span>
                    </div>
                    <div className="flex items-center space-x-3 p-2 rounded-lg bg-blue-500/20 border border-blue-500/30 rounded-lg cursor-pointer">
                      <span className="text-blue-300">Academia SP</span>
                    </div>
                  </div>
                </div>

                <button className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 px-4 rounded-lg font-medium hover:from-purple-600 hover:to-blue-600 transition-all duration-300">
                  + New Task
                </button>
              </div>
            )}
          </aside>

          {/* Área principal */}
          <main className="flex-1 flex flex-col">
            {/* Header */}
            <header className="p-8 border-b border-slate-700/30 backdrop-blur-xl bg-slate-800/10">
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
                  className="p-2 rounded-lg hover:bg-blue-500/10 transition-colors"
                  aria-label="Alternar sidebar"
                >
                  <span className="text-slate-400 text-xl">
                    {sidebarCollapsed ? '→' : '←'}
                  </span>
                </button>
              </div>
            </header>

            {/* Stats Cards */}
            <section className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                <div className="backdrop-blur-xl bg-white/5 border border-blue-500/20 rounded-3xl p-8 shadow-2xl shadow-blue-500/25">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center mb-6">
                    <span className="text-white text-2xl">🎯</span>
                  </div>
                  <div className="text-4xl font-bold text-white mb-3">24</div>
                  <div className="text-slate-400 font-medium text-lg">Total Tasks</div>
                </div>

                <div className="backdrop-blur-xl bg-white/5 border border-blue-600/20 rounded-3xl p-8 shadow-2xl shadow-blue-600/25">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 flex items-center justify-center mb-6">
                    <span className="text-white text-2xl">✅</span>
                  </div>
                  <div className="text-4xl font-bold text-white mb-3">18</div>
                  <div className="text-slate-400 font-medium text-lg">Completed</div>
                </div>

                <div className="backdrop-blur-xl bg-white/5 border border-purple-500/20 rounded-3xl p-8 shadow-2xl shadow-purple-500/25">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center mb-6">
                    <span className="text-white text-2xl">⏰</span>
                  </div>
                  <div className="text-4xl font-bold text-white mb-3">4</div>
                  <div className="text-slate-400 font-medium text-lg">In Progress</div>
                </div>

                <div className="backdrop-blur-xl bg-white/5 border border-amber-500/20 rounded-3xl p-8 shadow-2xl shadow-amber-500/25">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 flex items-center justify-center mb-6">
                    <span className="text-white text-2xl">⚠️</span>
                  </div>
                  <div className="text-4xl font-bold text-white mb-3">2</div>
                  <div className="text-slate-400 font-medium text-lg">High Priority</div>
                </div>
              </div>
            </section>

            {/* Main content */}
            <div className="flex-1 flex p-8 gap-8">
              {/* Chat conversacional */}
              <section className="w-96 backdrop-blur-xl bg-slate-800/20 border border-slate-700/30 rounded-3xl flex flex-col shadow-2xl shadow-black/20">
                <div className="p-6 border-b border-slate-700/30">
                  <h3 className="text-lg font-semibold text-white mb-2">AI Assistant</h3>
                  <p className="text-slate-400 text-sm">NTEX • Academia SP</p>
                </div>
                <div className="flex-1 p-6">
                  <div className="bg-slate-700/30 rounded-lg p-4 mb-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-yellow-400">💡</span>
                      <span className="text-slate-300 text-sm">Digite ou grave uma mensagem para criar tarefas automaticamente. Ex: 'Cliente Kabbatec precisa de orçamento até sexta'</span>
                    </div>
                  </div>
                  <div className="bg-slate-700/30 rounded-lg p-4 mb-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-blue-400">💬</span>
                      <span className="text-slate-300 text-sm">Bem-vindo ao seu assistente IA! Comece digitando ou gravando uma mensagem para o sistema irá analisar e organizar suas tarefas de forma inteligente.</span>
                    </div>
                  </div>
                </div>
                <div className="p-6 border-t border-slate-700/30">
                  <div className="flex items-center space-x-2 bg-slate-700/30 rounded-lg p-3">
                    <input
                      type="text"
                      placeholder="Digite ou segure para falar"
                      className="flex-1 bg-transparent text-white placeholder-slate-400 outline-none"
                    />
                    <button className="text-slate-400 hover:text-white">
                      🎤
                    </button>
                    <button className="text-blue-400 hover:text-blue-300">
                      ➤
                    </button>
                  </div>
                </div>
              </section>

              {/* Lista de tarefas */}
              <section className="flex-1 flex flex-col backdrop-blur-xl bg-slate-800/20 border border-slate-700/30 rounded-3xl shadow-2xl shadow-black/20">
                <div className="p-6 border-b border-slate-700/30">
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-1">
                      <button className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium">Lista</button>
                      <button className="px-4 py-2 text-slate-400 hover:text-white rounded-lg text-sm font-medium">Kanban</button>
                      <button className="px-4 py-2 text-slate-400 hover:text-white rounded-lg text-sm font-medium">Timeline</button>
                    </div>
                    <div className="flex space-x-2">
                      <select className="bg-slate-700/30 text-slate-300 text-sm rounded-lg px-3 py-2 border border-slate-600">
                        <option>Todas as prioridades</option>
                      </select>
                      <select className="bg-slate-700/30 text-slate-300 text-sm rounded-lg px-3 py-2 border border-slate-600">
                        <option>Todos os status</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="flex-1 overflow-auto p-6">
                  <div className="bg-slate-700/30 rounded-lg p-6 border border-slate-600/30">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-white mb-2">Criar campanha Instagram Academia SP</h4>
                        <p className="text-slate-300 mb-3">Desenvolver campanha para redes sociais da academia</p>
                        <div className="flex items-center space-x-4 text-sm text-slate-400">
                          <span>P2 - Normal</span>
                          <span className="text-green-400">Concluído</span>
                          <span>21/02/2025</span>
                          <span>4h</span>
                        </div>
                      </div>
                      <div className="w-24 h-2 bg-slate-600 rounded-full overflow-hidden">
                        <div className="w-full h-full bg-blue-500 rounded-full"></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-sm">
                        <span className="text-green-400">✓</span>
                        <span className="text-slate-300">Briefing com cliente</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <span className="text-green-400">✓</span>
                        <span className="text-slate-300">Criar conceito visual</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <span className="text-green-400">✓</span>
                        <span className="text-slate-300">Produzir conteúdo</span>
                      </div>
                    </div>
                    <div className="mt-4 text-xs text-slate-500">
                      Criado em 19/02/2025, 15:10
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
