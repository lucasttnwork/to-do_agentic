'use client'

import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { motion } from 'framer-motion'
import ProductivityBackground3D from '@/components/3d/ProductivityBackground3D'
import StatsCards from '@/components/dashboard/StatsCards'
import ChatInterface from '@/components/dashboard/ChatInterface'
import TaskBoard from '@/components/dashboard/TaskBoard'

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      {/* Background 3D Canvas - Camada 1 */}
      <div className="fixed inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
          <Suspense fallback={null}>
            <ProductivityBackground3D />
          </Suspense>
        </Canvas>
      </div>

      {/* Grid overlay sutil */}
      <div className="fixed inset-0 bg-grid-pattern opacity-5 z-10" />
      
      {/* Main Content - Camada superior */}
      <div className="relative z-20">
        {/* Header espaçado */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8"
        >
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                Welcome back, Lucas
              </h1>
              <p className="text-slate-400 mt-1">Ready to organize your tasks with AI</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 rounded-xl font-semibold text-white shadow-lg shadow-blue-500/25"
            >
              + New Task
            </motion.button>
          </div>
        </motion.header>

        {/* Stats Cards - Seção própria com espaço */}
        <section className="px-8 mb-16">
          <div className="max-w-7xl mx-auto">
            <StatsCards />
          </div>
        </section>

        {/* AI Assistant - Seção dedicada e espaçosa */}
        <section className="px-8 mb-16">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center mb-12"
            >
              <h2 className="text-2xl font-bold text-white mb-4">AI-Powered Task Management</h2>
              <p className="text-slate-400 text-lg">Your intelligent assistant for organizing and prioritizing tasks</p>
            </motion.div>
            <ChatInterface />
          </div>
        </section>

        {/* Task Board - Seção dedicada e espaçosa */}
        <section className="px-8 mb-16">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-center mb-12"
            >
              <h2 className="text-2xl font-bold text-white mb-4">Task Organization & Progress</h2>
              <p className="text-slate-400 text-lg">Visualize and manage your workflow with our intuitive kanban board</p>
            </motion.div>
            <TaskBoard />
          </div>
        </section>

        {/* Bottom spacing */}
        <div className="h-20" />
      </div>
    </div>
  )
}
