import { createFileRoute } from '@tanstack/react-router'
import { Network, Plus, X } from 'lucide-react'
import { PageHeader } from '~/components/ui/page-header'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Badge, Input, Select, Label } from '~/components/ui/input'
import { Button } from '~/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '~/components/ui/sheet'
import { DataTable, type Column } from '~/components/ui/data-table'
import { useCabosStore } from '~/stores/cabos'
import { LIDERANCAS } from '~/data/mock'
import { formatNumber } from '~/lib/utils'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { BAIRROS } from '~/data/constants'
import type { Cabo } from '~/data/types'

export const Route = createFileRoute('/_app/cabos')({
  head: () => ({ meta: [{ title: 'Cabos Eleitorais — VotoGeral 360' }] }),
  component: Cabos,
})

function Cabos() {
  const cadastrados = useCabosStore((s) => s.cadastrados)
  const adicionarCabo = useCabosStore((s) => s.adicionar)
  const [modalOpen, setModalOpen] = useState(false)

  const listaBase = cadastrados

  return (
    <div className="space-y-6">
      <PageHeader
        title="Cabos Eleitorais"
        description="Rede de cabos que operam a base em cada região."
        actions={<Button onClick={() => setModalOpen(true)}><Plus /> Novo cabo</Button>}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {listaBase.length === 0 ? (
          <Card className="col-span-full flex flex-col items-center justify-center gap-4 py-20 text-center">
            <Network className="size-16 text-muted-foreground/40" />
            <div>
              <p className="text-lg font-semibold">Nenhum cabo encontrado</p>
              <p className="text-sm text-muted-foreground">
                Clique em "Novo cabo" para cadastrar um cabo na rede.
              </p>
            </div>
          </Card>
        ) : (
          listaBase.map((c) => {
            const pct = c.performance
            const nomeLideranca = LIDERANCAS.find((l) => l.id === c.liderancaId)?.nome
            return (
              <Card key={c.id} className="p-5">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-brand/15 text-brand">
                    <Network className="size-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-semibold">{c.nome}</p>
                    <p className="text-xs text-muted-foreground">{c.regiao}</p>
                  </div>
                </div>
                {nomeLideranca && (
                  <p className="mt-2 text-xs text-muted-foreground">
                    Liderança: <span className="text-foreground">{nomeLideranca}</span>
                  </p>
                )}
                <div className="mt-4 space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Performance</span>
                    <span className="font-medium">{pct}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-border">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${pct}%`,
                        background: pct > 75 ? 'var(--color-success)' : pct > 50 ? 'var(--color-info)' : 'var(--color-warning)',
                      }}
                    />
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3 border-t border-border pt-3 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">Eleitores</p>
                    <p className="font-medium">{formatNumber(c.eleitores)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Visitas</p>
                    <p className="font-medium">{formatNumber(c.visitas)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Meta</p>
                    <p className="font-medium">{formatNumber(c.meta)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Meta atingida</p>
                    <p className="font-medium">{Math.round((c.eleitores / Math.max(c.meta, 1)) * 100)}%</p>
                  </div>
                </div>
              </Card>
            )
          })
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Todos os cabos</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={listaBase}
            pageSize={8}
            searchable
            searchKeys={['nome', 'regiao']}
            columns={
              [
                { key: 'nome', header: 'Cabo', sortable: true, sortValue: (c: Cabo) => c.nome, render: (c) => (
                  <div className="flex items-center gap-3">
                    <div className="flex size-8 items-center justify-center rounded-full bg-brand/15 text-xs font-semibold text-brand">
                      {c.nome.split(' ').slice(0, 2).map((p) => p[0]).join('')}
                    </div>
                    <span className="font-medium">{c.nome}</span>
                  </div>
                ) },
                { key: 'lideranca', header: 'Liderança', render: (c) => (
                  <span className="text-muted-foreground">
                    {LIDERANCAS.find((l) => l.id === c.liderancaId)?.nome ?? '—'}
                  </span>
                ) },
                { key: 'regiao', header: 'Região', sortable: true, sortValue: (c: Cabo) => c.regiao },
                { key: 'eleitores', header: 'Eleitores', sortable: true, sortValue: (c: Cabo) => c.eleitores, render: (c) => formatNumber(c.eleitores) },
                { key: 'visitas', header: 'Visitas', sortable: true, sortValue: (c: Cabo) => c.visitas, render: (c) => formatNumber(c.visitas) },
                { key: 'performance', header: 'Performance', sortable: true, sortValue: (c: Cabo) => c.performance, render: (c) => (
                  <Badge variant={c.performance > 70 ? 'success' : 'warning'}>{c.performance}%</Badge>
                ) },
              ] as Column<Cabo>[]
            }
          />
        </CardContent>
      </Card>

      {modalOpen && (
        <CaboModal
          onSave={(d) => {
            const novo: Cabo = {
              id: `cabo-${Date.now()}`,
              nome: d.nome,
              liderancaId: d.liderancaId,
              regiao: d.regiao,
              eleitores: d.eleitores,
              visitas: d.visitas,
              meta: d.meta,
              performance: d.performance,
            }
            adicionarCabo(novo)
            toast.success('Cabo cadastrado!', { description: d.nome })
            setModalOpen(false)
          }}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  )
}

const schema = z.object({
  nome: z.string().min(2, 'Informe o nome'),
  liderancaId: z.string().min(1, 'Selecione a liderança'),
  regiao: z.string().min(1, 'Selecione o bairro/região'),
  eleitores: z.coerce.number().min(0, 'Mínimo 0').max(9999),
  visitas: z.coerce.number().min(0, 'Mínimo 0').max(9999),
  meta: z.coerce.number().min(1, 'Mínimo 1').max(9999),
  performance: z.coerce.number().min(0, 'Mínimo 0').max(100),
})

type FormData = z.infer<typeof schema>

function CaboModal({ onSave, onClose }: { onSave: (d: FormData) => void; onClose: () => void }) {
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      nome: '',
      liderancaId: LIDERANCAS[0]?.id ?? '',
      regiao: BAIRROS[0],
      eleitores: 30,
      visitas: 10,
      meta: 50,
      performance: 60,
    },
  })

  function submit(d: FormData) {
    onSave(d)
  }

  function aoInvalido() {
    toast.error('Preencha os campos obrigatórios antes de salvar.')
  }

  const f = (name: keyof FormData) => ({
    ...form.register(name),
    error: form.formState.errors[name]?.message as string | undefined,
  })

  return (
    <Sheet open onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="max-w-xl p-0">
        <form onSubmit={form.handleSubmit(submit, aoInvalido)} className="flex h-full flex-col">
          <SheetHeader>
            <SheetTitle>Novo cabo</SheetTitle>
          </SheetHeader>
          <div className="flex-1 space-y-6 overflow-y-auto px-6 py-4">
            <section className="space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground">Identificação</h3>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Nome" error={f('nome').error} className="col-span-2">
                  <Input {...form.register('nome')} placeholder="Maria Silva" />
                </Field>
                <Field label="Liderança" error={f('liderancaId').error} className="col-span-2">
                  <Select {...form.register('liderancaId')}>
                    {LIDERANCAS.map((l) => (
                      <option key={l.id} value={l.id}>{l.nome}</option>
                    ))}
                  </Select>
                </Field>
                <Field label="Bairro / Região" error={f('regiao').error} className="col-span-2">
                  <Select {...form.register('regiao')}>
                    {BAIRROS.map((b, i) => <option key={`${b}-${i}`}>{b}</option>)}
                  </Select>
                </Field>
              </div>
            </section>

            <section className="space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground">Metas e performance</h3>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Eleitores" error={f('eleitores').error}>
                  <Input type="number" {...form.register('eleitores')} />
                </Field>
                <Field label="Visitas" error={f('visitas').error}>
                  <Input type="number" {...form.register('visitas')} />
                </Field>
                <Field label="Meta" error={f('meta').error}>
                  <Input type="number" {...form.register('meta')} />
                </Field>
                <Field label="Performance (%)" error={f('performance').error}>
                  <Input type="number" {...form.register('performance')} />
                </Field>
              </div>
            </section>
          </div>

          <SheetFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              <X /> Cancelar
            </Button>
            <Button type="submit">
              <Plus /> Salvar cabo
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}

function Field({
  label, error, children, className,
}: { label: string; error?: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`space-y-1.5 ${className ?? ''}`}>
      <Label>{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
