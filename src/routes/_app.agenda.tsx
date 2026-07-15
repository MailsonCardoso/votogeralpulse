'use client'

import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { CalendarDays, ChevronLeft, ChevronRight, Plus, MapPin } from 'lucide-react'
import { toast } from 'sonner'
import { PageHeader } from '~/components/ui/page-header'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Badge } from '~/components/ui/input'
import { EventoModal } from '~/components/forms/EventoModal'
import { useEventos } from '~/hooks/useData'
import { useEventosStore } from '~/stores/eventos'
import { formatDate } from '~/lib/utils'

export const Route = createFileRoute('/_app/agenda')({
  head: () => ({ meta: [{ title: 'Agenda — VotoGeral 360' }] }),
  component: Agenda,
})

const MESES = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']
const DIAS = ['D','S','T','Q','Q','S','S']

function Agenda() {
  const eventos = useEventos()
  const adicionarEvento = useEventosStore((s) => s.adicionar)
  const [modalOpen, setModalOpen] = useState(false)
  const [ano, setAno] = useState(2026)
  const [mes, setMes] = useState(5)

  const primeiro = new Date(ano, mes, 1).getDay()
  const diasMes = new Date(ano, mes + 1, 0).getDate()
  const hoje = new Date(2026, 5, 9)

  const eventosPorDia = new Map<number, typeof eventos>()
  eventos.forEach((e) => {
    const d = new Date(e.data)
    if (d.getFullYear() === ano && d.getMonth() === mes) {
      const arr = eventosPorDia.get(d.getDate()) ?? []
      arr.push(e)
      eventosPorDia.set(d.getDate(), arr)
    }
  })

  const proximos = [...eventos]
    .sort((a, b) => +new Date(a.data) - +new Date(b.data))
    .slice(0, 5)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Agenda"
        description="Calendário de eventos e compromissos de campanha."
        actions={<Button onClick={() => setModalOpen(true)}><Plus /> Novo evento</Button>}
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="size-4 text-brand" />
              {MESES[mes]} {ano}
            </CardTitle>
            <div className="flex gap-1">
              <Button variant="outline" size="icon" onClick={() => {
                if (mes === 0) { setMes(11); setAno(ano - 1) } else setMes(mes - 1)
              }}><ChevronLeft /></Button>
              <Button variant="outline" size="icon" onClick={() => {
                if (mes === 11) { setMes(0); setAno(ano + 1) } else setMes(mes + 1)
              }}><ChevronRight /></Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-muted-foreground">
              {DIAS.map((d, i) => <div key={i} className="py-1">{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: primeiro }).map((_, i) => <div key={`e${i}`} />)}
              {Array.from({ length: diasMes }).map((_, i) => {
                const dia = i + 1
                const evs = eventosPorDia.get(dia) ?? []
                const isHoje = dia === hoje.getDate() && mes === hoje.getMonth()
                return (
                  <div
                    key={dia}
                    className={`min-h-[64px] rounded-lg border border-border p-1.5 text-left text-xs transition-colors hover:bg-accent/30 ${
                      isHoje ? 'bg-brand/10 ring-1 ring-ring' : ''
                    }`}
                  >
                    <span className="font-semibold">{dia}</span>
                    {evs.slice(0, 2).map((e) => (
                      <p key={e.id} className="mt-0.5 truncate rounded bg-brand/15 px-1 text-[10px] text-brand">
                        {e.titulo}
                      </p>
                    ))}
                    {evs.length > 2 && (
                      <p className="text-[10px] text-muted-foreground">+{evs.length - 2}</p>
                    )}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Próximos eventos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {proximos.map((e) => (
              <div key={e.id} className="flex gap-3 rounded-lg border border-border p-3">
                <div className="flex size-11 shrink-0 flex-col items-center justify-center rounded-lg bg-brand/15 text-brand">
                  <span className="text-xs font-medium">{MESES[e.data ? new Date(e.data).getMonth() : 0].slice(0, 3)}</span>
                  <span className="text-lg font-bold leading-none">{new Date(e.data).getDate()}</span>
                </div>
                <div className="min-w-0">
                  <p className="truncate font-medium">{e.titulo}</p>
                  <p className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="size-3" /> {e.local}
                  </p>
                  <Badge variant="info" className="mt-1">{e.tipo}</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {modalOpen && (
        <EventoModal
          onSave={(e) => {
            adicionarEvento(e)
            toast.success('Evento criado!', { description: e.titulo })
            setModalOpen(false)
          }}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  )
}
