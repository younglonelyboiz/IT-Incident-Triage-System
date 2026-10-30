import { useEffect, useRef, useState } from 'react'
import { MOCK_DEFLECTION_SOLUTIONS } from '@/services/mockData'
import { ticketService } from '@/services/ticketService'
import { DeflectionSolution } from '@/types'

export function useDeflection(query: string, delay: number = 400) {
  const initial = (() => {
    if (!query) return []
    const q = query.toLowerCase()
    if (q.includes('vpn') || q.includes('kết nối') || q.includes('anyconnect') || q.includes('mạng')) {
      return MOCK_DEFLECTION_SOLUTIONS.vpn || []
    }
    if (q.includes('pass') || q.includes('mật khẩu') || q.includes('quên') || q.includes('đăng nhập')) {
      return MOCK_DEFLECTION_SOLUTIONS.password || []
    }
    if (q.includes('in') || q.includes('printer') || q.includes('kẹt') || q.includes('hp')) {
      return MOCK_DEFLECTION_SOLUTIONS.printer || []
    }
    return []
  })()

  const [solutions, setSolutions] = useState<DeflectionSolution[]>(initial)
  const [isLoading, setIsLoading] = useState(false)
  const isFirstMount = useRef(true)

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false
      if (initial.length > 0) return
    }
    if (!query || query.trim().length < 3) {
      setSolutions([])
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    const handler = setTimeout(async () => {
      try {
        const results = await ticketService.getDeflections(query)
        setSolutions(results)
      } catch (err) {
        console.error('Lỗi tìm kiếm deflection:', err)
        setSolutions([])
      } finally {
        setIsLoading(false)
      }
    }, delay)

    return () => clearTimeout(handler)
  }, [query, delay])

  return { solutions, isLoading }
}
