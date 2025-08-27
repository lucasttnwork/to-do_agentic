'use client';

import useSWR from 'swr';
import { useEffect, useState } from 'react';
import { Workspace } from '@/types';
import { getAccessToken } from '@/lib/auth';

interface WorkspacesResponse {
  workspaces: Workspace[];
}

async function fetchWorkspaces(token: string): Promise<Workspace[]> {

  const res = await fetch('/api/workspaces', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    return [];
  }

  const data: WorkspacesResponse = await res.json();
  const list = (data.workspaces || []) as Workspace[];
  // Caso inicial sem workspaces, criar um 'Personal' via API
  if (list.length === 0) {
    try {
      const createRes = await fetch('/api/workspaces', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: 'Personal', type: 'personal', settings: {} }),
      });
      if (createRes.ok) {
        const created = await createRes.json();
        return [created.workspace as Workspace];
      }
    } catch (e) {
      // Silenciar erro de criação inicial; retorna lista vazia
    }
  }
  return list;
}

export function useWorkspaces() {
  const [token, setToken] = useState<string | null>(null);
  useEffect(() => {
    getAccessToken().then(setToken).catch(() => setToken(null));
  }, []);

  const { data, error, isLoading, mutate } = useSWR<Workspace[] | undefined>(
    token ? ['workspaces', token] as const : null,
    () => fetchWorkspaces(token as string),
    {
      revalidateOnFocus: true,
    }
  );

  return {
    workspaces: data || [],
    isLoading,
    error,
    refresh: mutate,
  };
}


