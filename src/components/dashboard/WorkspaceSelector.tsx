'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Workspace } from '@/types';
import { Select, Flex, Text, Box } from '@radix-ui/themes';
import { HomeIcon, Component1Icon } from '@radix-ui/react-icons';

export function WorkspaceSelector() {
  const { currentWorkspace, setCurrentWorkspace } = useAppStore();
  const [open, setOpen] = useState(false);

  const workspaces: Workspace[] = [
    { id: '1', user_id: '1', name: 'Pessoal', type: 'personal', settings: {} },
    { id: '2', user_id: '1', name: 'NTEX', type: 'client', settings: {} },
  ];

  const renderIcon = (type: 'personal' | 'client') => (
    type === 'personal' ? <HomeIcon /> : <Component1Icon />
  );

  return (
    <Box p="4">
      <Text size="2" weight="medium">Workspaces</Text>
      <Box mt="2">
        <Select.Root open={open} onOpenChange={setOpen} value={currentWorkspace?.id || ''} onValueChange={(val) => {
          const selected = workspaces.find(w => w.id === val) || null;
          setCurrentWorkspace(selected);
        }}>
          <Select.Trigger placeholder="Selecionar workspace" />
          <Select.Content position="popper">
            <Select.Group>
              <Select.Label>Disponíveis</Select.Label>
              {workspaces.map(ws => (
                <Select.Item key={ws.id} value={ws.id}>
                  <Flex align="center" gap="2">
                    {renderIcon(ws.type)}
                    <Text>{ws.name}</Text>
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
