'use client'

import { motion } from 'framer-motion'
import { CheckCircle, Clock, AlertTriangle, Target } from 'lucide-react'
import { useEffect, useState } from 'react'

function AnimatedCounter({ value, duration = 1000 }: { value: number, duration?: number }) {
  const [count, setCount] = useState(0)
  
  useEffect(() => {
    const startTime = Date.now()
    const endTime = startTime + duration
    
    const updateCount = () => {
      const now = Date.now()
      const progress = Math.min((now - startTime) / duration, 1)
      setCount(Math.floor(progress * value))
      
      if (now < endTime) {
        requestAnimationFrame(updateCount)
      }
    }
    
    updateCount()
  }, [value, duration])
  
  return <span>{count}</span>
}

export default function StatsCards() {
  const stats = [
    {
      title: "Total Tasks",
      value: 24,
      icon: Target,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
      shadowColor: "shadow-blue-500/25"
    },
    {
      title: "Completed",
      value: 18,
      icon: CheckCircle,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/20",
      shadowColor: "shadow-green-500/25"
    },
    {
      title: "In Progress",
      value: 4,
      icon: Clock,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-500/10",
      borderColor: "border-orange-500/20",
      shadowColor: "shadow-orange-500/25"
    },
    {
      title: "High Priority",
      value: 2,
      icon: AlertTriangle,
      color: "from-red-500 to-red-600",
      bgColor: "bg-red-500/10",
      borderColor: "border-red-500/20",
      shadowColor: "shadow-red-500/25"
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          whileHover={{ y: -8, scale: 1.02 }}
          className={`backdrop-blur-xl bg-white/5 border ${stat.borderColor} rounded-3xl p-8 shadow-2xl ${stat.shadowColor} hover:shadow-xl transition-all duration-300 relative overflow-hidden group`}
        >
          {/* Background glow effect */}
          <div className={`absolute inset-0 ${stat.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl`} />
          
          {/* Shimmer effect */}
          <div className="absolute inset-0 -top-10 -left-10 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent rotate-12 transform scale-x-150 group-hover:animate-pulse" />
          
          <div className="relative z-10">
            {/* Icon */}
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${stat.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
              <stat.icon className="w-8 h-8 text-white" />
            </div>
            
            {/* Number */}
            <div className="text-4xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent mb-3">
              <AnimatedCounter value={stat.value} />
            </div>
            
            {/* Label */}
            <div className="text-slate-400 font-medium text-lg">
              {stat.title}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
