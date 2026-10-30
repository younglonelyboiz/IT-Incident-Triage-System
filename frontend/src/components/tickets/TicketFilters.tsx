import React from 'react'
import { Filter, RotateCcw, Search } from 'lucide-react'
import { CATEGORIES } from '@/lib/constants'
import { TicketFiltersState } from '@/types'

interface TicketFiltersProps {
  filters: TicketFiltersState
  onChange: (filters: TicketFiltersState) => void
  onReset: () => void
}

export const TicketFilters: React.FC<TicketFiltersProps> = ({ filters, onChange, onReset }) => {
  const hasActiveFilters =
    filters.search !== '' ||
    filters.category !== 'all' ||
    filters.priority !== 'all' ||
    filters.state !== 'all'

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-3.5 flex flex-wrap items-center justify-between gap-3 shadow-xs">
      {/* Search Input */}
      <div className="relative flex-1 min-w-[260px]">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
        <input
          id="ticket-search"
          type="text"
          placeholder="Tìm theo mã sự cố, tiêu đề, người báo cáo..."
          value={filters.search}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
          className="w-full pl-9 pr-3 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-slate-900 placeholder:text-slate-400"
          aria-label="Tìm kiếm sự cố"
        />
      </div>

      {/* Dropdown Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 shrink-0">
          <Filter className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Lọc theo:</span>
        </div>

        {/* Priority Filter */}
        <select
          value={filters.priority}
          onChange={(e) => onChange({ ...filters, priority: e.target.value })}
          className="text-xs bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          aria-label="Lọc theo mức độ ưu tiên"
        >
          <option value="all">Mức ưu tiên: Tất cả</option>
          <option value="P1">P1 Khẩn cấp</option>
          <option value="P2">P2 Cao</option>
          <option value="P3">P3 Trung bình</option>
          <option value="P4">P4 Thấp</option>
        </select>

        {/* Category Filter */}
        <select
          value={filters.category}
          onChange={(e) => onChange({ ...filters, category: e.target.value })}
          className="text-xs bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer max-w-[200px]"
          aria-label="Lọc theo danh mục"
        >
          <option value="all">Danh mục: Tất cả</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {/* State Filter */}
        <select
          value={filters.state}
          onChange={(e) => onChange({ ...filters, state: e.target.value })}
          className="text-xs bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          aria-label="Lọc theo trạng thái"
        >
          <option value="all">Trạng thái: Tất cả</option>
          <option value="AI_SUGGESTED">AI Đã Triage</option>
          <option value="PENDING_TRIAGE">Chờ Triage</option>
          <option value="TRIAGED">Đã Triage</option>
          <option value="IN_PROGRESS">Đang xử lý</option>
          <option value="MANUAL_TRIAGE_REQUIRED">Cần Triage Thủ công</option>
          <option value="RESOLVED">Đã giải quyết</option>
        </select>

        {/* Reset button */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2 py-1.5 rounded-md cursor-pointer transition-colors"
            title="Đặt lại tất cả bộ lọc"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Đặt lại</span>
          </button>
        )}
      </div>
    </div>
  )
}
