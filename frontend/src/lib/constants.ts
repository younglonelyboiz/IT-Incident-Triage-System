import { Priority, TicketState, UserRole } from '@/types'

export const PRIORITY_CONFIG: Record<
  Priority,
  {
    label: string
    color: string
    bgLight: string
    border: string
    text: string
    slaHours: number
    description: string
  }
> = {
  P1: {
    label: 'P1 Khẩn cấp',
    color: '#DC2626',
    bgLight: 'bg-zinc-100',
    border: 'border-zinc-300',
    text: 'text-zinc-900',
    slaHours: 1,
    description: 'Ngừng trệ toàn bộ hệ thống / ảnh hưởng diện rộng',
  },
  P2: {
    label: 'P2 Cao',
    color: '#D97706',
    bgLight: 'bg-zinc-100',
    border: 'border-zinc-200',
    text: 'text-zinc-800',
    slaHours: 4,
    description: 'Chức năng cốt lõi bị gián đoạn, có thể có giải pháp tạm thời',
  },
  P3: {
    label: 'P3 Trung bình',
    color: '#71717A',
    bgLight: 'bg-zinc-100',
    border: 'border-zinc-200',
    text: 'text-zinc-700',
    slaHours: 8,
    description: 'Sự cố ảnh hưởng bộ phận nhỏ người dùng',
  },
  P4: {
    label: 'P4 Thấp',
    color: '#A1A1AA',
    bgLight: 'bg-zinc-50',
    border: 'border-zinc-200',
    text: 'text-zinc-600',
    slaHours: 24,
    description: 'Yêu cầu hỗ trợ thông thường hoặc lỗi nhỏ',
  },
}

export const STATE_CONFIG: Record<
  TicketState,
  {
    label: string
    badgeClass: string
  }
> = {
  NEW: {
    label: 'Mới tạo',
    badgeClass: 'bg-zinc-100 text-zinc-700 border-zinc-200',
  },
  AI_SUGGESTED: {
    label: 'AI Đã Triage',
    badgeClass: 'bg-zinc-900 text-white border-zinc-900 font-medium',
  },
  PENDING_TRIAGE: {
    label: 'Chờ Triage',
    badgeClass: 'bg-zinc-100 text-zinc-800 border-zinc-300',
  },
  TRIAGED: {
    label: 'Đã Triage',
    badgeClass: 'bg-zinc-100 text-zinc-800 border-zinc-200',
  },
  IN_PROGRESS: {
    label: 'Đang xử lý',
    badgeClass: 'bg-zinc-100 text-zinc-900 border-zinc-300 font-medium',
  },
  RESOLVED: {
    label: 'Đã giải quyết',
    badgeClass: 'bg-zinc-100 text-zinc-600 border-zinc-200',
  },
  CLOSED: {
    label: 'Đã đóng',
    badgeClass: 'bg-zinc-50 text-zinc-400 border-zinc-200',
  },
  MANUAL_TRIAGE_REQUIRED: {
    label: 'Cần Triage Thủ công',
    badgeClass: 'bg-red-50 text-red-700 border-red-200 font-medium',
  },
}

export const CATEGORIES = [
  'Mạng & Kết nối (Network & VPN)',
  'Hệ thống & Máy chủ (Server & Cloud)',
  'Phần mềm doanh nghiệp (ERP, SAP, Office)',
  'Phần cứng & Thiết bị (Laptop, Printer)',
  'Tài khoản & Bảo mật (Auth & Access)',
  'Khác (Other)',
]

export const SEED_USERS = [
  {
    role: 'END_USER' as UserRole,
    name: 'Nguyễn Văn An',
    email: 'an.nguyen@company.com',
    password: 'password123',
    department: 'Phòng Kế toán - Tài chính',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    description: 'Nhân viên báo cáo sự cố (End-user portal)',
  },
  {
    role: 'IT_SUPPORT' as UserRole,
    name: 'Trần Minh Đức',
    email: 'duc.tran@company.com',
    password: 'password123',
    department: 'Trung tâm Vận hành IT L2',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    description: 'Kỹ thuật viên IT Support (Workbench & Triage)',
  },
  {
    role: 'ADMIN' as UserRole,
    name: 'Lê Hoàng Nam',
    email: 'nam.le@company.com',
    password: 'password123',
    department: 'Khối Quản trị Công nghệ Thông tin',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    description: 'Quản trị viên IT (Dashboard & Giám sát SLA)',
  },
]
