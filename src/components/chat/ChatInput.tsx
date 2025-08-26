'use client';

import { useState, useRef } from 'react';
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

      const response = await fetch('/api/audio/transcribe', { method: 'POST', body: formData });
      const result = await response.json();

      if (result.success) {
        setMessage(result.text);
      } else {
        alert('Erro na transcrição do áudio');
      }
    } catch {
      alert('Erro ao processar áudio');
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
    <Box p="4" className="border-t border-gray-800 bg-card">
      <Flex gap="2" align="center">
        <IconButton
          color={isRecording ? 'red' : 'gray'}
          variant={isRecording ? 'soft' : 'ghost'}
          onMouseDown={startRecording}
          onMouseUp={stopRecording}
          onMouseLeave={stopRecording}
          disabled={isProcessing}
          aria-label="Gravar áudio"
        >
          {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </IconButton>

        <Box className="flex-1 relative">
          <TextArea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Digite ou segure 🎤 para falar..."
            disabled={isProcessing}
            rows={1}
            resize="none"
          />
          <Box className="absolute right-2 top-1/2 -translate-y-1/2">
            <IconButton onClick={sendMessage} disabled={!message.trim() || isProcessing} aria-label="Enviar">
              {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </IconButton>
          </Box>
        </Box>
      </Flex>

      {isRecording && (
        <Box mt="2" className="text-center">
          <Box className="inline-flex items-center gap-2 px-3 py-1 bg-red-900/40 text-red-300 rounded-full text-sm">
            <Box className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
            Gravando... Solte para parar
          </Box>
        </Box>
      )}
    </Box>
  );
}
