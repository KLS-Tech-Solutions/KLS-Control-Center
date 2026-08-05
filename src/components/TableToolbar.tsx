import { Search } from 'lucide-react'
import type { ReactNode } from 'react'
import { Input, Select } from '@/components/ui/Input'

export interface FilterOption {
  value: string
  label: string
}

/**
 * Search + status filter row shared by every table page.
 * Filters sit in one row directly above the data they control.
 */
export function TableToolbar({
  query,
  onQueryChange,
  placeholder = 'Search…',
  status,
  onStatusChange,
  statusOptions,
  extraFilters,
  actions,
}: {
  query: string
  onQueryChange: (value: string) => void
  placeholder?: string
  status?: string
  onStatusChange?: (value: string) => void
  statusOptions?: FilterOption[]
  extraFilters?: ReactNode
  actions?: ReactNode
}) {
  return (
    <div className="border-hairline flex flex-wrap items-center gap-2.5 border-b px-5 py-4 sm:px-6">
      <div className="min-w-[200px] flex-1 sm:max-w-xs">
        <Input
          type="search"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder={placeholder}
          aria-label={placeholder}
          icon={<Search size={15} />}
        />
      </div>

      {statusOptions && onStatusChange && (
        <Select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          aria-label="Filter by status"
          className="w-auto min-w-[140px]"
        >
          <option value="all">All statuses</option>
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      )}

      {extraFilters}
      {actions && <div className="ml-auto flex items-center gap-2">{actions}</div>}
    </div>
  )
}
