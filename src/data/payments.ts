import type { Payment } from '@/types'

/** Mock transaction ledger. Replace with `GET /api/payments`. */
export const payments: Payment[] = [
  { id: 'pay-001', invoiceId: 'INV-2026-1041', studentName: 'Aarav Sharma', program: 'Full Stack Development', amount: 24999, method: 'UPI', status: 'paid', date: '2026-07-28' },
  { id: 'pay-002', invoiceId: 'INV-2026-1042', studentName: 'Diya Nair', program: 'Cyber Security', amount: 19999, method: 'Card', status: 'paid', date: '2026-07-28' },
  { id: 'pay-003', invoiceId: 'INV-2026-1043', studentName: 'Karthik Reddy', program: 'Agentic AI', amount: 27999, method: 'Net Banking', status: 'pending', date: '2026-07-30' },
  { id: 'pay-004', invoiceId: 'INV-2026-1044', studentName: 'Ishita Rao', program: 'Artificial Intelligence', amount: 26999, method: 'UPI', status: 'paid', date: '2026-07-31' },
  { id: 'pay-005', invoiceId: 'INV-2026-1045', studentName: 'Tanvi Desai', program: 'Cyber Security', amount: 19999, method: 'Card', status: 'failed', date: '2026-08-01' },
  { id: 'pay-006', invoiceId: 'INV-2026-1046', studentName: 'Sneha Iyer', program: 'Full Stack Development', amount: 24999, method: 'UPI', status: 'paid', date: '2026-08-01' },
  { id: 'pay-007', invoiceId: 'INV-2026-1047', studentName: 'Arjun Gowda', program: 'Agentic AI', amount: 27999, method: 'Wallet', status: 'pending', date: '2026-08-02' },
  { id: 'pay-008', invoiceId: 'INV-2026-1048', studentName: 'Meera Joshi', program: 'Python Programming', amount: 14999, method: 'UPI', status: 'paid', date: '2026-08-02' },
  { id: 'pay-009', invoiceId: 'INV-2026-1049', studentName: 'Vikram Singh', program: 'Artificial Intelligence', amount: 26999, method: 'Net Banking', status: 'refunded', date: '2026-08-03' },
  { id: 'pay-010', invoiceId: 'INV-2026-1050', studentName: 'Rahul Menon', program: 'Full Stack Development', amount: 24999, method: 'Card', status: 'paid', date: '2026-08-03' },
  { id: 'pay-011', invoiceId: 'INV-2026-1051', studentName: 'Nithya Krishnan', program: 'Artificial Intelligence', amount: 26999, method: 'UPI', status: 'paid', date: '2026-08-04' },
  { id: 'pay-012', invoiceId: 'INV-2026-1052', studentName: 'Shreya Kapoor', program: 'Python Programming', amount: 14999, method: 'Wallet', status: 'failed', date: '2026-08-04' },
  { id: 'pay-013', invoiceId: 'INV-2026-1053', studentName: 'Manish Patel', program: 'Cyber Security', amount: 19999, method: 'UPI', status: 'paid', date: '2026-08-05' },
  { id: 'pay-014', invoiceId: 'INV-2026-1054', studentName: 'Ananya Pillai', program: 'Agentic AI', amount: 27999, method: 'Card', status: 'pending', date: '2026-08-05' },
]

/** Pre-computed roll-ups for the Payments summary cards. */
const sum = (status: Payment['status']) =>
  payments.filter((p) => p.status === status).reduce((total, p) => total + p.amount, 0)

export const paymentSummary = {
  total: payments.reduce((total, p) => total + p.amount, 0),
  paid: sum('paid'),
  pending: sum('pending'),
  failed: sum('failed'),
  counts: {
    paid: payments.filter((p) => p.status === 'paid').length,
    pending: payments.filter((p) => p.status === 'pending').length,
    failed: payments.filter((p) => p.status === 'failed').length,
  },
}
