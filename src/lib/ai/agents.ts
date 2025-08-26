import OpenAI from 'openai';
import { AgentResponse, ParsedInput, LinkDecision, TaskPlan, PriorityDecision, Task, UserContext } from '@/types';

function getOpenAI(): OpenAI | null {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;
  return new OpenAI({ apiKey });
}

// 1. INTAKE AGENT - Parser de entrada
export async function intakeAgent(input: string): Promise<AgentResponse<ParsedInput>> {
  try {
    const client = getOpenAI();
    const prompt = `
    Você é o agente de captura de um sistema de tarefas. Analise a entrada do usuário e extraia:

    ENTRADA: "${input}"

    Extraia:
    1. INTENÇÃO (task_new, task_update, task_complete, task_question)
    2. ENTIDADES (clientes, pessoas, datas, horários)
    3. AÇÃO principal (verbo + objeto)
    4. PRAZO (explícito ou implícito)
    5. PRIORIDADE (urgente, normal, baixa)
    6. CONTEXTO (cliente, projeto, tipo de trabalho)

    Retorne JSON estruturado:
    {
      "intention": "task_new|task_update|task_complete|task_question",
      "action": "string",
      "entities": [{"type": "client|person|date", "value": "string"}],
      "due_date": "ISO date ou null",
      "priority": 1|2|3,
      "context": "string",
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
export async function linkerAgent(
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

// 3. PLANNER AGENT - Decomposição em subtarefas
export async function plannerAgent(
  taskData: Partial<Task>
): Promise<AgentResponse<TaskPlan>> {
  try {
    const client = getOpenAI();
    const prompt = `
    Crie um plano detalhado para esta tarefa:

    TAREFA: ${taskData.title}
    DESCRIÇÃO: ${taskData.description}
    CONTEXTO: ${taskData.project_id ? 'Cliente' : 'Pessoal'}

    Gere:
    1. Título claro (verbo + resultado)
    2. Descrição estruturada
    3. 3-7 subtarefas em ordem lógica
    4. Definition of Done
    5. Estimativa de esforço (minutos)

    Retorne JSON:
    {
      "title": "string",
      "description": "string",
      "subtasks": [
        {"title": "string", "description": "string", "order_index": 1}
      ],
      "definition_of_done": "string",
      "estimated_minutes": number,
      "confidence": 0.0-1.0
    }
    `;

    if (!client) {
      const fallback: TaskPlan = {
        title: taskData.title || 'Nova tarefa',
        description: taskData.description || 'Descrição gerada automaticamente.',
        subtasks: [
          { title: 'Definir objetivo', description: 'Especificar resultado esperado', order_index: 1 },
          { title: 'Planejar execução', description: 'Listar passos principais', order_index: 2 },
          { title: 'Revisar entrega', description: 'Conferir critérios de aceite', order_index: 3 },
        ],
        definition_of_done: 'Critérios atendidos e tarefa validada.',
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
      temperature: 0.2,
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) throw new Error('Resposta vazia da IA');
    const parsed = JSON.parse(response);
    
    return {
      success: true,
      data: parsed,
      confidence: parsed.confidence || 0.8,
      reasoning: 'Planejamento de tarefa concluído'
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

// 4. PRIORITIZER AGENT - Priorização inteligente
export async function prioritizerAgent(
  task: Task,
  userContext: UserContext
): Promise<AgentResponse<PriorityDecision>> {
  try {
    const client = getOpenAI();
    const prompt = `
    Defina prioridade para esta tarefa:

    TAREFA: ${JSON.stringify(task)}
    CONTEXTO DO USUÁRIO:
    - SLA de clientes: ${JSON.stringify(userContext.client_slas)}
    - Agenda hoje: ${userContext.calendar_today}
    - Tarefas P1 abertas: ${userContext.p1_count}

    Considere:
    - Urgência (prazo próximo)
    - Impacto (cliente VIP, receita)
    - Esforço vs tempo disponível
    - SLA contratual

    Retorne:
    {
      "priority": 1|2|3,
      "suggested_due_date": "ISO date ou null",
      "reasoning": "explicação",
      "confidence": 0.0-1.0
    }
    `;

    if (!client) {
      const fallback: PriorityDecision = {
        priority: 2,
        suggested_due_date: task.due_date,
        reasoning: 'Fallback sem OPENAI_API_KEY',
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
