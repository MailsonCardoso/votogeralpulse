'use client'

import * as React from 'react'
import {
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  ArrowUp,
  ArrowDown,
} from 'lucide-react'
import { cn } from '~/lib/utils'
import { Button } from '~/components/ui/button'

export type Column<T> = {
  key: string
  header: string
  render?: (row: T) => React.ReactNode
  sortable?: boolean
  sortValue?: (row: T) => string | number
  className?: string
}

export function DataTable<T extends { id: string | number }>({
  columns,
  data,
  pageSize = 8,
  searchable = false,
  searchKeys,
  empty,
}: {
  columns: Column<T>[]
  data: T[]
  pageSize?: number
  searchable?: boolean
  searchKeys?: (keyof T)[]
  empty?: React.ReactNode
}) {
  const [sort, setSort] = React.useState<{
    key: string
    dir: 'asc' | 'desc'
  } | null>(null)
  const [page, setPage] = React.useState(0)
  const [query, setQuery] = React.useState('')

  const filtered = React.useMemo(() => {
    if (!searchable || !query) return data
    const q = query.toLowerCase()
    return data.filter((row) =>
      (searchKeys ?? []).some((k) =>
        String(row[k] ?? '')
          .toLowerCase()
          .includes(q),
      ),
    )
  }, [data, query, searchable, searchKeys])

  const sorted = React.useMemo(() => {
    if (!sort) return filtered
    const col = columns.find((c) => c.key === sort.key)
    const get = col?.sortValue ?? ((r: T) => (r as any)[sort.key])
    return [...filtered].sort((a, b) => {
      const av = get(a)
      const bv = get(b)
      if (av < bv) return sort.dir === 'asc' ? -1 : 1
      if (av > bv) return sort.dir === 'asc' ? 1 : -1
      return 0
    })
  }, [filtered, sort, columns])

  const pageCount = Math.max(1, Math.ceil(sorted.length / pageSize))
  const current = Math.min(page, pageCount - 1)
  const rows = sorted.slice(current * pageSize, current * pageSize + pageSize)

  function toggleSort(col: Column<T>) {
    if (!col.sortable) return
    setSort((prev) => {
      if (prev?.key === col.key)
        return { key: col.key, dir: prev.dir === 'asc' ? 'desc' : 'asc' }
      return { key: col.key, dir: 'asc' }
    })
  }

  return (
    <div className="space-y-3">
      {searchable && (
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setPage(0)
          }}
          placeholder="Buscar..."
          className="h-9 w-full max-w-xs rounded-lg border border-border bg-card px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      )}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className={cn(
                      'px-4 py-3 font-medium',
                      col.sortable && 'cursor-pointer select-none',
                      col.className,
                    )}
                    onClick={() => toggleSort(col)}
                  >
                    <span className="inline-flex items-center gap-1">
                      {col.header}
                      {col.sortable &&
                        (sort?.key === col.key ? (
                          sort.dir === 'asc' ? (
                            <ArrowUp className="size-3" />
                          ) : (
                            <ArrowDown className="size-3" />
                          )
                        ) : (
                          <ChevronsUpDown className="size-3 opacity-40" />
                        ))}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-4 py-10 text-center text-muted-foreground">
                    {empty ?? 'Nenhum registro encontrado.'}
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-border/60 transition-colors last:border-0 hover:bg-accent/30"
                  >
                    {columns.map((col) => (
                      <td key={col.key} className={cn('px-4 py-3', col.className)}>
                        {col.render ? col.render(row) : (row as any)[col.key]}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          {sorted.length} registro{sorted.length !== 1 && 's'}
        </span>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            disabled={current === 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
          >
            <ChevronLeft />
          </Button>
          <span className="px-2">
            {current + 1} / {pageCount}
          </span>
          <Button
            variant="outline"
            size="icon"
            disabled={current >= pageCount - 1}
            onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
          >
            <ChevronRight />
          </Button>
        </div>
      </div>
    </div>
  )
}
