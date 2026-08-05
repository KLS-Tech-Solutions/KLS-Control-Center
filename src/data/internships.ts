import type { Internship } from '@/types'

/** The five KLS internship tracks. Replace with `GET /api/internships`. */
export const internships: Internship[] = [
  {
    id: 'int-001',
    title: 'Python Programming',
    slug: 'python',
    description:
      'Core Python, data structures, automation scripting and a capstone CLI project reviewed by an assigned mentor.',
    duration: '8 weeks',
    status: 'ongoing',
    enrolled: 84,
    seats: 100,
    mentor: 'Sandeep Rao',
    level: 'Beginner',
    stack: ['Python 3.12', 'Pytest', 'Pandas'],
  },
  {
    id: 'int-002',
    title: 'Full Stack Development',
    slug: 'full-stack',
    description:
      'React and FastAPI end to end — component architecture, REST design, auth patterns and production deployment.',
    duration: '12 weeks',
    status: 'ongoing',
    enrolled: 126,
    seats: 140,
    mentor: 'Priya Menon',
    level: 'Intermediate',
    stack: ['React', 'FastAPI', 'PostgreSQL'],
  },
  {
    id: 'int-003',
    title: 'Cyber Security',
    slug: 'cyber-security',
    description:
      'Network fundamentals, threat modelling, OWASP Top 10 and hands-on lab work in a sandboxed environment.',
    duration: '10 weeks',
    status: 'open',
    enrolled: 58,
    seats: 90,
    mentor: 'Imran Sheikh',
    level: 'Intermediate',
    stack: ['Kali Linux', 'Burp Suite', 'Wireshark'],
  },
  {
    id: 'int-004',
    title: 'Artificial Intelligence',
    slug: 'ai',
    description:
      'Applied machine learning — supervised models, evaluation, feature pipelines and a deployed inference service.',
    duration: '12 weeks',
    status: 'ongoing',
    enrolled: 97,
    seats: 110,
    mentor: 'Dr. Kavya Suresh',
    level: 'Advanced',
    stack: ['PyTorch', 'scikit-learn', 'MLflow'],
  },
  {
    id: 'int-005',
    title: 'Agentic AI',
    slug: 'agentic-ai',
    description:
      'Building autonomous agents — tool use, retrieval, orchestration patterns and evaluation harnesses for LLM systems.',
    duration: '10 weeks',
    status: 'open',
    enrolled: 41,
    seats: 60,
    mentor: 'Nikhil Bhat',
    level: 'Advanced',
    stack: ['LangGraph', 'Claude API', 'Vector DB'],
  },
]
