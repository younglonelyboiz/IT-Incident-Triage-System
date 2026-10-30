import React, { useState } from 'react'
import { Check, Edit3, ShieldAlert, X } from 'lucide-react'
import { CATEGORIES } from '@/lib/constants'
import { Priority, Ticket } from '@/types'

interface HITLPanelProps {
  ticket: Ticket
  onAccept: () => Promise<void>
  onOverride: (params: { category: string; priority: Priority; overrideReason: string }) => Promise<void>
  isSubmitting?: boolean
}

export const HITLPanel: React.FC<HITLPanelProps> = ({
  ticket,
  onAccept,
  onOverride,
  isSubmitting = false,
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(ticket.category)
  const [selectedPriority, setSelectedPriority] = useState<Priority>(ticket.priority)
  const [reason, setReason] = useState('')
  const [reasonError, setReasonError] = useState<string | null>(null)

  const handleValidateReason = () => {
    if (!reason.trim()) {
      setReasonError('Vui lòng nhập lý do ghi đè (bắt buộc cho kiểm toán ITIL)')
      return false
    }
    if (reason.trim().length < 10) {
      setReasonError('Lý do ghi đè cần cụ thể hơn (tối thiểu 10 ký tự)')
      return false
    }
    setReasonError(null)
    return true
  }

  const handleSaveOverride = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!handleValidateReason()) return

    await onOverride({
      category: selectedCategory,
      priority: selectedPriority,
      overrideReason: reason,
    })
    setIsEditing(false)
  }

  return (
    <div className="bg-white rounded-lg border border-zinc-200 p-4 shadow-xs">
      <div className="flex items-center justify-between pb-3 border-b border-zinc-100 mb-3">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-zinc-700" aria-hidden="true" />
          <h4 className="text-sm font-semibold text-zinc-900">
            Phê duyệt Chuyên viên (Human-in-the-Loop)
          </h4>
        </div>
        {ticket.hitlReviewed && (
          <span className="text-[11px] font-medium text-sky-800 bg-sky-50 border border-sky-200 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
            <Check className="w-3 h-3 text-sky-600" />
            Đã thẩm định
          </span>
        )}
      </div>

      {ticket.hitlReviewed && !isEditing ? (
        <div className="text-xs text-slate-600 bg-slate-50/70 p-3 rounded-md border border-slate-200/80 space-y-1.5">
          <p className="font-normal text-slate-800">
            Thẩm định bởi:{' '}
            <span className="font-semibold text-sky-700">{ticket.reviewedBy || 'Kỹ thuật viên'}</span>
          </p>
          {ticket.overrideReason ? (
            <div className="pt-1.5 border-t border-slate-200/60">
              <span className="font-medium text-slate-900 block">Lý do ghi đè:</span>
              <p className="text-slate-600 italic mt-0.5">"{ticket.overrideReason}"</p>
            </div>
          ) : (
            <p className="text-slate-600">Đã đồng ý toàn bộ đề xuất phân loại tự động của AI.</p>
          )}

          <div className="pt-2">
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="text-xs font-medium text-sky-600 hover:text-sky-800 underline cursor-pointer inline-flex items-center gap-1"
            >
              <Edit3 className="w-3 h-3" />
              Điều chỉnh lại phân loại
            </button>
          </div>
        </div>
      ) : !isEditing ? (
        <div className="space-y-3">
          <p className="text-xs text-slate-600 leading-relaxed">
            Hệ thống AI đã phân tích ngữ cảnh và đề xuất phân loại sơ bộ. Vui lòng xác nhận hoặc hiệu chỉnh để chuyển sang hàng đợi xử lý.
          </p>
          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={onAccept}
              disabled={isSubmitting}
              className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-medium text-white bg-sky-600 hover:bg-sky-700 disabled:opacity-50 rounded-md shadow-xs cursor-pointer transition-colors"
            >
              <Check className="w-4 h-4" />
              <span>Chấp nhận đề xuất AI</span>
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-md cursor-pointer transition-colors"
            >
              <Edit3 className="w-4 h-4" />
              <span>Chỉnh sửa / Ghi đè</span>
            </button>
          </div>
        </div>
      ) : (
        /* Inline Override Form */
        <form onSubmit={handleSaveOverride} className="space-y-3 bg-zinc-50 p-3.5 rounded-md border border-zinc-200">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-200">
            <span className="text-xs font-semibold text-zinc-900">Ghi đè kết quả phân loại</span>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="text-zinc-400 hover:text-zinc-600 cursor-pointer p-0.5"
              aria-label="Hủy chỉnh sửa"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div>
            <label htmlFor="override-category" className="block text-xs font-medium text-zinc-700 mb-1">
              Danh mục mới:
            </label>
            <select
              id="override-category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full text-xs bg-white border border-zinc-200 rounded-md p-2 text-zinc-800 focus:outline-none focus:border-zinc-900"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="override-priority" className="block text-xs font-medium text-zinc-700 mb-1">
              Mức ưu tiên mới:
            </label>
            <select
              id="override-priority"
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value as Priority)}
              className="w-full text-xs bg-white border border-zinc-200 rounded-md p-2 text-zinc-800 focus:outline-none focus:border-zinc-900 font-mono"
            >
              <option value="P1">P1 Khẩn cấp (SLA 1h)</option>
              <option value="P2">P2 Cao (SLA 4h)</option>
              <option value="P3">P3 Trung bình (SLA 8h)</option>
              <option value="P4">P4 Thấp (SLA 24h)</option>
            </select>
          </div>

          <div>
            <label htmlFor="override-reason" className="block text-xs font-medium text-zinc-700 mb-1">
              Lý do ghi đè (Bắt buộc) <span className="text-red-500">*</span>:
            </label>
            <textarea
              id="override-reason"
              rows={2}
              value={reason}
              onChange={(e) => {
                setReason(e.target.value)
                if (reasonError) setReasonError(null)
              }}
              onBlur={handleValidateReason}
              placeholder="VD: Hạ từ P1 xuống P2 vì người dùng có đường truyền dự phòng..."
              className={`w-full text-xs bg-white border rounded-md p-2 text-zinc-800 focus:outline-none focus:border-zinc-900 ${
                reasonError ? 'border-red-500 ring-1 ring-red-500' : 'border-zinc-200'
              }`}
            />
            {reasonError && <p className="text-[11px] text-red-600 mt-1 font-medium">{reasonError}</p>}
          </div>

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-3 py-1.5 text-xs text-zinc-600 hover:bg-zinc-200/60 rounded cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-3 py-1.5 text-xs font-medium text-white bg-zinc-900 hover:bg-zinc-800 disabled:opacity-50 rounded-md shadow-xs cursor-pointer"
            >
              Lưu & Xác nhận
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
