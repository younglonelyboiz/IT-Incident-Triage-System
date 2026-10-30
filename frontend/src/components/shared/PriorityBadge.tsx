import React from 'react'
import { AlertOctagon, AlertTriangle, ArrowDown, Info } from 'lucide-react'
import { PRIORITY_CONFIG } from '@/lib/constants'
import { Priority } from '@/types'

interface PriorityBadgeProps {
  priority: Priority
  className?: string
  showDescription?: boolean
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, className = '', showDescription = false }) => {
  const config = PRIORITY_CONFIG[priority] || PRIORITY_CONFIG.P3

  const dotColors = {
    P1: 'bg-red-500',
    P2: 'bg-amber-500',
    P3: 'bg-zinc-400',
    P4: 'bg-zinc-300',
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium border border-zinc-200 bg-zinc-50 text-zinc-800 ${className}`}
      title={showDescription ? config.description : undefined}
    >
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColors[priority]}`} aria-hidden="true" />
      <span>{config.label}</span>
    </span>
  )
}
