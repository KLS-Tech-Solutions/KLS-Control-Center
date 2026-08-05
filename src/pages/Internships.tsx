import { Plus } from 'lucide-react'
import { useState } from 'react'
import { ModuleCard } from '@/components/ModuleCard'
import { PageHeader } from '@/components/PageHeader'
import { StatCard } from '@/components/StatCard'
import { Button } from '@/components/ui/Button'
import { internships } from '@/data/internships'
import { GraduationCap, Layers, Users } from 'lucide-react'
import { cn } from '@/utils/cn'

const filters = [
  { value: 'all', label: 'All tracks' },
  { value: 'ongoing', label: 'Ongoing' },
  { value: 'open', label: 'Open' },
  { value: 'closed', label: 'Closed' },
]

export function Internships() {
  const [filter, setFilter] = useState('all')
  const visible =
    filter === 'all' ? internships : internships.filter((item) => item.status === filter)

  const totalEnrolled = internships.reduce((sum, item) => sum + item.enrolled, 0)
  const totalSeats = internships.reduce((sum, item) => sum + item.seats, 0)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Internships"
        description="Five active learning tracks with mentor-led delivery."
        actions={
          <Button size="sm">
            <Plus size={15} /> New internship
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Active Tracks" value={String(internships.length)} icon={Layers} index={0} caption="Python → Agentic AI" />
        <StatCard label="Total Enrolled" value={String(totalEnrolled)} icon={Users} index={1} delta={9.6} caption="vs last cohort" accent="emerald" />
        <StatCard
          label="Seat Utilisation"
          value={`${Math.round((totalEnrolled / totalSeats) * 100)}%`}
          icon={GraduationCap}
          index={2}
          caption={`${totalSeats - totalEnrolled} seats remaining`}
          accent="violet"
        />
      </div>

      {/* Segment filter */}
      <div className="bg-surface border-hairline inline-flex flex-wrap gap-1 rounded-xl border p-1">
        {filters.map((option) => (
          <button
            key={option.value}
            onClick={() => setFilter(option.value)}
            className={cn(
              'rounded-lg px-3.5 py-1.5 text-[13px] font-medium transition-colors',
              filter === option.value
                ? 'bg-navy-900 text-white dark:bg-white dark:text-navy-950'
                : 'text-secondary hover:bg-surface-muted',
            )}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
        {visible.map((internship, i) => (
          <ModuleCard key={internship.id} internship={internship} index={i} />
        ))}
      </div>

      {visible.length === 0 && (
        <p className="text-muted py-16 text-center text-sm">No internships in this state.</p>
      )}
    </div>
  )
}
