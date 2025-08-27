import { NextRequest, NextResponse } from 'next/server';
import { supabase, createRequestSupabaseClient } from '@/lib/supabase/client';

async function verifyAuth(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { error: 'Token de autenticação necessário', status: 401 } as const;
  }

  const token = authHeader.replace('Bearer ', '');
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) {
    return { error: 'Token inválido', status: 401 } as const;
  }
  return { user, token } as const;
}

// GET /api/subtasks?task_id=...
export async function GET(request: NextRequest) {
  try {
    const auth = await verifyAuth(request);
    if ('error' in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const url = new URL(request.url);
    const taskId = url.searchParams.get('task_id');
    if (!taskId) {
      return NextResponse.json({ error: 'task_id é obrigatório' }, { status: 400 });
    }

    // Verificar se tarefa pertence ao usuário (via workspace)
    const sb = createRequestSupabaseClient(auth.token);
    const { data: task, error: tErr } = await sb
      .from('tasks')
      .select(`
        id,
        workspaces!inner(user_id)
      `)
      .eq('id', taskId)
      .eq('workspaces.user_id', auth.user.id)
      .single();

    if (tErr || !task) {
      return NextResponse.json({ error: 'Tarefa não encontrada' }, { status: 404 });
    }

    const { data: subtasks, error } = await sb
      .from('subtasks')
      .select('*')
      .eq('task_id', taskId)
      .order('order_index', { ascending: true });

    if (error) {
      console.error('Erro ao buscar subtarefas:', error);
      return NextResponse.json({ error: 'Erro ao buscar subtarefas' }, { status: 500 });
    }

    return NextResponse.json({ subtasks: subtasks || [] });
  } catch (err) {
    console.error('Erro na API de subtasks (GET):', err);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

// POST /api/subtasks
export async function POST(request: NextRequest) {
  try {
    const auth = await verifyAuth(request);
    if ('error' in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { task_id, title, description, status = 'todo', order_index } = await request.json();
    if (!task_id || !title || typeof order_index !== 'number') {
      return NextResponse.json({ error: 'task_id, title e order_index são obrigatórios' }, { status: 400 });
    }

    // Verificar se tarefa pertence ao usuário
    const sb = createRequestSupabaseClient(auth.token);
    const { data: task, error: tErr } = await sb
      .from('tasks')
      .select(`
        id,
        workspaces!inner(user_id)
      `)
      .eq('id', task_id)
      .eq('workspaces.user_id', auth.user.id)
      .single();

    if (tErr || !task) {
      return NextResponse.json({ error: 'Tarefa não encontrada' }, { status: 404 });
    }

    const { data: subtask, error } = await sb
      .from('subtasks')
      .insert({ task_id, title, description, status, order_index })
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar subtarefa:', error);
      return NextResponse.json({ error: 'Erro ao criar subtarefa' }, { status: 500 });
    }

    return NextResponse.json({ subtask }, { status: 201 });
  } catch (err) {
    console.error('Erro na API de subtasks (POST):', err);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

// PUT /api/subtasks
export async function PUT(request: NextRequest) {
  try {
    const auth = await verifyAuth(request);
    if ('error' in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { id, ...updates } = await request.json();
    if (!id) {
      return NextResponse.json({ error: 'ID da subtarefa é obrigatório' }, { status: 400 });
    }

    // Verificar se subtarefa pertence ao usuário (via tarefa -> workspace)
    const sb = createRequestSupabaseClient(auth.token);
    const { data: existing, error: checkError } = await sb
      .from('subtasks')
      .select(`
        id,
        task_id,
        tasks!inner(
          id,
          workspaces!inner(user_id)
        )
      `)
      .eq('id', id)
      .eq('tasks.workspaces.user_id', auth.user.id)
      .single();

    if (checkError || !existing) {
      return NextResponse.json({ error: 'Subtarefa não encontrada' }, { status: 404 });
    }

    const { data: subtask, error } = await sb
      .from('subtasks')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar subtarefa:', error);
      return NextResponse.json({ error: 'Erro ao atualizar subtarefa' }, { status: 500 });
    }

    return NextResponse.json({ subtask });
  } catch (err) {
    console.error('Erro na API de subtasks (PUT):', err);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

// DELETE /api/subtasks?id=...
export async function DELETE(request: NextRequest) {
  try {
    const auth = await verifyAuth(request);
    if ('error' in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'ID da subtarefa é obrigatório' }, { status: 400 });
    }

    // Verificar se subtarefa pertence ao usuário
    const sb = createRequestSupabaseClient(auth.token);
    const { data: existing, error: checkError } = await sb
      .from('subtasks')
      .select(`
        id,
        task_id,
        tasks!inner(
          id,
          workspaces!inner(user_id)
        )
      `)
      .eq('id', id)
      .eq('tasks.workspaces.user_id', auth.user.id)
      .single();

    if (checkError || !existing) {
      return NextResponse.json({ error: 'Subtarefa não encontrada' }, { status: 404 });
    }

    const { error } = await sb
      .from('subtasks')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao deletar subtarefa:', error);
      return NextResponse.json({ error: 'Erro ao deletar subtarefa' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Subtarefa deletada com sucesso' });
  } catch (err) {
    console.error('Erro na API de subtasks (DELETE):', err);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}


