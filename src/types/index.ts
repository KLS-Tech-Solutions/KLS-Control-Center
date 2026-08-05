/**
 * Domain types for KLS Control Center.
 *
 * These shapes mirror what the future FastAPI service is expected to return, so
 * swapping the mock modules in `src/data` for real fetches later is a one-file
 * change per resource with no component edits.
 */

export type StudentStatus = 'active' | 'completed' | 'pending' | 'inactive'

export interface Student {
  id: string
  name: string
  email: string
  phone: string
  course: string
  status: StudentStatus
  joinedDate: string // ISO date
  progress: number // 0–100
}

export type InternshipStatus = 'open' | 'ongoing' | 'closed'

export interface Internship {
  id: string
  title: string
  slug: string
  description: string
  duration: string
  status: InternshipStatus
  enrolled: number
  seats: number
  mentor: string
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  stack: string[]
}

export type CertificateStatus = 'issued' | 'pending' | 'revoked'

export interface Certificate {
  id: string
  certificateId: string
  studentName: string
  studentEmail: string
  program: string
  status: CertificateStatus
  issuedDate: string
  grade: string
}

export type PaymentStatus = 'paid' | 'pending' | 'failed' | 'refunded'

export interface Payment {
  id: string
  invoiceId: string
  studentName: string
  program: string
  amount: number
  method: 'UPI' | 'Card' | 'Net Banking' | 'Wallet'
  status: PaymentStatus
  date: string
}

export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent'
export type TicketStatus = 'open' | 'in-progress' | 'resolved' | 'closed'

export interface Ticket {
  id: string
  ticketId: string
  subject: string
  requester: string
  category: string
  priority: TicketPriority
  status: TicketStatus
  createdAt: string
  assignee: string
}

/** A single point on any time-series chart. */
export interface SeriesPoint {
  month: string
  [key: string]: string | number
}

export interface ActivityItem {
  id: string
  actor: string
  action: string
  target: string
  timestamp: string
  type: 'student' | 'payment' | 'certificate' | 'system' | 'support'
}

export interface SystemService {
  name: string
  status: 'operational' | 'degraded' | 'down'
  uptime: string
  latency: string
}
