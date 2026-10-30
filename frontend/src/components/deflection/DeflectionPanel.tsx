import React from 'react'
import { Sparkles } from 'lucide-react'
import { SolutionCard } from './SolutionCard'
import { DeflectionSolution } from '@/types'

interface DeflectionPanelProps {
  solutions: DeflectionSolution[]
  isLoading?: boolean
  onResolved: () => void
  onNotResolved: () => void
}

export const DeflectionPanel: React.FC<DeflectionPanelProps> = ({
  solutions,
  isLoading = false,
  onResolved,
  onNotResolved,
}) => {
  return (
    <div className="bg-white border border-zinc-200 rounded-lg p-4 space-y-4 shadow-xs">
      {/* Header */}
      <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
        <div className="w-6 h-6 rounded bg-sky-600 flex items-center justify-center text-white shrink-0 shadow-xs">
          <Sparkles className="w-3.5 h-3.5" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-900">
            Giải pháp đề xuất tự xử lý nhanh
          </h3>
          <p className="text-[11px] text-sky-700">
            Cơ sở tri thức IT tự động đối soát dựa trên từ khóa sự cố
          </p>
        </div>
      </div>

      {/* Loading Skeleton */}
      {isLoading && solutions.length === 0 && (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="bg-zinc-50 p-4 rounded-md border border-zinc-200 animate-pulse space-y-2">
              <div className="h-4 bg-zinc-200 rounded w-2/3" />
              <div className="h-3 bg-zinc-100 rounded w-full" />
              <div className="h-14 bg-zinc-100 rounded w-full" />
            </div>
          ))}
        </div>
      )}

      {/* Solutions list */}
      {solutions.length > 0 && (
        <div className="space-y-3">
          {solutions.map((sol) => (
            <SolutionCard
              key={sol.id}
              solution={sol}
              onResolved={onResolved}
              onNotResolved={onNotResolved}
            />
          ))}
        </div>
      )}

      {/* Empty State when no keywords yet */}
      {!isLoading && solutions.length === 0 && (
        <div className="bg-zinc-50/50 border border-dashed border-zinc-200 rounded-md p-6 text-center text-zinc-500">
          <p className="text-xs font-medium text-zinc-700">
            Nhập chi tiết nội dung sự cố (như <em>VPN, mạng nội bộ, mật khẩu, máy in...</em>)
          </p>
          <p className="text-[11px] text-zinc-400 mt-1">
            Hệ thống sẽ tự động quét cơ sở tri thức để gợi ý cách xử lý ngay lập tức.
          </p>
        </div>
      )}
    </div>
  )
}
