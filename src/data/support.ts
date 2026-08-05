import type { Ticket } from '@/types'

/** Mock support queue. Replace with `GET /api/tickets`. */
export const tickets: Ticket[] = [
  { id: 'tkt-001', ticketId: 'KLS-T-4821', subject: 'Certificate name spelt incorrectly', requester: 'Rohan Verma', category: 'Certificates', priority: 'medium', status: 'open', createdAt: '2026-08-04', assignee: 'Priya Menon' },
  { id: 'tkt-002', ticketId: 'KLS-T-4822', subject: 'UPI payment deducted but not reflected', requester: 'Tanvi Desai', category: 'Payments', priority: 'urgent', status: 'in-progress', createdAt: '2026-08-04', assignee: 'Sandeep Rao' },
  { id: 'tkt-003', ticketId: 'KLS-T-4823', subject: 'Unable to access week 6 lab environment', requester: 'Diya Nair', category: 'Platform', priority: 'high', status: 'in-progress', createdAt: '2026-08-03', assignee: 'Imran Sheikh' },
  { id: 'tkt-004', ticketId: 'KLS-T-4824', subject: 'Request to switch batch timing', requester: 'Meera Joshi', category: 'Enrolment', priority: 'low', status: 'resolved', createdAt: '2026-08-02', assignee: 'Priya Menon' },
  { id: 'tkt-005', ticketId: 'KLS-T-4825', subject: 'Mentor session did not start on time', requester: 'Arjun Gowda', category: 'Mentorship', priority: 'medium', status: 'open', createdAt: '2026-08-02', assignee: 'Nikhil Bhat' },
  { id: 'tkt-006', ticketId: 'KLS-T-4826', subject: 'Invoice GST details need correction', requester: 'Rahul Menon', category: 'Payments', priority: 'high', status: 'open', createdAt: '2026-08-01', assignee: 'Sandeep Rao' },
  { id: 'tkt-007', ticketId: 'KLS-T-4827', subject: 'Course material download failing', requester: 'Shreya Kapoor', category: 'Platform', priority: 'medium', status: 'resolved', createdAt: '2026-07-31', assignee: 'Imran Sheikh' },
  { id: 'tkt-008', ticketId: 'KLS-T-4828', subject: 'Requesting completion letter for visa', requester: 'Aditya Kulkarni', category: 'Certificates', priority: 'low', status: 'closed', createdAt: '2026-07-30', assignee: 'Priya Menon' },
  { id: 'tkt-009', ticketId: 'KLS-T-4829', subject: 'Capstone submission deadline extension', requester: 'Nithya Krishnan', category: 'Academics', priority: 'medium', status: 'in-progress', createdAt: '2026-07-29', assignee: 'Dr. Kavya Suresh' },
  { id: 'tkt-010', ticketId: 'KLS-T-4830', subject: 'Refund status for cancelled enrolment', requester: 'Vikram Singh', category: 'Payments', priority: 'urgent', status: 'open', createdAt: '2026-07-28', assignee: 'Sandeep Rao' },
]

export const ticketSummary = {
  open: tickets.filter((t) => t.status === 'open').length,
  inProgress: tickets.filter((t) => t.status === 'in-progress').length,
  resolved: tickets.filter((t) => t.status === 'resolved').length,
  urgent: tickets.filter((t) => t.priority === 'urgent').length,
}
