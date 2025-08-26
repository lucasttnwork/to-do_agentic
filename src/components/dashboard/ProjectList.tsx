'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Project } from '@/types';
import { Select, Box, Text, Flex } from '@radix-ui/themes';
import { Component1Icon } from '@radix-ui/react-icons';

export function ProjectList() {
  const { currentProject, setCurrentProject, currentWorkspace } = useAppStore();
  const [open, setOpen] = useState(false);

  const projects: Project[] = [
    { id: '1', workspace_id: '2', name: 'Kabbatec', description: 'Cliente de marketing digital', status: 'active', client_sla_hours: 4 },
    { id: '2', workspace_id: '2', name: 'Cartório', description: 'Cliente de serviços jurídicos', status: 'active', client_sla_hours: 24 },
    { id: '3', workspace_id: '2', name: 'Academia SP', description: 'Cliente de fitness', status: 'active', client_sla_hours: 8 },
  ];

  const workspaceProjects = projects.filter(p => p.workspace_id === currentWorkspace?.id);

  return (
    <Box px="4">
      <Text size="2" weight="medium">Projetos</Text>
      <Box mt="2">
        <Select.Root open={open} onOpenChange={setOpen} value={currentProject?.id || ''} onValueChange={(val) => {
          const selected = workspaceProjects.find(p => p.id === val) || null;
          setCurrentProject(selected);
        }}>
          <Select.Trigger placeholder="Todos os projetos" />
          <Select.Content position="popper">
            <Select.Group>
              <Select.Label>Projetos</Select.Label>
              <Select.Item value="__all__" onSelect={() => setCurrentProject(null)}>
                <Flex align="center" gap="2">
                  <Component1Icon />
                  <Text>Todos os projetos</Text>
                </Flex>
              </Select.Item>
              {workspaceProjects.map(p => (
                <Select.Item key={p.id} value={p.id}>
                  <Flex align="center" gap="2">
                    <Component1Icon />
                    <Text>{p.name}</Text>
                  </Flex>
                </Select.Item>
              ))}
            </Select.Group>
          </Select.Content>
        </Select.Root>
      </Box>
    </Box>
  );
}
