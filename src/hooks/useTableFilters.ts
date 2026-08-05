import { useMemo, useState } from 'react'

/**
 * Generic client-side search + status filtering for the mock tables.
 * When the FastAPI backend lands, this hook is the seam to swap for a
 * server-side query — the pages themselves stay unchanged.
 */
export function useTableFilters<T>(
  rows: T[],
  searchFields: (row: T) => string[],
  statusOf?: (row: T) => string,
) {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('all')

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return rows.filter((row) => {
      const matchesQuery =
        !needle || searchFields(row).some((field) => field.toLowerCase().includes(needle))
      const matchesStatus = status === 'all' || !statusOf || statusOf(row) === status
      return matchesQuery && matchesStatus
    })
    // `searchFields`/`statusOf` are stable inline selectors in every call site.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, query, status])

  return { query, setQuery, status, setStatus, filtered }
}
