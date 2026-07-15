'use client'

import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { MapPinned, Plus, CheckCircle2, XCircle, Clock, X, Pencil } from 'lucide-react'
import { PageHeader } from '~/components/ui/page-header'
import { Card, CardContent } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Badge, Textarea, Input, Select, Label } from '~/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '~/components/ui/dialog'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '~/components/ui/sheet'
import { useVisitasStore } from '~/stores/visitas'
import { useEleitoresStore } from '~/stores/eleitores'
import { useCabosStore } from '~/stores/cabos'
import { formatDate } from '~/lib/utils'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
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

const MOTIVOS = [
  'Apoio presencial', 'Entrega de material', 'Debate de propostas',
  'Censo eleitoral', 'Convite para evento', 'Resolução de dúvidas',
]

function Visitas() {
  const visitas = useVisitasStore((s) => s.visitas)
  const adicionarVisita = useVisitasStore((s) => s.adicionar)
  const patchVisita = useVisitasStore((s) => s.patch)
  const eleitores = useEleitoresStore((s) => s.cadastrados)
  const cabos = useCabosStore((s) => s.cadastrados)
  const [agendar, setAgendar] = useState(false)
  const [feedback, setFeedback] = useState<{ v: Visita; open: boolean } | null>(null)
  const [textoFeedback, setTextoFeedback] = useState('')

  const nomeEleitor = (id: string) => eleitores.find((e) => e.id === id)?.nome ?? '—'
  const nomeCabo = (id: string) => cabos.find((c) => c.id === id)?.nome ?? '—'

  return (
    <div className="space-y-6">
      <PageHeader
        title="Visitas"
        description="Operação de campo: visitas agendadas, concluídas e feedback."
        actions={<Button onClick={() => setAgendar(true)}><Plus /> Agendar visita</Button>}
      />

      {visitas.length === 0 ? (
        <Card className="flex flex-col items-center justify-center gap-4 py-20 text-center">
          <MapPinned className="size-16 text-muted-foreground/40" />
          <div>
            <p className="text-lg font-semibold">Nenhuma visita agendada</p>
            <p className="text-sm text-muted-foreground">
              Clique em "Agendar visita" para registrar uma operação de campo.
            </p>
          </div>
        </Card>
      ) : (
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
                  <div className="mt-3 flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => { setFeedback({ v, open: true }); setTextoFeedback(v.feedback ?? '') }}>
                      <Pencil /> Feedback
                    </Button>
                  </div>
                )}
              </Card>
            )
          })}
        </div>
      )}

      {agendar && (
        <VisitaModal
          eleitores={eleitores}
          cabos={cabos}
          onSave={(d) => {
            adicionarVisita({
              id: `vis-${Date.now()}`,
              eleitorId: d.eleitorId,
              caboId: d.caboId,
              data: new Date(d.data).toISOString(),
              status: d.status,
              motivo: d.motivo,
              feedback: undefined,
              protocolo: `VT-${Math.floor(1000 + Math.random() * 8999)}`,
            })
            toast.success('Visita agendada!', { description: nomeEleitor(d.eleitorId) })
            setAgendar(false)
          }}
          onClose={() => setAgendar(false)}
        />
      )}

      <Dialog open={!!feedback?.open} onOpenChange={(o) => !o && setFeedback(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Feedback da visita</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Visita a {feedback && nomeEleitor(feedback.v.eleitorId)}
            </p>
            <Textarea
              value={textoFeedback}
              onChange={(e) => setTextoFeedback(e.target.value)}
              placeholder="Como foi a abordagem? O eleitor demonstrou apoio?"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFeedback(null)}>Cancelar</Button>
            <Button onClick={() => {
              if (!feedback) return
              patchVisita(feedback.v.id, { feedback: textoFeedback })
              toast.success('Feedback registrado!')
              setFeedback(null)
            }}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

const schema = z.object({
  eleitorId: z.string().min(1, 'Selecione o eleitor'),
  caboId: z.string().min(1, 'Selecione o cabo'),
  motivo: z.string().min(1, 'Selecione o motivo'),
  data: z.string().min(1, 'Informe a data'),
  status: z.enum(['agendada', 'concluida', 'cancelada']),
})
type FormData = z.infer<typeof schema>

function VisitaModal({ eleitores, cabos, onSave, onClose }: {
  eleitores: { id: string; nome: string }[]
  cabos: { id: string; nome: string }[]
  onSave: (d: FormData) => void
  onClose: () => void
}) {
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { motivo: MOTIVOS[0], data: new Date().toISOString().slice(0, 10), status: 'agendada' },
  })

  function submit(d: FormData) { onSave(d) }
  function aoInvalido() { toast.error('Preencha os campos obrigatórios antes de salvar.') }
  const f = (name: keyof FormData) => ({
    ...form.register(name),
    error: form.formState.errors[name]?.message as string | undefined,
  })

  return (
    <Sheet open onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="max-w-xl p-0">
        <form onSubmit={form.handleSubmit(submit, aoInvalido)} className="flex h-full flex-col">
          <SheetHeader>
            <SheetTitle>Agendar visita</SheetTitle>
          </SheetHeader>
          <div className="flex-1 space-y-6 overflow-y-auto px-6 py-4">
            <section className="space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground">Operação de campo</h3>
              <Field label="Eleitor" error={f('eleitorId').error}>
                <Select {...form.register('eleitorId')}>
                  <option value="">Selecione…</option>
                  {eleitores.map((e) => <option key={e.id} value={e.id}>{e.nome}</option>)}
                </Select>
              </Field>
              <Field label="Cabo responsável" error={f('caboId').error}>
                <Select {...form.register('caboId')}>
                  <option value="">Selecione…</option>
                  {cabos.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
                </Select>
              </Field>
              <Field label="Motivo" error={f('motivo').error}>
                <Select {...form.register('motivo')}>
                  {MOTIVOS.map((m) => <option key={m}>{m}</option>)}
                </Select>
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Data" error={f('data').error}>
                  <Input type="date" {...form.register('data')} />
                </Field>
                <Field label="Status" error={f('status').error}>
                  <Select {...form.register('status')}>
                    <option value="agendada">Agendada</option>
                    <option value="concluida">Concluída</option>
                    <option value="cancelada">Cancelada</option>
                  </Select>
                </Field>
              </div>
            </section>
          </div>
          <SheetFooter>
            <Button type="button" variant="outline" onClick={onClose}><X /> Cancelar</Button>
            <Button type="submit"><Plus /> Agendar</Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}

function Field({ label, error, children, className }: { label: string; error?: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`space-y-1.5 ${className ?? ''}`}>
      <Label>{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
