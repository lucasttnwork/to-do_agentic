import { NextRequest, NextResponse } from 'next/server';
import { Task } from '@/types';
import { mockTasks } from '@/lib/mock-data';

// GET - Listar tarefas
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const workspaceId = searchParams.get('workspace_id');
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');

    if (!workspaceId) {
      return NextResponse.json(
        { error: 'workspace_id é obrigatório' },
        { status: 400 }
      );
    }

    // Temporário: retornar do mock
    const tasks = mockTasks
      .filter(t => t.workspace_id === workspaceId)
      .filter(t => !status || t.status === status)
      .filter(t => !priority || String(t.priority) === String(priority))
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return NextResponse.json({ success: true, tasks });

  } catch (error) {
    console.error('Erro ao buscar tarefas:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// POST - Criar tarefa
export async function POST(req: NextRequest) {
  try {
    const taskData = await req.json();
    const { workspace_id, title, description, priority, due_date, effort_minutes } = taskData;

    if (!workspace_id || !title) {
      return NextResponse.json(
        { error: 'workspace_id e title são obrigatórios' },
        { status: 400 }
      );
    }

    const task: Task = {
      id: Math.random().toString(36).slice(2),
      workspace_id,
      title,
      description,
      status: 'todo',
      priority: (priority || 2) as 1 | 2 | 3,
      due_date,
      effort_minutes,
      source_type: 'manual',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as Task;
    return NextResponse.json({ success: true, task });

  } catch (error) {
    console.error('Erro ao criar tarefa:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// PUT - Atualizar tarefa
export async function PUT(req: NextRequest) {
  try {
    const { id, ...updates } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: 'ID da tarefa é obrigatório' },
        { status: 400 }
      );
    }

    const task = { id, ...updates };
    return NextResponse.json({ success: true, task });

  } catch (error) {
    console.error('Erro ao atualizar tarefa:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// DELETE - Deletar tarefa
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID da tarefa é obrigatório' },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, message: 'Tarefa deletada (mock)' });

  } catch (error) {
    console.error('Erro ao deletar tarefa:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
