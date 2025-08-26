import { supabase } from '@/lib/supabase/client';
import { Task, Subtask } from '@/types';

export class TaskService {
  // Obter todas as tarefas de um workspace
  async getTasks(workspaceId: string): Promise<Task[]> {
    try {
      const { data: tasks, error } = await supabase
        .from('tasks')
        .select(`
          *,
          subtasks (*),
          task_entities (
            entity_id,
            entities (*)
          )
        `)
        .eq('workspace_id', workspaceId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar tarefas:', error);
        return [];
      }

      // Processar entidades relacionadas
      return (tasks || []).map(task => ({
        ...task,
        entities: task.task_entities?.map(te => te.entities).filter(Boolean) || [],
      }));
    } catch (error) {
      console.error('Erro ao buscar tarefas:', error);
      return [];
    }
  }

  // Obter tarefas por status
  async getTasksByStatus(workspaceId: string, status: string): Promise<Task[]> {
    try {
      const { data: tasks, error } = await supabase
        .from('tasks')
        .select(`
          *,
          subtasks (*),
          task_entities (
            entity_id,
            entities (*)
          )
        `)
        .eq('workspace_id', workspaceId)
        .eq('status', status)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar tarefas por status:', error);
        return [];
      }

      return (tasks || []).map(task => ({
        ...task,
        entities: task.task_entities?.map(te => te.entities).filter(Boolean) || [],
      }));
    } catch (error) {
      console.error('Erro ao buscar tarefas por status:', error);
      return [];
    }
  }

  // Obter tarefas por prioridade
  async getTasksByPriority(workspaceId: string, priority: number): Promise<Task[]> {
    try {
      const { data: tasks, error } = await supabase
        .from('tasks')
        .select(`
          *,
          subtasks (*),
          task_entities (
            entity_id,
            entities (*)
          )
        `)
        .eq('workspace_id', workspaceId)
        .eq('priority', priority)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar tarefas por prioridade:', error);
        return [];
      }

      return (tasks || []).map(task => ({
        ...task,
        entities: task.task_entities?.map(te => te.entities).filter(Boolean) || [],
      }));
    } catch (error) {
      console.error('Erro ao buscar tarefas por prioridade:', error);
      return [];
    }
  }

  // Criar nova tarefa
  async createTask(task: Omit<Task, 'id' | 'created_at' | 'updated_at'>): Promise<Task | null> {
    try {
      const { data: newTask, error } = await supabase
        .from('tasks')
        .insert({
          workspace_id: task.workspace_id,
          project_id: task.project_id,
          title: task.title,
          description: task.description,
          status: task.status,
          priority: task.priority,
          effort_minutes: task.effort_minutes,
          due_date: task.due_date,
          source_type: task.source_type,
          source_content: task.source_content,
          ai_confidence: task.ai_confidence,
        })
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar tarefa:', error);
        return null;
      }

      // Criar subtarefas se existirem
      if (task.subtasks && task.subtasks.length > 0) {
        await this.createSubtasks(newTask.id, task.subtasks);
      }

      return newTask;
    } catch (error) {
      console.error('Erro ao criar tarefa:', error);
      return null;
    }
  }

  // Atualizar tarefa
  async updateTask(taskId: string, updates: Partial<Task>): Promise<Task | null> {
    try {
      const { data: updatedTask, error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', taskId)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar tarefa:', error);
        return null;
      }

      return updatedTask;
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
      return null;
    }
  }

  // Deletar tarefa
  async deleteTask(taskId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);

      if (error) {
        console.error('Erro ao deletar tarefa:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Erro ao deletar tarefa:', error);
      return false;
    }
  }

  // Criar subtarefas
  async createSubtasks(taskId: string, subtasks: Omit<Subtask, 'id' | 'created_at' | 'updated_at'>[]): Promise<Subtask[]> {
    try {
      const subtasksToInsert = subtasks.map(subtask => ({
        task_id: taskId,
        title: subtask.title,
        description: subtask.description,
        status: subtask.status,
        order_index: subtask.order_index,
      }));

      const { data: newSubtasks, error } = await supabase
        .from('subtasks')
        .insert(subtasksToInsert)
        .select();

      if (error) {
        console.error('Erro ao criar subtarefas:', error);
        return [];
      }

      return newSubtasks || [];
    } catch (error) {
      console.error('Erro ao criar subtarefas:', error);
      return [];
    }
  }

  // Atualizar subtarefa
  async updateSubtask(subtaskId: string, updates: Partial<Subtask>): Promise<Subtask | null> {
    try {
      const { data: updatedSubtask, error } = await supabase
        .from('subtasks')
        .update(updates)
        .eq('id', subtaskId)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar subtarefa:', error);
        return null;
      }

      return updatedSubtask;
    } catch (error) {
      console.error('Erro ao atualizar subtarefa:', error);
      return null;
    }
  }

  // Obter estatísticas do workspace
  async getWorkspaceStats(workspaceId: string): Promise<{
    total: number;
    todo: number;
    inProgress: number;
    review: number;
    done: number;
    highPriority: number;
  }> {
    try {
      const { data: tasks, error } = await supabase
        .from('tasks')
        .select('status, priority')
        .eq('workspace_id', workspaceId);

      if (error) {
        console.error('Erro ao buscar estatísticas:', error);
        return {
          total: 0,
          todo: 0,
          inProgress: 0,
          review: 0,
          done: 0,
          highPriority: 0,
        };
      }

      const stats = {
        total: tasks?.length || 0,
        todo: tasks?.filter(t => t.status === 'todo').length || 0,
        inProgress: tasks?.filter(t => t.status === 'in_progress').length || 0,
        review: tasks?.filter(t => t.status === 'review').length || 0,
        done: tasks?.filter(t => t.status === 'done').length || 0,
        highPriority: tasks?.filter(t => t.priority === 1).length || 0,
      };

      return stats;
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      return {
        total: 0,
        todo: 0,
        inProgress: 0,
        review: 0,
        done: 0,
        highPriority: 0,
      };
    }
  }

  // Buscar tarefas por texto
  async searchTasks(workspaceId: string, query: string): Promise<Task[]> {
    try {
      const { data: tasks, error } = await supabase
        .from('tasks')
        .select(`
          *,
          subtasks (*),
          task_entities (
            entity_id,
            entities (*)
          )
        `)
        .eq('workspace_id', workspaceId)
        .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar tarefas:', error);
        return [];
      }

      return (tasks || []).map(task => ({
        ...task,
        entities: task.task_entities?.map(te => te.entities).filter(Boolean) || [],
      }));
    } catch (error) {
      console.error('Erro ao buscar tarefas:', error);
      return [];
    }
  }

  // Mover tarefa entre status (drag & drop)
  async moveTask(taskId: string, newStatus: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ status: newStatus })
        .eq('id', taskId);

      if (error) {
        console.error('Erro ao mover tarefa:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Erro ao mover tarefa:', error);
      return false;
    }
  }

  // Marcar subtarefa como concluída
  async completeSubtask(subtaskId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('subtasks')
        .update({ status: 'done' })
        .eq('id', subtaskId);

      if (error) {
        console.error('Erro ao completar subtarefa:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Erro ao completar subtarefa:', error);
      return false;
    }
  }

  // Verificar se todas as subtarefas estão concluídas
  async checkTaskCompletion(taskId: string): Promise<boolean> {
    try {
      const { data: subtasks, error } = await supabase
        .from('subtasks')
        .select('status')
        .eq('task_id', taskId);

      if (error) {
        console.error('Erro ao verificar subtarefas:', error);
        return false;
      }

      return subtasks?.every(subtask => subtask.status === 'done') || false;
    } catch (error) {
      console.error('Erro ao verificar subtarefas:', error);
      return false;
    }
  }
}

// Instância singleton
export const taskService = new TaskService();
