import { INITIAL_TICKETS, MOCK_DEFLECTION_SOLUTIONS } from './mockData'
import { DeflectionSolution, Priority, Ticket, TicketComment, TicketFiltersState, TicketState } from '@/types'

const STORAGE_KEY_TICKETS = 'it_incident_tickets'

function loadStoredTickets(): Ticket[] {
  const raw = localStorage.getItem(STORAGE_KEY_TICKETS)
  if (!raw) {
    localStorage.setItem(STORAGE_KEY_TICKETS, JSON.stringify(INITIAL_TICKETS))
    return INITIAL_TICKETS
  }
  try {
    return JSON.parse(raw) as Ticket[]
  } catch {
    return INITIAL_TICKETS
  }
}

function saveTickets(tickets: Ticket[]) {
  localStorage.setItem(STORAGE_KEY_TICKETS, JSON.stringify(tickets))
}

export const ticketService = {
  async getTickets(filters?: Partial<TicketFiltersState>): Promise<Ticket[]> {
    let tickets = loadStoredTickets()

    if (filters?.search) {
      const q = filters.search.toLowerCase()
      tickets = tickets.filter(
        (t) =>
          t.ticketCode.toLowerCase().includes(q) ||
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.requesterName.toLowerCase().includes(q)
      )
    }

    if (filters?.category && filters.category !== 'all') {
      tickets = tickets.filter((t) => t.category === filters.category)
    }

    if (filters?.priority && filters.priority !== 'all') {
      tickets = tickets.filter((t) => t.priority === filters.priority)
    }

    if (filters?.state && filters.state !== 'all') {
      tickets = tickets.filter((t) => t.state === filters.state)
    }

    return tickets
  },

  async getTicketById(id: string): Promise<Ticket | null> {
    const tickets = loadStoredTickets()
    return tickets.find((t) => t.id === id || t.ticketCode === id) || null
  },

  async createTicket(payload: {
    title: string
    description: string
    deviceOrSystem?: string
    requesterName: string
    requesterEmail: string
    requesterDepartment: string
  }): Promise<Ticket> {
    await new Promise((r) => setTimeout(r, 500))
    const tickets = loadStoredTickets()
    const nextNum = tickets.length + 43
    const code = `INC-00${nextNum}`

    // Giả lập AI Triage
    const titleLower = payload.title.toLowerCase()
    let category = 'Hệ thống & Máy chủ (Server & Cloud)'
    let priority: Priority = 'P3'
    let confidence = 0.88
    let impact: 'CAO' | 'TRUNG_BINH' | 'THAP' = 'TRUNG_BINH'
    let urgency: 'CAO' | 'TRUNG_BINH' | 'THAP' = 'TRUNG_BINH'

    if (titleLower.includes('vpn') || titleLower.includes('mạng') || titleLower.includes('wifi') || titleLower.includes('kết nối')) {
      category = 'Mạng & Kết nối (Network & VPN)'
      priority = titleLower.includes('toàn bộ') || titleLower.includes('nhiều người') ? 'P1' : 'P2'
      confidence = 0.91
      impact = 'CAO'
      urgency = 'CAO'
    } else if (titleLower.includes('pass') || titleLower.includes('mật khẩu') || titleLower.includes('tài khoản')) {
      category = 'Tài khoản & Bảo mật (Auth & Access)'
      priority = 'P3'
      confidence = 0.95
    } else if (titleLower.includes('máy in') || titleLower.includes('laptop') || titleLower.includes('màn hình')) {
      category = 'Phần cứng & Thiết bị (Laptop, Printer)'
      priority = 'P4'
      confidence = 0.86
      impact = 'THAP'
      urgency = 'THAP'
    }

    const slaHoursMap: Record<Priority, number> = { P1: 1, P2: 4, P3: 8, P4: 24 }
    const slaDeadline = new Date(Date.now() + slaHoursMap[priority] * 60 * 60 * 1000).toISOString()

    const newTicket: Ticket = {
      id: `t-${Date.now()}`,
      ticketCode: code,
      title: payload.title,
      description: payload.description,
      category,
      priority,
      state: 'AI_SUGGESTED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      slaDeadline,
      requesterId: 'u-current',
      requesterName: payload.requesterName,
      requesterEmail: payload.requesterEmail,
      requesterDepartment: payload.requesterDepartment,
      deviceOrSystem: payload.deviceOrSystem,
      hitlReviewed: false,
      comments: [],
      auditLogs: [
        {
          id: `a-${Date.now()}`,
          timestamp: new Date().toISOString(),
          actor: payload.requesterName,
          action: `Tạo mới sự cố ${code}`,
        },
        {
          id: `a-ai-${Date.now()}`,
          timestamp: new Date().toISOString(),
          actor: 'AI Incident Triage Agent',
          action: `Đề xuất: ${priority} | ${category} (Độ tin cậy ${Math.round(confidence * 100)}%)`,
        },
      ],
      aiTriage: {
        suggestedPriority: priority,
        suggestedCategory: category,
        confidence,
        impact,
        urgency,
        reasoning: `Phát hiện các từ khóa trọng yếu trong tiêu đề và ngữ cảnh mô tả của người dùng. Hệ số rủi ro tác động: ${impact}.`,
        missingInformation: payload.description.length < 50 ? ['Chi tiết các bước tái hiện lỗi', 'Ảnh chụp màn hình'] : [],
        similarIncidents: [],
      },
    }

    tickets.unshift(newTicket)
    saveTickets(tickets)
    return newTicket
  },

  async acceptAITriage(id: string, reviewerName: string): Promise<Ticket> {
    await new Promise((r) => setTimeout(r, 300))
    const tickets = loadStoredTickets()
    const index = tickets.findIndex((t) => t.id === id || t.ticketCode === id)
    if (index === -1) throw new Error('Không tìm thấy ticket')

    const ticket = { ...tickets[index] }
    ticket.hitlReviewed = true
    ticket.reviewedBy = reviewerName
    ticket.state = 'TRIAGED'
    ticket.updatedAt = new Date().toISOString()
    ticket.auditLogs.push({
      id: `a-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor: `${reviewerName} (IT Support)`,
      action: `HITL: Chấp nhận đề xuất AI (${ticket.priority} - ${ticket.category})`,
    })

    tickets[index] = ticket
    saveTickets(tickets)
    return ticket
  },

  async overrideAITriage(
    id: string,
    params: {
      category: string
      priority: Priority
      overrideReason: string
      reviewerName: string
    }
  ): Promise<Ticket> {
    await new Promise((r) => setTimeout(r, 400))
    const tickets = loadStoredTickets()
    const index = tickets.findIndex((t) => t.id === id || t.ticketCode === id)
    if (index === -1) throw new Error('Không tìm thấy ticket')

    const ticket = { ...tickets[index] }
    const oldP = ticket.priority
    const oldC = ticket.category

    ticket.priority = params.priority
    ticket.category = params.category
    ticket.hitlReviewed = true
    ticket.reviewedBy = params.reviewerName
    ticket.overrideReason = params.overrideReason
    ticket.state = 'TRIAGED'
    ticket.updatedAt = new Date().toISOString()

    ticket.auditLogs.push({
      id: `a-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor: `${params.reviewerName} (IT Support)`,
      action: `HITL Override: Thay đổi từ [${oldP} - ${oldC}] thành [${params.priority} - ${params.category}]`,
      details: `Lý do ghi đè: ${params.overrideReason}`,
    })

    tickets[index] = ticket
    saveTickets(tickets)
    return ticket
  },

  async updateTicketState(id: string, newState: TicketState, actorName: string): Promise<Ticket> {
    await new Promise((r) => setTimeout(r, 300))
    const tickets = loadStoredTickets()
    const index = tickets.findIndex((t) => t.id === id || t.ticketCode === id)
    if (index === -1) throw new Error('Không tìm thấy ticket')

    const ticket = { ...tickets[index] }
    ticket.state = newState
    ticket.updatedAt = new Date().toISOString()
    ticket.auditLogs.push({
      id: `a-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor: actorName,
      action: `Chuyển trạng thái sang: ${newState}`,
    })

    tickets[index] = ticket
    saveTickets(tickets)
    return ticket
  },

  async addComment(
    id: string,
    comment: Omit<TicketComment, 'id' | 'createdAt'>
  ): Promise<Ticket> {
    await new Promise((r) => setTimeout(r, 200))
    const tickets = loadStoredTickets()
    const index = tickets.findIndex((t) => t.id === id || t.ticketCode === id)
    if (index === -1) throw new Error('Không tìm thấy ticket')

    const ticket = { ...tickets[index] }
    ticket.comments.push({
      ...comment,
      id: `c-${Date.now()}`,
      createdAt: new Date().toISOString(),
    })

    tickets[index] = ticket
    saveTickets(tickets)
    return ticket
  },

  async getDeflections(query: string): Promise<DeflectionSolution[]> {
    await new Promise((r) => setTimeout(r, 250))
    const q = query.toLowerCase()
    if (!q || q.length < 3) return []

    if (q.includes('vpn') || q.includes('kết nối') || q.includes('anyconnect') || q.includes('mạng')) {
      return MOCK_DEFLECTION_SOLUTIONS.vpn || []
    }
    if (q.includes('pass') || q.includes('mật khẩu') || q.includes('quên') || q.includes('đăng nhập')) {
      return MOCK_DEFLECTION_SOLUTIONS.password || []
    }
    if (q.includes('in') || q.includes('printer') || q.includes('kẹt') || q.includes('hp')) {
      return MOCK_DEFLECTION_SOLUTIONS.printer || []
    }

    return []
  },
}
