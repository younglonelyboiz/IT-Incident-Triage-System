import React, { useState } from 'react'
import { BookOpen, CheckSquare, ExternalLink, Square } from 'lucide-react'
import { Runbook } from '@/types'

interface RunbookChecklistProps {
  runbook: Runbook
}

export const RunbookChecklist: React.FC<RunbookChecklistProps> = ({ runbook }) => {
  const [steps, setSteps] = useState(runbook.steps)

  const toggleStep = (id: string) => {
    setSteps((prev) =>
      prev.map((s) => (s.id === id ? { ...s, completed: !s.completed } : s))
    )
  }

  const completedCount = steps.filter((s) => s.completed).length

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-3 shadow-xs">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-blue-600 shrink-0" />
          <div>
            <h4 className="text-sm font-bold text-slate-900">{runbook.title}</h4>
            <p className="text-xs text-slate-500 mt-0.5">{runbook.description}</p>
          </div>
        </div>
        <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 shrink-0">
          {completedCount}/{steps.length} bước
        </span>
      </div>

      {/* Steps checklist */}
      <div className="space-y-2 pt-1">
        {steps.map((step, idx) => (
          <div
            key={step.id}
            onClick={() => toggleStep(step.id)}
            className={`flex items-start gap-2.5 p-2 rounded-md border cursor-pointer transition-all ${
              step.completed
                ? 'bg-slate-50 border-slate-200 text-slate-500 line-through'
                : 'bg-white border-slate-200 text-slate-800 hover:border-blue-300 hover:bg-blue-50/30'
            }`}
          >
            <span className="shrink-0 mt-0.5 text-blue-600">
              {step.completed ? (
                <CheckSquare className="w-4 h-4 text-emerald-600" />
              ) : (
                <Square className="w-4 h-4 text-slate-400" />
              )}
            </span>
            <span className="text-xs font-medium leading-relaxed">
              <strong className="font-semibold text-slate-900 mr-1.5 not-italic">
                Bước {idx + 1}:
              </strong>
              {step.instruction}
            </span>
          </div>
        ))}
      </div>

      {/* Source document citation */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
        <span>Nguồn tài liệu: <strong className="text-slate-700">{runbook.sourceDoc}</strong></span>
        <button
          type="button"
          className="text-blue-600 hover:text-blue-800 font-semibold inline-flex items-center gap-1 cursor-pointer"
        >
          <span>Xem SOP</span>
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>
    </div>
  )
}
