'use client';

import React, { useState, useRef } from 'react';
import { useAppStore } from '@/lib/store';
import { ChatMessage } from '@/types';
import { generateId } from '@/lib/utils';
import { Send, Mic, MicOff, Loader2 } from 'lucide-react';
import { TextArea, IconButton, Flex, Box } from '@radix-ui/themes';

export function ChatInput() {
  const { 
    addMessage, 
    setIsLoading, 
    isRecording, 
    setIsRecording,
    currentWorkspace 
  } = useAppStore();
  
  const [message, setMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const sendMessage = async () => {
    if (!message.trim() || !currentWorkspace) return;

    const userMessage: ChatMessage = {
      id: generateId(),
      role: 'user',
      content: message.trim(),
      timestamp: new Date().toISOString(),
    };

    addMessage(userMessage);
    setMessage('');
    setIsLoading(true);
    setIsProcessing(true);

    try {
      const response = await fetch('/api/ai/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage.content, workspace_id: currentWorkspace.id }),
      });
      const result = await response.json();

      if (result.success) {
        const assistantMessage: ChatMessage = {
          id: generateId(),
          role: 'assistant',
          content: `✅ Criei a tarefa "${result.task.title}" com prioridade P${result.task.priority}. ${result.task.due_date ? `Prazo: ${new Date(result.task.due_date).toLocaleDateString('pt-BR')}` : ''}`,
          timestamp: new Date().toISOString(),
          action: 'task_created',
          task_id: result.task.id,
        };
        addMessage(assistantMessage);
      } else {
        addMessage({ id: generateId(), role: 'assistant', content: `❌ Erro ao processar: ${result.error}`, timestamp: new Date().toISOString() });
      }
    } catch {
      addMessage({ id: generateId(), role: 'assistant', content: '❌ Erro de conexão. Tente novamente.', timestamp: new Date().toISOString() });
    } finally {
      setIsLoading(false);
      setIsProcessing(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        await processAudio(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      alert('Erro ao acessar microfone. Verifique as permissões.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const processAudio = async (audioBlob: Blob) => {
    setIsLoading(true);
    setIsProcessing(true);

    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.wav');
      formData.append('workspace_id', currentWorkspace?.id || '');

      const response = await fetch('/api/audio/transcribe', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setMessage(result.text);
        // Processar automaticamente a transcrição
        const userMessage: ChatMessage = {
          id: generateId(),
          role: 'user',
          content: result.text,
          timestamp: new Date().toISOString(),
        };
        addMessage(userMessage);
        
        // Processar com IA
        const aiResponse = await fetch('/api/ai/process', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: result.text, workspace_id: currentWorkspace?.id }),
        });
        
        const aiResult = await aiResponse.json();
        
        if (aiResult.success) {
          const assistantMessage: ChatMessage = {
            id: generateId(),
            role: 'assistant',
            content: `✅ Criei a tarefa "${aiResult.task.title}" com prioridade P${aiResult.task.priority}. ${aiResult.task.due_date ? `Prazo: ${new Date(aiResult.task.due_date).toLocaleDateString('pt-BR')}` : ''}`,
            timestamp: new Date().toISOString(),
            action: 'task_created',
            task_id: aiResult.task.id,
          };
          addMessage(assistantMessage);
        } else {
          addMessage({ id: generateId(), role: 'assistant', content: `❌ Erro ao processar áudio: ${aiResult.error}`, timestamp: new Date().toISOString() });
        }
      } else {
        addMessage({ id: generateId(), role: 'assistant', content: `❌ Erro na transcrição: ${result.error}`, timestamp: new Date().toISOString() });
      }
    } catch (error) {
      addMessage({ id: generateId(), role: 'assistant', content: '❌ Erro ao processar áudio. Tente novamente.', timestamp: new Date().toISOString() });
    } finally {
      setIsLoading(false);
      setIsProcessing(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Box p="4" className="border-t border-slate-700/30">
      <Flex gap="3" align="end">
        <Box className="flex-1">
          <TextArea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Digite ou segure para falar..."
            className="min-h-[60px] bg-white/5 border border-white/20 text-white placeholder-slate-400 focus:border-blue-500/50"
            disabled={isProcessing}
          />
        </Box>
        
        <Flex direction="column" gap="2">
          {/* Botão de gravação */}
          <IconButton
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isProcessing}
            className={`w-12 h-12 ${
              isRecording 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : 'bg-white/5 border border-white/20 text-slate-300 hover:bg-white/10 hover:text-white'
            } transition-all`}
          >
            {isRecording ? <MicOff /> : <Mic />}
          </IconButton>
          
          {/* Botão de envio */}
          <IconButton
            onClick={sendMessage}
            disabled={!message.trim() || isProcessing}
            className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50"
          >
            {isProcessing ? <Loader2 className="animate-spin" /> : <Send />}
          </IconButton>
        </Flex>
      </Flex>
    </Box>
  );
}
