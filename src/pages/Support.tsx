import { AlertOctagon, CheckCircle2, Inbox, LoaderCircle, Plus } from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { StatCard } from '@/components/StatCard'
import { TableToolbar } from '@/components/TableToolbar'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { EmptyState, TD, TH, THead, TR, Table, TableWrap } from '@/components/ui/Table'
import { ticketSummary, tickets } from '@/data/support'
import { useTableFilters } from '@/hooks/useTableFilters'
import { formatDate } from '@/utils/format'
import { labelFor, toneFor } from '@/utils/status'

const statusOptions = [
  { value: 'open', label: 'Open' },
  { value: 'in-progress', label: 'In progress' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'closed', label: 'Closed' },
]

export function Support() {
  const { query, setQuery, status, setStatus, filtered } = useTableFilters(
    tickets,
    (ticket) => [ticket.ticketId, ticket.subject, ticket.requester, ticket.category],
    (ticket) => ticket.status,
  )

  return (
    <div className="space-y-6">
      <PageHeader
        title="Support"
        description="Learner and operator tickets across every KLS programme."
        actions={
          <Button size="sm">
            <Plus size={15} /> New ticket
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Open" value={String(ticketSummary.open)} icon={Inbox} index={0} caption="awaiting first reply" />
        <StatCard label="In Progress" value={String(ticketSummary.inProgress)} icon={LoaderCircle} index={1} accent="violet" caption="assigned to an owner" />
        <StatCard label="Resolved" value={String(ticketSummary.resolved)} icon={CheckCircle2} index={2} accent="emerald" delta={6.5} caption="this week" />
        <StatCard label="Urgent" value={String(ticketSummary.urgent)} icon={AlertOctagon} index={3} accent="rose" caption="breaching SLA soon" />
      </div>

      <Card className="overflow-hidden">
        <TableToolbar
          query={query}
          onQueryChange={setQuery}
          placeholder="Search ticket, subject or requester…"
          status={status}
          onStatusChange={setStatus}
          statusOptions={statusOptions}
          actions={<span className="text-muted text-[13px]">{filtered.length} results</span>}
        />

        {filtered.length === 0 ? (
          <EmptyState>No tickets match the current filters.</EmptyState>
        ) : (
          <TableWrap>
            <Table>
              <THead>
                <tr>
                  <TH>Ticket</TH>
                  <TH>Subject</TH>
                  <TH>Requester</TH>
                  <TH>Category</TH>
                  <TH>Priority</TH>
                  <TH>Status</TH>
                  <TH>Assignee</TH>
                  <TH>Created</TH>
                </tr>
              </THead>
              <tbody>
                {filtered.map((ticket) => (
                  <TR key={ticket.id}>
                    <TD className="tabular font-medium whitespace-nowrap">{ticket.ticketId}</TD>
                    <TD className="max-w-[280px]">
                      <p className="truncate font-medium" title={ticket.subject}>
                        {ticket.subject}
                      </p>
                    </TD>
                    <TD className="text-secondary whitespace-nowrap">{ticket.requester}</TD>
                    <TD className="text-secondary whitespace-nowrap">{ticket.category}</TD>
                    <TD>
                      <Badge tone={toneFor(ticket.priority)}>{ticket.priority}</Badge>
                    </TD>
                    <TD>
                      <Badge tone={toneFor(ticket.status)}>{labelFor(ticket.status)}</Badge>
                    </TD>
                    <TD>
                      <div className="flex items-center gap-2 whitespace-nowrap">
                        <Avatar name={ticket.assignee} size="sm" />
                        <span className="text-secondary text-[13px]">{ticket.assignee}</span>
                      </div>
                    </TD>
                    <TD className="text-secondary tabular whitespace-nowrap">
                      {formatDate(ticket.createdAt)}
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
