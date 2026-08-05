import { Award, Percent, TrendingUp, Users } from 'lucide-react'
import { useState } from 'react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { DashboardCard } from '@/components/DashboardCard'
import { PageHeader } from '@/components/PageHeader'
import { StatCard } from '@/components/StatCard'
import { ChartLegend, ChartTooltip } from '@/components/charts/ChartTooltip'
import { axisProps, barCursor, gridProps, ordinal, series } from '@/components/charts/chartTheme'
import {
  certificateTrend,
  completionRates,
  monthlyRegistrations,
  programMix,
  revenueTrend,
  studentGrowth,
} from '@/data/analytics'
import { cn } from '@/utils/cn'
import { formatCurrency, formatCurrencyCompact } from '@/utils/format'

const ranges = ['3M', '6M', '12M']

/** Slice the mock series to the selected window — the range control is real UI. */
const windowFor = <T,>(rows: T[], range: string) =>
  range === '3M' ? rows.slice(-3) : range === '6M' ? rows.slice(-6) : rows

export function Analytics() {
  const [range, setRange] = useState('12M')

  const growth = windowFor(studentGrowth, range)
  const registrations = windowFor(monthlyRegistrations, range)
  const revenue = windowFor(revenueTrend, range)
  const certificates = windowFor(certificateTrend, range)

  const mixTotal = programMix.reduce((sum, item) => sum + item.value, 0)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics"
        description="Enrolment, revenue and delivery performance across KLS programmes."
        actions={
          <div className="bg-surface border-hairline inline-flex gap-1 rounded-xl border p-1">
            {ranges.map((option) => (
              <button
                key={option}
                onClick={() => setRange(option)}
                className={cn(
                  'rounded-lg px-3 py-1.5 text-[13px] font-medium transition-colors',
                  range === option
                    ? 'bg-navy-900 text-white dark:bg-white dark:text-navy-950'
                    : 'text-secondary hover:bg-surface-muted',
                )}
              >
                {option}
              </button>
            ))}
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Enrolment Growth" value="+12.4%" icon={TrendingUp} index={0} delta={12.4} caption="month over month" />
        <StatCard label="Active Learners" value="1,486" icon={Users} index={1} accent="emerald" delta={9.1} caption="vs last month" />
        <StatCard label="Completion Rate" value="70.2%" icon={Percent} index={2} accent="violet" delta={3.4} caption="all programmes" />
        <StatCard label="Certificates / Month" value="52" icon={Award} index={3} accent="amber" delta={-1.8} caption="vs last month" />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <DashboardCard
          index={0}
          title="Student growth"
          description="Cumulative enrolled learners"
          className="xl:col-span-2"
        >
          <ResponsiveContainer width="100%" height={272}>
            <AreaChart data={growth} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
              <defs>
                <linearGradient id="analyticsGrowth" x1="0" y1="0" x2="0" y2="1">
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
                fill="url(#analyticsGrowth)"
                activeDot={{ r: 4, strokeWidth: 2, stroke: 'var(--surface)' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </DashboardCard>

        <DashboardCard
          index={1}
          title="Programme mix"
          description="Share of current enrolments"
        >
          <ResponsiveContainer width="100%" height={272}>
            <PieChart>
              <Pie
                data={programMix}
                dataKey="value"
                nameKey="name"
                innerRadius={62}
                outerRadius={92}
                paddingAngle={2}
                stroke="var(--surface)"
                strokeWidth={2}
              >
                {/* Single-hue ordinal ramp — the slices are ranked, not unrelated categories */}
                {programMix.map((entry, i) => (
                  <Cell key={entry.name} fill={ordinal[i % ordinal.length]} />
                ))}
              </Pie>
              <Tooltip
                content={
                  <ChartTooltip
                    formatter={(value) => `${value} (${Math.round((value / mixTotal) * 100)}%)`}
                  />
                }
              />
              <Legend
                verticalAlign="bottom"
                iconType="square"
                iconSize={8}
                formatter={(value) => (
                  <span className="text-secondary text-[12px]">{String(value)}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </DashboardCard>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <DashboardCard index={0} title="Registrations by channel" description="New sign-ups per month">
          <ChartLegend
            items={[
              { label: 'Organic', color: series.s1 },
              { label: 'Referral', color: series.s3 },
              { label: 'Campaign', color: series.s4 },
            ]}
          />
          <ResponsiveContainer width="100%" height={252}>
            <BarChart data={registrations} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid {...gridProps} />
              <XAxis dataKey="month" {...axisProps} />
              <YAxis {...axisProps} width={44} />
              <Tooltip content={<ChartTooltip />} cursor={barCursor} />
              <Bar dataKey="organic" name="Organic" stackId="ch" fill={series.s1} stroke="var(--surface)" strokeWidth={2} />
              <Bar dataKey="referral" name="Referral" stackId="ch" fill={series.s3} stroke="var(--surface)" strokeWidth={2} />
              <Bar dataKey="campaign" name="Campaign" stackId="ch" fill={series.s4} stroke="var(--surface)" strokeWidth={2} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </DashboardCard>

        <DashboardCard
          index={1}
          title="Completion rate by programme"
          description="Share of learners finishing the track"
        >
          <ResponsiveContainer width="100%" height={252}>
            <BarChart
              data={completionRates}
              layout="vertical"
              margin={{ top: 4, right: 44, left: 8, bottom: 0 }}
            >
              <CartesianGrid {...gridProps} horizontal={false} vertical />
              <XAxis type="number" domain={[0, 100]} {...axisProps} hide />
              <YAxis
                type="category"
                dataKey="program"
                {...axisProps}
                width={132}
                tick={{ fill: 'var(--ink-secondary)', fontSize: 12 }}
              />
              <Tooltip
                content={<ChartTooltip formatter={(value) => `${value}%`} />}
                cursor={barCursor}
              />
              <Bar dataKey="rate" name="Completion" radius={[0, 4, 4, 0]} barSize={16}>
                {completionRates.map((entry, i) => (
                  <Cell key={entry.program} fill={ordinal[Math.min(i, ordinal.length - 1)]} />
                ))}
                {/* Direct labels — values stay readable without leaning on colour */}
                <LabelList
                  dataKey="rate"
                  position="right"
                  formatter={(value: unknown) => `${value}%`}
                  style={{ fill: 'var(--ink-secondary)', fontSize: 12, fontWeight: 600 }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </DashboardCard>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <DashboardCard index={0} title="Revenue trend" description="Collected revenue per month (₹)">
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={revenue} margin={{ top: 8, right: 8, left: -6, bottom: 0 }}>
              <CartesianGrid {...gridProps} />
              <XAxis dataKey="month" {...axisProps} />
              <YAxis {...axisProps} width={56} tickFormatter={(v) => formatCurrencyCompact(Number(v))} />
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

        <DashboardCard index={1} title="Certificate throughput" description="Issued vs. awaiting review">
          <ChartLegend
            items={[
              { label: 'Issued', color: series.s1 },
              { label: 'Pending', color: series.s2 },
            ]}
          />
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={certificates} margin={{ top: 4, right: 8, left: -16, bottom: 0 }} barGap={2}>
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
    </div>
  )
}
