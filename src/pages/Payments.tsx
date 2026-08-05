import { AlertTriangle, CheckCircle2, Clock, Download, Wallet } from 'lucide-react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { DashboardCard } from '@/components/DashboardCard'
import { PageHeader } from '@/components/PageHeader'
import { StatCard } from '@/components/StatCard'
import { TableToolbar } from '@/components/TableToolbar'
import { ChartTooltip } from '@/components/charts/ChartTooltip'
import { axisProps, gridProps, series } from '@/components/charts/chartTheme'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { EmptyState, TD, TH, THead, TR, Table, TableWrap } from '@/components/ui/Table'
import { paymentSummary, payments } from '@/data/payments'
import { revenueTrend } from '@/data/analytics'
import { useTableFilters } from '@/hooks/useTableFilters'
import { formatCurrency, formatCurrencyCompact, formatDate } from '@/utils/format'
import { toneFor } from '@/utils/status'

const statusOptions = [
  { value: 'paid', label: 'Paid' },
  { value: 'pending', label: 'Pending' },
  { value: 'failed', label: 'Failed' },
  { value: 'refunded', label: 'Refunded' },
]

export function Payments() {
  const { query, setQuery, status, setStatus, filtered } = useTableFilters(
    payments,
    (payment) => [payment.invoiceId, payment.studentName, payment.program, payment.method],
    (payment) => payment.status,
  )

  return (
    <div className="space-y-6">
      <PageHeader
        title="Payments"
        description="Transactions and settlement status for the current cycle."
        actions={
          <Button variant="outline" size="sm">
            <Download size={15} /> Export ledger
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Revenue"
          value={formatCurrencyCompact(paymentSummary.total)}
          icon={Wallet}
          index={0}
          delta={15.2}
          caption="this cycle"
        />
        <StatCard
          label="Paid"
          value={formatCurrencyCompact(paymentSummary.paid)}
          icon={CheckCircle2}
          index={1}
          accent="emerald"
          caption={`${paymentSummary.counts.paid} transactions`}
        />
        <StatCard
          label="Pending"
          value={formatCurrencyCompact(paymentSummary.pending)}
          icon={Clock}
          index={2}
          accent="amber"
          caption={`${paymentSummary.counts.pending} awaiting settlement`}
        />
        <StatCard
          label="Failed"
          value={formatCurrencyCompact(paymentSummary.failed)}
          icon={AlertTriangle}
          index={3}
          accent="rose"
          caption={`${paymentSummary.counts.failed} need retry`}
        />
      </div>

      <DashboardCard title="Collections" description="Monthly collected revenue (₹)">
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={revenueTrend} margin={{ top: 8, right: 8, left: -6, bottom: 0 }}>
            <defs>
              <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={series.s1} stopOpacity={0.26} />
                <stop offset="100%" stopColor={series.s1} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid {...gridProps} />
            <XAxis dataKey="month" {...axisProps} />
            <YAxis {...axisProps} width={56} tickFormatter={(v) => formatCurrencyCompact(Number(v))} />
            <Tooltip
              content={<ChartTooltip formatter={formatCurrency} />}
              cursor={{ stroke: 'var(--axis)', strokeWidth: 1 }}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              name="Revenue"
              stroke={series.s1}
              strokeWidth={2}
              fill="url(#revenueFill)"
              activeDot={{ r: 4, strokeWidth: 2, stroke: 'var(--surface)' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </DashboardCard>

      <Card className="overflow-hidden">
        <TableToolbar
          query={query}
          onQueryChange={setQuery}
          placeholder="Search invoice, student or method…"
          status={status}
          onStatusChange={setStatus}
          statusOptions={statusOptions}
          actions={<span className="text-muted text-[13px]">{filtered.length} results</span>}
        />

        {filtered.length === 0 ? (
          <EmptyState>No transactions match the current filters.</EmptyState>
        ) : (
          <TableWrap>
            <Table>
              <THead>
                <tr>
                  <TH>Invoice</TH>
                  <TH>Student</TH>
                  <TH>Programme</TH>
                  <TH>Method</TH>
                  <TH className="text-right">Amount</TH>
                  <TH>Status</TH>
                  <TH>Date</TH>
                </tr>
              </THead>
              <tbody>
                {filtered.map((payment) => (
                  <TR key={payment.id}>
                    <TD className="tabular font-medium whitespace-nowrap">{payment.invoiceId}</TD>
                    <TD className="font-medium whitespace-nowrap">{payment.studentName}</TD>
                    <TD className="text-secondary whitespace-nowrap">{payment.program}</TD>
                    <TD className="text-secondary">{payment.method}</TD>
                    <TD className="tabular text-right font-semibold whitespace-nowrap">
                      {formatCurrency(payment.amount)}
                    </TD>
                    <TD>
                      <Badge tone={toneFor(payment.status)}>{payment.status}</Badge>
                    </TD>
                    <TD className="text-secondary tabular whitespace-nowrap">
                      {formatDate(payment.date)}
                    </TD>
                  </TR>
                ))}
              </tbody>
            </Table>
          </TableWrap>
        )}
      </Card>
    </div>
  )
}
