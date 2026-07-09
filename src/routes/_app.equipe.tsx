import { createFileRoute } from '@tanstack/react-router'
import { UsersRound, Plus, Mail, Phone } from 'lucide-react'
import { PageHeader } from '~/components/ui/page-header'
import { Card, CardContent } from '~/components/ui/card'
import { Badge, Input } from '~/components/ui/input'
import { Button } from '~/components/ui/button'
import { DataTable, type Column } from '~/components/ui/data-table'
import { useEquipe } from '~/hooks/useData'
import { formatDate } from '~/lib/utils'
import type { MembroEquipe } from '~/data/types'

export const Route = createFileRoute('/_app/equipe')({
  head: () => ({ meta: [{ title: 'Equipe — VotoGeral 360' }] }),
  component: Equipe,
})

function Equipe() {
  const equipe = useEquipe()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Equipe"
        description="Pessoas que operam a campanha em campo e no quartel-general."
        actions={<Button><Plus /> Convidar membro</Button>}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {equipe.slice(0, 9).map((m) => (
          <Card key={m.id} className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-full bg-brand/15 text-sm font-semibold text-brand">
                {m.nome.split(' ').slice(0, 2).map((p) => p[0]).join('')}
              </div>
              <div className="min-w-0">
                <p className="truncate font-semibold">{m.nome}</p>
                <p className="text-xs text-muted-foreground">{m.papel}</p>
              </div>
              <Badge variant={m.ativo ? 'success' : 'outline'} className="ml-auto">
                {m.ativo ? 'Ativo' : 'Ausente'}
              </Badge>
            </div>
            <div className="mt-4 space-y-1.5 text-sm">
              <p className="flex items-center gap-2 text-muted-foreground"><Mail className="size-3.5" /> {m.email}</p>
              <p className="flex items-center gap-2 text-muted-foreground"><Phone className="size-3.5" /> {m.telefone}</p>
              <p className="text-muted-foreground">Bairro: {m.bairro} · Desde {formatDate(m.entrouEm)}</p>
            </div>
          </Card>
        ))}
      </div>

      <DataTable
        data={equipe}
        pageSize={8}
        searchable
        searchKeys={['nome', 'papel', 'bairro']}
        columns={
          [
            { key: 'nome', header: 'Membro', sortable: true, sortValue: (m: MembroEquipe) => m.nome, render: (m) => (
              <div className="flex items-center gap-3">
                <div className="flex size-8 items-center justify-center rounded-full bg-brand/15 text-xs font-semibold text-brand">
                  {m.nome.split(' ').slice(0, 2).map((p) => p[0]).join('')}
                </div>
                <span className="font-medium">{m.nome}</span>
              </div>
            ) },
            { key: 'papel', header: 'Papel', sortable: true, sortValue: (m: MembroEquipe) => m.papel, render: (m) => <Badge variant="info">{m.papel}</Badge> },
            { key: 'bairro', header: 'Bairro', sortable: true, sortValue: (m: MembroEquipe) => m.bairro },
            { key: 'entrouEm', header: 'Desde', sortable: true, sortValue: (m: MembroEquipe) => m.entrouEm, render: (m) => formatDate(m.entrouEm) },
            { key: 'ativo', header: 'Status', sortable: true, sortValue: (m: MembroEquipe) => m.ativo ? 1 : 0, render: (m) => (
              <Badge variant={m.ativo ? 'success' : 'outline'}>{m.ativo ? 'Ativo' : 'Ausente'}</Badge>
            ) },
          ] as Column<MembroEquipe>[]
        }
      />
    </div>
  )
}
