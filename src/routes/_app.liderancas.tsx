import { createFileRoute } from '@tanstack/react-router'
import { Crown, Users, Plus, X, Pencil } from 'lucide-react'
import { PageHeader } from '~/components/ui/page-header'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Badge, Input, Select, Label } from '~/components/ui/input'
import { Button } from '~/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '~/components/ui/sheet'
import { DataTable, type Column } from '~/components/ui/data-table'
import { useLiderancas } from '~/hooks/useData'
import { formatNumber } from '~/lib/utils'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { BAIRROS } from '~/data/constants'
import { useLiderancasStore } from '~/stores/liderancas'
import type { Lideranca } from '~/data/types'

export const Route = createFileRoute('/_app/liderancas')({
  head: () => ({ meta: [{ title: 'Lideranças — VotoGeral 360' }] }),
  component: Liderancas,
})

function Liderancas() {
  const liderancas = useLiderancas()
  const cadastradas = useLiderancasStore((s) => s.cadastradas)
  const adicionarLideranca = useLiderancasStore((s) => s.adicionar)
  const patchLideranca = useLiderancasStore((s) => s.patch)
  const registrarConversao = useLiderancasStore((s) => s.registrarConversao)
  const override = useLiderancasStore((s) => s.override)
  const [q, setQ] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [detalhe, setDetalhe] = useState<Lideranca | null>(null)
  const [editando, setEditando] = useState<Lideranca | null>(null)

  const view = (l: Lideranca): Lideranca & { engajamento: number } => {
    const merge = { ...l, ...(override[l.id] ?? {}) }
    const engajamento = Math.min(100, Math.round((merge.convertidos / Math.max(merge.eleitores, 1)) * 100))
    return { ...merge, engajamento }
  }

  const listaBase = [...cadastradas, ...liderancas].map(view)

  const filtradas = listaBase.filter((l) =>
    l.nome.toLowerCase().includes(q.toLowerCase()) ||
    l.bairro.toLowerCase().includes(q.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <PageHeader
        title="Lideranças"
        description="Acompanhe a performance dos líderes comunitários."
        actions={<Button onClick={() => setModalOpen(true)}><Crown /> Nova liderança</Button>}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtradas.length === 0 ? (
          <Card className="col-span-full flex flex-col items-center justify-center gap-4 py-20 text-center">
            <Crown className="size-16 text-muted-foreground/40" />
            <div>
              <p className="text-lg font-semibold">Nenhuma liderança cadastrada</p>
              <p className="text-sm text-muted-foreground">
                Clique em "Nova liderança" para começar.
              </p>
            </div>
          </Card>
        ) : (
          filtradas.map((l) => {
          const pct = Math.round((l.convertidos / l.meta) * 100)
          return (
            <Card key={l.id} className="p-5">
              <div className="flex items-start gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-brand/15 text-brand">
                  <Crown className="size-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{l.nome}</p>
                  <p className="text-xs text-muted-foreground">{l.bairro}</p>
                  <p className="text-xs text-muted-foreground">{l.telefone}</p>
                </div>
                <Badge variant={l.ativo ? 'success' : 'outline'}>
                  {l.ativo ? 'Ativo' : 'Inativo'}
                </Badge>
              </div>
              <Button variant="ghost" size="sm" className="mt-3 w-full" onClick={() => setDetalhe(l)}>
                Ver detalhes
              </Button>
              <div className="mt-4 space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Meta de conversão</span>
                  <span className="font-medium">{pct}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-border">
                  <div className="h-full rounded-full brand-gradient" style={{ width: `${pct}%` }} />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{formatNumber(l.convertidos)} convertidos</span>
                  <span>meta {formatNumber(l.meta)}</span>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 border-t border-border pt-3 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">Eleitores</p>
                  <p className="font-medium">{formatNumber(l.eleitores)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Convertidos</p>
                  <p className="font-medium">{formatNumber(l.convertidos)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Engajamento</p>
                  <p className="font-medium">{l.engajamento}%</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Meta atingida</p>
                  <p className="font-medium">{Math.round((l.convertidos / Math.max(l.meta, 1)) * 100)}%</p>
                </div>
              </div>
            </Card>
          )
        })
      )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tabela de performance</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={listaBase}
            pageSize={6}
            searchable
            searchKeys={['nome', 'bairro']}
            columns={
              [
                { key: 'nome', header: 'Liderança', sortable: true, sortValue: (l: Lideranca) => l.nome, render: (l) => (
                  <div className="flex items-center gap-3">
                    <div className="flex size-8 items-center justify-center rounded-full bg-brand/15 text-xs font-semibold text-brand">
                      {l.nome.split(' ').slice(0, 2).map((p) => p[0]).join('')}
                    </div>
                    <div>
                      <p className="font-medium">{l.nome}</p>
                      <p className="text-xs text-muted-foreground">{l.bairro}</p>
                    </div>
                  </div>
                ) },
                { key: 'eleitores', header: 'Eleitores', sortable: true, sortValue: (l: Lideranca) => l.eleitores, render: (l) => formatNumber(l.eleitores) },
                { key: 'convertidos', header: 'Convertidos', sortable: true, sortValue: (l: Lideranca) => l.convertidos, render: (l) => formatNumber(l.convertidos) },
                { key: 'engajamento', header: 'Engajamento', sortable: true, sortValue: (l: Lideranca) => l.engajamento, render: (l) => (
                  <Badge variant="info">{l.engajamento}%</Badge>
                ) },
                { key: 'meta', header: 'Meta', sortable: true, sortValue: (l: Lideranca) => l.meta, render: (l) => formatNumber(l.meta) },
                { key: 'metaAtingida', header: 'Meta %', sortable: true, sortValue: (l: Lideranca) => l.convertidos / Math.max(l.meta, 1), render: (l) => (
                  <Badge variant={l.convertidos >= l.meta ? 'success' : 'outline'}>
                    {Math.round((l.convertidos / Math.max(l.meta, 1)) * 100)}%
                  </Badge>
                ) },
                { key: 'acoes', header: 'Ações', render: (l) => (
                  <Button variant="outline" size="sm" onClick={() => setEditando(l)}>
                    <Pencil /> Editar
                  </Button>
                ) },
              ] as Column<Lideranca>[]
            }
          />
        </CardContent>
      </Card>

      {(modalOpen || editando) && (
        <LiderancaModal
          initial={editando ?? undefined}
          onSave={(d) => {
            if (editando) {
              patchLideranca(editando.id, {
                nome: d.nome,
                bairro: d.bairro,
                telefone: d.telefone,
                eleitores: d.eleitores,
                meta: d.meta,
                ativo: d.ativo === 'true',
              })
              toast.success('Liderança atualizada!', { description: d.nome })
              setEditando(null)
            } else {
              const nova: Lideranca = {
                id: `lid-${Date.now()}`,
                nome: d.nome,
                bairro: d.bairro,
                telefone: d.telefone,
                eleitores: d.eleitores,
                convertidos: 0,
                meta: d.meta,
                engajamento: Math.min(100, Math.round((0 / Math.max(d.eleitores, 1)) * 100)),
                ativo: d.ativo === 'true',
              }
              adicionarLideranca(nova)
              toast.success('Liderança cadastrada!', { description: d.nome })
              setModalOpen(false)
            }
          }}
          onClose={() => { setModalOpen(false); setEditando(null) }}
        />
      )}

      {detalhe && (
        <LiderancaDetalhe
          lideranca={view(detalhe)}
          onRegistrarConversao={(convertidosAtual) => {
            registrarConversao(detalhe.id, convertidosAtual)
            toast.success('Conversão registrada!', { description: detalhe.nome })
          }}
          onEdit={() => { setEditando(detalhe); setDetalhe(null) }}
          onClose={() => setDetalhe(null)}
        />
      )}
    </div>
  )
}

const schema = z.object({
  nome: z.string().min(2, 'Informe o nome'),
  bairro: z.string().min(1, 'Selecione o bairro'),
  telefone: z.string().min(8, 'Telefone inválido'),
  eleitores: z.coerce.number().min(1, 'Mínimo 1').max(9999),
  meta: z.coerce.number().min(1, 'Mínimo 1').max(9999),
  ativo: z.string().refine((v) => v === 'true' || v === 'false', 'Selecione o status'),
})

type FormData = z.infer<typeof schema>

function LiderancaModal({ initial, onSave, onClose }: { initial?: Lideranca; onSave: (d: FormData) => void; onClose: () => void }) {
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: initial
      ? {
          nome: initial.nome,
          bairro: initial.bairro,
          telefone: initial.telefone,
          eleitores: initial.eleitores,
          meta: initial.meta,
          ativo: initial.ativo ? 'true' : 'false',
        }
      : {
          nome: '',
          bairro: BAIRROS[0],
          telefone: '',
          eleitores: 50,
          meta: 80,
          ativo: 'true',
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
            <SheetTitle>{initial ? 'Editar liderança' : 'Nova liderança'}</SheetTitle>
          </SheetHeader>
          <div className="flex-1 space-y-6 overflow-y-auto px-6 py-4">
            <section className="space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground">Identificação</h3>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Nome" error={f('nome').error} className="col-span-2">
                  <Input {...form.register('nome')} placeholder="Maria Silva" />
                </Field>
                <Field label="Bairro" error={f('bairro').error}>
                  <Select {...form.register('bairro')}>
                    {BAIRROS.map((b, i) => <option key={`${b}-${i}`}>{b}</option>)}
                  </Select>
                </Field>
                <Field label="Telefone" error={f('telefone').error}>
                  <Input {...form.register('telefone')} placeholder="(11) 9..." />
                </Field>
              </div>
            </section>

            <section className="space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground">Metas e performance</h3>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Eleitores" error={f('eleitores').error}>
                  <Input type="number" {...form.register('eleitores')} />
                </Field>
                <Field label="Meta de conversão" error={f('meta').error}>
                  <Input type="number" {...form.register('meta')} />
                </Field>
                <Field label="Engajamento" className="col-span-2">
                  <p className="text-sm text-muted-foreground">
                    Calculado automaticamente: {Math.min(100, Math.round(0 / Math.max(Number(form.watch('eleitores')), 1) * 100))}% da base convertida (convertidos / eleitores).
                  </p>
                </Field>
                <Field label="Status" error={f('ativo').error}>
                  <Select {...form.register('ativo')}>
                    <option value="true">Ativo</option>
                    <option value="false">Inativo</option>
                  </Select>
                </Field>
              </div>
            </section>
          </div>

          <SheetFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              <X /> Cancelar
            </Button>
            <Button type="submit">
              <Plus /> {initial ? 'Salvar alterações' : 'Salvar liderança'}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}

function LiderancaDetalhe({
  lideranca,
  onRegistrarConversao,
  onEdit,
  onClose,
}: {
  lideranca: Lideranca & { engajamento: number }
  onRegistrarConversao: (convertidosAtual: number) => void
  onEdit: () => void
  onClose: () => void
}) {
  const pctMeta = Math.round((lideranca.convertidos / Math.max(lideranca.meta, 1)) * 100)
  const metaAtingida = lideranca.convertidos >= lideranca.meta

  return (
    <Sheet open onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="max-w-xl p-0">
        <div className="flex h-full flex-col">
          <SheetHeader>
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-brand/15 text-brand">
                <Crown className="size-5" />
              </div>
              <div className="min-w-0">
                <SheetTitle className="truncate">{lideranca.nome}</SheetTitle>
                <p className="text-xs text-muted-foreground">{lideranca.bairro}</p>
              </div>
              <Badge variant={lideranca.ativo ? 'success' : 'outline'} className="ml-auto">
                {lideranca.ativo ? 'Ativo' : 'Inativo'}
              </Badge>
            </div>
          </SheetHeader>

          <div className="flex-1 space-y-6 overflow-y-auto px-6 py-4">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Kpi label="Eleitores" value={formatNumber(lideranca.eleitores)} />
              <Kpi label="Convertidos" value={formatNumber(lideranca.convertidos)} />
              <Kpi label="Engajamento" value={`${lideranca.engajamento}%`} />
              <Kpi label="Meta" value={formatNumber(lideranca.meta)} />
            </div>

            <section className="space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground">Meta de conversão</h3>
              <div className="space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{pctMeta}% da meta</span>
                  <span className="font-medium">{metaAtingida ? 'Meta atingida' : 'Em andamento'}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-border">
                  <div className="h-full rounded-full brand-gradient" style={{ width: `${Math.min(pctMeta, 100)}%` }} />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{formatNumber(lideranca.convertidos)} convertidos</span>
                  <span>meta {formatNumber(lideranca.meta)}</span>
                </div>
              </div>
            </section>

            <section className="space-y-2">
              <h3 className="text-sm font-semibold text-muted-foreground">Contato</h3>
              <div className="rounded-lg border border-border p-3 text-sm">
                <p className="text-muted-foreground">Telefone</p>
                <p className="font-medium">{lideranca.telefone}</p>
              </div>
            </section>
          </div>

          <SheetFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              <X /> Fechar
            </Button>
            <Button type="button" variant="outline" onClick={onEdit}>
              <Pencil /> Editar
            </Button>
            <Button type="button" onClick={() => onRegistrarConversao(lideranca.convertidos)}>
              <Plus /> Registrar conversão
            </Button>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  )
}

function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border p-3 text-center">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-lg font-semibold">{value}</p>
    </div>
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
