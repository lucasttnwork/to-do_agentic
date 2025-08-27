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

// GET /api/entities?workspace_id=...
export async function GET(request: NextRequest) {
  try {
    const auth = await verifyAuth(request);
    if ('error' in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const url = new URL(request.url);
    const workspaceId = url.searchParams.get('workspace_id');

    const sb = createRequestSupabaseClient(auth.token);

    let query = sb
      .from('entities')
      .select(`
        *,
        workspaces!inner(user_id)
      `)
      .eq('workspaces.user_id', auth.user.id);

    if (workspaceId) {
      query = query.eq('workspace_id', workspaceId);
    }

    const { data: entities, error } = await query.order('created_at', { ascending: false });
    if (error) {
      console.error('Erro ao buscar entities:', error);
      return NextResponse.json({ error: 'Erro ao buscar entidades' }, { status: 500 });
    }

    return NextResponse.json({ entities: entities || [] });
  } catch (err) {
    console.error('Erro na API de entities (GET):', err);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

// POST /api/entities
export async function POST(request: NextRequest) {
  try {
    const auth = await verifyAuth(request);
    if ('error' in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { workspace_id, type, name, metadata } = await request.json();
    if (!workspace_id || !type || !name) {
      return NextResponse.json({ error: 'workspace_id, type e name são obrigatórios' }, { status: 400 });
    }

    // Verificar se workspace pertence ao usuário
    const sb = createRequestSupabaseClient(auth.token);
    const { data: workspace, error: wErr } = await sb
      .from('workspaces')
      .select('id')
      .eq('id', workspace_id)
      .eq('user_id', auth.user.id)
      .single();

    if (wErr || !workspace) {
      return NextResponse.json({ error: 'Workspace não encontrado' }, { status: 404 });
    }

    const { data: entity, error } = await sb
      .from('entities')
      .insert({
        workspace_id,
        type,
        name,
        metadata: metadata ?? {},
      })
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar entity:', error);
      return NextResponse.json({ error: 'Erro ao criar entidade' }, { status: 500 });
    }

    return NextResponse.json({ entity }, { status: 201 });
  } catch (err) {
    console.error('Erro na API de entities (POST):', err);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

// PUT /api/entities
export async function PUT(request: NextRequest) {
  try {
    const auth = await verifyAuth(request);
    if ('error' in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { id, ...updates } = await request.json();
    if (!id) {
      return NextResponse.json({ error: 'ID da entidade é obrigatório' }, { status: 400 });
    }

    // Verificar propriedade via join com workspaces
    const sb = createRequestSupabaseClient(auth.token);
    const { data: existing, error: checkError } = await sb
      .from('entities')
      .select(`
        id,
        workspaces!inner(user_id)
      `)
      .eq('id', id)
      .eq('workspaces.user_id', auth.user.id)
      .single();

    if (checkError || !existing) {
      return NextResponse.json({ error: 'Entidade não encontrada' }, { status: 404 });
    }

    const { data: entity, error } = await sb
      .from('entities')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar entity:', error);
      return NextResponse.json({ error: 'Erro ao atualizar entidade' }, { status: 500 });
    }

    return NextResponse.json({ entity });
  } catch (err) {
    console.error('Erro na API de entities (PUT):', err);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

// DELETE /api/entities?id=...
export async function DELETE(request: NextRequest) {
  try {
    const auth = await verifyAuth(request);
    if ('error' in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'ID da entidade é obrigatório' }, { status: 400 });
    }

    // Verificar propriedade via join com workspaces
    const sb = createRequestSupabaseClient(auth.token);
    const { data: existing, error: checkError } = await sb
      .from('entities')
      .select(`
        id,
        workspaces!inner(user_id)
      `)
      .eq('id', id)
      .eq('workspaces.user_id', auth.user.id)
      .single();

    if (checkError || !existing) {
      return NextResponse.json({ error: 'Entidade não encontrada' }, { status: 404 });
    }

    const { error } = await sb
      .from('entities')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao deletar entity:', error);
      return NextResponse.json({ error: 'Erro ao deletar entidade' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Entidade deletada com sucesso' });
  } catch (err) {
    console.error('Erro na API de entities (DELETE):', err);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}


