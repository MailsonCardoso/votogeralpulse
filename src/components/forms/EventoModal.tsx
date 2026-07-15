'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '~/components/ui/button'
import { Input, Label, Select } from '~/components/ui/input'
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter,
} from '~/components/ui/sheet'
import type { Evento } from '~/data/types'

const schema = z.object({
  titulo: z.string().min(2, 'Informe o título'),
  data: z.string().min(1, 'Informe a data'),
  local: z.string().min(1, 'Informe o local'),
  bairro: z.string().min(1, 'Informe o bairro'),
  tipo: z.string().min(1),
  status: z.string().min(1),
  confirmados: z.coerce.number().min(0),
})
type FormData = z.infer<typeof schema>

export function EventoModal({ initial, onSave, onClose }: {
  initial?: Evento
  onSave: (e: Evento) => void
  onClose: () => void
}) {
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: initial
      ? {
          titulo: initial.titulo,
          data: initial.data ? new Date(initial.data).toISOString().slice(0, 10) : '',
          local: initial.local,
          bairro: initial.bairro,
          tipo: initial.tipo,
          status: initial.status,
          confirmados: initial.confirmados,
        }
      : { titulo: '', data: '', local: '', bairro: '', tipo: 'Comício', status: 'planejado', confirmados: 0 },
  })

  function submit(d: FormData) {
    const evento: Evento = {
      id: initial?.id ?? `evt-${Date.now()}`,
      titulo: d.titulo,
      data: new Date(d.data).toISOString(),
      local: d.local,
      bairro: d.bairro,
      tipo: d.tipo as Evento['tipo'],
      status: d.status as Evento['status'],
      confirmados: d.confirmados,
    }
    onSave(evento)
  }

  const f = (name: keyof FormData) => ({
    error: form.formState.errors[name]?.message as string | undefined,
  })

  return (
    <Sheet open onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="max-w-xl p-0">
        <form onSubmit={form.handleSubmit(submit)} className="flex h-full flex-col">
          <SheetHeader>
            <SheetTitle>{initial ? 'Editar evento' : 'Novo evento'}</SheetTitle>
          </SheetHeader>
          <div className="flex-1 space-y-4 overflow-y-auto px-6 py-4">
            <div className="space-y-1.5">
              <Label>Título</Label>
              <Input {...form.register('titulo')} placeholder="Comício na Praça Central" />
              {f('titulo').error && <p className="text-xs text-destructive">{f('titulo').error}</p>}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Data</Label>
                <Input type="date" {...form.register('data')} />
                {f('data').error && <p className="text-xs text-destructive">{f('data').error}</p>}
              </div>
              <div className="space-y-1.5">
                <Label>Confirmados</Label>
                <Input type="number" className="no-spinner" {...form.register('confirmados')} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Local</Label>
              <Input {...form.register('local')} placeholder="Praça da Sé" />
              {f('local').error && <p className="text-xs text-destructive">{f('local').error}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Bairro</Label>
              <Input {...form.register('bairro')} placeholder="Sé" />
              {f('bairro').error && <p className="text-xs text-destructive">{f('bairro').error}</p>}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Tipo</Label>
                <Select {...form.register('tipo')}>
                  <option value="Comício">Comício</option>
                  <option value="Caminhada">Caminhada</option>
                  <option value="Debate">Debate</option>
                  <option value="Social">Social</option>
                  <option value="Institucional">Institucional</option>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Status</Label>
                <Select {...form.register('status')}>
                  <option value="planejado">Planejado</option>
                  <option value="confirmado">Confirmado</option>
                  <option value="realizado">Realizado</option>
                  <option value="cancelado">Cancelado</option>
                </Select>
              </div>
            </div>
          </div>
          <SheetFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              <X /> Cancelar
            </Button>
            <Button type="submit">
              <Plus /> Salvar evento
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
