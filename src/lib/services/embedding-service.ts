import OpenAI from 'openai';
import { supabase } from '@/lib/supabase/client';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function generateTaskEmbedding(taskTitle: string, taskDescription?: string): Promise<number[]> {
  try {
    const text = `${taskTitle} ${taskDescription || ''}`.trim();
    
    // Gerar novo embedding
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: text,
      encoding_format: 'float',
    });

    const embedding = response.data[0].embedding;
    return embedding;
  } catch (error) {
    console.error('Erro ao gerar embedding:', error);
    // Retornar array vazio em caso de erro para não quebrar a aplicação
    return new Array(1536).fill(0);
  }
}

export async function searchTasksSemantic(
  query: string, 
  workspaceId: string, 
  limit: number = 10
): Promise<any[]> {
  try {
    // Gerar embedding da query
    const queryEmbedding = await generateTaskEmbedding(query);
    
    // Buscar tarefas similares usando a função SQL
    const { data, error } = await supabase
      .rpc('search_tasks_semantic', {
        query_embedding: queryEmbedding,
        workspace_id: workspaceId,
        match_threshold: 0.7,
        match_count: limit
      });

    if (error) {
      console.error('Erro na busca semântica:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Erro na busca semântica:', error);
    return [];
  }
}

export async function updateTaskEmbedding(taskId: string): Promise<void> {
  try {
    // Buscar a tarefa
    const { data: task, error: fetchError } = await supabase
      .from('tasks')
      .select('title, description')
      .eq('id', taskId)
      .single();

    if (fetchError || !task) {
      throw new Error('Tarefa não encontrada');
    }

    // Gerar embedding
    const embedding = await generateTaskEmbedding(task.title, task.description);

    // Atualizar a tarefa com o embedding
    const { error: updateError } = await supabase
      .from('tasks')
      .update({ embedding })
      .eq('id', taskId);

    if (updateError) {
      throw updateError;
    }
  } catch (error) {
    console.error('Erro ao atualizar embedding da tarefa:', error);
    throw error;
  }
}
