'use client';

import { useState, useRef } from 'react';
import { Send, Mic, Square } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  taskId?: string;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const sendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsProcessing(true);

    try {
      // Chamar API de processamento de IA
      const response = await fetch('/api/ai/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputValue,
          workspace_id: 'personal' // Temporário
        }),
      });

      const result = await response.json();

      if (result.success) {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `✅ Criei a tarefa "${result.task?.title || 'Nova tarefa'}" com prioridade P${result.task?.priority || 2}. ${result.task?.description || ''}`,
          timestamp: new Date(),
          taskId: result.task?.id
        };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: '❌ Desculpe, houve um erro ao processar sua solicitação.',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '❌ Erro de conexão. Tente novamente.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleVoiceRecording = async () => {
    if (!isRecording) {
      setIsRecording(true);
      // Implementar gravação de áudio aqui
    } else {
      setIsRecording(false);
      // Parar gravação e enviar para transcrição
    }
  };

  return (
    <div className="h-full flex flex-col">
      <GlassCard className="flex-1 flex flex-col p-0 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <h2 className="text-xl font-semibold flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-3 animate-pulse" />
            AI Assistant
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Capture tasks naturally with voice or text
          </p>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-auto p-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                'flex',
                message.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              <div className={cn(
                'max-w-[80%] rounded-2xl px-4 py-3',
                message.role === 'user'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                  : 'backdrop-blur-sm bg-white/5 border border-white/10 text-slate-100'
              )}>
                <p>{message.content}</p>
                <span className="text-xs opacity-70 mt-1 block">
                  {message.timestamp.toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))}

          {/* Processing Indicator */}
          {isProcessing && (
            <div className="flex justify-start">
              <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl px-4 py-3">
                <div className="flex items-center space-x-2">
                  <LoadingSpinner size="sm" />
                  <span className="text-slate-300">Processing...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-6 border-t border-white/10">
          <div className="flex items-end space-x-3">
            <div className="flex-1 relative">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Describe your task or say what you need to do..."
                className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 backdrop-blur-sm resize-none"
                rows={1}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
              />
            </div>
            
            <button
              onMouseDown={() => setIsRecording(true)}
              onMouseUp={() => setIsRecording(false)}
              className={cn(
                'p-3 rounded-xl transition-all duration-200',
                isRecording
                  ? 'bg-red-500 text-white'
                  : 'bg-white/5 border border-white/20 text-slate-300 hover:bg-white/10'
              )}
            >
              {isRecording ? <Square className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            <button
              onClick={sendMessage}
              disabled={!inputValue.trim()}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-3 rounded-xl hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
