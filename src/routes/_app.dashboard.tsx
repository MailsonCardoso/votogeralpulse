import { createFileRoute } from '@tanstack/react-router'
import {
  Users, Target, MessageSquare, TrendingUp, CalendarCheck, Banknote,
} from 'lucide-react'
import { PageHeader } from '~/components/ui/page-header'
import { KpiCard } from '~/components/ui/kpi-card'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Badge } from '~/components/ui/input'
import {
  AreaTrendChart,
  BarChartCard,
  DonutChart,
} from '~/components/charts'
import {
  useEleitores, useLiderancas, useVisitas, useAtividades,
  useMetricasSemana, useDemografia, APOIO_META,
} from '~/hooks/useData'
import { formatNumber, relativeTime } from '~/lib/utils'

export const Route = createFileRoute('/_app/dashboard')({
  head: () => ({
    meta: [
      { title: 'Painel Geral — VotoGeral 360' },
      { name: 'description', content: 'Visão executiva da campanha.' },
    ],
  }),
  component: Dashboard,
})

function Dashboard() {
  const eleitores = useEleitores()
  const liderancas = useLiderancas()
  const visitas = useVisitas()
  const atividades = useAtividades()
  const metricas = useMetricasSemana()
  const { idade } = useDemografia()

  const apoioDist = (['ferrenho', 'provavel', 'indeciso', 'adversario'] as const).map(
    (k) => ({
      nome: APOIO_META[k].label,
      valor: eleitores.filter((e) => e.apoio === k).length,
    }),
  )
  const bairrosTop = Object.entries(
    eleitores.reduce<Record<string, number>>((acc, e) => {
      acc[e.bairro] = (acc[e.bairro] ?? 0) + 1
      return acc
    }, {}),
  )
    .map(([bairro, total]) => ({ bairro, total }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 6)

  const totalConvertidos = eleitores.filter(
    (e) => e.apoio === 'ferrenho' || e.apoio === 'provavel',
  ).length

  return (
    <div className="space-y-6">
      <PageHeader
        title="Painel Geral"
        description="Visão executiva da sua campanha em tempo real."
        actions={
          <Badge variant="success">Campanha ativa</Badge>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        <KpiCard title="Eleitores" value={formatNumber(eleitores.length)} trend={8.2} icon={Users} delay={0} />
        <KpiCard title="Convertidos" value={formatNumber(totalConvertidos)} trend={12.4} icon={Target} delay={0.05} />
        <KpiCard title="Lideranças" value={formatNumber(liderancas.length)} trend={3.1} icon={Users} delay={0.1} />
        <KpiCard title="Visitas" value={formatNumber(visitas.length)} trend={-2.0} icon={CalendarCheck} delay={0.15} />
        <KpiCard title="Conversas" value="1.2k" trend={5.6} icon={MessageSquare} delay={0.2} />
        <KpiCard title="Recursos" value="R$ 184k" trend={1.4} icon={Banknote} delay={0.25} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Evolução semanal</CardTitle>
            <p className="text-sm text-muted">Contatos e conversões nos últimos 7 dias</p>
          </CardHeader>
          <CardContent>
            <AreaTrendChart
              data={metricas}
              xKey="dia"
              series={[
                { key: 'contatos', name: 'Contatos' },
                { key: 'conversoes', name: 'Conversões' },
              ]}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Intenção de voto</CardTitle>
            <p className="text-sm text-muted">Distribuição do eleitorado</p>
          </CardHeader>
          <CardContent>
            <DonutChart data={apoioDist} nameKey="nome" valueKey="valor" />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Eleitores por bairro</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChartCard
              data={bairrosTop}
              xKey="bairro"
              bars={[{ key: 'total', name: 'Eleitores', color: '#6366f1' }]}
              height={240}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Demografia — idade</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChartCard
              data={idade}
              xKey="faixa"
              bars={[{ key: 'eleitores', name: 'Eleitores', color: '#10b981' }]}
              height={240}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Metas da semana</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: 'Contatos', atual: 3000, meta: 3600 },
              { label: 'Conversões', atual: 855, meta: 1100 },
              { label: 'Visitas', atual: 30, meta: 45 },
            ].map((m) => {
              const pct = Math.round((m.atual / m.meta) * 100)
              return (
                <div key={m.label}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span>{m.label}</span>
                    <span className="text-muted">{pct}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-[var(--card-border)]">
                    <div
                      className="h-full rounded-full brand-gradient"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="size-4 text-brand-500" /> Atividade recente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {atividades.map((a) => (
              <li key={a.id} className="flex items-start gap-3 text-sm">
                <span className="mt-1.5 size-2 shrink-0 rounded-full bg-brand-500" />
                <div className="flex-1">
                  <p>
                    <span className="font-medium">{a.usuario}</span> {a.acao}{' '}
                    <span className="text-muted">{a.alvo}</span>
                  </p>
                </div>
                <span className="text-xs text-muted">{relativeTime(a.tempo)}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
