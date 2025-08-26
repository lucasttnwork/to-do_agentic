# 🎯 CURSOR: CONSTRUA O TASKFLOW AI COMPLETO

## PARTE 1: LANDING PAGE PREMIUM
Primeiro, implemente a landing page premium usando EXATAMENTE os componentes que forneci acima.

## PARTE 2: APLICAÇÃO PRINCIPAL COM UI PREMIUM

### ESTRUTURA DO PROJETO:
```
/src
  /app
    /(auth)
      /login
        page.tsx          # Login com glassmorphism
      /register  
        page.tsx          # Registro premium
    /dashboard
      page.tsx            # Dashboard principal
      layout.tsx          # Layout com sidebar animado
    /api
      /ai
        /process/route.ts # Pipeline de agentes
      /tasks
        /route.ts         # CRUD tarefas
      /audio
        /transcribe/route.ts # Whisper
    globals.css
    layout.tsx
    page.tsx             # Landing page
  /components
    /ui                  # Componentes base (ja criados)
    /dashboard
      Sidebar.tsx        # Navigation animada
      ChatInterface.tsx  # Chat com IA
      TaskBoard.tsx      # Kanban premium
      TaskList.tsx       # Lista com filtros
    /auth
      LoginForm.tsx      # Form glassmorphism
    /shared
      LoadingSpinner.tsx # Spinners animados
  /lib
    /ai
      agents.ts          # 4 agentes de IA
    supabase.ts
    utils.ts
```

### APLICAR DESIGN PREMIUM EM TODA A APLICAÇÃO:

#### 1. DASHBOARD LAYOUT - GLASSMORPHISM + PARTÍCULAS
```tsx
// /src/app/dashboard/layout.tsx
'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ParticlesBackground from '@/components/shared/ParticlesBackground'
import Sidebar from '@/components/dashboard/Sidebar'
import { cn } from '@/lib/utils'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden">
      {/* Background Effects */}
      <ParticlesBackground />
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      
      {/* Gradient Overlays */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      
      <div className="relative z-40 flex h-screen">
        {/* Animated Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="w-80 flex-shrink-0"
            >
              <Sidebar onClose={() => setSidebarOpen(false)} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Bar */}
          <div className="h-16 backdrop-blur-xl bg-white/5 border-b border-white/10 flex items-center px-6">
            {!sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Page Content */}
          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
```

#### 2. SIDEBAR COM GLASSMORPHISM
```tsx
// /src/components/dashboard/Sidebar.tsx
'use client'

import { motion } from 'framer-motion'
import { Brain, Home, MessageSquare, Calendar, Settings, X } from 'lucide-react'
import GlassCard from '@/components/ui/GlassCard'

interface SidebarProps {
  onClose: () => void
}

export default function Sidebar({ onClose }: SidebarProps) {
  const workspaces = [
    { id: 1, name: 'Personal', type: 'personal', color: 'blue' },
    { id: 2, name: 'NTEX', type: 'client', color: 'purple' },
    { id: 3, name: 'Kabbatec', type: 'client', color: 'green' }
  ]

  const menuItems = [
    { icon: Home, label: 'Dashboard', active: true },
    { icon: MessageSquare, label: 'Chat', active: false },
    { icon: Calendar, label: 'Calendar', active: false },
    { icon: Settings, label: 'Settings', active: false }
  ]

  return (
    <div className="h-full p-4">
      <GlassCard className="h-full p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold">TaskFlow AI</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/10 rounded transition-colors lg:hidden"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="space-y-2 mb-8">
          {menuItems.map((item, index) => (
            <motion.a
              key={item.label}
              href="#"
              whileHover={{ x: 4 }}
              className={cn(
                'flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200',
                item.active 
                  ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 text-white' 
                  : 'hover:bg-white/5 text-slate-300 hover:text-white'
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </motion.a>
          ))}
        </nav>

        {/* Workspaces */}
        <div>
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
            Workspaces
          </h3>
          <div className="space-y-2">
            {workspaces.map((workspace) => (
              <motion.div
                key={workspace.id}
                whileHover={{ x: 4 }}
                className="flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-white/5 transition-all cursor-pointer"
              >
                <div className={`w-3 h-3 rounded-full bg-${workspace.color}-500`} />
                <span className="text-slate-300 hover:text-white transition-colors">
                  {workspace.name}
                </span>
                <span className="text-xs text-slate-500 ml-auto">
                  {workspace.type === 'client' ? '👔' : '🏠'}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-auto pt-6">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
          >
            + New Task
          </motion.button>
        </div>
      </GlassCard>
    </div>
  )
}
```

#### 3. CHAT INTERFACE PREMIUM
```tsx
// /src/components/dashboard/ChatInterface.tsx
'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Mic, Square } from 'lucide-react'
import GlassCard from '@/components/ui/GlassCard'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  taskId?: string
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const sendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsProcessing(true)

    // Simulate AI processing
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '✅ Criei a tarefa "Orçar campanha Meta Ads - Academia SP (Kabbatec)" com prioridade P1, prazo sexta 17h. Adicionei 4 subtarefas automaticamente.',
        timestamp: new Date(),
        taskId: 'task-123'
      }
      setMessages(prev => [...prev, aiMessage])
      setIsProcessing(false)
    }, 2000)
  }

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
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
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
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Processing Indicator */}
          {isProcessing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl px-4 py-3">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-200" />
                  </div>
                  <span className="text-slate-300">Processing...</span>
                </div>
              </div>
            </motion.div>
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
                    e.preventDefault()
                    sendMessage()
                  }
                }}
              />
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
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
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={sendMessage}
              disabled={!inputValue.trim()}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-3 rounded-xl hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </GlassCard>
    </div>
  )
}
```

### INSTRUÇÕES FINAIS PARA CURSOR:

1. **IMPLEMENTE PRIMEIRO**: Landing page premium com todos os efeitos visuais
2. **CONFIGURE**: Supabase + Auth + Database schema exato
3. **DESENVOLVA**: Dashboard com glassmorphism + partículas em background
4. **INTEGRE**: Sistema de IA com os 4 agentes (Intake → Linker → Planner → Prioritizer)
5. **ADICIONE**: Interface de chat com transcrição de áudio via Whisper
6. **TESTE**: Fluxo completo de criação de tarefas por voz e texto
7. **OTIMIZE**: Performance e responsividade

### RESULTADO FINAL ESPERADO:
- ✅ Landing page premium igual à referência visual
- ✅ Dashboard com glassmorphism e efeitos de partículas
- ✅ Chat conversacional com IA funcional
- ✅ Sistema de captura por áudio
- ✅ Organização automática de tarefas
- ✅ Interface fluida e moderna
- ✅ Animações e micro-interações de qualidade premium

**CURSOR: Execute este projeto completo mantendo o mais alto padrão visual em todos os componentes!**