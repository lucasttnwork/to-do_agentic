'use client';

import { useState } from 'react';
import { WorkspaceSelector } from './WorkspaceSelector';
import { ProjectList } from './ProjectList';
import { ChatHeader } from '@/components/chat/ChatHeader';
import { ChatMessages } from '@/components/chat/ChatMessages';
import { ChatInput } from '@/components/chat/ChatInput';
import { TaskViewSwitcher } from '@/components/tasks/TaskViewSwitcher';
import { TaskList } from '@/components/tasks/TaskList';

export function MainDashboard() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen app-bg text-foreground">
      {/* Sidebar - Workspaces/Projetos */}
      <aside className={`${sidebarCollapsed ? 'w-16' : 'w-64'} glass border-r border-gray-800 transition-all duration-300 flex flex-col` }>
        <div className="p-4 border-b border-gray-800">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Alternar sidebar"
          >
            {sidebarCollapsed ? (
              <span className="text-gray-300">→</span>
            ) : (
              <span className="text-gray-300">←</span>
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

      {/* Área principal - Chat + Tarefas */}
      <main className="flex-1 flex">
        {/* Chat conversacional */}
        <section className="w-96 glass-strong border-r border-gray-800 flex flex-col glow">
          <ChatHeader />
          <ChatMessages />
          <ChatInput />
        </section>

        {/* Lista/Kanban/Timeline de tarefas */}
        <section className="flex-1 flex flex-col">
          <div className="p-4 border-b border-gray-800 glass">
            <TaskViewSwitcher />
          </div>
          <div className="flex-1 overflow-auto">
            <TaskList />
          </div>
        </section>
      </main>
    </div>
  );
}
