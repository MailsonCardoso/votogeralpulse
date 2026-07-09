import { createFileRoute } from '@tanstack/react-router'
import { Network, Plus } from 'lucide-react'
import { PageHeader } from '~/components/ui/page-header'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Badge } from '~/components/ui/input'
import { Button } from '~/components/ui/button'
import { DataTable, type Column } from '~/components/ui/data-table'
import { useCabos } from '~/hooks/useData'
import { formatNumber } from '~/lib/utils'
import type { Cabo } from '~/data/types'

export const Route = createFileRoute('/_app/cabos')({
  head: () => ({ meta: [{ title: 'Cabos Eleitorais — VotoGeral 360' }] }),
  component: Cabos,
})

function Cabos() {
  const cabos = useCabos()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Cabos Eleitorais"
        description="Rede de cabos que operam a base em cada região."
        actions={<Button><Plus /> Novo cabo</Button>}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cabos.slice(0, 9).map((c) => {
          const pct = c.performance
          return (
            <Card key={c.id} className="p-5">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-brand-500/15 text-brand-600 dark:text-brand-300">
                  <Network className="size-5" />
                </div>
                <div>
                  <p className="font-semibold">{c.nome}</p>
                  <p className="text-xs text-muted">{c.regiao}</p>
                </div>
              </div>
              <div className="mt-4 space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="text-muted">Performance</span>
                  <span className="font-medium">{pct}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-[var(--card-border)]">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${pct}%`,
                      background: pct > 75 ? 'var(--color-success)' : pct > 50 ? 'var(--color-info)' : 'var(--color-warning)',
                    }}
                  />
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 border-t border-[var(--card-border)] pt-3 text-sm">
                <div>
                  <p className="text-xs text-muted">Eleitores</p>
                  <p className="font-medium">{formatNumber(c.eleitores)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted">Visitas</p>
                  <p className="font-medium">{formatNumber(c.visitas)}</p>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Todos os cabos</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={cabos}
            pageSize={8}
            searchable
            searchKeys={['nome', 'regiao']}
            columns={
              [
                { key: 'nome', header: 'Cabo', sortable: true, sortValue: (c: Cabo) => c.nome, render: (c) => (
                  <div className="flex items-center gap-3">
                    <div className="flex size-8 items-center justify-center rounded-full bg-brand-500/15 text-xs font-semibold text-brand-600 dark:text-brand-300">
                      {c.nome.split(' ').slice(0, 2).map((p) => p[0]).join('')}
                    </div>
                    <span className="font-medium">{c.nome}</span>
                  </div>
                ) },
                { key: 'regiao', header: 'Região', sortable: true, sortValue: (c: Cabo) => c.regiao },
                { key: 'eleitores', header: 'Eleitores', sortable: true, sortValue: (c: Cabo) => c.eleitores, render: (c) => formatNumber(c.eleitores) },
                { key: 'visitas', header: 'Visitas', sortable: true, sortValue: (c: Cabo) => c.visitas, render: (c) => formatNumber(c.visitas) },
                { key: 'performance', header: 'Performance', sortable: true, sortValue: (c: Cabo) => c.performance, render: (c) => (
                  <Badge variant={c.performance > 70 ? 'success' : 'warning'}>{c.performance}%</Badge>
                ) },
              ] as Column<Cabo>[]
            }
          />
        </CardContent>
      </Card>
    </div>
  )
}
