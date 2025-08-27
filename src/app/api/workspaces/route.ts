import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase/client';

// GET /api/workspaces - Listar workspaces do usuário
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

    // Buscar workspaces do usuário
    const { data: workspaces, error } = await supabase
      .from('workspaces')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar workspaces:', error);
      return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
    }

    return NextResponse.json({ workspaces });
  } catch (error) {
    console.error('Erro na API de workspaces:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

// POST /api/workspaces - Criar novo workspace
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

    // Obter dados do request
    const { name, type, settings } = await request.json();

    if (!name) {
      return NextResponse.json({ error: 'Nome do workspace é obrigatório' }, { status: 400 });
    }

    // Criar workspace
    const { data: workspace, error } = await supabase
      .from('workspaces')
      .insert({
        user_id: user.id,
        name,
        type: type || 'personal',
        settings: settings || {}
      })
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar workspace:', error);
      return NextResponse.json({ error: 'Erro ao criar workspace' }, { status: 500 });
    }

    return NextResponse.json({ workspace }, { status: 201 });
  } catch (error) {
    console.error('Erro na API de workspaces:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

// PUT /api/workspaces/:id - Atualizar workspace
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
    const { id, name, type, settings } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'ID do workspace é obrigatório' }, { status: 400 });
    }

    // Verificar se o workspace pertence ao usuário
    const { data: existingWorkspace, error: checkError } = await supabase
      .from('workspaces')
      .select('id')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (checkError || !existingWorkspace) {
      return NextResponse.json({ error: 'Workspace não encontrado' }, { status: 404 });
    }

    // Atualizar workspace
    const { data: workspace, error } = await supabase
      .from('workspaces')
      .update({
        name,
        type,
        settings,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar workspace:', error);
      return NextResponse.json({ error: 'Erro ao atualizar workspace' }, { status: 500 });
    }

    return NextResponse.json({ workspace });
  } catch (error) {
    console.error('Erro na API de workspaces:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

// DELETE /api/workspaces/:id - Deletar workspace
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

    // Obter ID do workspace da URL
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID do workspace é obrigatório' }, { status: 400 });
    }

    // Verificar se o workspace pertence ao usuário
    const { data: existingWorkspace, error: checkError } = await supabase
      .from('workspaces')
      .select('id')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (checkError || !existingWorkspace) {
      return NextResponse.json({ error: 'Workspace não encontrado' }, { status: 404 });
    }

    // Deletar workspace (cascade irá deletar projetos e tarefas)
    const { error } = await supabase
      .from('workspaces')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao deletar workspace:', error);
      return NextResponse.json({ error: 'Erro ao deletar workspace' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Workspace deletado com sucesso' });
  } catch (error) {
    console.error('Erro na API de workspaces:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
