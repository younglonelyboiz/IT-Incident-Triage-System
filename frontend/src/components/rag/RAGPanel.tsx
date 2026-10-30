import React from 'react'
import { Database, FileText } from 'lucide-react'
import { RunbookChecklist } from './RunbookChecklist'
import { SimilarIncidentCard } from './SimilarIncidentCard'
import { Runbook, SimilarIncident } from '@/types'

interface RAGPanelProps {
  similarIncidents?: SimilarIncident[]
  runbook?: Runbook
}

export const RAGPanel: React.FC<RAGPanelProps> = ({ similarIncidents = [], runbook }) => {
  return (
    <div className="space-y-4">
      {/* Runbook Section */}
      {runbook && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Quy trình Xử lý Chuẩn (Grounded Runbook)
            </h3>
          </div>
          <RunbookChecklist runbook={runbook} />
        </div>
      )}

      {/* Similar Incidents Section */}
      {similarIncidents && similarIncidents.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900">
                Sự cố tương tự trong quá khứ ({similarIncidents.length})
              </h3>
            </div>
            <span className="text-[11px] text-slate-500">Vector Search Cosine &gt; 0.65</span>
          </div>

          <div className="space-y-2">
            {similarIncidents.map((inc) => (
              <SimilarIncidentCard key={inc.id} incident={inc} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
