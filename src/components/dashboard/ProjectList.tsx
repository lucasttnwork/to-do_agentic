'use client';

import { useAppStore } from '@/lib/store';
import { Project } from '@/types';

export function ProjectList() {
  const { currentProject, setCurrentProject, currentWorkspace } = useAppStore();

  const projects: Project[] = [
    { id: '1', workspace_id: '2', name: 'Kabbatec', description: 'Cliente de marketing digital', status: 'active', client_sla_hours: 4 },
    { id: '2', workspace_id: '2', name: 'Cartório', description: 'Cliente de serviços jurídicos', status: 'active', client_sla_hours: 24 },
    { id: '3', workspace_id: '2', name: 'Academia SP', description: 'Cliente de fitness', status: 'active', client_sla_hours: 8 },
  ];

  const workspaceProjects = projects.filter(p => p.workspace_id === currentWorkspace?.id);

  return (
    <div className="px-4">
      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4 px-2">
        Projetos
      </h3>
      <div className="space-y-2">
        <button
          onClick={() => setCurrentProject(null)}
          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all cursor-pointer group mb-1 ${
            !currentProject
              ? 'bg-blue-500/10 text-blue-300'
              : 'hover:bg-blue-500/5 text-slate-400 hover:text-blue-200'
          }`}
        >
          <div className="w-3 h-3 rounded-full bg-blue-500/50 group-hover:bg-blue-400/70 transition-colors shadow-lg" />
          <span className="font-medium">
            Todos os projetos
          </span>
        </button>
        
        {workspaceProjects.map((project) => (
          <button
            key={project.id}
            onClick={() => setCurrentProject(project)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all cursor-pointer group mb-1 ${
              currentProject?.id === project.id
                ? 'bg-blue-500/10 text-blue-300'
                : 'hover:bg-blue-500/5 text-slate-400 hover:text-blue-200'
            }`}
          >
            <div className="w-3 h-3 rounded-full bg-blue-500/50 group-hover:bg-blue-400/70 transition-colors shadow-lg" />
            <span className="font-medium">
              {project.name}
            </span>
            <span className="text-xs text-slate-500 ml-auto">
              {project.client_sla_hours}h
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
