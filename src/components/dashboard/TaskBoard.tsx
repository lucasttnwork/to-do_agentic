'use client'

import { motion } from 'framer-motion'
import { Plus, MoreHorizontal } from 'lucide-react'
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
      color: 'purple',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20'
    },
    { 
      id: 'done', 
      title: 'Done', 
      count: 12, 
      color: 'blue',
      bgColor: 'bg-blue-600/10',
      borderColor: 'border-blue-600/20'
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
                  <h3 className="text-lg font-semibold text-white">{column.title}</h3>
                  <span className="text-sm text-slate-400 bg-slate-800/50 px-3 py-1 rounded-full border border-slate-600/30">
                    {column.count}
                  </span>
                </div>
                
                {/* Progress bar sutil */}
                <div className="h-1 bg-slate-700/50 rounded-full overflow-hidden">
                  <div className={`h-full bg-gradient-to-r ${column.borderColor.replace('border-', 'from-').replace('/20', '')} to-transparent rounded-full`} style={{width: `${Math.min(column.count * 10, 100)}%`}}></div>
                </div>
              </div>
              
              {/* Column Content */}
              <div className="p-6">
                <div className="space-y-3">
                  {/* Placeholder cards */}
                  {Array.from({ length: Math.min(column.count, 3) }).map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 + i * 0.1 }}
                      className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-4 hover:border-white/20 transition-all cursor-pointer group"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="w-3 h-3 bg-slate-600 rounded-full mt-1"></div>
                        <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreHorizontal className="w-4 h-4 text-slate-400" />
                        </button>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="h-3 bg-slate-700/50 rounded w-3/4"></div>
                        <div className="h-2 bg-slate-700/30 rounded w-1/2"></div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex space-x-1">
                          <div className="w-6 h-6 bg-slate-700/50 rounded-full"></div>
                        </div>
                        <div className="text-xs text-slate-500">
                          {Math.floor(Math.random() * 24) + 1}h
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  
                  {/* Add task button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    className="w-full p-3 border-2 border-dashed border-slate-600/30 rounded-xl text-slate-400 hover:text-slate-300 hover:border-slate-500/50 transition-all group"
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      <span className="text-sm font-medium">Add Task</span>
                    </div>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
