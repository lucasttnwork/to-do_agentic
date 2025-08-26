'use client';

import { useAppStore } from '@/lib/store';
import { Workspace } from '@/types';
import { HomeIcon, Component1Icon } from '@radix-ui/react-icons';

export function WorkspaceSelector() {
  const { currentWorkspace, setCurrentWorkspace } = useAppStore();

  const workspaces: Workspace[] = [
    { id: '1', user_id: '1', name: 'Pessoal', type: 'personal', settings: {} },
    { id: '2', user_id: '1', name: 'NTEX', type: 'client', settings: {} },
  ];



  return (
    <div className="p-4">
      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4 px-2">
        Workspaces
      </h3>
      <div className="space-y-2">
        {workspaces.map((workspace) => (
          <button
            key={workspace.id}
            onClick={() => setCurrentWorkspace(workspace)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all cursor-pointer group mb-1 ${
              currentWorkspace?.id === workspace.id
                ? 'bg-blue-500/10 text-blue-300'
                : 'hover:bg-blue-500/5 text-slate-400 hover:text-blue-200'
            }`}
          >
            <div className="w-3 h-3 rounded-full bg-blue-500/50 group-hover:bg-blue-400/70 transition-colors shadow-lg" />
            <span className="font-medium">
              {workspace.name}
            </span>
            <span className="text-xs text-slate-500 ml-auto">
              {workspace.type === 'client' ? '🏢' : '🏠'}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
