import { Task, ParsedInput, LinkDecision, TaskPlan, PriorityDecision, AgentResponse, UserContext } from '@/types';
import { getOpenAI } from './openai-client';

// Estado compartilhado entre agentes
export interface AgentState {
  input: string;
  parsedInput?: ParsedInput;
  existingTasks: Task[];
  linkDecision?: LinkDecision;
  taskPlan?: TaskPlan;
  priorityDecision?: PriorityDecision;
  finalTask?: Task;
  userContext?: UserContext;
  errors: string[];
  confidence: number;
}

// 1. INTAKE AGENT - Analisa entrada do usuário
async function intakeAgent(input: string): Promise<AgentResponse<ParsedInput>> {
  try {
    const client = getOpenAI();
    const prompt = `
    Analise esta entrada do usuário e extraia informações estruturadas:

    ENTRADA: "${input}"

    Retorne um JSON com:
    {
      "intention": "task_new|task_update|task_complete|task_question",
      "action": "descrição da ação principal",
      "entities": [
        {"type": "client|person|date|project", "value": "nome/valor"}
      ],
      "due_date": "YYYY-MM-DD ou null",
      "priority": 1|2|3,
      "context": "contexto adicional",
      "confidence": 0.0-1.0
    }
    `;

    if (!client) {
      const fallback: ParsedInput = {
        intention: 'task_new',
        action: input.slice(0, 120),
        entities: [],
        priority: 2,
        context: undefined,
        confidence: 0.6,
      };
      return { success: true, data: fallback, confidence: 0.6, reasoning: 'Fallback sem OPENAI_API_KEY' };
    }

    const completion = await client.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'Você é um assistente especializado em análise de tarefas. Responda apenas com JSON válido.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.1,
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) throw new Error('Resposta vazia da IA');
    const parsed = JSON.parse(response);
    
    return {
      success: true,
      data: parsed,
      confidence: parsed.confidence || 0.8,
      reasoning: 'Análise de entrada concluída com sucesso'
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
      confidence: 0,
      reasoning: 'Falha na análise de entrada'
    };
  }
}

// 2. LINKER AGENT - Vincula a tarefas existentes
async function linkerAgent(
  parsedInput: ParsedInput, 
  existingTasks: Task[]
): Promise<AgentResponse<LinkDecision>> {
  try {
    const client = getOpenAI();
    const prompt = `
    Decida se esta nova entrada deve ser:
    - CRIAR nova tarefa
    - ANEXAR a tarefa existente como subtarefa/comentário  
    - EDITAR tarefa existente

    ENTRADA: ${JSON.stringify(parsedInput)}
    TAREFAS EXISTENTES: ${JSON.stringify(existingTasks.slice(0, 10))}

    Considere:
    - Similaridade de contexto (mesmo cliente/projeto)
    - Proximidade temporal (mesmo dia/semana)
    - Complementaridade (subtarefa vs tarefa independente)

    Retorne:
    {
      "decision": "create_new|attach_to|edit_existing",
      "target_task_id": "uuid ou null",
      "reasoning": "explicação da decisão",
      "confidence": 0.0-1.0
    }
    `;

    if (!client) {
      const fallback: LinkDecision = {
        decision: 'create_new',
        target_task_id: undefined,
        reasoning: 'Fallback sem OPENAI_API_KEY',
        confidence: 0.6,
      };
      return { success: true, data: fallback, confidence: 0.6, reasoning: 'Fallback sem OPENAI_API_KEY' };
    }

    const completion = await client.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'Você é um assistente especializado em análise de tarefas. Responda apenas com JSON válido.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.1,
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) throw new Error('Resposta vazia da IA');
    const parsed = JSON.parse(response);
    
    return {
      success: true,
      data: parsed,
      confidence: parsed.confidence || 0.8,
      reasoning: 'Decisão de vinculação concluída com sucesso'
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
      confidence: 0,
      reasoning: 'Falha na decisão de vinculação'
    };
  }
}

// 3. PLANNER AGENT - Planeja tarefas complexas
async function plannerAgent(
  parsedInput: ParsedInput,
  linkDecision: LinkDecision
): Promise<AgentResponse<TaskPlan>> {
  try {
    if (linkDecision.decision !== 'create_new') {
      return {
        success: true,
        data: {
          title: parsedInput.action,
          description: parsedInput.context || 'Sem descrição',
          subtasks: [],
          definition_of_done: 'Tarefa concluída',
          estimated_minutes: 30,
          confidence: 0.8,
        },
        confidence: 0.8,
        reasoning: 'Tarefa simples, sem necessidade de planejamento'
      };
    }

    const client = getOpenAI();
    const prompt = `
    Planeje esta tarefa complexa:

    ENTRADA: ${JSON.stringify(parsedInput)}

    Retorne um plano estruturado:
    {
      "title": "título da tarefa",
      "description": "descrição detalhada",
      "subtasks": [
        {"title": "subtarefa", "description": "descrição", "order_index": 1}
      ],
      "definition_of_done": "critérios de conclusão",
      "estimated_minutes": 120,
      "confidence": 0.0-1.0
    }
    `;

    if (!client) {
      const fallback: TaskPlan = {
        title: parsedInput.action,
        description: parsedInput.context || 'Sem descrição',
        subtasks: [],
        definition_of_done: 'Tarefa concluída',
        estimated_minutes: 60,
        confidence: 0.6,
      };
      return { success: true, data: fallback, confidence: 0.6, reasoning: 'Fallback sem OPENAI_API_KEY' };
    }

    const completion = await client.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'Você é um assistente especializado em planejamento de tarefas. Responda apenas com JSON válido.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.1,
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) throw new Error('Resposta vazia da IA');
    const parsed = JSON.parse(response);
    
    return {
      success: true,
      data: parsed,
      confidence: parsed.confidence || 0.8,
      reasoning: 'Planejamento concluído com sucesso'
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
      confidence: 0,
      reasoning: 'Falha no planejamento'
    };
  }
}

// 4. PRIORITY AGENT - Define prioridade e prazo
async function priorityAgent(
  parsedInput: ParsedInput,
  taskPlan: TaskPlan,
  userContext: UserContext
): Promise<AgentResponse<PriorityDecision>> {
  try {
    const client = getOpenAI();
    const prompt = `
    Defina prioridade e prazo para esta tarefa:

    ENTRADA: ${JSON.stringify(parsedInput)}
    PLANO: ${JSON.stringify(taskPlan)}
    CONTEXTO: ${JSON.stringify(userContext)}

    Considere:
    - SLAs de clientes
    - Tarefas P1 existentes
    - Complexidade da tarefa
    - Urgência natural

    Retorne:
    {
      "priority": 1|2|3,
      "suggested_due_date": "YYYY-MM-DD ou null",
      "reasoning": "explicação da decisão",
      "confidence": 0.0-1.0
    }
    `;

    if (!client) {
      const fallback: PriorityDecision = {
        priority: parsedInput.priority,
        suggested_due_date: undefined,
        reasoning: 'Fallback sem OPENAI_API_KEY',
        confidence: 0.6,
      };
      return { success: true, data: fallback, confidence: 0.6, reasoning: 'Fallback sem OPENAI_API_KEY' };
    }

    const completion = await client.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'Você é um assistente especializado em priorização de tarefas. Responda apenas com JSON válido.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.1,
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) throw new Error('Resposta vazia da IA');
    const parsed = JSON.parse(response);
    
    return {
      success: true,
      data: parsed,
      confidence: parsed.confidence || 0.8,
      reasoning: 'Priorização concluída com sucesso'
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
      confidence: 0,
      reasoning: 'Falha na priorização'
    };
  }
}

// 5. EXECUTOR AGENT - Cria a tarefa final
async function executorAgent(
  parsedInput: ParsedInput,
  linkDecision: LinkDecision,
  taskPlan: TaskPlan,
  priorityDecision: PriorityDecision,
  existingTasks: Task[]
): Promise<AgentResponse<Task>> {
  try {
    if (linkDecision.decision === 'attach_to' && linkDecision.target_task_id) {
      // Anexar como subtarefa
      const targetTask = existingTasks.find(t => t.id === linkDecision.target_task_id);
      if (targetTask) {
        const subtask: Task = {
          id: crypto.randomUUID(),
          workspace_id: targetTask.workspace_id,
          project_id: targetTask.project_id,
          title: taskPlan.title,
          description: taskPlan.description,
          status: 'todo',
          priority: priorityDecision.priority,
          effort_minutes: taskPlan.estimated_minutes,
          source_type: 'ai_chat',
          source_content: parsedInput.action,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        
        return {
          success: true,
          data: subtask,
          confidence: 0.9,
          reasoning: 'Subtarefa criada com sucesso'
        };
      }
    }

    // Criar nova tarefa
    const task: Task = {
      id: crypto.randomUUID(),
      workspace_id: '', // Será definido pelo caller
      title: taskPlan.title,
      description: taskPlan.description,
      status: 'todo',
      priority: priorityDecision.priority,
      effort_minutes: taskPlan.estimated_minutes,
      due_date: priorityDecision.suggested_due_date,
      source_type: 'ai_chat',
      source_content: parsedInput.action,
      subtasks: taskPlan.subtasks.map((st, index) => ({
        id: crypto.randomUUID(),
        task_id: '', // Será definido após criação da tarefa
        title: st.title,
        description: st.description,
        status: 'todo',
        order_index: index + 1,
      })),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    return {
      success: true,
      data: task,
      confidence: 0.9,
      reasoning: 'Tarefa criada com sucesso'
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
      confidence: 0,
      reasoning: 'Falha na criação da tarefa'
    };
  }
}

// Função principal que orquestra os agentes
export async function processUserInput(
  input: string,
  existingTasks: Task[],
  workspaceId: string,
  userContext: UserContext
): Promise<AgentState> {
  const state: AgentState = {
    input,
    existingTasks,
    errors: [],
    confidence: 0,
  };

  try {
    // 1. Análise de entrada
    const intakeResult = await intakeAgent(input);
    if (!intakeResult.success || !intakeResult.data) {
      state.errors.push(intakeResult.error || 'Falha na análise de entrada');
      return state;
    }
    state.parsedInput = intakeResult.data;
    state.confidence = Math.min(state.confidence, intakeResult.confidence);

    // 2. Decisão de vinculação
    const linkResult = await linkerAgent(intakeResult.data, existingTasks);
    if (!linkResult.success || !linkResult.data) {
      state.errors.push(linkResult.error || 'Falha na decisão de vinculação');
      return state;
    }
    state.linkDecision = linkResult.data;
    state.confidence = Math.min(state.confidence, linkResult.confidence);

    // 3. Planejamento (se necessário)
    const planResult = await plannerAgent(intakeResult.data, linkResult.data);
    if (!planResult.success || !planResult.data) {
      state.errors.push(planResult.error || 'Falha no planejamento');
      return state;
    }
    state.taskPlan = planResult.data;
    state.confidence = Math.min(state.confidence, planResult.confidence);

    // 4. Priorização
    const priorityResult = await priorityAgent(intakeResult.data, planResult.data, userContext);
    if (!priorityResult.success || !priorityResult.data) {
      state.errors.push(priorityResult.error || 'Falha na priorização');
      return state;
    }
    state.priorityDecision = priorityResult.data;
    state.confidence = Math.min(state.confidence, priorityResult.confidence);

    // 5. Execução
    const executorResult = await executorAgent(
      intakeResult.data,
      linkResult.data,
      planResult.data,
      priorityResult.data,
      existingTasks
    );
    if (!executorResult.success || !executorResult.data) {
      state.errors.push(executorResult.error || 'Falha na execução');
      return state;
    }
    state.finalTask = executorResult.data;
    state.confidence = Math.min(state.confidence, executorResult.confidence);

    return state;
  } catch (error) {
    state.errors.push(error instanceof Error ? error.message : 'Erro desconhecido');
    return state;
  }
}
