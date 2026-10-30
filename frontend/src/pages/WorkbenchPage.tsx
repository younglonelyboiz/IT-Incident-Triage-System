import React, { useDeferredValue, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AlertOctagon, Clock, Layers, PlusCircle } from 'lucide-react'
import { TopBar } from '@/components/layout/TopBar'
import { TicketFilters } from '@/components/tickets/TicketFilters'
import { TicketTable } from '@/components/tickets/TicketTable'
import { ticketService } from '@/services/ticketService'
import { Ticket, TicketFiltersState } from '@/types'

export const WorkbenchPage: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const [filters, setFilters] = useState<TicketFiltersState>({
    search: '',
    category: 'all',
    priority: 'all',
    state: 'all',
  })

  // useDeferredValue cho search theo đúng spec D7
  const deferredSearch = useDeferredValue(filters.search)

  const fetchTickets = async () => {
    setIsLoading(true)
    try {
      const data = await ticketService.getTickets({
        ...filters,
        search: deferredSearch,
      })
      setTickets(data)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTickets()
  }, [deferredSearch, filters.category, filters.priority, filters.state])

  const handleResetFilters = () => {
    setFilters({
      search: '',
      category: 'all',
      priority: 'all',
      state: 'all',
    })
  }

  // Calculate quick KPI counts
  const pendingTriageCount = tickets.filter(
    (t) => t.state === 'PENDING_TRIAGE' || t.state === 'AI_SUGGESTED'
  ).length
  const p1ActiveCount = tickets.filter((t) => t.priority === 'P1' && t.state !== 'RESOLVED' && t.state !== 'CLOSED').length
  const slaExpiringCount = tickets.filter((t) => {
    const diff = new Date(t.slaDeadline).getTime() - Date.now()
    return diff > 0 && diff < 60 * 60 * 1000 && t.state !== 'RESOLVED' && t.state !== 'CLOSED'
  }).length

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <TopBar
        title="Bàn làm việc Kỹ thuật viên (Incident Workbench)"
        subtitle="Quản lý hàng đợi tiếp nhận, rà soát đề xuất AI Triage và điều phối xử lý sự cố"
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

      <div className="p-6 space-y-4 max-w-[1400px] w-full mx-auto">
        {/* KPI Strip Bar - Minimalist Clean Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="bg-white border border-slate-200/80 hover:border-sky-200 rounded-lg p-3.5 flex items-center justify-between transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
            <div>
              <p className="text-[11px] font-medium text-slate-500">Chờ Triage & Phê duyệt</p>
              <p className="text-xl font-semibold text-slate-900 mt-0.5">{pendingTriageCount}</p>
            </div>
            <div className="w-8 h-8 rounded border border-sky-100 bg-sky-50 flex items-center justify-center text-sky-600">
              <Layers className="w-4 h-4" />
            </div>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-lg p-3.5 flex items-center justify-between shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
            <div>
              <p className="text-[11px] font-medium text-slate-500">P1 Khẩn cấp Active</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xl font-semibold text-slate-900">{p1ActiveCount}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
              </div>
            </div>
            <div className="w-8 h-8 rounded border border-red-100 bg-red-50/50 flex items-center justify-center text-red-600">
              <AlertOctagon className="w-4 h-4" />
            </div>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-lg p-3.5 flex items-center justify-between shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
            <div>
              <p className="text-[11px] font-medium text-slate-500">Sắp vi phạm SLA (&lt; 1 giờ)</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xl font-semibold text-slate-900">{slaExpiringCount}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              </div>
            </div>
            <div className="w-8 h-8 rounded border border-amber-100 bg-amber-50/50 flex items-center justify-center text-amber-700">
              <Clock className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <TicketFilters
          filters={filters}
          onChange={setFilters}
          onReset={handleResetFilters}
        />

        {/* Ticket Data Table */}
        <TicketTable
          tickets={tickets}
          isLoading={isLoading}
          onResetFilters={handleResetFilters}
        />
      </div>
    </div>
  )
}
