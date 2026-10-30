import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Clock, PlusCircle } from 'lucide-react'
import { TopBar } from '@/components/layout/TopBar'
import { EmptyState } from '@/components/shared/EmptyState'
import { PriorityBadge } from '@/components/shared/PriorityBadge'
import { SLACountdown } from '@/components/shared/SLACountdown'
import { StateBadge } from '@/components/shared/StateBadge'
import { useAuth } from '@/context/AuthContext'
import { ticketService } from '@/services/ticketService'
import { Ticket } from '@/types'

export const MyTicketsPage: React.FC = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUserTickets = async () => {
      setIsLoading(true)
      try {
        const all = await ticketService.getTickets()
        // Filter tickets requested by current user or show relevant for demo
        const mine = user?.role === 'END_USER'
          ? all.filter((t) => t.requesterEmail.toLowerCase() === user.email.toLowerCase() || t.requesterId === 'u-current')
          : all.slice(0, 4)
        setTickets(mine.length > 0 ? mine : all.slice(0, 3))
      } finally {
        setIsLoading(false)
      }
    }
    fetchUserTickets()
  }, [user])

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <TopBar
        title="Sự cố của tôi (My Incidents)"
        subtitle="Theo dõi tiến độ xử lý và phản hồi các yêu cầu hỗ trợ kỹ thuật của bạn"
        actions={
          <Link
            to="/tickets/new"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-sky-600 hover:bg-sky-700 rounded-md cursor-pointer transition-colors shadow-xs"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Báo sự cố mới</span>
          </Link>
        }
      />

      <div className="p-6 max-w-[1200px] w-full mx-auto space-y-4">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white p-4 rounded-lg border border-slate-200 animate-pulse h-20" />
            ))}
          </div>
        ) : tickets.length === 0 ? (
          <EmptyState
            title="Bạn chưa có phiếu sự cố nào"
            description="Tất cả dịch vụ của bạn hiện đang hoạt động bình thường. Nếu gặp trở ngại kỹ thuật, hãy gửi phiếu mới."
            action={{
              label: 'Tạo phiếu báo cáo sự cố',
              onClick: () => navigate('/tickets/new'),
            }}
          />
        ) : (
          <div className="space-y-2.5">
            {tickets.map((t) => (
              <div
                key={t.id}
                onClick={() => navigate(`/tickets/${t.ticketCode}`)}
                className="bg-white border border-slate-200/80 hover:border-sky-300 hover:shadow-xs p-4 rounded-lg cursor-pointer transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200/80">
                      {t.ticketCode}
                    </span>
                    <StateBadge state={t.state} />
                    <PriorityBadge priority={t.priority} />
                  </div>

                  <h3 className="text-sm font-semibold text-slate-900 line-clamp-1">{t.title}</h3>
                  <p className="text-xs text-slate-500 line-clamp-1">{t.description}</p>
                </div>

                <div className="flex sm:flex-col items-end justify-between sm:justify-center gap-1.5 shrink-0">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Hạn cam kết:</span>
                    <SLACountdown deadline={t.slaDeadline} showIcon={false} />
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">
                    Cập nhật {new Date(t.updatedAt).toLocaleTimeString('vi-VN')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
