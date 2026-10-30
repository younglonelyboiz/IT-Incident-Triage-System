import React from 'react'
import { Clock } from 'lucide-react'
import { useSLA } from '@/hooks/useSLA'

interface SLACountdownProps {
  deadline: string
  createdAt?: string
  className?: string
  showIcon?: boolean
}

export const SLACountdown: React.FC<SLACountdownProps> = ({
  deadline,
  createdAt,
  className = '',
  showIcon = true,
}) => {
  const { timeLeftFormatted, status, isExpiringSoon } = useSLA(deadline, createdAt)

  const statusStyles = {
    safe: 'text-zinc-700 bg-white border-zinc-200',
    warning: 'text-amber-700 bg-amber-50/50 border-amber-200',
    critical: 'text-red-600 bg-red-50/50 border-red-200 font-medium',
    expired: 'text-red-700 bg-red-50 border-red-200 font-medium',
  }[status]

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono border ${statusStyles} ${className}`}
      title={`Hạn cam kết SLA: ${new Date(deadline).toLocaleString('vi-VN')}`}
    >
      {showIcon && <Clock className="w-3 h-3 text-zinc-400 shrink-0" aria-hidden="true" />}
      <span>{timeLeftFormatted}</span>
      {isExpiringSoon && status !== 'expired' && (
        <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0 ml-0.5" title="Sắp vi phạm SLA (< 1h)" />
      )}
    </span>
  )
}
