import type { Certificate } from '@/types'

/** Mock certificate ledger. Replace with `GET /api/certificates`. */
export const certificates: Certificate[] = [
  { id: 'crt-001', certificateId: 'KLS-2026-PY-0142', studentName: 'Rohan Verma', studentEmail: 'rohan.verma@gmail.com', program: 'Python Programming', status: 'issued', issuedDate: '2026-01-15', grade: 'A+' },
  { id: 'crt-002', certificateId: 'KLS-2026-CS-0088', studentName: 'Aditya Kulkarni', studentEmail: 'aditya.k@protonmail.com', program: 'Cyber Security', status: 'issued', issuedDate: '2026-01-22', grade: 'A' },
  { id: 'crt-003', certificateId: 'KLS-2026-PY-0143', studentName: 'Siddharth Bose', studentEmail: 'sid.bose@gmail.com', program: 'Python Programming', status: 'issued', issuedDate: '2026-02-04', grade: 'A+' },
  { id: 'crt-004', certificateId: 'KLS-2026-FS-0210', studentName: 'Rahul Menon', studentEmail: 'rahul.menon@zoho.com', program: 'Full Stack Development', status: 'pending', issuedDate: '2026-07-30', grade: '—' },
  { id: 'crt-005', certificateId: 'KLS-2026-AI-0061', studentName: 'Nithya Krishnan', studentEmail: 'nithya.k@gmail.com', program: 'Artificial Intelligence', status: 'issued', issuedDate: '2026-03-11', grade: 'A' },
  { id: 'crt-006', certificateId: 'KLS-2026-AG-0019', studentName: 'Ananya Pillai', studentEmail: 'ananya.pillai@gmail.com', program: 'Agentic AI', status: 'issued', issuedDate: '2026-04-08', grade: 'B+' },
  { id: 'crt-007', certificateId: 'KLS-2026-CS-0089', studentName: 'Manish Patel', studentEmail: 'manish.patel@gmail.com', program: 'Cyber Security', status: 'pending', issuedDate: '2026-08-01', grade: '—' },
  { id: 'crt-008', certificateId: 'KLS-2025-FS-0198', studentName: 'Pooja Hegde', studentEmail: 'pooja.hegde@gmail.com', program: 'Full Stack Development', status: 'revoked', issuedDate: '2025-12-19', grade: 'C' },
  { id: 'crt-009', certificateId: 'KLS-2026-AI-0062', studentName: 'Ishita Rao', studentEmail: 'ishita.rao@yahoo.in', program: 'Artificial Intelligence', status: 'issued', issuedDate: '2026-05-16', grade: 'A' },
  { id: 'crt-010', certificateId: 'KLS-2026-PY-0144', studentName: 'Meera Joshi', studentEmail: 'meera.joshi@gmail.com', program: 'Python Programming', status: 'issued', issuedDate: '2026-06-03', grade: 'B+' },
  { id: 'crt-011', certificateId: 'KLS-2026-FS-0211', studentName: 'Sneha Iyer', studentEmail: 'sneha.iyer@gmail.com', program: 'Full Stack Development', status: 'issued', issuedDate: '2026-06-27', grade: 'A' },
  { id: 'crt-012', certificateId: 'KLS-2026-AG-0020', studentName: 'Arjun Gowda', studentEmail: 'arjun.gowda@gmail.com', program: 'Agentic AI', status: 'pending', issuedDate: '2026-08-04', grade: '—' },
]
