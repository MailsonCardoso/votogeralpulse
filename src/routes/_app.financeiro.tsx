import { createFileRoute } from '@tanstack/react-router'
import { Wallet, TrendingUp, TrendingDown, ArrowDownToLine, ArrowUpFromLine } from 'lucide-react'
import { PageHeader } from '~/components/ui/page-header'
import { KpiCard } from '~/components/ui/kpi-card'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Badge } from '~/components/ui/input'
import { DataTable, type Column } from '~/components/ui/data-table'
import { BarChartCard } from '~/components/charts'
import { useFinanceiro } from '~/hooks/useData'
import { formatCurrency, formatDate } from '~/lib/utils'
import type { Movimentacao } from '~/data/types'

export const Route = createFileRoute('/_app/financeiro')({
  head: () => ({ meta: [{ title: 'Financeiro — VotoGeral 360' }] }),
  component: Financeiro,
})

function Financeiro() {
  const fin = useFinanceiro()
  const receitas = fin.filter((f) => f.tipo === 'receita').reduce((s, f) => s + f.valor, 0)
  const despesas = fin.filter((f) => f.tipo === 'despesa').reduce((s, f) => s + f.valor, 0)
  const saldo = receitas - despesas

  const fluxo = fin.reduce<Record<string, { mes: string; receita: number; despesa: number }>>((acc, f) => {
    const mes = new Date(f.data).toLocaleDateString('pt-BR', { month: 'short' })
    if (!acc[mes]) acc[mes] = { mes, receita: 0, despesa: 0 }
    acc[mes][f.tipo] += f.valor
    return acc
  }, {})

  return (
    <div className="space-y-6">
      <PageHeader title="Financeiro" description="Receitas, despesas e fluxo de caixa da campanha." />

      <div className="grid gap-4 md:grid-cols-3">
        <KpiCard title="Saldo" value={formatCurrency(saldo)} trend={6.4} icon={Wallet} />
        <KpiCard title="Receitas" value={formatCurrency(receitas)} trend={9.1} icon={ArrowDownToLine} />
        <KpiCard title="Despesas" value={formatCurrency(despesas)} trend={-3.2} icon={ArrowUpFromLine} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Fluxo de caixa</CardTitle>
        </CardHeader>
        <CardContent>
          <BarChartCard
            data={Object.values(fluxo)}
            xKey="mes"
            bars={[
              { key: 'receita', name: 'Receita', color: '#10b981' },
              { key: 'despesa', name: 'Despesa', color: '#ef4444' },
            ]}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Movimentações</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={fin}
            pageSize={8}
            searchable
            searchKeys={['descricao', 'categoria']}
            columns={
              [
                { key: 'descricao', header: 'Descrição', sortable: true, sortValue: (m: Movimentacao) => m.descricao, render: (m) => (
                  <div>
                    <p className="font-medium">{m.descricao}</p>
                    <p className="text-xs text-muted">{m.categoria}</p>
                  </div>
                ) },
                { key: 'data', header: 'Data', sortable: true, sortValue: (m: Movimentacao) => m.data, render: (m) => formatDate(m.data) },
                { key: 'tipo', header: 'Tipo', sortable: true, sortValue: (m: Movimentacao) => m.tipo, render: (m) => (
                  <Badge variant={m.tipo === 'receita' ? 'success' : 'danger'}>
                    {m.tipo === 'receita' ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
                    {m.tipo === 'receita' ? 'Receita' : 'Despesa'}
                  </Badge>
                ) },
                { key: 'valor', header: 'Valor', sortable: true, sortValue: (m: Movimentacao) => m.valor, render: (m) => (
                  <span className={m.tipo === 'receita' ? 'text-[var(--color-success)]' : 'text-danger'}>
                    {m.tipo === 'receita' ? '+' : '-'} {formatCurrency(m.valor)}
                  </span>
                ) },
              ] as Column<Movimentacao>[]
            }
          />
        </CardContent>
      </Card>
    </div>
  )
}
