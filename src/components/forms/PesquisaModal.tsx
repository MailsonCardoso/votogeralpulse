'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X, Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '~/components/ui/button'
import { Input, Label } from '~/components/ui/input'
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter,
} from '~/components/ui/sheet'
import type { Pesquisa } from '~/data/types'

const schema = z.object({
  titulo: z.string().min(2, 'Informe o título'),
  data: z.string().min(1, 'Informe a data'),
  amostra: z.coerce.number().min(1, 'Amostra mínima 1'),
})
type FormData = z.infer<typeof schema>

export function PesquisaModal({ initial, onSave, onClose }: {
  initial?: Pesquisa
  onSave: (p: Pesquisa) => void
  onClose: () => void
}) {
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: initial
      ? {
          titulo: initial.titulo,
          data: initial.data ? new Date(initial.data).toISOString().slice(0, 10) : '',
          amostra: initial.amostra,
        }
      : { titulo: '', data: '', amostra: 100 },
  })
  const [intencao, setIntencao] = useState<{ nome: string; valor: number }[]>(
    initial?.intencao?.length ? initial.intencao : [{ nome: 'Candidato A', valor: 0 }],
  )
  const [perguntas, setPerguntas] = useState<{ pergunta: string; aprovacao: number }[]>(
    initial?.perguntas?.length ? initial.perguntas : [{ pergunta: '', aprovacao: 0 }],
  )

  function submit(d: FormData) {
    const pesquisa: Pesquisa = {
      id: initial?.id ?? `pesq-${Date.now()}`,
      titulo: d.titulo,
      data: new Date(d.data).toISOString(),
      amostra: d.amostra,
      intencao: intencao.filter((i) => i.nome.trim()),
      perguntas: perguntas.filter((p) => p.pergunta.trim()),
    }
    onSave(pesquisa)
  }

  const f = (name: keyof FormData) => ({
    error: form.formState.errors[name]?.message as string | undefined,
  })

  return (
    <Sheet open onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="max-w-xl p-0">
        <form onSubmit={form.handleSubmit(submit)} className="flex h-full flex-col">
          <SheetHeader>
            <SheetTitle>{initial ? 'Editar pesquisa' : 'Nova pesquisa'}</SheetTitle>
          </SheetHeader>
          <div className="flex-1 space-y-5 overflow-y-auto px-6 py-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 space-y-1.5">
                <Label>Título</Label>
                <Input {...form.register('titulo')} placeholder="Intenção de voto — 1º turno" />
                {f('titulo').error && <p className="text-xs text-destructive">{f('titulo').error}</p>}
              </div>
              <div className="space-y-1.5">
                <Label>Data</Label>
                <Input type="date" {...form.register('data')} />
                {f('data').error && <p className="text-xs text-destructive">{f('data').error}</p>}
              </div>
              <div className="space-y-1.5">
                <Label>Amostra</Label>
                <Input type="number" className="no-spinner" {...form.register('amostra')} />
                {f('amostra').error && <p className="text-xs text-destructive">{f('amostra').error}</p>}
              </div>
            </div>

            <section className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-muted-foreground">Intenção de voto</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIntencao((v) => [...v, { nome: '', valor: 0 }])}
                >
                  <Plus /> Item
                </Button>
              </div>
              {intencao.map((item, i) => (
                <div key={i} className="flex items-end gap-2">
                  <div className="flex-1 space-y-1.5">
                    <Label className="text-xs">Nome</Label>
                    <Input
                      value={item.nome}
                      onChange={(e) => setIntencao((v) => v.map((x, j) => (j === i ? { ...x, nome: e.target.value } : x)))}
                      placeholder="Candidato A"
                    />
                  </div>
                  <div className="w-24 space-y-1.5">
                    <Label className="text-xs">%</Label>
                    <Input
                      type="number"
                      className="no-spinner"
                      value={item.valor}
                      onChange={(e) => setIntencao((v) => v.map((x, j) => (j === i ? { ...x, valor: Number(e.target.value) } : x)))}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setIntencao((v) => v.filter((_, j) => j !== i))}
                  >
                    <Trash2 />
                  </Button>
                </div>
              ))}
            </section>

            <section className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-muted-foreground">Perguntas</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setPerguntas((v) => [...v, { pergunta: '', aprovacao: 0 }])}
                >
                  <Plus /> Pergunta
                </Button>
              </div>
              {perguntas.map((item, i) => (
                <div key={i} className="flex items-end gap-2">
                  <div className="flex-1 space-y-1.5">
                    <Label className="text-xs">Pergunta</Label>
                    <Input
                      value={item.pergunta}
                      onChange={(e) => setPerguntas((v) => v.map((x, j) => (j === i ? { ...x, pergunta: e.target.value } : x)))}
                      placeholder="Aprova a gestão atual?"
                    />
                  </div>
                  <div className="w-24 space-y-1.5">
                    <Label className="text-xs">Aprovação %</Label>
                    <Input
                      type="number"
                      className="no-spinner"
                      value={item.aprovacao}
                      onChange={(e) => setPerguntas((v) => v.map((x, j) => (j === i ? { ...x, aprovacao: Number(e.target.value) } : x)))}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setPerguntas((v) => v.filter((_, j) => j !== i))}
                  >
                    <Trash2 />
                  </Button>
                </div>
              ))}
            </section>
          </div>
          <SheetFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              <X /> Cancelar
            </Button>
            <Button type="submit">
              <Plus /> Salvar pesquisa
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
