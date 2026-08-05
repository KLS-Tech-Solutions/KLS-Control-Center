import { Download, MoreHorizontal, UserPlus } from 'lucide-react'
import { useState } from 'react'
import { PageHeader } from '@/components/PageHeader'
import { TableToolbar } from '@/components/TableToolbar'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Select } from '@/components/ui/Input'
import { EmptyState, TD, TH, THead, TR, Table, TableWrap } from '@/components/ui/Table'
import { courses, students } from '@/data/students'
import { useTableFilters } from '@/hooks/useTableFilters'
import { formatDate } from '@/utils/format'
import { toneFor } from '@/utils/status'

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
  { value: 'pending', label: 'Pending' },
  { value: 'inactive', label: 'Inactive' },
]

export function Students() {
  const [course, setCourse] = useState('all')
  const { query, setQuery, status, setStatus, filtered } = useTableFilters(
    students,
    (student) => [student.name, student.email, student.course],
    (student) => student.status,
  )

  const rows = course === 'all' ? filtered : filtered.filter((s) => s.course === course)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Students"
        description={`${students.length} enrolled learners across all KLS programmes.`}
        actions={
          <>
            <Button variant="outline" size="sm">
              <Download size={15} /> Export CSV
            </Button>
            <Button size="sm">
              <UserPlus size={15} /> Add student
            </Button>
          </>
        }
      />

      <Card className="overflow-hidden">
        <TableToolbar
          query={query}
          onQueryChange={setQuery}
          placeholder="Search name, email or course…"
          status={status}
          onStatusChange={setStatus}
          statusOptions={statusOptions}
          extraFilters={
            <Select
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              aria-label="Filter by course"
              className="w-auto min-w-[170px]"
            >
              <option value="all">All courses</option>
              {courses.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </Select>
          }
          actions={<span className="text-muted text-[13px]">{rows.length} results</span>}
        />

        {rows.length === 0 ? (
          <EmptyState>No students match the current filters.</EmptyState>
        ) : (
          <TableWrap>
            <Table>
              <THead>
                <tr>
                  <TH>Student</TH>
                  <TH>Email</TH>
                  <TH>Course</TH>
                  <TH>Progress</TH>
                  <TH>Status</TH>
                  <TH>Joined</TH>
                  <TH className="text-right">Actions</TH>
                </tr>
              </THead>
              <tbody>
                {rows.map((student) => (
                  <TR key={student.id}>
                    <TD>
                      <div className="flex items-center gap-3">
                        <Avatar name={student.name} />
                        <div>
                          <p className="font-medium">{student.name}</p>
                          <p className="text-muted tabular text-[12px]">{student.phone}</p>
                        </div>
                      </div>
                    </TD>
                    <TD className="text-secondary">{student.email}</TD>
                    <TD className="whitespace-nowrap">{student.course}</TD>
                    <TD>
                      <div className="flex items-center gap-2.5">
                        <div className="bg-mist-100 h-1.5 w-20 overflow-hidden rounded-full dark:bg-white/10">
                          <div
                            className="bg-azure-600 h-full rounded-full"
                            style={{ width: `${student.progress}%` }}
                          />
                        </div>
                        <span className="tabular text-secondary text-[12px]">
                          {student.progress}%
                        </span>
                      </div>
                    </TD>
                    <TD>
                      <Badge tone={toneFor(student.status)}>{student.status}</Badge>
                    </TD>
                    <TD className="text-secondary tabular whitespace-nowrap">
                      {formatDate(student.joinedDate)}
                    </TD>
                    <TD className="text-right">
                      <Button variant="ghost" size="icon" aria-label={`Actions for ${student.name}`}>
                        <MoreHorizontal size={16} />
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
