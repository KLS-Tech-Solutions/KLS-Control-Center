import type { Student } from '@/types'

/** Mock student roster. Replace with `GET /api/students` during backend integration. */
export const students: Student[] = [
  { id: 'stu-001', name: 'Aarav Sharma', email: 'aarav.sharma@gmail.com', phone: '+91 98450 11234', course: 'Full Stack Development', status: 'active', joinedDate: '2026-01-12', progress: 74 },
  { id: 'stu-002', name: 'Diya Nair', email: 'diya.nair@outlook.com', phone: '+91 99860 22145', course: 'Cyber Security', status: 'active', joinedDate: '2026-01-28', progress: 61 },
  { id: 'stu-003', name: 'Rohan Verma', email: 'rohan.verma@gmail.com', phone: '+91 97410 33456', course: 'Python Programming', status: 'completed', joinedDate: '2025-10-05', progress: 100 },
  { id: 'stu-004', name: 'Ishita Rao', email: 'ishita.rao@yahoo.in', phone: '+91 90080 44567', course: 'Artificial Intelligence', status: 'active', joinedDate: '2026-02-14', progress: 45 },
  { id: 'stu-005', name: 'Karthik Reddy', email: 'karthik.reddy@gmail.com', phone: '+91 96320 55678', course: 'Agentic AI', status: 'pending', joinedDate: '2026-06-02', progress: 8 },
  { id: 'stu-006', name: 'Sneha Iyer', email: 'sneha.iyer@gmail.com', phone: '+91 88840 66789', course: 'Full Stack Development', status: 'active', joinedDate: '2026-03-09', progress: 52 },
  { id: 'stu-007', name: 'Aditya Kulkarni', email: 'aditya.k@protonmail.com', phone: '+91 93420 77890', course: 'Cyber Security', status: 'completed', joinedDate: '2025-09-21', progress: 100 },
  { id: 'stu-008', name: 'Meera Joshi', email: 'meera.joshi@gmail.com', phone: '+91 99720 88901', course: 'Python Programming', status: 'active', joinedDate: '2026-04-18', progress: 38 },
  { id: 'stu-009', name: 'Vikram Singh', email: 'vikram.singh@gmail.com', phone: '+91 90190 99012', course: 'Artificial Intelligence', status: 'inactive', joinedDate: '2025-12-01', progress: 22 },
  { id: 'stu-010', name: 'Ananya Pillai', email: 'ananya.pillai@gmail.com', phone: '+91 97390 10123', course: 'Agentic AI', status: 'active', joinedDate: '2026-05-07', progress: 67 },
  { id: 'stu-011', name: 'Rahul Menon', email: 'rahul.menon@zoho.com', phone: '+91 94480 21234', course: 'Full Stack Development', status: 'active', joinedDate: '2026-02-25', progress: 81 },
  { id: 'stu-012', name: 'Tanvi Desai', email: 'tanvi.desai@gmail.com', phone: '+91 98860 32345', course: 'Cyber Security', status: 'pending', joinedDate: '2026-07-11', progress: 5 },
  { id: 'stu-013', name: 'Siddharth Bose', email: 'sid.bose@gmail.com', phone: '+91 90350 43456', course: 'Python Programming', status: 'completed', joinedDate: '2025-11-14', progress: 100 },
  { id: 'stu-014', name: 'Nithya Krishnan', email: 'nithya.k@gmail.com', phone: '+91 89040 54567', course: 'Artificial Intelligence', status: 'active', joinedDate: '2026-03-30', progress: 58 },
  { id: 'stu-015', name: 'Arjun Gowda', email: 'arjun.gowda@gmail.com', phone: '+91 96110 65678', course: 'Agentic AI', status: 'active', joinedDate: '2026-06-19', progress: 29 },
  { id: 'stu-016', name: 'Pooja Hegde', email: 'pooja.hegde@gmail.com', phone: '+91 99450 76789', course: 'Full Stack Development', status: 'inactive', joinedDate: '2025-08-08', progress: 15 },
  { id: 'stu-017', name: 'Manish Patel', email: 'manish.patel@gmail.com', phone: '+91 97400 87890', course: 'Cyber Security', status: 'active', joinedDate: '2026-04-02', progress: 70 },
  { id: 'stu-018', name: 'Shreya Kapoor', email: 'shreya.kapoor@gmail.com', phone: '+91 93810 98901', course: 'Python Programming', status: 'active', joinedDate: '2026-05-23', progress: 43 },
]

/** Distinct course names — drives the Students page filter. */
export const courses = Array.from(new Set(students.map((s) => s.course)))
