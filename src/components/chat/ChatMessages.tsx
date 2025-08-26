'use client';

import { useEffect, useRef } from 'react';
import { useAppStore } from '@/lib/store';
import { ChatMessage } from '@/types';
import { formatDateTime } from '@/lib/utils';
import { ScrollArea, Card, Flex, Text, Box } from '@radix-ui/themes';
import { PersonIcon, CheckCircledIcon, ClockIcon, ChatBubbleIcon } from '@radix-ui/react-icons';

export function ChatMessages() {
  const { messages } = useAppStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getAction = (action?: string) => {
    switch (action) {
      case 'task_created':
        return { icon: <CheckCircledIcon />, label: 'Tarefa criada' };
      case 'task_updated':
        return { icon: <ClockIcon />, label: 'Tarefa atualizada' };
      case 'task_completed':
        return { icon: <CheckCircledIcon />, label: 'Tarefa concluída' };
      default:
        return null;
    }
  };

  return (
    <ScrollArea type="auto" scrollbars="vertical" className="flex-1">
      <Box p="4" className="space-y-4">
        {messages.length === 0 ? (
          <Flex direction="column" align="center" justify="center" className="h-full text-center">
            <ChatBubbleIcon className="mb-4" width="48" height="48" />
            <Text size="3" weight="medium" className="text-white">Bem-vindo ao seu assistente IA!</Text>
            <Text size="2" color="gray" className="max-w-md text-slate-400">
              Comece digitando ou gravando uma mensagem para criar tarefas automaticamente. O sistema irá analisar e organizar suas tarefas de forma inteligente.
            </Text>
          </Flex>
        ) : (
          messages.map((message: ChatMessage) => {
            const isUser = message.role === 'user';
            const action = getAction(message.action);
            return (
              <Flex key={message.id} justify={isUser ? 'end' : 'start'}>
                <Card size="2" variant={isUser ? 'classic' : 'surface'} className={`max-w-[80%] ${isUser ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' : 'backdrop-blur-sm bg-white/10 border border-white/20'}`}>
                  <Flex gap="2" align="start">
                    {!isUser && (
                      <Box mt="1">
                        <ChatBubbleIcon />
                      </Box>
                    )}
                    <Box>
                      <Text size="2" className="whitespace-pre-wrap">{message.content}</Text>
                      {action && (
                        <Flex align="center" gap="1" mt="2" className={isUser ? 'opacity-80' : 'opacity-75'}>
                          {action.icon}
                          <Text size="1">{action.label}</Text>
                        </Flex>
                      )}
                      <Text size="1" color={isUser ? 'gray' : 'gray'} className="block mt-2">
                        {formatDateTime(message.timestamp)}
                      </Text>
                    </Box>
                    {isUser && (
                      <Box mt="1">
                        <PersonIcon />
                      </Box>
                    )}
                  </Flex>
                </Card>
              </Flex>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </Box>
    </ScrollArea>
  );
}
