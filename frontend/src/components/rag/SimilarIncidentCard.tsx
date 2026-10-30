import React from 'react'
import { CheckCircle2, History } from 'lucide-react'
import { SimilarIncident } from '@/types'

interface SimilarIncidentCardProps {
  incident: SimilarIncident
}

export const SimilarIncidentCard: React.FC<SimilarIncidentCardProps> = ({ incident }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-3 hover:border-blue-300 hover:shadow-xs transition-all space-y-1.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <History className="w-3.5 h-3.5 text-blue-600" />
          <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
            {incident.ticketCode}
          </span>
        </div>
        <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
          {Math.round(incident.similarity * 100)}% tương đồng
        </span>
      </div>

      <p className="text-xs font-semibold text-slate-800 line-clamp-1">{incident.title}</p>

      <div className="bg-slate-50 p-2 rounded border border-slate-100 flex items-start gap-1.5 text-xs text-slate-700">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-slate-800">Giải pháp đã áp dụng: </span>
          <span>{incident.resolution}</span>
        </div>
      </div>
    </div>
  )
}
