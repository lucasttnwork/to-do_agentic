'use client';

import { useState } from 'react';
import { Task } from '@/types';
import { formatDate, formatDateTime, formatDuration, getPriorityLabel, getStatusLabel } from '@/lib/utils';
import { Card, Flex, Text, Box, Badge, DropdownMenu, Progress, IconButton } from '@radix-ui/themes';
import { DotsHorizontalIcon, ChevronDownIcon, ChevronRightIcon, CheckCircledIcon, CircleIcon, ClockIcon, CalendarIcon, Pencil2Icon, TrashIcon } from '@radix-ui/react-icons';

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const completedSubtasks = task.subtasks?.filter(st => st.status === 'done').length || 0;
  const totalSubtasks = task.subtasks?.length || 0;
  const progress = totalSubtasks ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

  const priorityColor = task.priority === 1 ? 'red' : task.priority === 2 ? 'yellow' : 'green';
  const statusColor = task.status === 'in_progress' ? 'blue' : task.status === 'done' ? 'green' : 'gray';

  return (
    <Card variant="surface">
      <Flex align="start" justify="between" mb="2">
        <Flex align="start" gap="2" className="flex-1">
          <IconButton variant="ghost" color="gray" onClick={() => setIsExpanded(!isExpanded)} aria-label="Expandir">
            {isExpanded ? <ChevronDownIcon /> : <ChevronRightIcon />}
          </IconButton>
          <Box className="flex-1">
            <Text weight="medium">{task.title}</Text>
            {task.description && (
              <Text as="p" size="2" color="gray" className="mt-1">{task.description}</Text>
            )}
          </Box>
        </Flex>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            <IconButton variant="ghost" color="gray" aria-label="Ações"><DotsHorizontalIcon /></IconButton>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content align="end">
            <DropdownMenu.Item>
              <Pencil2Icon /> Editar
            </DropdownMenu.Item>
            <DropdownMenu.Separator />
            <DropdownMenu.Item color="red">
              <TrashIcon /> Deletar
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </Flex>

      <Flex align="center" gap="3" mb="3" ml="7">
        <Badge color={priorityColor as any} variant="soft">{getPriorityLabel(task.priority)}</Badge>
        <Badge color={statusColor as any} variant="soft">{getStatusLabel(task.status)}</Badge>
        {task.due_date && (
          <Flex align="center" gap="1" className="text-xs text-gray-400">
            <CalendarIcon />
            <Text size="1">{formatDate(task.due_date)}</Text>
          </Flex>
        )}
        {task.effort_minutes && (
          <Flex align="center" gap="1" className="text-xs text-gray-400">
            <ClockIcon />
            <Text size="1">{formatDuration(task.effort_minutes)}</Text>
          </Flex>
        )}
      </Flex>

      {totalSubtasks > 0 && (
        <Box ml="7" mb="2">
          <Flex align="center" justify="between" mb="2">
            <Text size="1" color="gray">Subtarefas ({completedSubtasks}/{totalSubtasks})</Text>
            <Box className="w-24"><Progress value={progress} /></Box>
          </Flex>
          {isExpanded && (
            <Box className="space-y-1">
              {task.subtasks!.map((sub) => (
                <Flex key={sub.id} align="center" gap="2" className="text-sm">
                  {sub.status === 'done' ? <CheckCircledIcon className="text-green-500" /> : <CircleIcon className="text-gray-600" />}
                  <Text className={sub.status === 'done' ? 'line-through text-gray-500' : ''}>{sub.title}</Text>
                </Flex>
              ))}
            </Box>
          )}
        </Box>
      )}

      <Flex align="center" justify="between" ml="7" className="text-xs text-gray-400">
        <Flex align="center" gap="4">
          <Text size="1">Criado em {formatDateTime(task.created_at)}</Text>
          {task.ai_confidence && (
            <Text size="1">IA: {Math.round(task.ai_confidence * 100)}%</Text>
          )}
        </Flex>
        <Text size="1">Fonte: {task.source_type}</Text>
      </Flex>
    </Card>
  );
}
