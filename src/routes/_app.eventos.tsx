import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Flag, Plus, MapPin, Users } from 'lucide-react'
import { toast } from 'sonner'
import { PageHeader } from '~/components/ui/page-header'
import { Card, CardContent } from '~/components/ui/card'
import { Badge } from '~/components/ui/input'
import { Button } from '~/components/ui/button'
import { EventoModal } from '~/components/forms/EventoModal'
import { useEventos } from '~/hooks/useData'
import { useEventosStore } from '~/stores/eventos'
import { formatDate, formatNumber } from '~/lib/utils'
import type { StatusEvento } from '~/data/types'

export const Route = createFileRoute('/_app/eventos')({
  head: () => ({ meta: [{ title: 'Eventos — VotoGeral 360' }] }),
  component: Eventos,
})

const STATUS: Record<StatusEvento, { label: string; variant: 'success' | 'info' | 'warning' | 'danger' }> = {
  planejado: { label: 'Planejado', variant: 'info' },
  confirmado: { label: 'Confirmado', variant: 'success' },
  realizado: { label: 'Realizado', variant: 'warning' },
  cancelado: { label: 'Cancelado', variant: 'danger' },
}

function Eventos() {
  const eventos = useEventos()
  const adicionarEvento = useEventosStore((s) => s.adicionar)
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Eventos"
        description="Comícios, caminhadas e mobilizações da campanha."
        actions={<Button onClick={() => setModalOpen(true)}><Plus /> Criar evento</Button>}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {eventos.map((e) => {
          const st = STATUS[e.status]
          return (
            <Card key={e.id} className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex size-10 items-center justify-center rounded-xl bg-brand/15 text-brand">
                  <Flag className="size-5" />
                </div>
                <Badge variant={st.variant}>{st.label}</Badge>
              </div>
              <h3 className="mt-3 font-semibold">{e.titulo}</h3>
              <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                <p className="flex items-center gap-2"><MapPin className="size-3.5" /> {e.local} · {e.bairro}</p>
                <p>{formatDate(e.data)}</p>
                <p className="flex items-center gap-2"><Users className="size-3.5" /> {formatNumber(e.confirmados)} confirmados</p>
              </div>
              <div className="mt-3">
                <Badge variant="outline">{e.tipo}</Badge>
              </div>
            </Card>
          )
        })}
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
