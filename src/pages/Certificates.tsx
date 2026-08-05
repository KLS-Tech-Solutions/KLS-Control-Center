import { Award, Clock, Download, FileBadge, ShieldOff } from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { StatCard } from '@/components/StatCard'
import { TableToolbar } from '@/components/TableToolbar'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { EmptyState, TD, TH, THead, TR, Table, TableWrap } from '@/components/ui/Table'
import { certificates } from '@/data/certificates'
import { useTableFilters } from '@/hooks/useTableFilters'
import { formatDate } from '@/utils/format'
import { toneFor } from '@/utils/status'

const statusOptions = [
  { value: 'issued', label: 'Issued' },
  { value: 'pending', label: 'Pending' },
  { value: 'revoked', label: 'Revoked' },
]

export function Certificates() {
  const { query, setQuery, status, setStatus, filtered } = useTableFilters(
    certificates,
    (cert) => [cert.certificateId, cert.studentName, cert.program],
    (cert) => cert.status,
  )

  const counts = {
    issued: certificates.filter((c) => c.status === 'issued').length,
    pending: certificates.filter((c) => c.status === 'pending').length,
    revoked: certificates.filter((c) => c.status === 'revoked').length,
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Certificates"
        description="Issuance ledger for all completed KLS programmes."
        actions={
          <>
            <Button variant="outline" size="sm">
              <Download size={15} /> Bulk download
            </Button>
            <Button size="sm">
              <FileBadge size={15} /> Issue certificate
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Records" value={String(certificates.length)} icon={FileBadge} index={0} />
        <StatCard label="Issued" value={String(counts.issued)} icon={Award} index={1} accent="emerald" delta={8.1} caption="vs last month" />
        <StatCard label="Pending Review" value={String(counts.pending)} icon={Clock} index={2} accent="amber" caption="awaiting approval" />
        <StatCard label="Revoked" value={String(counts.revoked)} icon={ShieldOff} index={3} accent="rose" caption="policy violations" />
      </div>

      <Card className="overflow-hidden">
        <TableToolbar
          query={query}
          onQueryChange={setQuery}
          placeholder="Search certificate ID, student or programme…"
          status={status}
          onStatusChange={setStatus}
          statusOptions={statusOptions}
          actions={<span className="text-muted text-[13px]">{filtered.length} results</span>}
        />

        {filtered.length === 0 ? (
          <EmptyState>No certificates match the current filters.</EmptyState>
        ) : (
          <TableWrap>
            <Table>
              <THead>
                <tr>
                  <TH>Certificate ID</TH>
                  <TH>Student</TH>
                  <TH>Programme</TH>
                  <TH>Grade</TH>
                  <TH>Status</TH>
                  <TH>Issued</TH>
                  <TH className="text-right">Download</TH>
                </tr>
              </THead>
              <tbody>
                {filtered.map((cert) => (
                  <TR key={cert.id}>
                    <TD className="tabular font-medium whitespace-nowrap">{cert.certificateId}</TD>
                    <TD>
                      <p className="font-medium">{cert.studentName}</p>
                      <p className="text-muted text-[12px]">{cert.studentEmail}</p>
                    </TD>
                    <TD className="text-secondary whitespace-nowrap">{cert.program}</TD>
                    <TD className="tabular">{cert.grade}</TD>
                    <TD>
                      <Badge tone={toneFor(cert.status)}>{cert.status}</Badge>
                    </TD>
                    <TD className="text-secondary tabular whitespace-nowrap">
                      {cert.status === 'pending' ? '—' : formatDate(cert.issuedDate)}
                    </TD>
                    <TD className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={cert.status !== 'issued'}
                        aria-label={`Download ${cert.certificateId}`}
                      >
                        <Download size={14} /> PDF
                      </Button>
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
