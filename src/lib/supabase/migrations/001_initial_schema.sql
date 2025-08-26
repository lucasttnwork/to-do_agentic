-- Migration: 001_initial_schema.sql
-- Description: Schema inicial para TaskFlow AI
-- Date: 2024-01-XX

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "vector";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Workspaces table
CREATE TABLE IF NOT EXISTS public.workspaces (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    type TEXT CHECK (type IN ('personal', 'client')) DEFAULT 'personal',
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projects table
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    status TEXT CHECK (status IN ('active', 'inactive')) DEFAULT 'active',
    client_sla_hours INTEGER DEFAULT 24,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tasks table
CREATE TABLE IF NOT EXISTS public.tasks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE NOT NULL,
    project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT CHECK (status IN ('todo', 'in_progress', 'review', 'done', 'archived')) DEFAULT 'todo',
    priority INTEGER CHECK (priority IN (1, 2, 3)) DEFAULT 2,
    effort_minutes INTEGER,
    due_date TIMESTAMP WITH TIME ZONE,
    source_type TEXT CHECK (source_type IN ('manual', 'audio', 'whatsapp', 'email', 'ai_chat')) DEFAULT 'manual',
    source_content TEXT,
    ai_confidence DECIMAL(3,2) CHECK (ai_confidence >= 0 AND ai_confidence <= 1),
    embedding VECTOR(1536),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subtasks table
CREATE TABLE IF NOT EXISTS public.subtasks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT CHECK (status IN ('todo', 'done')) DEFAULT 'todo',
    order_index INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Entities table (clients, people, tags)
CREATE TABLE IF NOT EXISTS public.entities (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE NOT NULL,
    type TEXT CHECK (type IN ('client', 'person', 'tag', 'project')) NOT NULL,
    name TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chat messages table for AI conversation history
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE NOT NULL,
    role TEXT CHECK (role IN ('user', 'assistant')) NOT NULL,
    content TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    task_id UUID REFERENCES public.tasks(id) ON DELETE SET NULL,
    action TEXT CHECK (action IN ('task_created', 'task_updated', 'task_completed', 'task_deleted')),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Task entities relationship table (many-to-many)
CREATE TABLE IF NOT EXISTS public.task_entities (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE NOT NULL,
    entity_id UUID REFERENCES public.entities(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(task_id, entity_id)
);

-- AI Agent execution logs
CREATE TABLE IF NOT EXISTS public.ai_agent_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    agent_type TEXT NOT NULL, -- 'intake', 'linker', 'planner', 'prioritizer'
    input_data JSONB NOT NULL,
    output_data JSONB NOT NULL,
    confidence DECIMAL(3,2) CHECK (confidence >= 0 AND confidence <= 1),
    execution_time_ms INTEGER,
    success BOOLEAN NOT NULL,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User context for AI decisions
CREATE TABLE IF NOT EXISTS public.user_context (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE NOT NULL,
    context_type TEXT NOT NULL, -- 'calendar', 'sla', 'workload'
    context_data JSONB NOT NULL,
    valid_until TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_tasks_workspace_id ON public.tasks(workspace_id);
CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON public.tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON public.tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON public.tasks(priority);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON public.tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_subtasks_task_id ON public.subtasks(task_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_workspace ON public.chat_messages(user_id, workspace_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_timestamp ON public.chat_messages(timestamp);
CREATE INDEX IF NOT EXISTS idx_entities_workspace_type ON public.entities(workspace_id, type);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subtasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.entities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_entities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_agent_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_context ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can only see their own data
CREATE POLICY "Users can view own data" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Workspaces policies
CREATE POLICY "Users can view own workspaces" ON public.workspaces
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own workspaces" ON public.workspaces
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own workspaces" ON public.workspaces
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own workspaces" ON public.workspaces
    FOR DELETE USING (auth.uid() = user_id);

-- Projects policies
CREATE POLICY "Users can view projects in own workspaces" ON public.projects
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.workspaces 
            WHERE id = workspace_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert projects in own workspaces" ON public.projects
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.workspaces 
            WHERE id = workspace_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update projects in own workspaces" ON public.projects
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.workspaces 
            WHERE id = workspace_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete projects in own workspaces" ON public.projects
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.workspaces 
            WHERE id = workspace_id AND user_id = auth.uid()
        )
    );

-- Tasks policies
CREATE POLICY "Users can view tasks in own workspaces" ON public.tasks
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.workspaces 
            WHERE id = workspace_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert tasks in own workspaces" ON public.tasks
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.workspaces 
            WHERE id = workspace_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update tasks in own workspaces" ON public.tasks
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.workspaces 
            WHERE id = workspace_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete tasks in own workspaces" ON public.tasks
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.workspaces 
            WHERE id = workspace_id AND user_id = auth.uid()
        )
    );

-- Subtasks policies
CREATE POLICY "Users can view subtasks of own tasks" ON public.subtasks
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.tasks t
            JOIN public.workspaces w ON t.workspace_id = w.id
            WHERE t.id = task_id AND w.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert subtasks to own tasks" ON public.subtasks
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.tasks t
            JOIN public.workspaces w ON t.workspace_id = w.id
            WHERE t.id = task_id AND w.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update subtasks of own tasks" ON public.subtasks
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.tasks t
            JOIN public.workspaces w ON t.workspace_id = w.id
            WHERE t.id = task_id AND w.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete subtasks of own tasks" ON public.subtasks
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.tasks t
            JOIN public.workspaces w ON t.workspace_id = w.id
            WHERE t.id = task_id AND w.user_id = auth.uid()
        )
    );

-- Entities policies
CREATE POLICY "Users can view entities in own workspaces" ON public.entities
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.workspaces 
            WHERE id = workspace_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert entities in own workspaces" ON public.entities
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.workspaces 
            WHERE id = workspace_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update entities in own workspaces" ON public.entities
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.workspaces 
            WHERE id = workspace_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete entities in own workspaces" ON public.entities
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.workspaces 
            WHERE id = workspace_id AND user_id = auth.uid()
        )
    );

-- Chat messages policies
CREATE POLICY "Users can view own chat messages" ON public.chat_messages
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own chat messages" ON public.chat_messages
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own chat messages" ON public.chat_messages
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own chat messages" ON public.chat_messages
    FOR DELETE USING (auth.uid() = user_id);

-- Task entities policies
CREATE POLICY "Users can view task entities of own tasks" ON public.task_entities
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.tasks t
            JOIN public.workspaces w ON t.workspace_id = w.id
            WHERE t.id = task_id AND w.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert task entities to own tasks" ON public.task_entities
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.tasks t
            JOIN public.workspaces w ON t.workspace_id = w.id
            WHERE t.id = task_id AND w.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update task entities of own tasks" ON public.task_entities
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.tasks t
            JOIN public.workspaces w ON t.workspace_id = w.id
            WHERE t.id = task_id AND w.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete task entities of own tasks" ON public.task_entities
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.tasks t
            JOIN public.workspaces w ON t.workspace_id = w.id
            WHERE t.id = task_id AND w.user_id = auth.uid()
        )
    );

-- AI agent logs policies
CREATE POLICY "Users can view own AI agent logs" ON public.ai_agent_logs
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own AI agent logs" ON public.ai_agent_logs
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User context policies
CREATE POLICY "Users can view own context" ON public.user_context
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own context" ON public.user_context
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own context" ON public.user_context
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own context" ON public.user_context
    FOR DELETE USING (auth.uid() = user_id);

-- Create functions for automatic timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workspaces_updated_at BEFORE UPDATE ON public.workspaces
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON public.tasks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subtasks_updated_at BEFORE UPDATE ON public.subtasks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_entities_updated_at BEFORE UPDATE ON public.entities
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_context_updated_at BEFORE UPDATE ON public.user_context
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default workspace for new users
CREATE OR REPLACE FUNCTION create_default_workspace()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.workspaces (user_id, name, type)
    VALUES (NEW.id, 'Personal', 'personal');
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER create_default_workspace_trigger
    AFTER INSERT ON public.users
    FOR EACH ROW EXECUTE FUNCTION create_default_workspace();

-- Create vector index for semantic search
CREATE INDEX IF NOT EXISTS tasks_embedding_idx ON public.tasks 
USING ivfflat (embedding vector_cosine_ops) 
WITH (lists = 100);

-- Create function for semantic search
CREATE OR REPLACE FUNCTION search_tasks_semantic(
    query_embedding VECTOR(1536),
    workspace_id UUID,
    match_threshold FLOAT DEFAULT 0.7,
    match_count INT DEFAULT 10
)
RETURNS TABLE (
    id UUID,
    title TEXT,
    description TEXT,
    similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        t.id,
        t.title,
        t.description,
        1 - (t.embedding <=> query_embedding) AS similarity
    FROM public.tasks t
    WHERE t.workspace_id = search_tasks_semantic.workspace_id
        AND t.embedding IS NOT NULL
        AND 1 - (t.embedding <=> query_embedding) > match_threshold
    ORDER BY t.embedding <=> query_embedding
    LIMIT match_count;
END;
$$;
