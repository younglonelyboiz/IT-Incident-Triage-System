import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ConfidenceBar } from '@/components/shared/ConfidenceBar'
import { PriorityBadge } from '@/components/shared/PriorityBadge'
import { SLACountdown } from '@/components/shared/SLACountdown'
import { StateBadge } from '@/components/shared/StateBadge'
import { Ticket } from '@/types'

interface TicketRowProps {
  ticket: Ticket
}

export const TicketRow: React.FC<TicketRowProps> = ({ ticket }) => {
  const navigate = useNavigate()

  let rowHighlight = 'hover:bg-zinc-50 bg-white'
  if (ticket.priority === 'P1') {
    rowHighlight = 'border-l-2 border-l-red-500 bg-white hover:bg-zinc-50'
  } else if (ticket.state === 'MANUAL_TRIAGE_REQUIRED') {
    rowHighlight = 'border-l-2 border-l-amber-500 bg-white hover:bg-zinc-50'
  }

  return (
    <tr
      onClick={() => navigate(`/tickets/${ticket.ticketCode}`)}
      className={`border-b border-zinc-100 cursor-pointer transition-colors duration-150 ${rowHighlight}`}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          navigate(`/tickets/${ticket.ticketCode}`)
        }
      }}
    >
      {/* Code */}
      <td className="px-4 py-3 whitespace-nowrap">
        <span className="font-mono text-[11px] font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200/80">
          {ticket.ticketCode}
        </span>
      </td>

      {/* Title & Requester */}
      <td className="px-5 py-4 min-w-[280px]">
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-slate-900 line-clamp-1 group-hover:text-sky-600 transition-colors">
            {ticket.title}
          </span>
          <span className="text-xs text-slate-500 mt-0.5">
            {ticket.requesterName} • {ticket.requesterDepartment}
          </span>
        </div>
      </td>

      {/* AI Suggestion */}
      <td className="px-5 py-4 whitespace-nowrap">
        {ticket.aiTriage ? (
          <div className="flex flex-col gap-1 w-48">
            <span className="text-xs font-medium text-slate-800 truncate" title={ticket.aiTriage.suggestedCategory}>
              {ticket.aiTriage.suggestedCategory}
            </span>
            <ConfidenceBar value={ticket.aiTriage.confidence} />
          </div>
        ) : (
          <span className="text-xs text-slate-400 italic">Chưa có đề xuất AI</span>
        )}
      </td>

      {/* Priority */}
      <td className="px-5 py-4 whitespace-nowrap">
        <PriorityBadge priority={ticket.priority} />
      </td>

      {/* State */}
      <td className="px-5 py-4 whitespace-nowrap">
        <StateBadge state={ticket.state} />
      </td>

      {/* SLA Countdown */}
      <td className="px-5 py-4 whitespace-nowrap text-right min-w-[170px]">
        <SLACountdown deadline={ticket.slaDeadline} createdAt={ticket.createdAt} />
      </td>
    </tr>
  )
}
