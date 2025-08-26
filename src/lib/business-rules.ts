export const BUSINESS_RULES = {
  // Priorização automática
  PRIORITY_AUTO: {
    P1: 'due_date < 24h OU client_vip=true OU esforço < 15min + urgente',
    P2: 'due_date < 1 semana OU client_normal',
    P3: 'sem prazo OU pessoal OU esforço > 2h'
  },

  // SLA por cliente
  CLIENT_SLA: {
    'Kabbatec': '4 horas',
    'Cartório': '24 horas', 
    'Academia SP': '8 horas',
    'Pessoal': 'sem SLA'
  },

  // Limite diário
  DAILY_LIMITS: {
    max_p1_per_day: 3,
    max_new_tasks_per_day: 15,
    work_hours: { start: '09:00', end: '18:00' }
  },

  // Confirmação obrigatória
  REQUIRE_CONFIRMATION: [
    'editar tarefa com > 3 dias',
    'mesclar tarefas',
    'deletar qualquer coisa',
    'alterar due_date de cliente'
  ]
};

// Funções auxiliares para aplicar as regras
export function calculatePriority(
  dueDate?: string,
  clientName?: string,
  effortMinutes?: number,
  isUrgent?: boolean
): 1 | 2 | 3 {
  // P1: Prazo < 24h ou cliente VIP ou tarefa rápida urgente
  if (dueDate) {
    const due = new Date(dueDate);
    const now = new Date();
    const hoursUntilDue = (due.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    if (hoursUntilDue < 24) return 1;
  }
  
  if (clientName && BUSINESS_RULES.CLIENT_SLA[clientName as keyof typeof BUSINESS_RULES.CLIENT_SLA]) {
    return 1; // Cliente com SLA = VIP
  }
  
  if (effortMinutes && effortMinutes < 15 && isUrgent) return 1;
  
  // P2: Prazo < 1 semana ou cliente normal
  if (dueDate) {
    const due = new Date(dueDate);
    const now = new Date();
    const daysUntilDue = (due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    
    if (daysUntilDue < 7) return 2;
  }
  
  if (clientName) return 2; // Cliente = P2
  
  // P3: Padrão
  return 3;
}

export function getClientSLA(clientName: string): string {
  return BUSINESS_RULES.CLIENT_SLA[clientName as keyof typeof BUSINESS_RULES.CLIENT_SLA] || 'sem SLA';
}

export function shouldRequireConfirmation(action: string, taskAge?: number): boolean {
  if (action === 'delete') return true;
  if (action === 'merge') return true;
  if (action === 'edit' && taskAge && taskAge > 3) return true;
  if (action === 'change_due_date') return true;
  
  return false;
}
