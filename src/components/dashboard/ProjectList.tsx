'use client';

import { useAppStore } from '@/lib/store';
import { Project } from '@/types';
import { motion } from 'framer-motion';
import { useProjects } from '@/hooks/useProjects';

export function ProjectList() {
  const { currentProject, setCurrentProject, currentWorkspace } = useAppStore();
  const { projects } = useProjects(currentWorkspace?.id);
  const workspaceProjects = (projects as Project[]);

  return (
    <div className="px-4 py-4">
      <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-widest mb-4 px-2">
        Projetos
      </h3>
      <div className="space-y-2 max-h-[42vh] overflow-auto pr-1">
        <motion.button
          onClick={() => setCurrentProject(null)}
          whileHover={{ x: 6, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer group relative overflow-hidden ${
            !currentProject
              ? 'bg-gradient-to-r from-blue-500/40 to-purple-500/40 border border-blue-500/60 text-white shadow-lg shadow-blue-500/40'
              : 'hover:bg-slate-600 text-slate-200 hover:text-white'
          }`}
        >
          {/* Active indicator glow */}
          {!currentProject && (
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full" />
          )}
          
          {/* Status dot */}
          <div className={`w-3 h-3 rounded-full transition-colors shadow-lg ${
            !currentProject
              ? 'bg-blue-400'
              : 'bg-slate-400 group-hover:bg-slate-300'
          }`} />
          
          {/* Project name */}
          <span className="font-medium relative z-10">
            Todos os projetos
          </span>
          
          {/* Hover glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
        </motion.button>
        
        {workspaceProjects.map((project) => (
          <motion.button
            key={project.id}
            onClick={() => setCurrentProject(project)}
            whileHover={{ x: 6, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer group relative overflow-hidden ${
              currentProject?.id === project.id
                ? 'bg-gradient-to-r from-blue-500/40 to-purple-500/40 border border-blue-500/60 text-white shadow-lg shadow-blue-500/40'
                : 'hover:bg-slate-600 text-slate-200 hover:text-white'
            }`}
          >
            {/* Active indicator glow */}
            {currentProject?.id === project.id && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full" />
            )}
            
            {/* Status dot */}
            <div className={`w-3 h-3 rounded-full transition-colors shadow-lg ${
              currentProject?.id === project.id
                ? 'bg-blue-400'
                : 'bg-slate-400 group-hover:bg-slate-300'
            }`} />
            
            {/* Project name */}
            <span className="font-medium relative z-10">
              {project.name}
            </span>
            
            <span className="text-xs text-slate-300 ml-auto relative z-10" />
            
            {/* Hover glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
          </motion.button>
        ))}
      </div>
    </div>
  );
}
