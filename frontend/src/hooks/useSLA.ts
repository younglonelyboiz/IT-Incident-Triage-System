import { useEffect, useState } from 'react'

export type SLAStatus = 'safe' | 'warning' | 'critical' | 'expired'

export interface SLAHookResult {
  timeLeftFormatted: string
  status: SLAStatus
  percentRemaining: number
  isExpired: boolean
  isExpiringSoon: boolean
}

export function useSLA(deadline: string | Date, createdAt?: string | Date): SLAHookResult {
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const targetTime = new Date(deadline).getTime()
  const startTime = createdAt ? new Date(createdAt).getTime() : targetTime - 4 * 60 * 60 * 1000
  const totalDuration = Math.max(1, targetTime - startTime)
  const remainingMs = targetTime - now

  if (remainingMs <= 0) {
    return {
      timeLeftFormatted: 'Quá hạn SLA',
      status: 'expired',
      percentRemaining: 0,
      isExpired: true,
      isExpiringSoon: true,
    }
  }

  const percentRemaining = Math.min(100, Math.max(0, (remainingMs / totalDuration) * 100))
  const hours = Math.floor(remainingMs / (1000 * 60 * 60))
  const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((remainingMs % (1000 * 60)) / 1000)

  const pad = (n: number) => n.toString().padStart(2, '0')
  const timeLeftFormatted = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`

  let status: SLAStatus = 'safe'
  if (remainingMs < 60 * 60 * 1000) {
    // < 1 hour
    status = 'critical'
  } else if (percentRemaining < 20) {
    status = 'warning'
  }

  return {
    timeLeftFormatted,
    status,
    percentRemaining,
    isExpired: false,
    isExpiringSoon: remainingMs < 60 * 60 * 1000,
  }
}
