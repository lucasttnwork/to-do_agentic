'use client';

import ChatInterface from '@/components/dashboard/ChatInterface';
import TaskBoard from '@/components/dashboard/TaskBoard';

export default function DashboardPage() {
  return (
    <div className="flex h-full">
      {/* Chat Interface */}
      <div className="w-96 border-r border-white/10">
        <ChatInterface />
      </div>

      {/* Task Board */}
      <div className="flex-1">
        <TaskBoard />
      </div>
    </div>
  );
}
