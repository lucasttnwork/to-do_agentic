'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Mic, Square, Brain, Sparkles } from 'lucide-react'
import { ChatMessage } from '@/types'

interface ChatInterfaceProps {
  workspaceId?: string
  userId?: string
}

export default function ChatInterface({ workspaceId, userId }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Carregar histórico inicial
  useEffect(() => {
    if (workspaceId && userId) {
      loadChatHistory()
    } else {
      // Mensagem de boas-vindas padrão
      setMessages([{
        id: 'welcome',
        role: 'assistant',
        content: 'Bem-vindo ao seu assistente IA! Comece digitando ou gravando uma mensagem para criar tarefas automaticamente. O sistema irá analisar e organizar suas tarefas de forma inteligente.',
        timestamp: new Date().toISOString(),
      }])
    }
  }, [workspaceId, userId])

  const loadChatHistory = async () => {
    try {
      const response = await fetch(`/api/ai/process?workspaceId=${workspaceId}&limit=50`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('supabase.auth.token')}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success && data.messages) {
          setMessages(data.messages)
        }
      }
    } catch (error) {
      console.error('Erro ao carregar histórico:', error)
      // Mensagem de boas-vindas em caso de erro
      setMessages([{
        id: 'welcome',
        role: 'assistant',
        content: 'Bem-vindo ao seu assistente IA! Comece digitando ou gravando uma mensagem para criar tarefas automaticamente. O sistema irá analisar e organizar suas tarefas de forma inteligente.',
        timestamp: new Date().toISOString(),
      }])
    }
  }

  const sendMessage = async () => {
    if (!inputValue.trim() || !workspaceId || !userId) return

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: inputValue,
      timestamp: new Date().toISOString(),
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsProcessing(true)

    try {
      const response = await fetch('/api/ai/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('supabase.auth.token')}`,
        },
        body: JSON.stringify({
          content: inputValue,
          workspaceId,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success && data.message) {
          setMessages(prev => [...prev, data.message])
          
          // Se uma tarefa foi criada, você pode atualizar o dashboard aqui
          if (data.task) {
            // Emitir evento para atualizar o dashboard
            window.dispatchEvent(new CustomEvent('taskCreated', { detail: data.task }))
          }
        } else {
          // Mensagem de erro
          const errorMessage: ChatMessage = {
            id: crypto.randomUUID(),
            role: 'assistant',
            content: data.error || 'Erro ao processar sua mensagem. Tente novamente.',
            timestamp: new Date().toISOString(),
          }
          setMessages(prev => [...prev, errorMessage])
        }
      } else {
        throw new Error('Erro na requisição')
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error)
      const errorMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: 'Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente.',
        timestamp: new Date().toISOString(),
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsProcessing(false)
    }
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className="h-[500px] backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl shadow-2xl shadow-black/20 flex flex-col overflow-hidden relative"
    >
      {/* Background gradient */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-blue-500/10 to-transparent pointer-events-none" />
      
      {/* Header */}
      <div className="p-8 border-b border-white/10 relative z-10">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/25">
              <Brain className="w-7 h-7 text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-3 border-slate-950 rounded-full">
              <div className="w-full h-full bg-green-400 rounded-full animate-ping" />
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white flex items-center">
              AI Assistant
              <Sparkles className="w-5 h-5 ml-2 text-blue-400" />
            </h2>
            <p className="text-slate-400 text-sm">NTEX • Academia SP</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-auto p-8 space-y-6">
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] ${
                message.role === 'user'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                  : 'backdrop-blur-sm bg-white/10 border border-white/20 text-slate-100 shadow-lg'
              } rounded-2xl px-6 py-4 relative overflow-hidden`}>
                
                {/* Message content */}
                <div 
                  className="relative z-10 leading-relaxed"
                  dangerouslySetInnerHTML={{ 
                    __html: message.content.replace(/\n/g, '<br/>') 
                  }}
                />
                
                {/* Timestamp */}
                <span className="text-xs opacity-60 mt-3 block relative z-10">
                  {formatTimestamp(message.timestamp)}
                </span>
                
                {/* Glow effect for user messages */}
                {message.role === 'user' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-xl" />
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Processing Indicator */}
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex justify-start"
          >
            <div className="backdrop-blur-sm bg-white/10 border border-white/20 rounded-2xl px-6 py-4 shadow-lg">
              <div className="flex items-center space-x-3">
                <div className="flex space-x-2">
                  {[0, 1, 2].map(i => (
                    <div
                      key={i}
                      className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                      style={{ animationDelay: `${i * 0.2}s` }}
                    />
                  ))}
                </div>
                <span className="text-slate-300">IA está pensando...</span>
              </div>
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-8 border-t border-white/10 relative">
        <div className="flex items-end space-x-4">
          <div className="flex-1 relative">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Digite ou segure para falar..."
              className="w-full bg-white/5 border border-white/20 rounded-2xl px-6 py-4 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 backdrop-blur-sm resize-none transition-all duration-200"
              rows={3}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  sendMessage()
                }
              }}
              disabled={isProcessing}
            />
          </div>
          
          <div className="flex flex-col space-y-3">
            {/* Mic Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onMouseDown={() => setIsRecording(true)}
              onMouseUp={() => setIsRecording(false)}
              disabled={isProcessing}
              className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-200 ${
                isRecording
                  ? 'bg-red-500 text-white shadow-red-500/25'
                  : 'bg-white/5 border border-white/20 text-slate-300 hover:bg-white/10 backdrop-blur-sm'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isRecording ? <Square className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
            </motion.button>

            {/* Send Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={sendMessage}
              disabled={!inputValue.trim() || isProcessing}
              className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-6 h-6 text-white" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
