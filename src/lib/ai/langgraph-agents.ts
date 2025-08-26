import { Task, ParsedInput, LinkDecision, TaskPlan, PriorityDecision, AgentResponse } from '@/types';
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
  userContext?: any;
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
        reasoning: 'Fallback sem OPENAI_API_KEY',
        confidence: 0.6,
      };
      return { success: true, data: fallback, confidence: 0.6, reasoning: fallback.reasoning };
    }

    const completion = await client.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'Você é um assistente especializado em decisões de vinculação de tarefas. Responda apenas com JSON válido.' },
        {role: 'user', content: prompt }
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
      reasoning: parsed.reasoning
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

// 3. PLANNER AGENT - Cria plano de subtarefas
async function plannerAgent(
  parsedInput: ParsedInput,
  linkDecision: LinkDecision
): Promise<AgentResponse<TaskPlan>> {
  try {
    const client = getOpenAI();
    const prompt = `
    Crie um plano detalhado para esta tarefa:

    ENTRADA: ${JSON.stringify(parsedInput)}
    DECISÃO: ${JSON.stringify(linkDecision)}

    Retorne:
    {
      "title": "título da tarefa",
      "description": "descrição detalhada",
      "subtasks": [
        {
          "title": "subtarefa 1",
          "description": "descrição da subtarefa",
          "order_index": 1
        }
      ],
      "definition_of_done": "critérios de conclusão",
      "estimated_minutes": 120,
      "confidence": 0.0-1.0
    }
    `;

    if (!client) {
      const fallback: TaskPlan = {
        title: parsedInput.action,
        description: 'Tarefa criada via fallback',
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

// 4. PRIORITIZER AGENT - Define prioridade e prazo
async function prioritizerAgent(
  taskPlan: TaskPlan,
  userContext?: any
): Promise<AgentResponse<PriorityDecision>> {
  try {
    const client = getOpenAI();
    const prompt = `
    Defina a prioridade e prazo para esta tarefa:

    PLANO: ${JSON.stringify(taskPlan)}
    CONTEXTO DO USUÁRIO: ${JSON.stringify(userContext || {})}

    Considere:
    - SLA do cliente (se aplicável)
    - Urgência da tarefa
    - Capacidade atual do usuário
    - Dependências

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
        priority: 2,
        reasoning: 'Prioridade média por padrão',
        confidence: 0.6,
      };
      return { success: true, data: fallback, confidence: 0.6, reasoning: fallback.reasoning };
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
      reasoning: parsed.reasoning
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

// 5. FINALIZER AGENT - Consolida tudo em uma tarefa final
async function finalizerAgent(
  state: AgentState
): Promise<AgentState> {
  try {
    if (!state.taskPlan || !state.priorityDecision) {
      throw new Error('Dados insuficientes para finalização');
    }

    const finalTask: Task = {
      id: crypto.randomUUID(),
      workspace_id: '', // Será definido pelo contexto
      project_id: undefined,
      title: state.taskPlan.title,
      description: state.taskPlan.description,
      status: 'todo',
      priority: state.priorityDecision.priority,
      effort_minutes: state.taskPlan.estimated_minutes,
      due_date: state.priorityDecision.suggested_due_date,
      source_type: 'ai_chat',
      source_content: state.input,
      ai_confidence: state.confidence,
      subtasks: state.taskPlan.subtasks.map((subtask, index) => ({
        id: crypto.randomUUID(),
        task_id: '', // Será definido após criação da tarefa
        title: subtask.title,
        description: subtask.description,
        status: 'todo',
        order_index: subtask.order_index,
      })),
      entities: state.parsedInput?.entities?.map(entity => ({
        id: '',
        workspace_id: '',
        type: entity.type as 'client' | 'person' | 'tag',
        name: entity.value,
        metadata: {},
      })) || [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    return {
      ...state,
      finalTask,
    };
  } catch (error) {
    return {
      ...state,
      errors: [...state.errors, `Erro no agente de finalização: ${error}`],
      confidence: Math.max(0, state.confidence - 0.2),
    };
  }
}

// Função principal para processar entrada do usuário (versão simplificada)
export async function processUserInput(
  input: string,
  existingTasks: Task[] = [],
  workspaceId: string = '',
  userContext?: any
): Promise<AgentState> {
  let state: AgentState = {
    input,
    existingTasks,
    userContext,
    errors: [],
    confidence: 1.0,
  };

  try {
    // 1. Intake Agent
    const intakeResult = await intakeAgent(input);
    if (!intakeResult.success) {
      state.errors.push(intakeResult.error || 'Erro no agente de entrada');
      state.confidence = Math.max(0, state.confidence - 0.2);
      return state;
    }
    state.parsedInput = intakeResult.data;
    state.confidence = Math.min(1.0, state.confidence * intakeResult.confidence);

    // 2. Linker Agent
    const linkerResult = await linkerAgent(intakeResult.data, existingTasks);
    if (!linkerResult.success) {
      state.errors.push(linkerResult.error || 'Erro no agente de vinculação');
      state.confidence = Math.max(0, state.confidence - 0.2);
      return state;
    }
    state.linkDecision = linkerResult.data;
    state.confidence = Math.min(1.0, state.confidence * linkerResult.confidence);

    // 3. Planner Agent
    const plannerResult = await plannerAgent(intakeResult.data, linkerResult.data);
    if (!plannerResult.success) {
      state.errors.push(plannerResult.error || 'Erro no agente de planejamento');
      state.confidence = Math.max(0, state.confidence - 0.2);
      return state;
    }
    state.taskPlan = plannerResult.data;
    state.confidence = Math.min(1.0, state.confidence * plannerResult.confidence);

    // 4. Prioritizer Agent
    const prioritizerResult = await prioritizerAgent(plannerResult.data, userContext);
    if (!prioritizerResult.success) {
      state.errors.push(prioritizerResult.error || 'Erro no agente de priorização');
      state.confidence = Math.max(0, state.confidence - 0.2);
      return state;
    }
    state.priorityDecision = prioritizerResult.data;
    state.confidence = Math.min(1.0, state.confidence * prioritizerResult.confidence);

    // 5. Finalizer Agent
    state = await finalizerAgent(state);
    
    // Definir workspace_id na tarefa final
    if (state.finalTask) {
      state.finalTask.workspace_id = workspaceId;
      if (state.finalTask.subtasks) {
        state.finalTask.subtasks = state.finalTask.subtasks.map(subtask => ({
          ...subtask,
          task_id: state.finalTask!.id,
        }));
      }
    }

    return state;
  } catch (error) {
    return {
      ...state,
      errors: [...state.errors, `Erro geral: ${error}`],
      confidence: 0,
    };
  }
}
