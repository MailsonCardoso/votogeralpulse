'use client'

import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Megaphone, Plus, Send, Users, Clock } from 'lucide-react'
import { toast } from 'sonner'
import { PageHeader } from '~/components/ui/page-header'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Input, Label, Select, Textarea, Badge } from '~/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '~/components/ui/dialog'

export const Route = createFileRoute('/_app/campanhas')({
  head: () => ({ meta: [{ title: 'Campanhas — VotoGeral 360' }] }),
  component: Campanhas,
})

const CAMPANHAS = [
  { id: 1, nome: 'Lembrete de votação', publico: 'Ferrenhos - Zona Leste', canal: 'WhatsApp', status: 'Enviada', alcance: 4200, data: '2026-06-04' },
  { id: 2, nome: 'Convite comício', publico: 'Indecisos - Mooca', canal: 'SMS', status: 'Agendada', alcance: 1800, data: '2026-06-12' },
  { id: 3, nome: 'Pesquisa rápida', publico: 'Todos - Vila Mariana', canal: 'E-mail', status: 'Rascunho', alcance: 0, data: '—' },
]

function Campanhas() {
  const [open, setOpen] = useState(false)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Campanhas"
        description="Disparos segmentados por público, canal e agenda."
        actions={<Button onClick={() => setOpen(true)}><Plus /> Nova campanha</Button>}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CAMPANHAS.map((c) => (
          <Card key={c.id} className="p-5">
            <div className="flex items-start justify-between">
              <div className="flex size-10 items-center justify-center rounded-xl bg-brand-500/15 text-brand-600 dark:text-brand-300">
                <Megaphone className="size-5" />
              </div>
              <Badge variant={c.status === 'Enviada' ? 'success' : c.status === 'Agendada' ? 'info' : 'outline'}>
                {c.status}
              </Badge>
            </div>
            <h3 className="mt-3 font-semibold">{c.nome}</h3>
            <div className="mt-2 space-y-1 text-sm text-muted">
              <p className="flex items-center gap-2"><Users className="size-3.5" /> {c.publico}</p>
              <p className="flex items-center gap-2"><Send className="size-3.5" /> {c.canal}</p>
              <p className="flex items-center gap-2"><Clock className="size-3.5" /> {c.data}</p>
            </div>
            <div className="mt-3 border-t border-[var(--card-border)] pt-3 text-sm">
              <span className="text-muted">Alcance: </span>
              <span className="font-medium">{c.alcance.toLocaleString('pt-BR')}</span>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Nova campanha de disparo</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Nome da campanha</Label>
              <Input placeholder="Ex.: Lembrete de votação" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Público</Label>
                <Select>
                  <option>Ferrenhos - Zona Leste</option>
                  <option>Indecisos - Mooca</option>
                  <option>Todos - Vila Mariana</option>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Canal</Label>
                <Select>
                  <option>WhatsApp</option>
                  <option>SMS</option>
                  <option>E-mail</option>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Mensagem</Label>
              <Textarea placeholder="Olá {{nome}}, conte com a gente…" />
            </div>
            <div className="space-y-1.5">
              <Label>Agendar para</Label>
              <Input type="date" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button onClick={() => { toast.success('Campanha criada!'); setOpen(false) }}>
              <Send /> Criar disparo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
