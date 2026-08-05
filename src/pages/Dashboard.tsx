import {
  Award,
  CreditCard,
  Download,
  FileBadge,
  GraduationCap,
  LifeBuoy,
  Plus,
  TrendingUp,
  UserPlus,
  Users,
  Wallet,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { DashboardCard } from '@/components/DashboardCard'
import { PageHeader } from '@/components/PageHeader'
import { StatCard } from '@/components/StatCard'
import { ChartLegend, ChartTooltip } from '@/components/charts/ChartTooltip'
import { axisProps, barCursor, gridProps, series } from '@/components/charts/chartTheme'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import {
  certificateTrend,
  dashboardStats,
  monthlyRegistrations,
  recentActivity,
  revenueTrend,
  studentGrowth,
  systemStatus,
} from '@/data/analytics'
import { toneFor } from '@/utils/status'
import { formatCurrency, formatCurrencyCompact, formatNumber } from '@/utils/format'

const stats = [
  { label: 'Total Students', value: formatNumber(dashboardStats.totalStudents), icon: Users, delta: 12.4, caption: 'vs last month', accent: 'azure' as const },
  { label: 'Active Internships', value: String(dashboardStats.activeInternships), icon: GraduationCap, caption: 'across 5 tracks', accent: 'navy' as const },
  { label: 'Certificates Issued', value: formatNumber(dashboardStats.certificatesIssued), icon: Award, delta: 8.1, caption: 'vs last month', accent: 'emerald' as const },
  { label: 'Revenue', value: formatCurrencyCompact(dashboardStats.revenue), icon: Wallet, delta: 15.2, caption: 'financial YTD', accent: 'violet' as const },
  { label: 'Pending Payments', value: formatCurrencyCompact(dashboardStats.pendingPayments), icon: CreditCard, delta: -4.3, caption: '3 invoices', accent: 'amber' as const },
  { label: 'Support Tickets', value: String(dashboardStats.supportTickets), icon: LifeBuoy, delta: -2.0, caption: '4 open now', accent: 'rose' as const },
]

const quickActions = [
  { label: 'Add student', icon: UserPlus, to: '/students' },
  { label: 'Issue certificate', icon: FileBadge, to: '/certificates' },
  { label: 'New internship', icon: Plus, to: '/internships' },
  { label: 'Export report', icon: Download, to: '/analytics' },
]

const activityAccent: Record<string, string> = {
  student: 'bg-azure-50 text-azure-700 dark:bg-azure-900/35 dark:text-azure-300',
  payment: 'bg-violet-50 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300',
  certificate: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  support: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  system: 'bg-mist-100 text-[color:var(--ink-secondary)] dark:bg-white/8',
}

const activityIcon = {
  student: Users,
  payment: CreditCard,
  certificate: Award,
  support: LifeBuoy,
  system: TrendingUp,
}

export function Dashboard() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Operational overview across all KLS programmes — August 2026."
        actions={
          <>
            <Button variant="outline" size="sm">
              <Download size={15} /> Export
            </Button>
            <Button size="sm">
              <Plus size={15} /> New internship
            </Button>
          </>
        }
      />

      {/* KPI row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        {stats.map((stat, i) => (
          <StatCard key={stat.label} index={i} {...stat} />
        ))}
      </div>

      {/* Primary charts */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <DashboardCard
          index={0}
          title="Student growth"
          description="Cumulative enrolled students, last 12 months"
          className="xl:col-span-2"
          action={<Badge tone="success">+12.4% MoM</Badge>}
        >
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={studentGrowth} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
              <defs>
                <linearGradient id="growthFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={series.s1} stopOpacity={0.28} />
                  <stop offset="100%" stopColor={series.s1} stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid {...gridProps} />
              <XAxis dataKey="month" {...axisProps} />
              <YAxis {...axisProps} width={48} />
              <Tooltip content={<ChartTooltip />} cursor={{ stroke: 'var(--axis)', strokeWidth: 1 }} />
              <Area
                type="monotone"
                dataKey="students"
                name="Students"
                stroke={series.s1}
                strokeWidth={2}
                fill="url(#growthFill)"
                activeDot={{ r: 4, strokeWidth: 2, stroke: 'var(--surface)' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </DashboardCard>

        <DashboardCard
          index={1}
          title="Revenue"
          description="Collected revenue per month (₹)"
          action={<Badge tone="info">FY 2025–26</Badge>}
        >
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={revenueTrend} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
              <CartesianGrid {...gridProps} />
              <XAxis dataKey="month" {...axisProps} interval="preserveStartEnd" />
              <YAxis {...axisProps} width={54} tickFormatter={(v) => formatCurrencyCompact(Number(v))} />
              <Tooltip
                content={<ChartTooltip formatter={formatCurrency} />}
                cursor={{ stroke: 'var(--axis)', strokeWidth: 1 }}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                name="Revenue"
                stroke={series.s2}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 2, stroke: 'var(--surface)' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </DashboardCard>
      </div>

      {/* Secondary charts */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <DashboardCard
          index={0}
          title="Monthly registrations"
          description="New sign-ups by acquisition channel"
        >
          <ChartLegend
            items={[
              { label: 'Organic', color: series.s1 },
              { label: 'Referral', color: series.s3 },
              { label: 'Campaign', color: series.s4 },
            ]}
          />
          <ResponsiveContainer width="100%" height={252}>
            <BarChart data={monthlyRegistrations} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid {...gridProps} />
              <XAxis dataKey="month" {...axisProps} />
              <YAxis {...axisProps} width={44} />
              <Tooltip content={<ChartTooltip />} cursor={barCursor} />
              {/* 2px surface gap between stacked segments keeps edges legible */}
              <Bar dataKey="organic" name="Organic" stackId="reg" fill={series.s1} stroke="var(--surface)" strokeWidth={2} />
              <Bar dataKey="referral" name="Referral" stackId="reg" fill={series.s3} stroke="var(--surface)" strokeWidth={2} />
              <Bar dataKey="campaign" name="Campaign" stackId="reg" fill={series.s4} stroke="var(--surface)" strokeWidth={2} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </DashboardCard>

        <DashboardCard
          index={1}
          title="Certificates"
          description="Issued vs. awaiting review, per month"
        >
          <ChartLegend
            items={[
              { label: 'Issued', color: series.s1 },
              { label: 'Pending', color: series.s2 },
            ]}
          />
          <ResponsiveContainer width="100%" height={252}>
            <BarChart data={certificateTrend} margin={{ top: 4, right: 8, left: -16, bottom: 0 }} barGap={2}>
              <CartesianGrid {...gridProps} />
              <XAxis dataKey="month" {...axisProps} />
              <YAxis {...axisProps} width={44} />
              <Tooltip content={<ChartTooltip />} cursor={barCursor} />
              <Bar dataKey="issued" name="Issued" fill={series.s1} radius={[4, 4, 0, 0]} />
              <Bar dataKey="pending" name="Pending" fill={series.s2} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </DashboardCard>
      </div>

      {/* Quick actions · activity · system status */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <DashboardCard index={0} title="Quick actions" description="Common operator tasks">
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action) => (
              <Link
                key={action.label}
                to={action.to}
                className="bg-surface-muted border-hairline hover:border-azure-600 hover:text-azure-700 dark:hover:text-azure-300 group flex flex-col gap-2.5 rounded-xl border p-4 transition-all duration-200 hover:-translate-y-0.5"
              >
                <action.icon size={18} className="text-azure-600" />
                <span className="text-[13px] font-medium">{action.label}</span>
              </Link>
            ))}
          </div>
        </DashboardCard>

        <DashboardCard
          index={1}
          title="Recent activity"
          description="Latest events across the platform"
          action={
            <Link to="/analytics" className="text-azure-600 text-[12.5px] font-medium hover:underline">
              View all
            </Link>
          }
        >
          <ul className="space-y-3.5">
            {recentActivity.map((item) => {
              const Icon = activityIcon[item.type]
              return (
                <li key={item.id} className="flex items-start gap-3">
                  <span
                    className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${activityAccent[item.type]}`}
                  >
                    <Icon size={15} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] leading-snug">
                      <span className="font-medium">{item.actor}</span>{' '}
                      <span className="text-secondary">{item.action}</span>{' '}
                      <span className="font-medium">{item.target}</span>
                    </p>
                    <p className="text-muted mt-0.5 text-[11.5px]">{item.timestamp}</p>
                  </div>
                </li>
              )
            })}
          </ul>
        </DashboardCard>

        <DashboardCard index={2} title="System status" description="Service health, last 24 hours">
          <ul className="space-y-3">
            {systemStatus.map((service) => (
              <li
                key={service.name}
                className="border-hairline bg-surface-muted flex items-center justify-between gap-3 rounded-xl border px-3.5 py-3"
              >
                <div>
                  <p className="text-[13px] font-medium">{service.name}</p>
                  <p className="text-muted tabular mt-0.5 text-[11.5px]">
                    {service.uptime} uptime · {service.latency}
                  </p>
                </div>
                <Badge tone={toneFor(service.status)}>{service.status}</Badge>
              </li>
            ))}
          </ul>
        </DashboardCard>
      </div>
    </div>
  )
}
