import React from 'react'
import { TicketRow } from './TicketRow'
import { EmptyState } from '@/components/shared/EmptyState'
import { Ticket } from '@/types'

interface TicketTableProps {
  tickets: Ticket[]
  isLoading?: boolean
  onResetFilters?: () => void
}

export const TicketTable: React.FC<TicketTableProps> = ({ tickets, isLoading = false, onResetFilters }) => {
  if (isLoading) {
    return (
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs">
        <div className="p-8 text-center text-slate-500 animate-pulse-slow">
          <div className="h-6 bg-slate-200 rounded w-1/4 mx-auto mb-4" />
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-12 bg-slate-100 rounded w-full" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (tickets.length === 0) {
    return (
      <EmptyState
        title="Không tìm thấy sự cố nào"
        description="Không có phiếu sự cố nào phù hợp với điều kiện tìm kiếm và bộ lọc hiện tại của bạn."
        action={
          onResetFilters
            ? {
                label: 'Xóa bộ lọc tìm kiếm',
                onClick: onResetFilters,
              }
            : undefined
        }
      />
    )
  }

  return (
    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              <th scope="col" className="px-5 py-3">Mã INC</th>
              <th scope="col" className="px-5 py-3">Tiêu đề sự cố & Người báo cáo</th>
              <th scope="col" className="px-5 py-3">Đề xuất AI (Category / Độ tin cậy)</th>
              <th scope="col" className="px-5 py-3">Ưu tiên</th>
              <th scope="col" className="px-5 py-3">Trạng thái</th>
              <th scope="col" className="px-5 py-3 text-right whitespace-nowrap min-w-[170px]">SLA Đếm ngược</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {tickets.map((ticket) => (
              <TicketRow key={ticket.id} ticket={ticket} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
