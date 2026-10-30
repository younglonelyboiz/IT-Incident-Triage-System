import React from 'react'
import { Sparkles } from 'lucide-react'

interface ConfidenceBarProps {
  value: number // 0 to 1 or 0 to 100
  showLabel?: boolean
  className?: string
}

export const ConfidenceBar: React.FC<ConfidenceBarProps> = ({
  value,
  showLabel = true,
  className = '',
}) => {
  const normalized = value > 1 ? value : Math.round(value * 100)

  // Color gradient logic based on confidence
  let barColor = 'bg-violet-600'
  let textColor = 'text-violet-700'
  if (normalized < 70) {
    barColor = 'bg-amber-500'
    textColor = 'text-amber-700'
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex-1 bg-sky-100/60 h-1.5 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${
            normalized < 70 ? 'bg-amber-500' : 'bg-sky-500'
          }`}
          style={{ width: `${Math.min(100, Math.max(0, normalized))}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-[11px] font-mono font-medium text-sky-800 shrink-0">
          {normalized}%
        </span>
      )}
    </div>
  )
}
