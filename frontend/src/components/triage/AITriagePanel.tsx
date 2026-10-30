import React from 'react'
import { Bot, HelpCircle, Sparkles } from 'lucide-react'
import { HITLPanel } from './HITLPanel'
import { PriorityMatrix } from './PriorityMatrix'
import { ConfidenceBar } from '@/components/shared/ConfidenceBar'
import { PriorityBadge } from '@/components/shared/PriorityBadge'
import { Priority, Ticket } from '@/types'

interface AITriagePanelProps {
  ticket: Ticket
  onAccept: () => Promise<void>
  onOverride: (params: { category: string; priority: Priority; overrideReason: string }) => Promise<void>
  isSubmitting?: boolean
}

export const AITriagePanel: React.FC<AITriagePanelProps> = ({
  ticket,
  onAccept,
  onOverride,
  isSubmitting = false,
}) => {
  const triage = ticket.aiTriage

  if (!triage) {
    return (
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-5 text-center text-slate-500">
        <Bot className="w-8 h-8 mx-auto text-slate-400 mb-2" />
        <p className="text-sm font-semibold">Chưa có kết quả AI Triage</p>
        <p className="text-xs text-slate-400 mt-1">Sự cố này đang chờ mô hình phân tích tự động.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* AI Triage Card - Minimalist */}
      <div className="bg-white border border-slate-200/90 rounded-lg p-4 space-y-3.5 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
        {/* Header */}
        <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-sky-600 flex items-center justify-center text-white shadow-xs">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div>
              <h3 className="text-xs font-semibold text-slate-900">Phân loại & Định tuyến AI</h3>
              <p className="text-[10px] text-slate-500">Mô hình Triage tự động</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] uppercase font-mono text-slate-400 block">Tin cậy</span>
            <span className="text-xs font-mono font-bold text-sky-700">
              {Math.round(triage.confidence * 100)}%
            </span>
          </div>
        </div>

        {/* Confidence bar */}
        <div>
          <ConfidenceBar value={triage.confidence} />
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 gap-2 pt-0.5">
          <div className="bg-sky-50/40 p-2.5 rounded border border-sky-100/70">
            <span className="text-[10px] text-sky-800 font-medium block">Danh mục đề xuất</span>
            <span className="text-xs font-semibold text-slate-900 mt-0.5 block truncate" title={triage.suggestedCategory}>
              {triage.suggestedCategory}
            </span>
          </div>

          <div className="bg-slate-50/70 p-2.5 rounded border border-slate-200/60">
            <span className="text-[10px] text-slate-500 font-medium block">Mức ưu tiên</span>
            <div className="mt-1">
              <PriorityBadge priority={triage.suggestedPriority} />
            </div>
          </div>
        </div>

        {/* AI Reasoning */}
        <div className="bg-zinc-50/70 p-3 rounded border border-zinc-100">
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-zinc-700 mb-1">
            <HelpCircle className="w-3.5 h-3.5 text-zinc-400" />
            <span>Lập luận chẩn đoán:</span>
          </div>
          <p className="text-xs text-zinc-600 leading-relaxed">
            "{triage.reasoning}"
          </p>
        </div>

        {/* ITIL Priority Matrix */}
        <PriorityMatrix currentImpact={triage.impact} currentUrgency={triage.urgency} />
      </div>

      {/* Human In The Loop approval panel */}
      <HITLPanel
        ticket={ticket}
        onAccept={onAccept}
        onOverride={onOverride}
        isSubmitting={isSubmitting}
      />
    </div>
  )
}
