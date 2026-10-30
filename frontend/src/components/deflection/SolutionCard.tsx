import React from 'react'
import { Check, ChevronRight, HelpCircle, Lightbulb } from 'lucide-react'
import { DeflectionSolution } from '@/types'

interface SolutionCardProps {
  solution: DeflectionSolution
  onResolved: () => void
  onNotResolved: () => void
}

export const SolutionCard: React.FC<SolutionCardProps> = ({
  solution,
  onResolved,
  onNotResolved,
}) => {
  return (
    <div className="bg-white border border-zinc-200 rounded-lg p-3.5 space-y-3 shadow-xs">
      <div className="flex items-start gap-2.5">
        <div className="w-6 h-6 rounded bg-zinc-100 flex items-center justify-center text-zinc-700 shrink-0 mt-0.5">
          <Lightbulb className="w-3.5 h-3.5" />
        </div>
        <div>
          <h4 className="text-xs font-semibold text-zinc-900 leading-snug">{solution.title}</h4>
          <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">{solution.summary}</p>
        </div>
      </div>

      {/* Steps */}
      <div className="bg-zinc-50 rounded-md p-2.5 border border-zinc-200/60 space-y-1.5">
        <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">
          Các bước thực hiện nhanh:
        </span>
        <ol className="list-decimal list-inside text-xs text-zinc-700 space-y-1">
          {solution.steps.map((step, idx) => (
            <li key={idx} className="leading-relaxed">
              {step}
            </li>
          ))}
        </ol>
      </div>

      {/* Resolution Feedback CTA */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={onResolved}
          className="flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 px-3 text-xs font-medium text-sky-800 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-md cursor-pointer transition-colors shadow-xs"
        >
          <Check className="w-3.5 h-3.5 text-sky-600" />
          <span>Đã tự khắc phục thành công</span>
        </button>

        <button
          type="button"
          onClick={onNotResolved}
          className="inline-flex items-center justify-center gap-1 py-1.5 px-3 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-md cursor-pointer transition-colors"
        >
          <span>Chưa xử lý được</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}
