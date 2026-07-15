import { createFileRoute } from '@tanstack/react-router'
import { UsersRound, Plus, X, Pencil, Trash2, Mail, Phone } from 'lucide-react'
import { PageHeader } from '~/components/ui/page-header'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Badge, Input, Select, Label } from '~/components/ui/input'
import { Button } from '~/components/ui/button'
import { Switch } from '~/components/ui/switch'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '~/components/ui/sheet'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '~/components/ui/dialog'
import { DataTable, type Column } from '~/components/ui/data-table'
import { useEquipe } from '~/hooks/useData'
import { useEquipeStore } from '~/stores/equipe'
import { formatDate } from '~/lib/utils'
import { BAIRROS } from '~/data/constants'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import type { MembroEquipe } from '~/data/types'

export const Route = createFileRoute('/_app/equipe')({
  head: () => ({ meta: [{ title: 'Equipe — VotoGeral 360' }] }),
  component: Equipe,
})

const PAPEIS = [
  'Coordenador', 'Cab furado', 'Liderança', 'Voluntário',
  'Assessor', 'Analista de Dados', 'Social Media', 'Financeiro',
]

function Equipe() {
  const equipe = useEquipe()
  const adicionar = useEquipeStore((s) => s.adicionar)
  const patch = useEquipeStore((s) => s.patch)
  const remover = useEquipeStore((s) => s.remover)
  const [modalOpen, setModalOpen] = useState(false)
  const [editando, setEditando] = useState<MembroEquipe | null>(null)
  const [excluindo, setExcluindo] = useState<MembroEquipe | null>(null)

  function confirmarExclusao() {
    if (!excluindo) return
    remover(excluindo.id)
    toast.success('Membro removido!', { description: excluindo.nome })
    setExcluindo(null)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Equipe"
        description="Pessoas que operam a campanha em campo e no quartel-general."
        actions={<Button onClick={() => setModalOpen(true)}><Plus /> Convidar membro</Button>}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {equipe.length === 0 ? (
          <Card className="col-span-full flex flex-col items-center justify-center gap-4 py-20 text-center">
            <UsersRound className="size-16 text-muted-foreground/40" />
            <div>
              <p className="text-lg font-semibold">Nenhum membro encontrado</p>
              <p className="text-sm text-muted-foreground">
                Clique em "Convidar membro" para adicionar alguém à equipe.
              </p>
            </div>
          </Card>
        ) : (
          equipe.slice(0, 9).map((m) => (
            <Card key={m.id} className="p-5">
              <div className="flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-full bg-brand/15 text-sm font-semibold text-brand">
                  {m.nome.split(' ').slice(0, 2).map((p) => p[0]).join('')}
                </div>
                <div className="min-w-0">
                  <p className="truncate font-semibold">{m.nome}</p>
                  <p className="text-xs text-muted-foreground">{m.papel}</p>
                </div>
                <Badge variant={m.ativo ? 'success' : 'outline'} className="ml-auto">
                  {m.ativo ? 'Ativo' : 'Ausente'}
                </Badge>
              </div>
              <div className="mt-4 space-y-1.5 text-sm">
                <p className="flex items-center gap-2 text-muted-foreground"><Mail className="size-3.5" /> {m.email}</p>
                <p className="flex items-center gap-2 text-muted-foreground"><Phone className="size-3.5" /> {m.telefone}</p>
                <p className="text-muted-foreground">Bairro: {m.bairro} · Desde {formatDate(m.entrouEm)}</p>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                <label className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Switch
                    checked={m.ativo}
                    onCheckedChange={(v) => {
                      patch(m.id, { ativo: v })
                      toast.success(v ? 'Membro ativado!' : 'Membro inativado!', { description: m.nome })
                    }}
                  />
                  {m.ativo ? 'Ativo' : 'Ausente'}
                </label>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => setEditando(m)} aria-label="Editar membro">
                    <Pencil />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-destructive" onClick={() => setExcluindo(m)} aria-label="Remover membro">
                    <Trash2 />
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Todos os membros</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={equipe}
            pageSize={8}
            searchable
            searchKeys={['nome', 'papel', 'bairro']}
            columns={
              [
                { key: 'nome', header: 'Membro', sortable: true, sortValue: (m: MembroEquipe) => m.nome, render: (m) => (
                  <div className="flex items-center gap-3">
                    <div className="flex size-8 items-center justify-center rounded-full bg-brand/15 text-xs font-semibold text-brand">
                      {m.nome.split(' ').slice(0, 2).map((p) => p[0]).join('')}
                    </div>
                    <span className="font-medium">{m.nome}</span>
                  </div>
                ) },
                { key: 'papel', header: 'Papel', sortable: true, sortValue: (m: MembroEquipe) => m.papel, render: (m) => <Badge variant="info">{m.papel}</Badge> },
                { key: 'bairro', header: 'Bairro', sortable: true, sortValue: (m: MembroEquipe) => m.bairro },
                { key: 'email', header: 'Email', render: (m) => <span className="text-muted-foreground">{m.email}</span> },
                { key: 'telefone', header: 'Telefone', render: (m) => <span className="text-muted-foreground">{m.telefone}</span> },
                { key: 'entrouEm', header: 'Desde', sortable: true, sortValue: (m: MembroEquipe) => m.entrouEm, render: (m) => formatDate(m.entrouEm) },
                { key: 'ativo', header: 'Status', sortable: true, sortValue: (m: MembroEquipe) => m.ativo ? 1 : 0, render: (m) => (
                  <Switch
                    checked={m.ativo}
                    onCheckedChange={(v) => {
                      patch(m.id, { ativo: v })
                      toast.success(v ? 'Membro ativado!' : 'Membro inativado!', { description: m.nome })
                    }}
                  />
                ) },
                { key: 'acoes', header: 'Ações', render: (m) => (
                  <div className="flex gap-1">
                    <Button variant="outline" size="sm" onClick={() => setEditando(m)}>
                      <Pencil /> Editar
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => setExcluindo(m)} aria-label="Remover membro">
                      <Trash2 />
                    </Button>
                  </div>
                ) },
              ] as Column<MembroEquipe>[]
            }
          />
        </CardContent>
      </Card>

      {(modalOpen || editando) && (
        <MembroModal
          initial={editando ?? undefined}
          onSave={(d) => {
            if (editando) {
              patch(editando.id, {
                nome: d.nome,
                papel: d.papel,
                email: d.email,
                telefone: d.telefone,
                bairro: d.bairro,
                ativo: d.ativo,
              })
              toast.success('Membro atualizado!', { description: d.nome })
              setEditando(null)
            } else {
              adicionar({
                id: `eq-${Date.now()}`,
                nome: d.nome,
                papel: d.papel,
                email: d.email,
                telefone: d.telefone,
                bairro: d.bairro,
                ativo: d.ativo,
                entrouEm: new Date().toISOString(),
              })
              toast.success('Membro convidado!', { description: d.nome })
              setModalOpen(false)
            }
          }}
          onClose={() => { setModalOpen(false); setEditando(null) }}
        />
      )}

      <Dialog open={!!excluindo} onOpenChange={(o) => !o && setExcluindo(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remover membro</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja remover <span className="font-medium text-foreground">{excluindo?.nome}</span> da equipe? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setExcluindo(null)}>
              <X /> Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmarExclusao}>
              <Trash2 /> Remover
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

const schema = z.object({
  nome: z.string().min(2, 'Informe o nome'),
  papel: z.string().min(1, 'Selecione o papel'),
  email: z.string().email('Email inválido'),
  telefone: z.string().min(8, 'Informe o telefone'),
  bairro: z.string().min(1, 'Selecione o bairro'),
  ativo: z.boolean(),
})

type FormData = z.infer<typeof schema>

function MembroModal({ initial, onSave, onClose }: { initial?: MembroEquipe; onSave: (d: FormData) => void; onClose: () => void }) {
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: initial
      ? {
          nome: initial.nome,
          papel: initial.papel,
          email: initial.email,
          telefone: initial.telefone,
          bairro: initial.bairro,
          ativo: initial.ativo,
        }
      : {
          nome: '',
          papel: PAPEIS[0],
          email: '',
          telefone: '',
          bairro: BAIRROS[0],
          ativo: true,
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

  const ativo = form.watch('ativo')

  return (
    <Sheet open onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="max-w-xl p-0">
        <form onSubmit={form.handleSubmit(submit, aoInvalido)} className="flex h-full flex-col">
          <SheetHeader>
            <SheetTitle>{initial ? 'Editar membro' : 'Convidar membro'}</SheetTitle>
          </SheetHeader>
          <div className="flex-1 space-y-6 overflow-y-auto px-6 py-4">
            <section className="space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground">Identificação</h3>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Nome" error={f('nome').error} className="col-span-2">
                  <Input {...form.register('nome')} placeholder="Maria Silva" />
                </Field>
                <Field label="Papel" error={f('papel').error} className="col-span-2">
                  <Select {...form.register('papel')}>
                    {PAPEIS.map((p) => <option key={p}>{p}</option>)}
                  </Select>
                </Field>
                <Field label="Bairro" error={f('bairro').error} className="col-span-2">
                  <Select {...form.register('bairro')}>
                    {BAIRROS.map((b, i) => <option key={`${b}-${i}`}>{b}</option>)}
                  </Select>
                </Field>
              </div>
            </section>

            <section className="space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground">Contato</h3>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Email" error={f('email').error} className="col-span-2">
                  <Input type="email" {...form.register('email')} placeholder="maria@exemplo.com" />
                </Field>
                <Field label="Telefone" error={f('telefone').error} className="col-span-2">
                  <Input {...form.register('telefone')} placeholder="(98) 99999-9999" />
                </Field>
              </div>
            </section>

            <section className="space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground">Status</h3>
              <label className="flex items-center justify-between rounded-lg border border-border bg-card px-3 py-2.5">
                <span className="text-sm font-medium">Membro ativo</span>
                <Switch
                  checked={ativo}
                  onCheckedChange={(v) => form.setValue('ativo', v, { shouldValidate: true })}
                />
              </label>
            </section>
          </div>

          <SheetFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              <X /> Cancelar
            </Button>
            <Button type="submit">
              <Plus /> {initial ? 'Salvar alterações' : 'Convidar membro'}
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
