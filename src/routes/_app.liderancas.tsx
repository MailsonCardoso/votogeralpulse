import { createFileRoute } from '@tanstack/react-router'
import { Crown, TrendingUp, Users } from 'lucide-react'
import { PageHeader } from '~/components/ui/page-header'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Badge, Input, Select } from '~/components/ui/input'
import { Button } from '~/components/ui/button'
import { DataTable, type Column } from '~/components/ui/data-table'
import { useLiderancas } from '~/hooks/useData'
import { formatNumber } from '~/lib/utils'
import { useState } from 'react'
import type { Lideranca } from '~/data/types'

export const Route = createFileRoute('/_app/liderancas')({
  head: () => ({ meta: [{ title: 'Lideranças — VotoGeral 360' }] }),
  component: Liderancas,
})

function Liderancas() {
  const liderancas = useLiderancas()
  const [q, setQ] = useState('')

  const filtradas = liderancas.filter((l) =>
    l.nome.toLowerCase().includes(q.toLowerCase()) ||
    l.bairro.toLowerCase().includes(q.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <PageHeader
        title="Lideranças"
        description="Acompanhe a performance dos líderes comunitários."
        actions={<Button><Crown /> Nova liderança</Button>}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtradas.map((l) => {
          const pct = Math.round((l.convertidos / l.meta) * 100)
          return (
            <Card key={l.id} className="p-5">
              <div className="flex items-start gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-brand/15 text-brand">
                  <Crown className="size-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{l.nome}</p>
                  <p className="text-xs text-muted-foreground">{l.bairro}</p>
                </div>
                <Badge variant={l.ativo ? 'success' : 'outline'}>
                  {l.ativo ? 'Ativo' : 'Inativo'}
                </Badge>
              </div>
              <div className="mt-4 space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Meta de conversão</span>
                  <span className="font-medium">{pct}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-border">
                  <div className="h-full rounded-full brand-gradient" style={{ width: `${pct}%` }} />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{formatNumber(l.convertidos)} convertidos</span>
                  <span>meta {formatNumber(l.meta)}</span>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 border-t border-border pt-3 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">Eleitores</p>
                  <p className="font-medium">{formatNumber(l.eleitores)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Engajamento</p>
                  <p className="font-medium">{l.engajamento}%</p>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tabela de performance</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={liderancas}
            pageSize={6}
            searchable
            searchKeys={['nome', 'bairro']}
            columns={
              [
                { key: 'nome', header: 'Liderança', sortable: true, sortValue: (l: Lideranca) => l.nome, render: (l) => (
                  <div className="flex items-center gap-3">
                    <div className="flex size-8 items-center justify-center rounded-full bg-brand/15 text-xs font-semibold text-brand">
                      {l.nome.split(' ').slice(0, 2).map((p) => p[0]).join('')}
                    </div>
                    <div>
                      <p className="font-medium">{l.nome}</p>
                      <p className="text-xs text-muted-foreground">{l.bairro}</p>
                    </div>
                  </div>
                ) },
                { key: 'eleitores', header: 'Eleitores', sortable: true, sortValue: (l: Lideranca) => l.eleitores, render: (l) => formatNumber(l.eleitores) },
                { key: 'convertidos', header: 'Convertidos', sortable: true, sortValue: (l: Lideranca) => l.convertidos, render: (l) => formatNumber(l.convertidos) },
                { key: 'engajamento', header: 'Engajamento', sortable: true, sortValue: (l: Lideranca) => l.engajamento, render: (l) => (
                  <Badge variant="info">{l.engajamento}%</Badge>
                ) },
                { key: 'meta', header: 'Meta', sortable: true, sortValue: (l: Lideranca) => l.meta, render: (l) => formatNumber(l.meta) },
              ] as Column<Lideranca>[]
            }
          />
        </CardContent>
      </Card>
    </div>
  )
}
