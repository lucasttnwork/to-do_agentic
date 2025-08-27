'use client';

import useSWR from 'swr';
import { useEffect, useState } from 'react';
import { Project } from '@/types';
import { getAccessToken } from '@/lib/auth';

interface ProjectsResponse {
  projects: Project[];
}

async function fetchProjects(token: string, workspaceId?: string): Promise<Project[]> {

  const params = new URLSearchParams();
  if (workspaceId) params.set('workspace_id', workspaceId);

  const res = await fetch(`/api/projects${params.size ? `?${params}` : ''}` , {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    return [];
  }

  const data: ProjectsResponse = await res.json();
  return data.projects || [];
}

export function useProjects(workspaceId?: string) {
  const [token, setToken] = useState<string | null>(null);
  useEffect(() => {
    getAccessToken().then(setToken).catch(() => setToken(null));
  }, []);

  const { data, error, isLoading, mutate } = useSWR<Project[] | undefined>(
    workspaceId && token ? ['projects', workspaceId, token] : null,
    () => fetchProjects(token as string, workspaceId),
    {
      revalidateOnFocus: true,
    }
  );

  return {
    projects: data || [],
    isLoading,
    error,
    refresh: mutate,
  };
}


