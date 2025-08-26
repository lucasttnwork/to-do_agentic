export interface User {
  id: string;
  email: string;
  full_name?: string;
  preferences: Record<string, any>;
}

export interface Workspace {
  id: string;
  user_id: string;
  name: string;
  type: 'personal' | 'client';
  settings: Record<string, any>;
}

export interface Project {
  id: string;
  workspace_id: string;
  name: string;
  description?: string;
  status: 'active' | 'inactive';
  client_sla_hours: number;
}

export interface Task {
  id: string;
  workspace_id: string;
  project_id?: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'done' | 'archived';
  priority: 1 | 2 | 3;
  effort_minutes?: number;
  due_date?: string;
  source_type: 'manual' | 'audio' | 'whatsapp' | 'email' | 'ai_chat';
  source_content?: string;
  ai_confidence?: number;
  subtasks?: Subtask[];
  entities?: Entity[];
  created_at: string;
  updated_at: string;
}

export interface Subtask {
  id: string;
  task_id: string;
  title: string;
  description?: string;
  status: 'todo' | 'done';
  order_index: number;
}

export interface Entity {
  id: string;
  workspace_id: string;
  type: 'client' | 'person' | 'tag';
  name: string;
  metadata: Record<string, any>;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  task_id?: string;
  action?: 'task_created' | 'task_updated' | 'task_completed';
  metadata?: Record<string, any>;
}

// Tipos para os agentes de IA
export interface ParsedInput {
  intention: 'task_new' | 'task_update' | 'task_complete' | 'task_question';
  action: string;
  entities: Array<{
    type: 'client' | 'person' | 'date' | 'project';
    value: string;
  }>;
  due_date?: string;
  priority: 1 | 2 | 3;
  context?: string;
  confidence: number;
}

export interface LinkDecision {
  decision: 'create_new' | 'attach_to' | 'edit_existing';
  target_task_id?: string;
  reasoning: string;
  confidence: number;
}

export interface TaskPlan {
  title: string;
  description: string;
  subtasks: Array<{
    title: string;
    description: string;
    order_index: number;
  }>;
  definition_of_done: string;
  estimated_minutes: number;
  confidence: number;
}

export interface PriorityDecision {
  priority: 1 | 2 | 3;
  suggested_due_date?: string;
  reasoning: string;
  confidence: number;
}

export interface AgentResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  confidence: number;
  reasoning?: string;
}

export interface UserContext {
  client_slas: Record<string, number>;
  calendar_today: string[];
  p1_count: number;
}
