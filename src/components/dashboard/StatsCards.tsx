'use client'

import { CheckCircle, Clock, AlertTriangle, Target } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useAppStore } from '@/lib/store'
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
  const { tasks } = useAppStore();

  const stats = useMemo(() => {
    const total = tasks.length;
    const done = tasks.filter(t => t.status === 'done').length;
    const inProgress = tasks.filter(t => t.status === 'in_progress').length;
    const highPriority = tasks.filter(t => t.priority === 1).length;

    return [
      {
        title: 'Total Tasks',
        value: total,
        icon: <Target className="w-8 h-8 text-white" />,
        gradient: 'from-blue-500 via-blue-600 to-purple-500'
      },
      {
        title: 'Completed',
        value: done,
        icon: <CheckCircle className="w-8 h-8 text-white" />,
        gradient: 'from-green-400 via-blue-400 to-cyan-400'
      },
      {
        title: 'In Progress',
        value: inProgress,
        icon: <Clock className="w-8 h-8 text-white" />,
        gradient: 'from-purple-500 via-pink-500 to-purple-600'
      },
      {
        title: 'High Priority',
        value: highPriority,
        icon: <AlertTriangle className="w-8 h-8 text-white" />,
        gradient: 'from-orange-400 via-red-400 to-pink-400'
      }
    ];
  }, [tasks]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-6 mb-6 md:mb-8">
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
