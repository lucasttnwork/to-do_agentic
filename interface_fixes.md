# CURSOR: CORREÇÕES URGENTES DA INTERFACE

## PROBLEMA 1: CORES INCONSISTENTES NOS CARDS DE ESTATÍSTICA

### CORRIJA IMEDIATAMENTE:

```tsx
// TODOS os cards de estatística devem usar APENAS azul/roxo/neutro

// Card "Total Tasks" - CORRETO, manter
<div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20">
  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl">
    <Target className="w-6 h-6 text-white" />
  </div>
</div>

// Card "Completed" - CORRIGIR: remover verde
<div className="bg-gradient-to-br from-blue-600/10 to-blue-700/10 border border-blue-600/20">
  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl">
    <CheckCircle className="w-6 h-6 text-white" />
  </div>
</div>

// Card "In Progress" - CORRETO, manter roxo
<div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/20">
  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl">
    <Clock className="w-6 h-6 text-white" />
  </div>
</div>

// Card "High Priority" - CORRIGIR: remover laranja/amarelo
<div className="bg-gradient-to-br from-red-500/10 to-purple-500/10 border border-red-500/20">
  <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-purple-500 rounded-xl">
    <AlertTriangle className="w-6 h-6 text-white" />
  </div>
</div>
```

## PROBLEMA 2: TASK CARD SEM GLASSMORPHISM PREMIUM

### SUBSTITUA A TASK CARD ATUAL POR:

```tsx
// A task card na direita está muito básica
// Implemente este design premium:

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  whileHover={{ y: -4, scale: 1.01 }}
  className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl shadow-black/10 hover:shadow-blue-500/10 transition-all duration-300 relative overflow-hidden group"
>
  {/* Background glow effect */}
  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
  
  {/* Priority indicator - sutil */}
  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-t-2xl" />
  
  <div className="relative z-10">
    {/* Header da task */}
    <div className="flex items-start justify-between mb-4">
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-white mb-2">
          Criar campanha Instagram Academia SP
        </h3>
        <p className="text-slate-400 text-sm leading-relaxed">
          Desenvolver campanha para redes sociais da academia
        </p>
      </div>
      
      {/* Status badge */}
      <div className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-xs font-medium border border-purple-500/30 backdrop-blur-sm">
        P2 • Normal
      </div>
    </div>
    
    {/* Metadata */}
    <div className="flex items-center justify-between text-xs text-slate-400 mb-4">
      <span>Concluído: 21/02/2025</span>
      <span>4h estimado</span>
    </div>
    
    {/* Subtasks checklist */}
    <div className="space-y-2 mb-4">
      <div className="flex items-center space-x-3">
        <div className="w-4 h-4 bg-green-500/20 border border-green-500/50 rounded flex items-center justify-center">
          <Check className="w-3 h-3 text-green-400" />
        </div>
        <span className="text-slate-300 text-sm line-through opacity-60">Briefing com cliente</span>
      </div>
      
      <div className="flex items-center space-x-3">
        <div className="w-4 h-4 bg-green-500/20 border border-green-500/50 rounded flex items-center justify-center">
          <Check className="w-3 h-3 text-green-400" />
        </div>
        <span className="text-slate-300 text-sm line-through opacity-60">Criar conceito visual</span>
      </div>
      
      <div className="flex items-center space-x-3">
        <div className="w-4 h-4 border border-slate-600 rounded"></div>
        <span className="text-slate-300 text-sm">Produzir conteúdo</span>
      </div>
    </div>
    
    {/* Progress bar */}
    <div className="mb-4">
      <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
        <span>Progresso</span>
        <span>67%</span>
      </div>
      <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" style={{width: '67%'}}></div>
      </div>
    </div>
    
    {/* Footer */}
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
          <span className="text-xs text-white font-semibold">K</span>
        </div>
        <span className="text-slate-400 text-sm">Kabbatec</span>
      </div>
      
      <div className="flex items-center space-x-2">
        <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
          <MoreHorizontal className="w-4 h-4 text-slate-400" />
        </button>
      </div>
    </div>
  </div>
</motion.div>
```

## PROBLEMA 3: ÁREA VAZIA PRECISA DE CARDS ADICIONAIS

### ADICIONE MAIS TASKS NA LISTA:

```tsx
// Crie 2-3 cards adicionais para preencher o espaço
// Use este template variando apenas conteúdo e progresso:

<motion.div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl hover:shadow-blue-500/10 transition-all duration-300">
  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-t-2xl" />
  
  <div className="flex items-start justify-between mb-3">
    <h3 className="text-white font-semibold">Reunião planejamento NTEX</h3>
    <span className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded text-xs">P1 • Alta</span>
  </div>
  
  <p className="text-slate-400 text-sm mb-4">Definir roadmap do próximo trimestre</p>
  
  <div className="flex items-center justify-between text-xs text-slate-400">
    <span>Hoje, 14:00</span>
    <span>1h</span>
  </div>
</motion.div>
```

## PROBLEMA 4: BOTÕES DE FILTRO INCONSISTENTES

### CORRIJA OS BOTÕES DE FILTRO:

```tsx
// Botão ativo
<button className="bg-blue-500/20 text-blue-300 px-4 py-2 rounded-xl border border-blue-500/30 font-medium text-sm backdrop-blur-sm">
  Lista
</button>

// Botões inativos
<button className="bg-white/5 text-slate-400 px-4 py-2 rounded-xl border border-white/10 font-medium text-sm hover:bg-white/10 hover:text-slate-300 transition-all backdrop-blur-sm">
  Kanban
</button>
```

## PROBLEMA 5: CHAT AREA PRECISA MELHORAR

### CORRIJA O CHAT:

```tsx
// Container principal do chat
<div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl shadow-xl shadow-black/10 h-full flex flex-col">
  
  {/* Header */}
  <div className="p-6 border-b border-white/10">
    <div className="flex items-center space-x-3">
      <div className="relative">
        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
          <Brain className="w-5 h-5 text-white" />
        </div>
        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-slate-900 rounded-full"></div>
      </div>
      <div>
        <h3 className="text-white font-semibold">AI Assistant</h3>
        <p className="text-slate-400 text-sm">NTEX • Academia SP</p>
      </div>
    </div>
  </div>
  
  {/* Messages area com melhor padding */}
  <div className="flex-1 p-6 space-y-4 overflow-auto">
    {/* Messages aqui */}
  </div>
  
  {/* Input com botões premium */}
  <div className="p-6 border-t border-white/10">
    <div className="flex items-center space-x-3">
      <div className="flex-1 relative">
        <input 
          placeholder="Digite ou segure para falar..."
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 backdrop-blur-sm"
        />
      </div>
      
      <button className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg hover:shadow-purple-500/25 transition-all">
        <Mic className="w-5 h-5 text-white" />
      </button>
      
      <button className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg hover:shadow-blue-500/25 transition-all">
        <Send className="w-5 h-5 text-white" />
      </button>
    </div>
  </div>
</div>
```

## IMPLEMENTAÇÃO PRIORITÁRIA

1. **PRIMEIRO**: Corrigir cores dos cards de estatística (remover verde/laranja)
2. **SEGUNDO**: Implementar task cards premium com glassmorphism
3. **TERCEIRO**: Adicionar 2-3 cards para preencher espaço vazio
4. **QUARTO**: Corrigir botões de filtro
5. **QUINTO**: Melhorar área do chat

## RESULTADO ESPERADO

Após essas correções:
- Paleta completamente consistente (apenas azul/roxo/neutro + vermelho sutil para prioridade)
- Task cards com visual premium e glassmorphism
- Área de conteúdo preenchida adequadamente
- Botões e controles consistentes
- Interface que transmite profissionalismo e sofisticação tech

**CURSOR: Implemente EXATAMENTE essas correções na ordem especificada.**