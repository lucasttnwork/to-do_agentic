'use client';

import useSWR from 'swr';
import { useEffect, useState } from 'react';
import { Task } from '@/types';
import { getAccessToken } from '@/lib/auth';

interface TasksResponse {
  success: boolean;
  tasks: Task[];
}

type TaskFilters = {
  workspaceId?: string;
  projectId?: string;
  status?: string;
  priority?: string | number;
};

async function fetchTasks(token: string, filters: TaskFilters): Promise<Task[]> {
  if (!token || !filters.workspaceId) return [];

  const params = new URLSearchParams();
  params.set('workspace_id', filters.workspaceId);
  if (filters.projectId) params.set('project_id', filters.projectId);
  if (filters.status) params.set('status', String(filters.status));
  if (filters.priority) params.set('priority', String(filters.priority));

  const res = await fetch(`/api/tasks?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    return [];
  }

  const data: TasksResponse = await res.json();
  return data.tasks || [];
}

export function useTasks(filters: TaskFilters) {
  const [token, setToken] = useState<string | null>(null);
  useEffect(() => {
    getAccessToken().then(setToken).catch(() => setToken(null));
  }, []);

  const key = filters.workspaceId && token ? ['tasks', filters.workspaceId, filters.projectId, filters.status, filters.priority, token] : null;
  const { data, error, isLoading, mutate } = useSWR<Task[] | undefined>(
    key,
    () => fetchTasks(token as string, filters),
    {
      revalidateOnFocus: true,
    }
  );

  return {
    tasks: data || [],
    isLoading,
    error,
    refresh: mutate,
  };
}


