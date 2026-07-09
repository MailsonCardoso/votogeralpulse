import { createFileRoute } from '@tanstack/react-router'
import { BarChart3, Plus, Users } from 'lucide-react'
import { PageHeader } from '~/components/ui/page-header'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Badge } from '~/components/ui/input'
import { Button } from '~/components/ui/button'
import { DonutChart, BarChartCard } from '~/components/charts'
import { usePesquisas } from '~/hooks/useData'
import { formatDate, formatNumber } from '~/lib/utils'

export const Route = createFileRoute('/_app/pesquisas')({
  head: () => ({ meta: [{ title: 'Pesquisas — VotoGeral 360' }] }),
  component: Pesquisas,
})

function Pesquisas() {
  const pesquisas = usePesquisas()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pesquisas"
        description="Apuração de intenção de voto e opinião do eleitorado."
        actions={<Button><Plus /> Nova pesquisa</Button>}
      />

      <div className="grid gap-4 lg:grid-cols-2">
        {pesquisas.map((p) => (
          <Card key={p.id}>
            <CardHeader className="flex-row items-start justify-between space-y-0">
              <div>
                <CardTitle>{p.titulo}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {formatDate(p.data)} · {formatNumber(p.amostra)} entrevistas
                </p>
              </div>
              <Badge variant="info"><Users /> {formatNumber(p.amostra)}</Badge>
            </CardHeader>
            <CardContent className="space-y-5">
              <DonutChart data={p.intencao} nameKey="nome" valueKey="valor" height={220} />
              <div>
                <p className="mb-2 text-sm font-medium">Aprovação por pergunta</p>
                <div className="space-y-3">
                  {p.perguntas.map((q) => (
                    <div key={q.pergunta}>
                      <div className="mb-1 flex justify-between text-xs">
                        <span className="text-muted-foreground">{q.pergunta}</span>
                        <span className="font-medium">{q.aprovacao}%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-border">
                        <div className="h-full rounded-full brand-gradient" style={{ width: `${q.aprovacao}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
