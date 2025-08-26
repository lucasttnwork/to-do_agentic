import { Task, Workspace, Project } from '@/types';

// Dados mockados para demonstração
export const mockWorkspaces: Workspace[] = [
  {
    id: '1',
    user_id: '1',
    name: 'Pessoal',
    type: 'personal',
    settings: {}
  },
  {
    id: '2',
    user_id: '1',
    name: 'NTEX',
    type: 'client',
    settings: {}
  }
];

export const mockProjects: Project[] = [
  {
    id: '1',
    workspace_id: '2',
    name: 'Kabbatec',
    description: 'Cliente de marketing digital',
    status: 'active',
    client_sla_hours: 4
  },
  {
    id: '2',
    workspace_id: '2',
    name: 'Cartório',
    description: 'Cliente de serviços jurídicos',
    status: 'active',
    client_sla_hours: 24
  },
  {
    id: '3',
    workspace_id: '2',
    name: 'Academia SP',
    description: 'Cliente de fitness',
    status: 'active',
    client_sla_hours: 8
  }
];

export const mockTasks: Task[] = [
  {
    id: '1',
    workspace_id: '2',
    project_id: '1',
    title: 'Orçar campanha Meta Ads - Academia SP',
    description: 'Criar orçamento completo para campanha de marketing digital da Academia SP',
    status: 'todo',
    priority: 1,
    effort_minutes: 180,
    due_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 dias
    source_type: 'manual',
    ai_confidence: 0.95,
    subtasks: [
      {
        id: '1-1',
        task_id: '1',
        title: 'Levantar objetivos com cliente',
        description: 'Entender metas de conversão e público-alvo',
        status: 'todo',
        order_index: 1
      },
      {
        id: '1-2',
        task_id: '1',
        title: 'Definir estratégia de campanha',
        description: 'Criar estrutura de campanha e segmentação',
        status: 'todo',
        order_index: 2
      },
      {
        id: '1-3',
        task_id: '1',
        title: 'Calcular investimento e fee',
        description: 'Definir budget e margem de lucro',
        status: 'todo',
        order_index: 3
      }
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    workspace_id: '2',
    project_id: '2',
    title: 'Protocolar documento urgente',
    description: 'Documento do cartório precisa ser protocolado hoje',
    status: 'in_progress',
    priority: 1,
    effort_minutes: 45,
    due_date: new Date().toISOString(),
    source_type: 'audio',
    ai_confidence: 0.88,
    subtasks: [
      {
        id: '2-1',
        task_id: '2',
        title: 'Verificar documentação',
        description: 'Confirmar se todos os documentos estão em ordem',
        status: 'done',
        order_index: 1
      },
      {
        id: '2-2',
        task_id: '2',
        title: 'Ir ao cartório',
        description: 'Protocolizar o documento',
        status: 'todo',
        order_index: 2
      }
    ],
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 horas atrás
    updated_at: new Date().toISOString()
  },
  {
    id: '3',
    workspace_id: '1',
    title: 'Renovar CNH',
    description: 'Lembrar de renovar a carteira de motorista',
    status: 'todo',
    priority: 3,
    effort_minutes: 120,
    due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 dias
    source_type: 'manual',
    ai_confidence: 0.92,
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 dia atrás
    updated_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '4',
    workspace_id: '2',
    project_id: '3',
    title: 'Criar campanha Instagram Academia SP',
    description: 'Desenvolver campanha para redes sociais da academia',
    status: 'done',
    priority: 2,
    effort_minutes: 240,
    due_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 dias atrás
    source_type: 'whatsapp',
    ai_confidence: 0.85,
    subtasks: [
      {
        id: '4-1',
        task_id: '4',
        title: 'Briefing com cliente',
        description: 'Entender objetivos da campanha',
        status: 'done',
        order_index: 1
      },
      {
        id: '4-2',
        task_id: '4',
        title: 'Criar conceito visual',
        description: 'Desenvolver identidade visual da campanha',
        status: 'done',
        order_index: 2
      },
      {
        id: '4-3',
        task_id: '4',
        title: 'Produzir conteúdo',
        description: 'Criar posts e stories',
        status: 'done',
        order_index: 3
      }
    ],
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 dias atrás
    updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  }
];
