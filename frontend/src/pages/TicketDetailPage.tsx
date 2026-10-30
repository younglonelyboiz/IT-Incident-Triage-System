import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  Laptop,
  MessageSquare,
  Send,
  User,
} from 'lucide-react'
import { RAGPanel } from '@/components/rag/RAGPanel'
import { MissingInfoAlert } from '@/components/shared/MissingInfoAlert'
import { PriorityBadge } from '@/components/shared/PriorityBadge'
import { SLACountdown } from '@/components/shared/SLACountdown'
import { StateBadge } from '@/components/shared/StateBadge'
import { AITriagePanel } from '@/components/triage/AITriagePanel'
import { useAuth } from '@/context/AuthContext'
import { useNotification } from '@/context/NotificationContext'
import { ticketService } from '@/services/ticketService'
import { Priority, Ticket, TicketState } from '@/types'

export const TicketDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { showToast } = useNotification()

  const [ticket, setTicket] = useState<Ticket | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newComment, setNewComment] = useState('')

  useEffect(() => {
    const fetchTicket = async () => {
      if (!id) return
      setIsLoading(true)
      try {
        const data = await ticketService.getTicketById(id)
        setTicket(data)
      } finally {
        setIsLoading(false)
      }
    }
    fetchTicket()
  }, [id])

  if (isLoading) {
    return (
      <div className="p-8 max-w-[1400px] mx-auto w-full space-y-4 animate-pulse">
        <div className="h-10 bg-slate-200 rounded w-1/3" />
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-7 h-96 bg-slate-200 rounded" />
          <div className="col-span-5 h-96 bg-slate-200 rounded" />
        </div>
      </div>
    )
  }

  if (!ticket) {
    return (
      <div className="p-12 text-center">
        <h2 className="text-lg font-bold text-slate-800">Không tìm thấy sự cố {id}</h2>
        <Link to="/tickets" className="text-blue-600 text-sm mt-2 inline-block">
          Quay lại Bàn làm việc
        </Link>
      </div>
    )
  }

  const handleAcceptAI = async () => {
    setIsSubmitting(true)
    try {
      const updated = await ticketService.acceptAITriage(ticket.id, user?.name || 'Kỹ thuật viên')
      setTicket(updated)
      showToast({
        title: 'Đã phê duyệt đề xuất AI',
        message: `Sự cố ${updated.ticketCode} đã chuyển sang trạng thái Đã Triage.`,
        type: 'success',
      })
    } catch {
      showToast({ title: 'Lỗi', message: 'Không thể phê duyệt đề xuất', type: 'error' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleOverrideAI = async (params: {
    category: string
    priority: Priority
    overrideReason: string
  }) => {
    setIsSubmitting(true)
    try {
      const updated = await ticketService.overrideAITriage(ticket.id, {
        ...params,
        reviewerName: user?.name || 'Kỹ thuật viên',
      })
      setTicket(updated)
      showToast({
        title: 'Đã ghi đè phân loại AI',
        message: `Đã cập nhật mức ưu tiên ${params.priority} và danh mục mới.`,
        type: 'success',
      })
    } catch {
      showToast({ title: 'Lỗi', message: 'Không thể cập nhật ghi đè', type: 'error' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleStateChange = async (newState: TicketState) => {
    try {
      const updated = await ticketService.updateTicketState(ticket.id, newState, user?.name || 'Kỹ thuật viên')
      setTicket(updated)
      showToast({
        title: 'Cập nhật trạng thái',
        message: `Sự cố đã chuyển sang: ${newState}`,
        type: 'info',
      })
    } catch {
      showToast({ title: 'Lỗi', message: 'Không thể cập nhật trạng thái', type: 'error' })
    }
  }

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    try {
      const updated = await ticketService.addComment(ticket.id, {
        authorName: user?.name || 'Kỹ thuật viên',
        authorRole: user?.role || 'IT_SUPPORT',
        content: newComment,
        isInternal: false,
      })
      setTicket(updated)
      setNewComment('')
      showToast({ title: 'Đã gửi phản hồi', type: 'success' })
    } catch {
      showToast({ title: 'Lỗi gửi phản hồi', type: 'error' })
    }
  }

  return (
    <div className="flex-1 flex flex-col min-w-0">
      {/* Sticky Sub-Header bar */}
      <div className="sticky top-0 z-10 bg-white border-b border-slate-200 px-8 py-3.5 flex flex-wrap items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Quay lại danh sách"
            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="h-5 w-px bg-slate-200" />
          <span className="font-mono text-base font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
            {ticket.ticketCode}
          </span>
          <StateBadge state={ticket.state} />
          <PriorityBadge priority={ticket.priority} />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Hạn cam kết SLA:</span>
            <SLACountdown deadline={ticket.slaDeadline} createdAt={ticket.createdAt} />
          </div>

          {/* Quick status actions */}
          <div className="flex items-center gap-1.5 ml-2">
            {ticket.state !== 'IN_PROGRESS' && ticket.state !== 'RESOLVED' && (
              <button
                type="button"
                onClick={() => handleStateChange('IN_PROGRESS')}
                className="px-3 py-1.5 text-xs font-semibold text-orange-700 bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-md cursor-pointer transition-colors"
              >
                Tiếp nhận xử lý
              </button>
            )}
            {ticket.state !== 'RESOLVED' && (
              <button
                type="button"
                onClick={() => handleStateChange('RESOLVED')}
                className="px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-md cursor-pointer transition-colors flex items-center gap-1"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Đánh dấu Đã giải quyết
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2-Column Content Layout (55% / 45%) */}
      <div className="p-8 max-w-[1500px] w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (55% ~ 7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Incident Overview Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
            <div>
              <h1 className="text-xl font-bold text-slate-900 leading-snug">
                {ticket.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 mt-2.5 text-xs text-slate-500">
                <span className="inline-flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <strong>{ticket.requesterName}</strong> ({ticket.requesterDepartment})
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  Tạo lúc {new Date(ticket.createdAt).toLocaleString('vi-VN')}
                </span>
                {ticket.deviceOrSystem && (
                  <span className="inline-flex items-center gap-1.5">
                    <Laptop className="w-3.5 h-3.5 text-slate-400" />
                    Thiết bị: <code className="text-slate-700 bg-slate-100 px-1 rounded">{ticket.deviceOrSystem}</code>
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="pt-3 border-t border-slate-100">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Mô tả chi tiết sự cố:
              </h3>
              <div className="text-sm text-slate-800 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-200 whitespace-pre-line">
                {ticket.description}
              </div>
            </div>

            {/* Missing Info Alert if flagged by AI */}
            {ticket.aiTriage?.missingInformation && ticket.aiTriage.missingInformation.length > 0 && (
              <MissingInfoAlert
                missingItems={ticket.aiTriage.missingInformation}
                questionTemplate={ticket.aiTriage.questionTemplate}
              />
            )}
          </div>

          {/* Grounded RAG & Runbooks Panel */}
          <RAGPanel
            similarIncidents={ticket.aiTriage?.similarIncidents}
            runbook={ticket.aiTriage?.suggestedRunbook}
          />

          {/* Comments & Discussion */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-200">
              <MessageSquare className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900">
                Trao đổi & Phản hồi ({ticket.comments.length})
              </h3>
            </div>

            <div className="space-y-3">
              {ticket.comments.map((comment) => (
                <div key={comment.id} className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800">
                      {comment.authorName} ({comment.authorRole})
                    </span>
                    <span className="text-slate-500">{new Date(comment.createdAt).toLocaleTimeString('vi-VN')}</span>
                  </div>
                  <p className="text-xs text-slate-700">{comment.content}</p>
                </div>
              ))}
            </div>

            {/* Add comment box */}
            <form onSubmit={handleAddComment} className="pt-2 flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Nhập nội dung phản hồi tới người báo cáo hoặc ghi chú nội bộ..."
                className="flex-1 text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors inline-flex items-center gap-1 shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Gửi</span>
              </button>
            </form>
          </div>
        </div>

        {/* Right Column (45% ~ 5 cols): AI Triage, HITL & Audit Log */}
        <div className="lg:col-span-5 space-y-6">
          {/* AI Triage & HITL Panel */}
          <AITriagePanel
            ticket={ticket}
            onAccept={handleAcceptAI}
            onOverride={handleOverrideAI}
            isSubmitting={isSubmitting}
          />

          {/* Audit Logs / Activity History */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
              <Clock className="w-4 h-4 text-slate-500" />
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Nhật ký Vận hành & Phân loại
              </h3>
            </div>

            <div className="space-y-3 pt-1">
              {ticket.auditLogs.map((log) => (
                <div key={log.id} className="text-xs border-l-2 border-blue-400 pl-3 py-0.5 space-y-0.5">
                  <div className="flex items-center justify-between text-slate-500 text-[11px]">
                    <span className="font-semibold text-slate-700">{log.actor}</span>
                    <span>{new Date(log.timestamp).toLocaleTimeString('vi-VN')}</span>
                  </div>
                  <p className="font-medium text-slate-900">{log.action}</p>
                  {log.details && <p className="text-slate-500 text-[11px] italic">{log.details}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
