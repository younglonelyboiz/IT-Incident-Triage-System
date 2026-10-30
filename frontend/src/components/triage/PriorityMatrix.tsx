import React from 'react'

interface PriorityMatrixProps {
  currentImpact: 'CAO' | 'TRUNG_BINH' | 'THAP'
  currentUrgency: 'CAO' | 'TRUNG_BINH' | 'THAP'
}

export const PriorityMatrix: React.FC<PriorityMatrixProps> = ({ currentImpact, currentUrgency }) => {
  const matrix = [
    { impact: 'CAO', label: 'Cao', values: ['P1', 'P2', 'P3'] },
    { impact: 'TRUNG_BINH', label: 'TB', values: ['P2', 'P3', 'P4'] },
    { impact: 'THAP', label: 'Thấp', values: ['P3', 'P4', 'P4'] },
  ]

  const urgencies: Array<'CAO' | 'TRUNG_BINH' | 'THAP'> = ['CAO', 'TRUNG_BINH', 'THAP']

  const getPriorityStyle = (_p: string, isSelected: boolean) => {
    const base = 'text-[11px] font-mono text-center py-1 px-1 rounded transition-colors '
    if (isSelected) {
      return base + 'bg-zinc-900 text-white font-semibold ring-1 ring-zinc-900 shadow-xs'
    }
    return base + 'bg-zinc-50 text-zinc-600 border border-zinc-200/80 hover:bg-zinc-100'
  }

  return (
    <div className="bg-white p-3 rounded-md border border-zinc-200 text-xs">
      <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-zinc-100">
        <span className="font-medium text-zinc-900">Ma trận Tác động × Khẩn cấp (ITIL)</span>
        <span className="text-[10px] text-zinc-600 bg-zinc-100 px-1.5 py-0.5 rounded font-mono">
          {currentImpact} × {currentUrgency}
        </span>
      </div>

      <div className="grid grid-cols-4 gap-1 items-center">
        {/* Header row */}
        <div className="text-[10px] font-medium text-zinc-400 text-center">T.Động \ K.Cấp</div>
        <div className="text-[10px] font-medium text-zinc-500 text-center">Cao</div>
        <div className="text-[10px] font-medium text-zinc-500 text-center">TB</div>
        <div className="text-[10px] font-medium text-zinc-500 text-center">Thấp</div>

        {/* Matrix rows */}
        {matrix.map((row) => (
          <React.Fragment key={row.impact}>
            <div className="text-[11px] font-medium text-zinc-600 pr-1">{row.label}</div>
            {row.values.map((val, idx) => {
              const urg = urgencies[idx]
              const isSelected = row.impact === currentImpact && urg === currentUrgency
              return (
                <div key={idx} className={getPriorityStyle(val, isSelected)}>
                  {val}
                </div>
              )
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}
