import React, { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader2, PlusCircle } from 'lucide-react'
import { DeflectionPanel } from '@/components/deflection/DeflectionPanel'
import { TopBar } from '@/components/layout/TopBar'
import { useAuth } from '@/context/AuthContext'
import { useNotification } from '@/context/NotificationContext'
import { useDeflection } from '@/hooks/useDeflection'
import { ticketService } from '@/services/ticketService'

export const NewTicketPage: React.FC = () => {
  const { user } = useAuth()
  const { showToast } = useNotification()
  const navigate = useNavigate()

  const [title, setTitle] = useState(() => {
    if (typeof window !== 'undefined') {
      const p = new URLSearchParams(window.location.search).get('seed')
      if (p === 'vpn') return 'Không thể kết nối VPN AnyConnect từ xa'
    }
    return ''
  })
  const [description, setDescription] = useState(() => {
    if (typeof window !== 'undefined') {
      const p = new URLSearchParams(window.location.search).get('seed')
      if (p === 'vpn') return 'Cisco AnyConnect báo lỗi handshake failed khi kết nối gateway công ty'
    }
    return ''
  })
  const [deviceOrSystem, setDeviceOrSystem] = useState(() => {
    if (typeof window !== 'undefined') {
      const p = new URLSearchParams(window.location.search).get('seed')
      if (p === 'vpn') return 'Cisco AnyConnect v4.10'
    }
    return ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<{ title?: string; description?: string }>({})

  const submitBtnRef = useRef<HTMLButtonElement>(null)

  // Real-time deflection based on description or title input
  const query = `${title} ${description}`
  const { solutions, isLoading: isDeflecting } = useDeflection(query, 400)

  const validate = () => {
    const errs: { title?: string; description?: string } = {}
    if (!title.trim()) {
      errs.title = 'Vui lòng nhập tóm tắt ngắn gọn về sự cố'
    } else if (title.trim().length < 5) {
      errs.title = 'Tiêu đề quá ngắn (tối thiểu 5 ký tự)'
    }

    if (!description.trim()) {
      errs.description = 'Vui lòng mô tả chi tiết lỗi gặp phải và thông báo lỗi hiển thị'
    } else if (description.trim().length < 15) {
      errs.description = 'Mô tả cần chi tiết hơn để hệ thống AI chẩn đoán sơ bộ'
    }

    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setIsSubmitting(true)
    try {
      const created = await ticketService.createTicket({
        title,
        description,
        deviceOrSystem,
        requesterName: user?.name || 'Nhân viên',
        requesterEmail: user?.email || 'user@company.com',
        requesterDepartment: user?.department || 'Phòng ban',
      })

      showToast({
        title: 'Tạo phiếu sự cố thành công!',
        message: `Mã phiếu: ${created.ticketCode}. AI đã tự động phân tích và chuyển tới kỹ thuật viên.`,
        type: 'success',
      })

      if (user?.role === 'END_USER') {
        navigate('/my-tickets')
      } else {
        navigate(`/tickets/${created.ticketCode}`)
      }
    } catch {
      showToast({
        title: 'Lỗi',
        message: 'Không thể tạo phiếu sự cố. Vui lòng thử lại.',
        type: 'error',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeflectionResolved = () => {
    showToast({
      title: 'Tuyệt vời!',
      message: 'Cảm ơn bạn đã phản hồi. Sự cố đã được giải quyết nhanh chóng qua cơ sở tri thức!',
      type: 'success',
    })
    navigate('/my-tickets')
  }

  const handleDeflectionNotResolved = () => {
    submitBtnRef.current?.focus()
    showToast({
      title: 'Tiếp tục gửi phiếu',
      message: 'Vui lòng điền đủ thông tin và gửi phiếu để đội ngũ IT hỗ trợ bạn trực tiếp.',
      type: 'info',
    })
  }

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <TopBar
        title="Báo cáo Sự cố Công nghệ Thông tin"
        subtitle="Hệ thống AI sẽ hỗ trợ gợi ý giải pháp tức thì hoặc tự động phân loại chuyển tới chuyên viên phù hợp"
      />

      <div className="p-8 max-w-[1400px] w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form Column (60% ~ 7 cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-7 shadow-xs">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="ticket-title" className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-1.5">
                Tiêu đề sự cố <span className="text-red-500">*</span>
              </label>
              <input
                id="ticket-title"
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value)
                  if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }))
                }}
                onBlur={validate}
                placeholder="VD: Không vào được VPN HCM-01, Máy in tầng 4 kẹt giấy, Quên mật khẩu..."
                className={`w-full text-sm px-3.5 py-2.5 rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                  errors.title ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-300'
                }`}
              />
              {errors.title && <p className="text-xs text-red-600 mt-1 font-medium">{errors.title}</p>}
            </div>

            <div>
              <label htmlFor="ticket-description" className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-1.5">
                Mô tả chi tiết sự cố & Hiện tượng <span className="text-red-500">*</span>
              </label>
              <textarea
                id="ticket-description"
                rows={5}
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value)
                  if (errors.description) setErrors((prev) => ({ ...prev, description: undefined }))
                }}
                onBlur={validate}
                placeholder="Mô tả cụ thể thông báo lỗi hiển thị trên màn hình, các bước bạn đã thử thao tác, file log hoặc mã lỗi (nếu có)..."
                className={`w-full text-sm px-3.5 py-2.5 rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                  errors.description ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-300'
                }`}
              />
              {errors.description && <p className="text-xs text-red-600 mt-1 font-medium">{errors.description}</p>}
            </div>

            <div>
              <label htmlFor="ticket-device" className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-1.5">
                Thiết bị / Ứng dụng liên quan (Không bắt buộc)
              </label>
              <input
                id="ticket-device"
                type="text"
                value={deviceOrSystem}
                onChange={(e) => setDeviceOrSystem(e.target.value)}
                placeholder="VD: MacBook Pro M2, SAP ERP Client, HP LaserJet 404..."
                className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-md cursor-pointer transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                ref={submitBtnRef}
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white text-xs font-medium rounded-md shadow-xs cursor-pointer transition-colors flex items-center gap-2"
              >
                {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <PlusCircle className="w-3.5 h-3.5" />}
                <span>Gửi phiếu tới IT Support</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right AI Deflection Column (40% ~ 5 cols) */}
        <div className="lg:col-span-5">
          <DeflectionPanel
            solutions={solutions}
            isLoading={isDeflecting}
            onResolved={handleDeflectionResolved}
            onNotResolved={handleDeflectionNotResolved}
          />
        </div>
      </div>
    </div>
  )
}
