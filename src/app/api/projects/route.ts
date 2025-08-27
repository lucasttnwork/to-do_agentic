import { NextRequest, NextResponse } from 'next/server';
import { supabase, createRequestSupabaseClient } from '../../../lib/supabase/client';

// GET /api/projects - Listar projetos do usuário
export async function GET(request: NextRequest) {
  try {
    // Verificar autenticação
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Token de autenticação necessário' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    
    // Verificar token e obter usuário
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }

    // Obter workspace_id da query string (opcional)
    const url = new URL(request.url);
    const workspaceId = url.searchParams.get('workspace_id');

    const sb = createRequestSupabaseClient(token);

    let query = sb
      .from('projects')
      .select(`
        *,
        workspaces!inner(user_id)
      `)
      .eq('workspaces.user_id', user.id);

    // Filtrar por workspace se especificado
    if (workspaceId) {
      query = query.eq('workspace_id', workspaceId);
    }

    const { data: projects, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar projetos:', error);
      return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
    }

    return NextResponse.json({ projects });
  } catch (error) {
    console.error('Erro na API de projetos:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

// POST /api/projects - Criar novo projeto
export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Token de autenticação necessário' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    
    // Verificar token e obter usuário
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }

    const sb = createRequestSupabaseClient(token);

    // Obter dados do request
    const { name, description, status, client_sla_hours, workspace_id } = await request.json();

    if (!name || !workspace_id) {
      return NextResponse.json({ error: 'Nome e workspace são obrigatórios' }, { status: 400 });
    }

    // Verificar se o workspace pertence ao usuário
    const { data: workspace, error: workspaceError } = await sb
      .from('workspaces')
      .select('id')
      .eq('id', workspace_id)
      .eq('user_id', user.id)
      .single();

    if (workspaceError || !workspace) {
      return NextResponse.json({ error: 'Workspace não encontrado' }, { status: 404 });
    }

    // Criar projeto
    const { data: project, error } = await sb
      .from('projects')
      .insert({
        workspace_id,
        name,
        description: description || '',
        status: status || 'active',
        client_sla_hours: client_sla_hours || 24
      })
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar projeto:', error);
      return NextResponse.json({ error: 'Erro ao criar projeto' }, { status: 500 });
    }

    return NextResponse.json({ project }, { status: 201 });
  } catch (error) {
    console.error('Erro na API de projetos:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

// PUT /api/projects/:id - Atualizar projeto
export async function PUT(request: NextRequest) {
  try {
    // Verificar autenticação
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Token de autenticação necessário' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    
    // Verificar token e obter usuário
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }

    // Obter dados do request
    const { id, name, description, status, client_sla_hours } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'ID do projeto é obrigatório' }, { status: 400 });
    }

    // Verificar se o projeto pertence ao usuário
    const sb = createRequestSupabaseClient(token);

    const { data: existingProject, error: checkError } = await sb
      .from('projects')
      .select(`
        id,
        workspaces!inner(user_id)
      `)
      .eq('id', id)
      .eq('workspaces.user_id', user.id)
      .single();

    if (checkError || !existingProject) {
      return NextResponse.json({ error: 'Projeto não encontrado' }, { status: 404 });
    }

    // Atualizar projeto
    const { data: project, error } = await sb
      .from('projects')
      .update({
        name,
        description,
        status,
        client_sla_hours,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar projeto:', error);
      return NextResponse.json({ error: 'Erro ao atualizar projeto' }, { status: 500 });
    }

    return NextResponse.json({ project });
  } catch (error) {
    console.error('Erro na API de projetos:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

// DELETE /api/projects/:id - Deletar projeto
export async function DELETE(request: NextRequest) {
  try {
    // Verificar autenticação
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Token de autenticação necessário' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    
    // Verificar token e obter usuário
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }

    // Obter ID do projeto da URL
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID do projeto é obrigatório' }, { status: 400 });
    }

    // Verificar se o projeto pertence ao usuário
    const sb = createRequestSupabaseClient(token);

    const { data: existingProject, error: checkError } = await sb
      .from('projects')
      .select(`
        id,
        workspaces!inner(user_id)
      `)
      .eq('id', id)
      .eq('workspaces.user_id', user.id)
      .single();

    if (checkError || !existingProject) {
      return NextResponse.json({ error: 'Projeto não encontrado' }, { status: 404 });
    }

    // Deletar projeto (cascade irá deletar tarefas)
    const { error } = await sb
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao deletar projeto:', error);
      return NextResponse.json({ error: 'Erro ao deletar projeto' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Projeto deletado com sucesso' });
  } catch (error) {
    console.error('Erro na API de projetos:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
