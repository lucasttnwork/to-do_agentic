'use client';

import { useAppStore } from '@/lib/store';
import { PersonIcon, GearIcon } from '@radix-ui/react-icons';
import { Flex, Card, IconButton, Text, Box, Callout } from '@radix-ui/themes';

export function ChatHeader() {
  const { currentWorkspace, currentProject } = useAppStore();

  return (
    <Box p="4" className="border-b border-gray-800 bg-card">
      <Flex align="center" justify="between">
        <Flex align="center" gap="3">
          <Flex align="center" justify="center" className="w-8 h-8 rounded-lg bg-blue-600">
            <PersonIcon color="white" />
          </Flex>
          <Box>
            <Text size="2" weight="medium">Assistente IA</Text>
            <Text size="1" color="gray">
              {currentWorkspace?.name} {currentProject && `• ${currentProject.name}`}
            </Text>
          </Box>
        </Flex>
        <IconButton variant="ghost" color="gray" size="2" radius="full" aria-label="Configurações">
          <GearIcon />
        </IconButton>
      </Flex>
      <Callout.Root size="1" color="blue" className="mt-3">
        <Callout.Text>
          💡 Digite ou grave uma mensagem para criar tarefas automaticamente. Ex: "Cliente Kabbatec precisa de orçamento até sexta"
        </Callout.Text>
      </Callout.Root>
    </Box>
  );
}
