import { create } from 'zustand';
import { Task, ChatMessage, Workspace, Project, User } from '@/types';

interface AppState {
  // Usuário atual
  user: User | null;
  setUser: (user: User | null) => void;
  
  // Workspace atual
  currentWorkspace: Workspace | null;
  setCurrentWorkspace: (workspace: Workspace | null) => void;
  
  // Projeto atual
  currentProject: Project | null;
  setCurrentProject: (project: Project | null) => void;
  
  // Tarefas
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  
  // Chat
  messages: ChatMessage[];
  addMessage: (message: ChatMessage) => void;
  clearMessages: () => void;
  
  // UI State
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  
  // Audio recording
  isRecording: boolean;
  setIsRecording: (recording: boolean) => void;
  
  // View mode
  viewMode: 'list' | 'kanban' | 'timeline';
  setViewMode: (mode: 'list' | 'kanban' | 'timeline') => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Usuário
  user: null,
  setUser: (user) => set({ user }),
  
  // Workspace
  currentWorkspace: null,
  setCurrentWorkspace: (workspace) => set({ currentWorkspace: workspace }),
  
  // Projeto
  currentProject: null,
  setCurrentProject: (project) => set({ currentProject: project }),
  
  // Tarefas
  tasks: [],
  setTasks: (tasks) => set({ tasks }),
  addTask: (task) => set((state) => ({ 
    tasks: [...state.tasks, task] 
  })),
  updateTask: (id, updates) => set((state) => ({
    tasks: state.tasks.map(task => 
      task.id === id ? { ...task, ...updates } : task
    )
  })),
  deleteTask: (id) => set((state) => ({
    tasks: state.tasks.filter(task => task.id !== id)
  })),
  
  // Chat
  messages: [],
  addMessage: (message) => set((state) => ({
    messages: [...state.messages, message]
  })),
  clearMessages: () => set({ messages: [] }),
  
  // UI State
  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),
  
  // Audio recording
  isRecording: false,
  setIsRecording: (recording) => set({ isRecording: recording }),
  
  // View mode
  viewMode: 'list',
  setViewMode: (mode) => set({ viewMode: mode }),
}));
