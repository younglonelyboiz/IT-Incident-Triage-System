import { AITriageResult } from './ai.types'
import { UserRole } from './user.types'

export type Priority = 'P1' | 'P2' | 'P3' | 'P4'

export type TicketState =
  | 'NEW'
  | 'AI_SUGGESTED'
  | 'PENDING_TRIAGE'
  | 'TRIAGED'
  | 'IN_PROGRESS'
  | 'RESOLVED'
  | 'CLOSED'
  | 'MANUAL_TRIAGE_REQUIRED'

export interface AuditLogEntry {
  id: string
  timestamp: string
  actor: string
  action: string
  details?: string
}

export interface TicketComment {
  id: string
  authorName: string
  authorRole: UserRole
  content: string
  createdAt: string
  isInternal: boolean
}

export interface Ticket {
  id: string
  ticketCode: string // e.g. INC-0042
  title: string
  description: string
  category: string
  priority: Priority
  state: TicketState
  createdAt: string
  updatedAt: string
  slaDeadline: string // ISO string
  requesterId: string
  requesterName: string
  requesterEmail: string
  requesterDepartment: string
  deviceOrSystem?: string
  assigneeId?: string
  assigneeName?: string
  aiTriage?: AITriageResult
  hitlReviewed: boolean
  reviewedBy?: string
  overrideReason?: string
  comments: TicketComment[]
  auditLogs: AuditLogEntry[]
}

export interface TicketFiltersState {
  search: string
  category: string
  priority: string
  state: string
}
