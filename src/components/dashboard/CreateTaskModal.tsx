'use client';

import React, { useState } from 'react';
import { X, Calendar, Clock, AlertTriangle } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import { cn } from '@/lib/utils';

interface TaskData {
  title: string;
  description: string;
  priority: number;
  due_date: string;
  effort_minutes?: number;
  workspace_id: string;
  project_id?: string;
}

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (taskData: TaskData) => void;
  workspaceId?: string;
  projectId?: string | null;
}

export default function CreateTaskModal({ isOpen, onClose, onSubmit, workspaceId, projectId }: CreateTaskModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 2,
    due_date: '',
    effort_minutes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!workspaceId) {
      newErrors.workspace = 'Selecione um workspace primeiro';
    }
    
    if (!formData.title.trim()) {
      newErrors.title = 'Título é obrigatório';
    }
    
    if (formData.effort_minutes && parseFloat(formData.effort_minutes) <= 0) {
      newErrors.effort_minutes = 'Tempo deve ser maior que zero';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    if (!workspaceId) {
      onClose();
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const payload: TaskData = {
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        due_date: formData.due_date || undefined,
        effort_minutes: formData.effort_minutes ? Math.round(parseFloat(formData.effort_minutes) * 60) : undefined,
        workspace_id: workspaceId,
        project_id: projectId ?? undefined,
      };
      
      await onSubmit(payload);
      onClose();
      setFormData({ title: '', description: '', priority: 2, due_date: '', effort_minutes: '' });
      setErrors({});
    } catch (error) {
      console.error('Erro ao criar tarefa:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <GlassCard className="w-full max-w-md p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Create New Task</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Erro de workspace */}
        {errors.workspace && (
          <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 mb-4">
            <p className="text-red-400 text-sm">{errors.workspace}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-2 text-white">Título da Tarefa</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, title: e.target.value }));
                if (errors.title) setErrors(prev => ({ ...prev, title: '' }));
              }}
              className={`w-full bg-white/5 border rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none transition-colors ${
                errors.title ? 'border-red-500/50 focus:border-red-500' : 'border-white/20 focus:border-blue-500/50'
              }`}
              placeholder="O que precisa ser feito?"
              required
            />
            {errors.title && (
              <p className="text-red-400 text-sm mt-1">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2 text-white">Descrição</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500/50 resize-none"
              placeholder="Adicione detalhes sobre esta tarefa..."
              rows={3}
            />
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium mb-2 text-white">Prioridade</label>
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3].map((priority) => (
                <button
                  key={priority}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, priority }))}
                  className={cn(
                    'p-3 rounded-lg border transition-all',
                    formData.priority === priority
                      ? 'border-blue-500 bg-blue-500/20 text-blue-400'
                      : 'border-white/20 bg-white/5 hover:bg-white/10'
                  )}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <AlertTriangle className="w-4 h-4" />
                    <span>P{priority}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-sm font-medium mb-2 text-white">Data de Vencimento</label>
            <div className="relative">
              <input
                type="date"
                value={formData.due_date}
                onChange={(e) => setFormData(prev => ({ ...prev, due_date: e.target.value }))}
                className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500/50"
              />
              <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            </div>
          </div>

          {/* Effort */}
          <div>
            <label className="block text-sm font-medium mb-2 text-white">Esforço Estimado (horas)</label>
            <div className="relative">
              <input
                type="number"
                min="0.5"
                step="0.5"
                value={formData.effort_minutes}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, effort_minutes: e.target.value }));
                  if (errors.effort_minutes) setErrors(prev => ({ ...prev, effort_minutes: '' }));
                }}
                className={`w-full bg-white/5 border rounded-lg px-4 py-3 text-white focus:outline-none transition-colors ${
                  errors.effort_minutes ? 'border-red-500/50 focus:border-red-500' : 'border-white/20 focus:border-blue-500/50'
                }`}
                placeholder="2.5"
              />
              <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            </div>
            {errors.effort_minutes && (
              <p className="text-red-400 text-sm mt-1">{errors.effort_minutes}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 border border-white/20 rounded-lg text-white hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Criando...' : 'Criar Tarefa'}
            </button>
          </div>
        </form>
      </GlassCard>
    </div>
  );
}
