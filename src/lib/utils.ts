import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function formatDateTime(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatTime(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getPriorityColor(priority: 1 | 2 | 3): string {
  switch (priority) {
    case 1:
      return 'text-red-600 bg-red-50 border-red-200';
    case 2:
      return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    case 3:
      return 'text-green-600 bg-green-50 border-green-200';
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200';
  }
}

export function getPriorityLabel(priority: 1 | 2 | 3): string {
  switch (priority) {
    case 1:
      return 'P1 - Urgente';
    case 2:
      return 'P2 - Normal';
    case 3:
      return 'P3 - Baixa';
    default:
      return 'Sem prioridade';
  }
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'todo':
      return 'text-gray-600 bg-gray-50 border-gray-200';
    case 'in_progress':
      return 'text-blue-600 bg-blue-50 border-blue-200';
    case 'done':
      return 'text-green-600 bg-green-50 border-green-200';
    case 'archived':
      return 'text-purple-600 bg-purple-50 border-purple-200';
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200';
  }
}

export function getStatusLabel(status: string): string {
  switch (status) {
    case 'todo':
      return 'A fazer';
    case 'in_progress':
      return 'Em andamento';
    case 'done':
      return 'Concluído';
    case 'archived':
      return 'Arquivado';
    default:
      return 'Desconhecido';
  }
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}min`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return `${hours}h`;
  }
  
  return `${hours}h ${remainingMinutes}min`;
}

export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}
