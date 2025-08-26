import { NextRequest, NextResponse } from 'next/server';
import { intakeAgent, linkerAgent, plannerAgent, prioritizerAgent } from '@/lib/ai/agents';
import { Task, UserContext } from '@/types';
import { mockTasks } from '@/lib/mock-data';

// Função para buscar tarefas similares
async function findSimilarTasks(parsedInput: any, workspaceId: string): Promise<Task[]> {
  // Temporário: usar mock enquanto Supabase não está conectado
  return mockTasks.filter(t => t.workspace_id === workspaceId).slice(0, 10) as Task[];
}

// Função para criar tarefa
async function createTask(taskData: any, priorityData: any, workspaceId: string): Promise<Task> {
  // Temporário: criar tarefa em memória (mock)
  const newTask: Task = {
    id: Math.random().toString(36).slice(2),
    workspace_id: workspaceId,
    project_id: undefined,
    title: taskData.title,
    description: taskData.description,
    status: 'todo',
    priority: priorityData.priority,
    effort_minutes: taskData.estimated_minutes,
    due_date: priorityData.suggested_due_date,
    source_type: 'manual',
    source_content: undefined,
    ai_confidence: priorityData.confidence,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  } as Task;

  // Não persistimos no mockTasks porque é somente leitura; retornamos o objeto
  return newTask;
}

// Função para log de atividade
async function logActivity(data: {
  action: string;
  task_id: string;
  ai_agent: string;
  changes: any;
}) {
  // Temporário: sem persistência
  return;
}

export async function POST(req: NextRequest) {
  try {
    const { message, workspace_id } = await req.json();

    if (!message || !workspace_id) {
      return NextResponse.json(
        { error: 'Mensagem e workspace_id são obrigatórios' },
        { status: 400 }
      );
    }

    // 1. Parse da entrada
    const parsed = await intakeAgent(message);
    if (!parsed.success || !parsed.data) {
      return NextResponse.json(
        { error: 'Falha no processamento da entrada', details: parsed.error },
        { status: 500 }
      );
    }

    // 2. Buscar tarefas similares
    const existingTasks = await findSimilarTasks(parsed.data, workspace_id);

    // 3. Decisão de vínculo
    const linkDecision = await linkerAgent(parsed.data, existingTasks);
    if (!linkDecision.success || !linkDecision.data) {
      return NextResponse.json(
        { error: 'Falha na decisão de vinculação', details: linkDecision.error },
        { status: 500 }
      );
    }

    // 4. Processar baseado na decisão
    let result;
    if (linkDecision.data.decision === 'create_new') {
      const plan = await plannerAgent({
        title: parsed.data.action,
        description: parsed.data.context,
        project_id: undefined,
      } as any);
      if (!plan.success || !plan.data) {
        return NextResponse.json(
          { error: 'Falha no planejamento', details: plan.error },
          { status: 500 }
        );
      }

      // Contexto do usuário (simulado)
      const userContext: UserContext = {
        client_slas: {
          'Kabbatec': 4,
          'Cartório': 24,
          'Academia SP': 8,
        },
        calendar_today: [],
        p1_count: existingTasks.filter(t => t.priority === 1).length,
      };

      const priority = await prioritizerAgent(plan.data as any, userContext);
      if (!priority.success || !priority.data) {
        return NextResponse.json(
          { error: 'Falha na priorização', details: priority.error },
          { status: 500 }
        );
      }

      result = await createTask(plan.data, priority.data, workspace_id);

      // 5. Log da atividade
      await logActivity({
        action: 'ai_processed',
        task_id: result.id,
        ai_agent: 'full_pipeline',
        changes: { parsed: parsed.data, linkDecision: linkDecision.data, plan: plan.data, priority: priority.data }
      });
    } else if (linkDecision.data.decision === 'attach_to') {
      // Implementar lógica de anexar a tarefa existente
      result = { id: linkDecision.data.target_task_id, action: 'attached' };
    } else {
      // Implementar lógica de editar tarefa existente
      result = { id: linkDecision.data.target_task_id, action: 'updated' };
    }

    return NextResponse.json({ 
      success: true, 
      task: result,
      processing: {
        parsed: parsed.data,
        linkDecision: linkDecision.data,
      }
    });

  } catch (error) {
    console.error('Erro no processamento de IA:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
