import { motion } from 'framer-motion'
import { ArrowUpRight, Clock, Users } from 'lucide-react'
import type { Internship } from '@/types'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { toneFor } from '@/utils/status'

/**
 * Programme tile for the Internships page. The capacity meter doubles as a
 * secondary channel for "how full is this track" alongside the numeric label.
 */
export function ModuleCard({ internship, index = 0 }: { internship: Internship; index?: number }) {
  const fill = Math.round((internship.enrolled / internship.seats) * 100)

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4 }}
      className="group bg-surface border-hairline flex h-full flex-col rounded-2xl border p-5 shadow-[var(--shadow-soft)] transition-shadow duration-300 hover:shadow-[var(--shadow-lift)]"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold tracking-tight">{internship.title}</h3>
          <p className="text-muted mt-0.5 text-[13px]">
            {internship.level} · Mentor {internship.mentor}
          </p>
        </div>
        <Badge tone={toneFor(internship.status)}>{internship.status}</Badge>
      </div>

      <p className="text-secondary mt-3 text-[13px] leading-relaxed">{internship.description}</p>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {internship.stack.map((tech) => (
          <span
            key={tech}
            className="bg-surface-muted text-secondary border-hairline rounded-md border px-2 py-1 text-[11px] font-medium"
          >
            {tech}
          </span>
        ))}
      </div>

      {/* Capacity meter */}
      <div className="mt-5">
        <div className="text-secondary mb-2 flex items-center justify-between text-[12px]">
          <span className="inline-flex items-center gap-1.5">
            <Users size={13} /> {internship.enrolled} / {internship.seats} seats
          </span>
          <span className="tabular font-medium">{fill}%</span>
        </div>
        <div className="bg-mist-100 h-1.5 w-full overflow-hidden rounded-full dark:bg-white/10">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${fill}%` }}
            transition={{ duration: 0.7, delay: 0.15 + index * 0.06, ease: [0.22, 1, 0.36, 1] }}
            className="bg-azure-600 h-full rounded-full"
          />
        </div>
      </div>

      <div className="border-hairline mt-5 flex items-center justify-between border-t pt-4">
        <span className="text-secondary inline-flex items-center gap-1.5 text-[13px]">
          <Clock size={14} /> {internship.duration}
        </span>
        <Button variant="ghost" size="sm" className="group-hover:text-azure-600">
          Manage <ArrowUpRight size={14} />
        </Button>
      </div>
    </motion.article>
  )
}
