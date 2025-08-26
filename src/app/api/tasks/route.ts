import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import { generateTaskEmbedding } from '@/lib/services/embedding-service';

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

    if (status) {
      query = query.eq('status', status);
    }

    if (priority) {
      query = query.eq('priority', priority);
    }

    const { data: tasks, error } = await query
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro Supabase:', error);
      return NextResponse.json(
        { error: 'Erro ao buscar tarefas' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, tasks: tasks || [] });

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
    const { 
      workspace_id, 
      title, 
      description, 
      priority, 
      due_date, 
      effort_minutes,
      project_id,
      source_type = 'manual'
    } = taskData;

    if (!workspace_id || !title) {
      return NextResponse.json(
        { error: 'workspace_id e title são obrigatórios' },
        { status: 400 }
      );
    }

    // Gerar embedding para a tarefa
    const embedding = await generateTaskEmbedding(title, description);
    
    const { data: task, error } = await supabase
      .from('tasks')
      .insert({
        workspace_id,
        title,
        description,
        status: 'todo',
        priority: (priority || 2) as 1 | 2 | 3,
        due_date,
        effort_minutes,
        project_id,
        source_type,
        embedding,
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

    if (error) {
      console.error('Erro Supabase:', error);
      return NextResponse.json(
        { error: 'Erro ao criar tarefa' },
        { status: 500 }
      );
    }

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

    const { data: task, error } = await supabase
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

    if (error) {
      console.error('Erro Supabase:', error);
      return NextResponse.json(
        { error: 'Erro ao atualizar tarefa' },
        { status: 500 }
      );
    }

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

    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro Supabase:', error);
      return NextResponse.json(
        { error: 'Erro ao deletar tarefa' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: 'Tarefa deletada com sucesso' });

  } catch (error) {
    console.error('Erro ao deletar tarefa:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
