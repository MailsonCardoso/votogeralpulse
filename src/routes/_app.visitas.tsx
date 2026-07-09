'use client'

import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { MapPinned, Plus, CheckCircle2, XCircle, Clock } from 'lucide-react'
import { PageHeader } from '~/components/ui/page-header'
import { Card, CardContent } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Badge, Textarea } from '~/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '~/components/ui/dialog'
import { useVisitas, useEleitores, useCabos } from '~/hooks/useData'
import { formatDate } from '~/lib/utils'
import { toast } from 'sonner'
import type { StatusVisita, Visita } from '~/data/types'

export const Route = createFileRoute('/_app/visitas')({
  head: () => ({ meta: [{ title: 'Visitas — VotoGeral 360' }] }),
  component: Visitas,
})

const STATUS: Record<StatusVisita, { label: string; variant: 'success' | 'warning' | 'danger'; icon: any }> = {
  concluida: { label: 'Concluída', variant: 'success', icon: CheckCircle2 },
  agendada: { label: 'Agendada', variant: 'warning', icon: Clock },
  cancelada: { label: 'Cancelada', variant: 'danger', icon: XCircle },
}

function Visitas() {
  const visitas = useVisitas()
  const eleitores = useEleitores()
  const cabos = useCabos()
  const [feedback, setFeedback] = useState<{ v: Visita; open: boolean } | null>(null)

  const nomeEleitor = (id: string) => eleitores.find((e) => e.id === id)?.nome ?? '—'
  const nomeCabo = (id: string) => cabos.find((c) => c.id === id)?.nome ?? '—'

  return (
    <div className="space-y-6">
      <PageHeader
        title="Visitas"
        description="Operação de campo: visitas agendadas, concluídas e feedback."
        actions={<Button><Plus /> Agendar visita</Button>}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visitas.map((v) => {
          const st = STATUS[v.status]
          return (
            <Card key={v.id} className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium">{nomeEleitor(v.eleitorId)}</p>
                  <p className="text-xs text-muted-foreground">Cabo: {nomeCabo(v.caboId)}</p>
                </div>
                <Badge variant={st.variant}><st.icon className="size-3" /> {st.label}</Badge>
              </div>
              <p className="mt-3 text-sm">{v.motivo}</p>
              {v.feedback && (
                <p className="mt-2 rounded-lg bg-accent/30 p-2 text-xs text-muted-foreground">
                  “{v.feedback}”
                </p>
              )}
              <div className="mt-3 flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
                <span>{formatDate(v.data)}</span>
                <span className="font-mono">{v.protocolo}</span>
              </div>
              {v.status === 'agendada' && (
                <Button variant="outline" size="sm" className="mt-3 w-full" onClick={() => setFeedback({ v, open: true })}>
                  Registrar feedback
                </Button>
              )}
            </Card>
          )
        })}
      </div>

      <Dialog open={!!feedback?.open} onOpenChange={(o) => !o && setFeedback(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Feedback da visita</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Visita a {feedback && nomeEleitor(feedback.v.eleitorId)}</p>
            <Textarea placeholder="Como foi a abordagem? O eleitor demonstrou apoio?" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFeedback(null)}>Cancelar</Button>
            <Button onClick={() => { toast.success('Feedback registrado!'); setFeedback(null) }}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
