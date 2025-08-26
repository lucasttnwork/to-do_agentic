'use client';

import { useAppStore } from '@/lib/store';
import { Tabs, Box } from '@radix-ui/themes';

type ViewMode = 'list' | 'kanban' | 'timeline';

export function TaskViewSwitcher() {
  const { viewMode, setViewMode } = useAppStore();

  return (
    <Box className="flex items-center justify-between">
      <Tabs.Root value={viewMode} onValueChange={(val) => setViewMode(val as ViewMode)}>
        <Tabs.List className="bg-slate-800/30 border border-slate-600/30 rounded-xl p-1 backdrop-blur-sm">
          <Tabs.Trigger 
            value="list"
            className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-300 data-[state=active]:border-blue-500/30 text-slate-400 hover:text-slate-300 rounded-lg px-4 py-2 font-medium text-sm transition-all"
          >
            Lista
          </Tabs.Trigger>
          <Tabs.Trigger 
            value="kanban"
            className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-300 data-[state=active]:border-blue-500/30 text-slate-400 hover:text-slate-300 rounded-lg px-4 py-2 font-medium text-sm transition-all"
          >
            Kanban
          </Tabs.Trigger>
          <Tabs.Trigger 
            value="timeline"
            className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-300 data-[state=active]:border-blue-500/30 text-slate-400 hover:text-slate-300 rounded-lg px-4 py-2 font-medium text-sm transition-all"
          >
            Timeline
          </Tabs.Trigger>
        </Tabs.List>
      </Tabs.Root>

      <Box className="flex items-center gap-3">
        <select className="bg-white/5 border border-white/10 text-slate-300 hover:border-blue-500/50 rounded-xl px-3 py-2 backdrop-blur-sm transition-all focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20">
          <option value="all">Todas as prioridades</option>
          <option value="1">P1 - Urgente</option>
          <option value="2">P2 - Normal</option>
          <option value="3">P3 - Baixa</option>
        </select>
        <select className="bg-white/5 border border-white/10 text-slate-300 hover:border-blue-500/50 rounded-xl px-3 py-2 backdrop-blur-sm transition-all focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20">
          <option value="all">Todos os status</option>
          <option value="todo">A fazer</option>
          <option value="in_progress">Em andamento</option>
          <option value="done">Concluído</option>
        </select>
      </Box>
    </Box>
  );
}
