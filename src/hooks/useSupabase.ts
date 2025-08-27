import { useCallback } from 'react';
import { supabase } from '../lib/supabase/client';
import { useAuthContext } from '../components/auth/AuthProvider';

export function useSupabase() {
  const { session } = useAuthContext();

  // Função para fazer requisições autenticadas
  const authenticatedRequest = useCallback(async <T>(
    requestFn: () => Promise<{ data: T | null; error: any }>
  ) => {
    if (!session?.access_token) {
      return { data: null, error: { message: 'Usuário não autenticado' } };
    }

    try {
      return await requestFn();
    } catch (error) {
      console.error('Erro na requisição Supabase:', error);
      return { data: null, error };
    }
  }, [session]);

  // Função para buscar workspaces
  const getWorkspaces = useCallback(async () => {
    return authenticatedRequest(async () => {
      return await supabase
        .from('workspaces')
        .select('*')
        .order('created_at', { ascending: false });
    });
  }, [authenticatedRequest]);

  // Função para criar workspace
  const createWorkspace = useCallback(async (workspaceData: {
    name: string;
    type?: string;
    settings?: Record<string, any>;
  }) => {
    return authenticatedRequest(async () => {
      return await supabase
        .from('workspaces')
        .insert(workspaceData)
        .select()
        .single();
    });
  }, [authenticatedRequest]);

  // Função para atualizar workspace
  const updateWorkspace = useCallback(async (id: string, updates: {
    name?: string;
    type?: string;
    settings?: Record<string, any>;
  }) => {
    return authenticatedRequest(async () => {
      return await supabase
        .from('workspaces')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
    });
  }, [authenticatedRequest]);

  // Função para deletar workspace
  const deleteWorkspace = useCallback(async (id: string) => {
    return authenticatedRequest(async () => {
      return await supabase
        .from('workspaces')
        .delete()
        .eq('id', id);
    });
  }, [authenticatedRequest]);

  // Função para buscar projetos
  const getProjects = useCallback(async (workspaceId?: string) => {
    return authenticatedRequest(async () => {
      let query = supabase
        .from('projects')
        .select(`
          *,
          workspaces!inner(user_id)
        `);

      if (workspaceId) {
        query = query.eq('workspace_id', workspaceId);
      }

      return await query.order('created_at', { ascending: false });
    });
  }, [authenticatedRequest]);

  // Função para criar projeto
  const createProject = useCallback(async (projectData: {
    name: string;
    description?: string;
    status?: string;
    client_sla_hours?: number;
    workspace_id: string;
  }) => {
    return authenticatedRequest(async () => {
      return await supabase
        .from('projects')
        .insert(projectData)
        .select()
        .single();
    });
  }, [authenticatedRequest]);

  // Função para atualizar projeto
  const updateProject = useCallback(async (id: string, updates: {
    name?: string;
    description?: string;
    status?: string;
    client_sla_hours?: number;
  }) => {
    return authenticatedRequest(async () => {
      return await supabase
        .from('projects')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
    });
  }, [authenticatedRequest]);

  // Função para deletar projeto
  const deleteProject = useCallback(async (id: string) => {
    return authenticatedRequest(async () => {
      return await supabase
        .from('projects')
        .delete()
        .eq('id', id);
    });
  }, [authenticatedRequest]);

  // Função para buscar tarefas
  const getTasks = useCallback(async (workspaceId: string, filters?: {
    status?: string;
    priority?: number;
    project_id?: string;
  }) => {
    return authenticatedRequest(async () => {
      let query = supabase
        .from('tasks')
        .select(`
          *,
          projects (
            id,
            name,
            client_id
          )
        `)
        .eq('workspace_id', workspaceId);

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      if (filters?.priority) {
        query = query.eq('priority', filters.priority);
      }

      if (filters?.project_id) {
        query = query.eq('project_id', filters.project_id);
      }

      return await query.order('created_at', { ascending: false });
    });
  }, [authenticatedRequest]);

  // Função para criar tarefa
  const createTask = useCallback(async (taskData: {
    workspace_id: string;
    title: string;
    description?: string;
    priority?: number;
    due_date?: string;
    effort_minutes?: number;
    project_id?: string;
    source_type?: string;
  }) => {
    return authenticatedRequest(async () => {
      return await supabase
        .from('tasks')
        .insert({
          ...taskData,
          status: 'todo',
          priority: taskData.priority || 2
        })
        .select(`
          *,
          projects (
            id,
            name,
            client_id
          )
        `)
        .single();
    });
  }, [authenticatedRequest]);

  // Função para atualizar tarefa
  const updateTask = useCallback(async (id: string, updates: {
    title?: string;
    description?: string;
    status?: string;
    priority?: number;
    due_date?: string;
    effort_minutes?: number;
    project_id?: string;
  }) => {
    return authenticatedRequest(async () => {
      return await supabase
        .from('tasks')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select(`
          *,
          projects (
            id,
            name,
            client_id
          )
        `)
        .single();
    });
  }, [authenticatedRequest]);

  // Função para deletar tarefa
  const deleteTask = useCallback(async (id: string) => {
    return authenticatedRequest(async () => {
      return await supabase
        .from('tasks')
        .delete()
        .eq('id', id);
    });
  }, [authenticatedRequest]);

  return {
    // Workspaces
    getWorkspaces,
    createWorkspace,
    updateWorkspace,
    deleteWorkspace,
    
    // Projects
    getProjects,
    createProject,
    updateProject,
    deleteProject,
    
    // Tasks
    getTasks,
    createTask,
    updateTask,
    deleteTask,
    
    // Utilitários
    authenticatedRequest
  };
}
