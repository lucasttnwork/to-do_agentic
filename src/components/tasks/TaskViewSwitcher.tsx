'use client';

import { useAppStore } from '@/lib/store';
import { Tabs, Box, Select } from '@radix-ui/themes';

export function TaskViewSwitcher() {
  const { viewMode, setViewMode } = useAppStore();

  return (
    <Box className="flex items-center justify-between">
      <Tabs.Root value={viewMode} onValueChange={(val) => setViewMode(val as any)}>
        <Tabs.List>
          <Tabs.Trigger value="list">Lista</Tabs.Trigger>
          <Tabs.Trigger value="kanban">Kanban</Tabs.Trigger>
          <Tabs.Trigger value="timeline">Timeline</Tabs.Trigger>
        </Tabs.List>
      </Tabs.Root>

      <Box className="flex items-center gap-2">
        <Select.Root defaultValue="all">
          <Select.Trigger />
          <Select.Content>
            <Select.Item value="all">Todas as prioridades</Select.Item>
            <Select.Item value="1">P1 - Urgente</Select.Item>
            <Select.Item value="2">P2 - Normal</Select.Item>
            <Select.Item value="3">P3 - Baixa</Select.Item>
          </Select.Content>
        </Select.Root>
        <Select.Root defaultValue="all">
          <Select.Trigger />
          <Select.Content>
            <Select.Item value="all">Todos os status</Select.Item>
            <Select.Item value="todo">A fazer</Select.Item>
            <Select.Item value="in_progress">Em andamento</Select.Item>
            <Select.Item value="done">Concluído</Select.Item>
          </Select.Content>
        </Select.Root>
      </Box>
    </Box>
  );
}
