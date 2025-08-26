'use client';

import { useState } from 'react';
import { WorkspaceSelector } from './WorkspaceSelector';
import { ProjectList } from './ProjectList';
import { ChatHeader } from '@/components/chat/ChatHeader';
import { ChatMessages } from '@/components/chat/ChatMessages';
import { ChatInput } from '@/components/chat/ChatInput';
import { TaskViewSwitcher } from '@/components/tasks/TaskViewSwitcher';
import { TaskList } from '@/components/tasks/TaskList';
import StatsCards from './StatsCards';

export function MainDashboard() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
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
          <div className="flex-1 overflow-y-auto">
            <WorkspaceSelector />
            <ProjectList />
          </div>
        )}
      </aside>

      {/* Área principal */}
      <main className="flex-1 flex flex-col">
        {/* Header com mais espaço */}
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
          <StatsCards />
        </section>

        {/* Main content com proporções melhores */}
        <div className="flex-1 flex p-8 gap-8">
          {/* Chat conversacional */}
          <section className="w-96 backdrop-blur-xl bg-slate-800/20 border border-slate-700/30 rounded-3xl flex flex-col shadow-2xl shadow-black/20">
            <ChatHeader />
            <ChatMessages />
            <ChatInput />
          </section>

          {/* Lista/Kanban/Timeline de tarefas */}
          <section className="flex-1 flex flex-col backdrop-blur-xl bg-slate-800/20 border border-slate-700/30 rounded-3xl shadow-2xl shadow-black/20">
            <div className="p-6 border-b border-slate-700/30">
              <TaskViewSwitcher />
            </div>
            <div className="flex-1 overflow-auto p-6">
              <TaskList />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
