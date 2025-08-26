import { StateGraph, END } from '@langchain/langgraph';
import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage, AIMessage } from '@langchain/core/messages';
import { AgentResponse, ParsedInput, LinkDecision, TaskPlan, PriorityDecision, Task, UserContext } from '@/types';

// Estado do grafo de agentes
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

// Configuração do modelo
const model = new ChatOpenAI({
  modelName: 'gpt-4o-mini',
  temperature: 0.1,
  openAIApiKey: process.env.OPENAI_API_KEY,
});

// 1. AGENTE DE CAPTURA (INTAKE)
async function intakeAgent(state: AgentState): Promise<AgentState> {
  try {
    const prompt = `
    Você é o agente de captura de um sistema de tarefas. Analise a entrada do usuário e extraia informações estruturadas.

    ENTRADA: "${state.input}"

    Extraia:
    1. INTENÇÃO (task_new, task_update, task_complete, task_question)
    2. ENTIDADES (clientes, pessoas, datas, horários)
    3. AÇÃO principal (verbo + objeto)
    4. PRAZO (explícito ou implícito)
    5. PRIORIDADE (urgente, normal, baixa)
    6. CONTEXTO (cliente, projeto, tipo de trabalho)

    Responda apenas com JSON válido:
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

    const response = await model.invoke([new HumanMessage(prompt)]);
    const content = response.content as string;
    
    // Extrair JSON da resposta
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Resposta não contém JSON válido');
    }
    
    const parsed = JSON.parse(jsonMatch[0]);
    
    return {
      ...state,
      parsedInput: parsed,
      confidence: parsed.confidence || 0.8,
    };
  } catch (error) {
    return {
      ...state,
      errors: [...state.errors, `Erro no agente de captura: ${error}`],
      confidence: Math.max(0, state.confidence - 0.2),
    };
  }
}

// 2. AGENTE DE VINCULAÇÃO (LINKER)
async function linkerAgent(state: AgentState): Promise<AgentState> {
  try {
    if (!state.parsedInput) {
      throw new Error('Entrada não foi processada');
    }

    const prompt = `
    Decida se esta nova entrada deve ser:
    - CRIAR nova tarefa
    - ANEXAR a tarefa existente como subtarefa/comentário  
    - EDITAR tarefa existente

    ENTRADA: ${JSON.stringify(state.parsedInput)}
    TAREFAS EXISTENTES: ${JSON.stringify(state.existingTasks.slice(0, 10))}

    Considere:
    - Similaridade de contexto (mesmo cliente/projeto)
    - Proximidade temporal (mesmo dia/semana)
    - Complementaridade (subtarefa vs tarefa independente)

    Responda apenas com JSON válido:
    {
      "decision": "create_new|attach_to|edit_existing",
      "target_task_id": "uuid ou null",
      "reasoning": "explicação da decisão",
      "confidence": 0.0-1.0
    }
    `;

    const response = await model.invoke([new HumanMessage(prompt)]);
    const content = response.content as string;
    
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Resposta não contém JSON válido');
    }
    
    const parsed = JSON.parse(jsonMatch[0]);
    
    return {
      ...state,
      linkDecision: parsed,
      confidence: Math.min(state.confidence, parsed.confidence || 0.8),
    };
  } catch (error) {
    return {
      ...state,
      errors: [...state.errors, `Erro no agente de vinculação: ${error}`],
      confidence: Math.max(0, state.confidence - 0.2),
    };
  }
}

// 3. AGENTE DE PLANEJAMENTO (PLANNER)
async function plannerAgent(state: AgentState): Promise<AgentState> {
  try {
    if (!state.parsedInput) {
      throw new Error('Entrada não foi processada');
    }

    const prompt = `
    Crie um plano detalhado para esta tarefa:

    TAREFA: ${state.parsedInput.action}
    CONTEXTO: ${state.parsedInput.context || 'Geral'}

    Gere:
    1. Título claro (verbo + resultado)
    2. Descrição estruturada
    3. 3-7 subtarefas em ordem lógica
    4. Definition of Done
    5. Estimativa de esforço (minutos)

    Responda apenas com JSON válido:
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

    const response = await model.invoke([new HumanMessage(prompt)]);
    const content = response.content as string;
    
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Resposta não contém JSON válido');
    }
    
    const parsed = JSON.parse(jsonMatch[0]);
    
    return {
      ...state,
      taskPlan: parsed,
      confidence: Math.min(state.confidence, parsed.confidence || 0.8),
    };
  } catch (error) {
    return {
      ...state,
      errors: [...state.errors, `Erro no agente de planejamento: ${error}`],
      confidence: Math.max(0, state.confidence - 0.2),
    };
  }
}

// 4. AGENTE DE PRIORIZAÇÃO (PRIORITIZER)
async function prioritizerAgent(state: AgentState): Promise<AgentState> {
  try {
    if (!state.taskPlan) {
      throw new Error('Plano de tarefa não foi gerado');
    }

    const prompt = `
    Defina prioridade para esta tarefa:

    TAREFA: ${JSON.stringify(state.taskPlan)}
    CONTEXTO DO USUÁRIO: ${JSON.stringify(state.userContext || {})}

    Considere:
    - Urgência (prazo próximo)
    - Impacto (cliente VIP, receita)
    - Esforço vs tempo disponível
    - SLA contratual

    Responda apenas com JSON válido:
    {
      "priority": 1|2|3,
      "suggested_due_date": "ISO date ou null",
      "reasoning": "explicação",
      "confidence": 0.0-1.0
    }
    `;

    const response = await model.invoke([new HumanMessage(prompt)]);
    const content = response.content as string;
    
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Resposta não contém JSON válido');
    }
    
    const parsed = JSON.parse(jsonMatch[0]);
    
    return {
      ...state,
      priorityDecision: parsed,
      confidence: Math.min(state.confidence, parsed.confidence || 0.8),
    };
  } catch (error) {
    return {
      ...state,
      errors: [...state.errors, `Erro no agente de priorização: ${error}`],
      confidence: Math.max(0, state.confidence - 0.2),
    };
  }
}

// 5. AGENTE DE FINALIZAÇÃO (FINALIZER)
async function finalizerAgent(state: AgentState): Promise<AgentState> {
  try {
    if (!state.taskPlan || !state.priorityDecision) {
      throw new Error('Dados insuficientes para finalizar');
    }

    // Criar tarefa final
    const finalTask: Task = {
      id: crypto.randomUUID(),
      workspace_id: '', // Será definido pelo contexto
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
      entities: state.parsedInput?.entities || [],
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

// Função de decisão para roteamento
function shouldContinue(state: AgentState): string {
  if (state.errors.length > 0) {
    return 'error';
  }
  
  if (state.finalTask) {
    return 'end';
  }
  
  return 'continue';
}

// Criar o grafo de agentes
export function createAgentGraph() {
  const workflow = new StateGraph<AgentState>({
    channels: {
      input: { reducer: (x: string, y: string) => y },
      parsedInput: { reducer: (x: any, y: any) => y },
      existingTasks: { reducer: (x: Task[], y: Task[]) => y },
      linkDecision: { reducer: (x: any, y: any) => y },
      taskPlan: { reducer: (x: any, y: any) => y },
      priorityDecision: { reducer: (x: any, y: any) => y },
      finalTask: { reducer: (x: any, y: any) => y },
      userContext: { reducer: (x: any, y: any) => y },
      errors: { reducer: (x: string[], y: string[]) => [...x, ...y] },
      confidence: { reducer: (x: number, y: number) => y },
    },
  });

  // Adicionar nós
  workflow.addNode('intake', intakeAgent);
  workflow.addNode('linker', linkerAgent);
  workflow.addNode('planner', plannerAgent);
  workflow.addNode('prioritizer', prioritizerAgent);
  workflow.addNode('finalizer', finalizerAgent);

  // Adicionar arestas
  workflow.addEdge('intake', 'linker');
  workflow.addEdge('linker', 'planner');
  workflow.addEdge('planner', 'prioritizer');
  workflow.addEdge('prioritizer', 'finalizer');
  workflow.addEdge('finalizer', END);

  // Adicionar condicionais
  workflow.addConditionalEdges('intake', shouldContinue, {
    error: END,
    continue: 'linker',
    end: END,
  });

  workflow.addConditionalEdges('linker', shouldContinue, {
    error: END,
    continue: 'planner',
    end: END,
  });

  workflow.addConditionalEdges('planner', shouldContinue, {
    error: END,
    continue: 'prioritizer',
    end: END,
  });

  workflow.addConditionalEdges('prioritizer', shouldContinue, {
    error: END,
    continue: 'finalizer',
    end: END,
  });

  return workflow.compile();
}

// Função principal para processar entrada do usuário
export async function processUserInput(
  input: string,
  existingTasks: Task[] = [],
  userContext?: UserContext
): Promise<AgentResponse<Task>> {
  try {
    const graph = createAgentGraph();
    
    const initialState: AgentState = {
      input,
      existingTasks,
      userContext,
      errors: [],
      confidence: 1.0,
    };

    const result = await graph.invoke(initialState);

    if (result.errors.length > 0) {
      return {
        success: false,
        error: result.errors.join('; '),
        confidence: result.confidence,
        reasoning: 'Erro no processamento da entrada',
      };
    }

    if (!result.finalTask) {
      return {
        success: false,
        error: 'Tarefa não foi gerada',
        confidence: result.confidence,
        reasoning: 'Falha na geração da tarefa',
      };
    }

    return {
      success: true,
      data: result.finalTask,
      confidence: result.confidence,
      reasoning: 'Tarefa processada com sucesso',
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
      confidence: 0,
      reasoning: 'Falha no processamento',
    };
  }
}
