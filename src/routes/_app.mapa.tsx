'use client'

import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { MapPinned, Flame } from 'lucide-react'
import { PageHeader } from '~/components/ui/page-header'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Badge } from '~/components/ui/input'
import { useDensidade } from '~/hooks/useData'
import { cn } from '~/lib/utils'

export const Route = createFileRoute('/_app/mapa')({
  head: () => ({ meta: [{ title: 'Mapa de Calor — VotoGeral 360' }] }),
  component: Mapa,
})

function cor(densidade: number) {
  if (densidade > 75) return 'var(--color-danger)'
  if (densidade > 50) return 'var(--color-warning)'
  if (densidade > 30) return 'var(--color-info)'
  return 'var(--color-success)'
}

function Mapa() {
  const densidade = useDensidade()
  const [hover, setHover] = useState<(typeof densidade)[number] | null>(null)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Mapa de Calor"
        description="Densidade de eleitores e conversão por região."
        actions={
          <Badge variant="warning"><Flame /> Mapa térmico</Badge>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPinned className="size-4 text-brand-500" /> Região metropolitana
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative overflow-hidden rounded-xl border border-[var(--card-border)] bg-[var(--bg-elevated)]">
              <svg viewBox="0 0 400 280" className="h-[360px] w-full">
                <defs>
                  <pattern id="dots" width="14" height="14" patternUnits="userSpaceOnUse">
                    <circle cx="2" cy="2" r="1" fill="var(--card-border)" />
                  </pattern>
                </defs>
                <rect width="400" height="280" fill="url(#dots)" />
                <path
                  d="M40 60 Q 120 30 200 60 T 360 70 Q 380 140 340 200 T 200 240 Q 100 250 50 200 Q 20 130 40 60 Z"
                  fill="color-mix(in oklab, var(--brand) 8%, transparent)"
                  stroke="var(--brand)"
                  strokeWidth="1.5"
                />
                {densidade.map((d, i) => {
                  const x = 60 + ((i * 53) % 300)
                  const y = 50 + ((i * 71) % 180)
                  const r = 4 + (d.densidade / 100) * 14
                  return (
                    <g
                      key={d.bairro}
                      onMouseEnter={() => setHover(d)}
                      className="cursor-pointer"
                    >
                      <circle cx={x} cy={y} r={r} fill={cor(d.densidade)} opacity={0.35} />
                      <circle cx={x} cy={y} r={3} fill={cor(d.densidade)} />
                    </g>
                  )
                })}
              </svg>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted">
              <span className="flex items-center gap-1.5"><i className="size-3 rounded-full" style={{ background: 'var(--color-success)' }} /> Baixa</span>
              <span className="flex items-center gap-1.5"><i className="size-3 rounded-full" style={{ background: 'var(--color-info)' }} /> Média</span>
              <span className="flex items-center gap-1.5"><i className="size-3 rounded-full" style={{ background: 'var(--color-warning)' }} /> Alta</span>
              <span className="flex items-center gap-1.5"><i className="size-3 rounded-full" style={{ background: 'var(--color-danger)' }} /> Crítica</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ranking de densidade</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {[...densidade].sort((a, b) => b.densidade - a.densidade).slice(0, 8).map((d) => (
              <div
                key={d.bairro}
                onMouseEnter={() => setHover(d)}
                className={cn(
                  'flex items-center justify-between rounded-lg px-3 py-2 transition-colors',
                  hover?.bairro === d.bairro ? 'bg-[var(--card-border)]/40' : '',
                )}
              >
                <span className="flex items-center gap-2 text-sm">
                  <span className="size-2.5 rounded-full" style={{ background: cor(d.densidade) }} />
                  {d.bairro}
                </span>
                <span className="text-sm font-medium">{d.densidade}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
