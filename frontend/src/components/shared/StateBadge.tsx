import React from 'react'
import { Sparkles, AlertCircle } from 'lucide-react'
import { STATE_CONFIG } from '@/lib/constants'
import { TicketState } from '@/types'

interface StateBadgeProps {
  state: TicketState
  className?: string
}

export const StateBadge: React.FC<StateBadgeProps> = ({ state, className = '' }) => {
  const config = STATE_CONFIG[state] || STATE_CONFIG.NEW

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] border ${config.badgeClass} ${className}`}
    >
      {state === 'AI_SUGGESTED' && <Sparkles className="w-3 h-3 text-zinc-400 shrink-0" aria-hidden="true" />}
      {state === 'MANUAL_TRIAGE_REQUIRED' && <AlertCircle className="w-3 h-3 text-red-500 shrink-0" aria-hidden="true" />}
      <span>{config.label}</span>
    </span>
  )
}
