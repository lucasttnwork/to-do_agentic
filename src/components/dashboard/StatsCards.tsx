'use client'

import { CheckCircle, Clock, AlertTriangle, Target } from 'lucide-react'
import { useEffect, useState } from 'react'
import { SimpleStatsCard } from '@/components/premium/Glass/SimpleStatsCard'

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
      icon: <Target className="w-8 h-8 text-white" />,
      gradient: "from-blue-500 via-blue-600 to-purple-500"
    },
    {
      title: "Completed",
      value: 18,
      icon: <CheckCircle className="w-8 h-8 text-white" />,
      gradient: "from-green-400 via-blue-400 to-cyan-400"
    },
    {
      title: "In Progress",
      value: 4,
      icon: <Clock className="w-8 h-8 text-white" />,
      gradient: "from-purple-500 via-pink-500 to-purple-600"
    },
    {
      title: "High Priority",
      value: 2,
      icon: <AlertTriangle className="w-8 h-8 text-white" />,
      gradient: "from-orange-400 via-red-400 to-pink-400"
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
      {stats.map((stat, index) => (
        <SimpleStatsCard
          key={stat.title}
          title={stat.title}
          value={<AnimatedCounter value={stat.value} />}
          icon={stat.icon}
          gradient={stat.gradient}
        />
      ))}
    </div>
  )
}
