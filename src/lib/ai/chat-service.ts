import { supabase } from '@/lib/supabase/client';
import { ChatMessage, Task, UserContext } from '@/types';
import { processUserInput } from './langgraph-agents';

export interface ChatSession {
  userId: string;
  workspaceId: string;
  messages: ChatMessage[];
  context: UserContext;
}

export class ChatService {
  private sessions: Map<string, ChatSession> = new Map();

  // Inicializar sessão de chat
  async initializeSession(userId: string, workspaceId: string): Promise<ChatSession> {
    const sessionKey = `${userId}-${workspaceId}`;
    
    // Verificar se já existe uma sessão
    if (this.sessions.has(sessionKey)) {
      return this.sessions.get(sessionKey)!;
    }

    // Carregar histórico do banco de dados
    const { data: messages, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('user_id', userId)
      .eq('workspace_id', workspaceId)
      .order('timestamp', { ascending: true })
      .limit(50);

    if (error) {
      console.error('Erro ao carregar histórico:', error);
    }

    // Carregar contexto do usuário
    const context = await this.loadUserContext(userId, workspaceId);

    const session: ChatSession = {
      userId,
      workspaceId,
      messages: messages || [],
      context,
    };

    this.sessions.set(sessionKey, session);
    return session;
  }

  // Carregar contexto do usuário
  private async loadUserContext(userId: string, workspaceId: string): Promise<UserContext> {
    try {
      // Carregar SLAs de clientes
      const { data: projects } = await supabase
        .from('projects')
        .select('name, client_sla_hours')
        .eq('workspace_id', workspaceId)
        .eq('status', 'active');

      const clientSlas: Record<string, number> = {};
      projects?.forEach(project => {
        clientSlas[project.name] = project.client_sla_hours;
      });

      // Carregar tarefas P1 abertas
      const { count: p1Count } = await supabase
        .from('tasks')
        .select('*', { count: 'exact', head: true })
        .eq('workspace_id', workspaceId)
        .eq('priority', 1)
        .eq('status', 'todo');

      // Contexto básico (pode ser expandido com integração de calendário)
      const context: UserContext = {
        client_slas: clientSlas,
        calendar_today: [], // Será integrado com Google Calendar
        p1_count: p1Count || 0,
      };

      return context;
    } catch (error) {
      console.error('Erro ao carregar contexto:', error);
      return {
        client_slas: {},
        calendar_today: [],
        p1_count: 0,
      };
    }
  }

  // Processar mensagem do usuário
  async processMessage(
    userId: string,
    workspaceId: string,
    content: string
  ): Promise<{ message: ChatMessage; task?: Task; error?: string }> {
    try {
      const session = await this.initializeSession(userId, workspaceId);
      
      // Adicionar mensagem do usuário
      const userMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'user',
        content,
        timestamp: new Date().toISOString(),
      };

      session.messages.push(userMessage);

      // Salvar mensagem do usuário no banco
      await this.saveMessage(userId, workspaceId, userMessage);

      // Processar com agentes de IA
      const existingTasks = await this.loadExistingTasks(workspaceId);
      const agentResponse = await processUserInput(content, existingTasks, workspaceId, session.context);

      let assistantMessage: ChatMessage;
      let task: Task | undefined;

      if (agentResponse.finalTask) {
        // Tarefa criada com sucesso
        task = agentResponse.finalTask;
        task.workspace_id = workspaceId;

        // Salvar tarefa no banco
        const savedTask = await this.saveTask(task);
        if (savedTask) {
          task = savedTask;
        }

        assistantMessage = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: this.generateSuccessResponse(task, 'Tarefa processada com sucesso'),
          timestamp: new Date().toISOString(),
          task_id: task.id,
          action: 'task_created',
        };
      } else {
        // Erro no processamento
        const errorMessage = agentResponse.errors.length > 0 
          ? agentResponse.errors.join('; ') 
          : 'Erro desconhecido';
        assistantMessage = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: this.generateErrorResponse(errorMessage),
          timestamp: new Date().toISOString(),
        };
      }

      session.messages.push(assistantMessage);
      await this.saveMessage(userId, workspaceId, assistantMessage);

      // Atualizar contexto
      session.context = await this.loadUserContext(userId, workspaceId);

      return {
        message: assistantMessage,
        task,
        error: agentResponse.finalTask ? undefined : agentResponse.errors.join('; '),
      };
    } catch (error) {
      console.error('Erro ao processar mensagem:', error);
      return {
        message: {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: 'Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente.',
          timestamp: new Date().toISOString(),
        },
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      };
    }
  }

  // Carregar tarefas existentes
  private async loadExistingTasks(workspaceId: string): Promise<Task[]> {
    try {
      const { data: tasks, error } = await supabase
        .from('tasks')
        .select(`
          *,
          subtasks (*)
        `)
        .eq('workspace_id', workspaceId)
        .in('status', ['todo', 'in_progress'])
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) {
        console.error('Erro ao carregar tarefas:', error);
        return [];
      }

      return tasks || [];
    } catch (error) {
      console.error('Erro ao carregar tarefas:', error);
      return [];
    }
  }

  // Salvar mensagem no banco
  private async saveMessage(userId: string, workspaceId: string, message: ChatMessage): Promise<void> {
    try {
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          id: message.id,
          user_id: userId,
          workspace_id: workspaceId,
          role: message.role,
          content: message.content,
          timestamp: message.timestamp,
          task_id: message.task_id,
          action: message.action,
          metadata: message.metadata || {},
        });

      if (error) {
        console.error('Erro ao salvar mensagem:', error);
      }
    } catch (error) {
      console.error('Erro ao salvar mensagem:', error);
    }
  }

  // Salvar tarefa no banco
  private async saveTask(task: Task): Promise<Task | null> {
    try {
      // Salvar tarefa principal
      const { data: savedTask, error: taskError } = await supabase
        .from('tasks')
        .insert({
          id: task.id,
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

      if (taskError) {
        console.error('Erro ao salvar tarefa:', taskError);
        return null;
      }

      // Salvar subtarefas
      if (task.subtasks && task.subtasks.length > 0) {
        const subtasksToInsert = task.subtasks.map(subtask => ({
          ...subtask,
          task_id: savedTask.id,
        }));

        const { error: subtaskError } = await supabase
          .from('subtasks')
          .insert(subtasksToInsert);

        if (subtaskError) {
          console.error('Erro ao salvar subtarefas:', subtaskError);
        }
      }

      // Salvar entidades relacionadas
      if (task.entities && task.entities.length > 0) {
        for (const entity of task.entities) {
          // Verificar se a entidade já existe
          const { data: existingEntity } = await supabase
            .from('entities')
            .select('id')
            .eq('workspace_id', task.workspace_id)
            .eq('name', entity.name)
            .eq('type', entity.type)
            .single();

          let entityId = existingEntity?.id;

          if (!entityId) {
            // Criar nova entidade
            const { data: newEntity } = await supabase
              .from('entities')
              .insert({
                workspace_id: task.workspace_id,
                type: entity.type,
                name: entity.name,
                metadata: {},
              })
              .select('id')
              .single();

            entityId = newEntity?.id;
          }

          if (entityId) {
            // Vincular entidade à tarefa
            await supabase
              .from('task_entities')
              .insert({
                task_id: savedTask.id,
                entity_id: entityId,
              });
          }
        }
      }

      return savedTask;
    } catch (error) {
      console.error('Erro ao salvar tarefa:', error);
      return null;
    }
  }

  // Gerar resposta de sucesso
  private generateSuccessResponse(task: Task, reasoning?: string): string {
    const priorityText = {
      1: 'alta prioridade',
      2: 'prioridade média',
      3: 'baixa prioridade',
    }[task.priority];

    const dueDateText = task.due_date 
      ? ` com prazo para ${new Date(task.due_date).toLocaleDateString('pt-BR')}`
      : '';

    const subtasksText = task.subtasks && task.subtasks.length > 0
      ? `\n\n📋 **Subtarefas criadas:**\n${task.subtasks.map(st => `• ${st.title}`).join('\n')}`
      : '';

    return `✅ **Tarefa criada com sucesso!**

📝 **${task.title}**
${task.description ? `\n${task.description}` : ''}

🎯 **${priorityText}**${dueDateText}
⏱️ **Estimativa:** ${task.effort_minutes || 'Não definida'} minutos
${subtasksText}

${reasoning ? `\n💭 *${reasoning}*` : ''}`;
  }

  // Gerar resposta de erro
  private generateErrorResponse(error: string): string {
    return `❌ **Erro ao processar sua solicitação**

${error}

Por favor, tente reformular sua mensagem ou entre em contato com o suporte se o problema persistir.`;
  }

  // Obter histórico de chat
  async getChatHistory(userId: string, workspaceId: string, limit: number = 50): Promise<ChatMessage[]> {
    try {
      const { data: messages, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('user_id', userId)
        .eq('workspace_id', workspaceId)
        .order('timestamp', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Erro ao carregar histórico:', error);
        return [];
      }

      return (messages || []).reverse();
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
      return [];
    }
  }

  // Limpar sessão
  clearSession(userId: string, workspaceId: string): void {
    const sessionKey = `${userId}-${workspaceId}`;
    this.sessions.delete(sessionKey);
  }
}

// Instância singleton
export const chatService = new ChatService();
