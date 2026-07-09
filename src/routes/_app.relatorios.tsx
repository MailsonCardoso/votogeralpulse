'use client'

import { createFileRoute } from '@tanstack/react-router'
import { FileText, Download, FileSpreadsheet, FileBarChart } from 'lucide-react'
import { toast } from 'sonner'
import { PageHeader } from '~/components/ui/page-header'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Button } from '~/components/ui/button'

export const Route = createFileRoute('/_app/relatorios')({
  head: () => ({ meta: [{ title: 'Relatórios — VotoGeral 360' }] }),
  component: Relatorios,
})

const RELATORIOS = [
  { id: 1, titulo: 'Base de eleitores', desc: 'Exportação completa com filtros aplicados.', icon: FileSpreadsheet, fmt: 'CSV' },
  { id: 2, titulo: 'Intenção de voto', desc: 'Apuração consolidada por bairro e faixa.', icon: FileBarChart, fmt: 'PDF' },
  { id: 3, titulo: 'Performance de cabos', desc: 'Ranking e metas por região.', icon: FileText, fmt: 'PDF' },
  { id: 4, titulo: 'Fluxo financeiro', desc: 'Receitas e despesas por categoria.', icon: FileSpreadsheet, fmt: 'CSV' },
  { id: 5, titulo: 'Agenda de eventos', desc: 'Calendário de mobilizações.', icon: FileText, fmt: 'PDF' },
  { id: 6, titulo: 'Resumo executivo', desc: 'Visão geral para o comitê.', icon: FileBarChart, fmt: 'PDF' },
]

function Relatorios() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Relatórios"
        description="Exporte dados da campanha em CSV ou PDF."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {RELATORIOS.map((r) => (
          <Card key={r.id} className="flex flex-col p-5">
            <div className="flex size-10 items-center justify-center rounded-xl bg-brand-500/15 text-brand-600 dark:text-brand-300">
              <r.icon className="size-5" />
            </div>
            <h3 className="mt-3 font-semibold">{r.titulo}</h3>
            <p className="mt-1 flex-1 text-sm text-muted">{r.desc}</p>
            <div className="mt-4 flex items-center gap-2">
              <span className="rounded-full bg-[var(--card-border)]/40 px-2 py-0.5 text-xs font-medium text-muted">
                {r.fmt}
              </span>
              <Button
                variant="outline"
                size="sm"
                className="ml-auto"
                onClick={() => toast.success(`${r.titulo} exportado (${r.fmt})`, { description: 'Download simulado com sucesso.' })}
              >
                <Download /> Exportar
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
