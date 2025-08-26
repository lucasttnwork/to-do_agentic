'use client';

import { useAppStore } from '@/lib/store';
import { PersonIcon, GearIcon } from '@radix-ui/react-icons';
import { Flex, IconButton, Text, Box, Callout } from '@radix-ui/themes';

export function ChatHeader() {
  const { currentWorkspace, currentProject } = useAppStore();

  return (
    <Box p="6" className="border-b border-slate-700/30 bg-gradient-to-r from-purple-500/10 to-blue-500/10">
      <Flex align="center" justify="between">
        <Flex align="center" gap="3">
          <Flex align="center" justify="center" className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 shadow-lg shadow-purple-500/25">
            <PersonIcon color="white" />
          </Flex>
          <Box>
            <Text size="3" weight="medium" className="text-white">AI Assistant</Text>
            <Text size="2" className="text-slate-400">
              {currentWorkspace?.name} {currentProject && `• ${currentProject.name}`}
            </Text>
          </Box>
        </Flex>
        <IconButton 
          variant="ghost" 
          size="2" 
          radius="full" 
          aria-label="Configurações"
          className="text-slate-400 hover:text-blue-300 hover:bg-blue-500/10"
        >
          <GearIcon />
        </IconButton>
      </Flex>
      <Callout.Root size="2" className="mt-4 bg-blue-500/5 border border-blue-500/20 rounded-xl">
        <Callout.Text className="text-slate-300">
          💡 Digite ou grave uma mensagem para criar tarefas automaticamente. Ex: "Cliente Kabbatec precisa de orçamento até sexta"
        </Callout.Text>
      </Callout.Root>
    </Box>
  );
}
