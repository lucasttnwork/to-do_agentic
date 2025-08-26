'use client'

import { motion } from 'framer-motion'
import { Plus, Filter, MoreHorizontal } from 'lucide-react'
import { useState } from 'react'

export default function TaskBoard() {
  const [filter, setFilter] = useState('all')
  
  const columns = [
    { 
      id: 'todo', 
      title: 'To Do', 
      count: 8, 
      color: 'slate',
      bgColor: 'bg-slate-500/10',
      borderColor: 'border-slate-500/20'
    },
    { 
      id: 'progress', 
      title: 'In Progress', 
      count: 3, 
      color: 'blue',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20'
    },
    { 
      id: 'review', 
      title: 'Review', 
      count: 2, 
      color: 'orange',
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500/20'
    },
    { 
      id: 'done', 
      title: 'Done', 
      count: 12, 
      color: 'green',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/20'
    }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl shadow-2xl shadow-black/20 overflow-hidden relative"
    >
      {/* Background gradient sutil */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-blue-500/5 to-transparent pointer-events-none" />
      {/* Header */}
      <div className="p-8 border-b border-white/10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">Task Board</h2>
            <p className="text-slate-400 mt-1">Organize and track your progress</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-white/5 border border-white/20 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-blue-500/50 backdrop-blur-sm"
            >
              <option value="all">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-2 rounded-xl font-semibold text-white shadow-lg shadow-blue-500/25 flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>New Task</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Kanban Columns */}
      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {columns.map((column, index) => (
            <motion.div
              key={column.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`backdrop-blur-xl bg-white/5 border ${column.borderColor} rounded-2xl overflow-hidden relative shadow-lg shadow-black/10 hover:shadow-xl hover:shadow-black/20 transition-all duration-300 group`}
            >
              {/* Column Header */}
              <div className="p-6 border-b border-white/10 relative z-10">
                {/* Shimmer effect no hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-2xl" />
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full bg-${column.color}-500`} />
                    <h3 className="font-semibold text-white text-lg">{column.title}</h3>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-slate-400 font-medium">{column.count}</span>
                    <button className="p-1 hover:bg-white/10 rounded-lg transition-colors">
                      <MoreHorizontal className="w-4 h-4 text-slate-400" />
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Tasks Area */}
              <div className="p-6">
                <div className="space-y-4 min-h-[300px]">
                  {/* Empty State */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center justify-center h-32 rounded-2xl border-2 border-dashed border-white/20 text-slate-400 hover:border-white/30 hover:bg-white/5 transition-all duration-300 cursor-pointer backdrop-blur-sm"
                  >
                    <div className="text-center">
                      <Plus className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <span className="text-sm font-medium">Add task</span>
                    </div>
                  </motion.div>
                  
                  {/* Sample Task Cards - apenas para visualização */}
                  {column.count > 0 && (
                    <>
                      <motion.div
                        whileHover={{ y: -2 }}
                        className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-4 hover:border-white/20 hover:bg-white/10 transition-all duration-300 shadow-sm hover:shadow-md"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="font-medium text-white text-sm">Review client proposal</h4>
                          <div className="w-2 h-2 bg-red-500 rounded-full" />
                        </div>
                        <p className="text-xs text-slate-400 mb-3">Due tomorrow</p>
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-xs text-white font-semibold">L</span>
                          </div>
                          <span className="text-xs text-slate-400">3 subtasks</span>
                        </div>
                      </motion.div>
                      
                      <motion.div
                        whileHover={{ y: -2 }}
                        className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-4 hover:border-white/20 hover:bg-white/10 transition-all duration-300 shadow-sm hover:shadow-md"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="font-medium text-white text-sm">Update website content</h4>
                          <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                        </div>
                        <p className="text-xs text-slate-400 mb-3">Due Friday</p>
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                            <span className="text-xs text-white font-semibold">A</span>
                          </div>
                          <span className="text-xs text-slate-400">5 subtasks</span>
                        </div>
                      </motion.div>
                    </>
                  )}
                </div>
              </div>
              
              {/* Status Indicator */}
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-${column.color}-500 to-${column.color}-600`} />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
