'use client'

import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plus, Filter, Search, X } from 'lucide-react'
import { toast } from 'sonner'
import { PageHeader } from '~/components/ui/page-header'
import { Button } from '~/components/ui/button'
import { Input, Label, Select, Badge } from '~/components/ui/input'
import { Card } from '~/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '~/components/ui/tabs'
import { AvatarInitials } from '~/components/ui/avatar'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '~/components/ui/dialog'
import { DataTable, type Column } from '~/components/ui/data-table'
import { useEleitores, APOIO_META } from '~/hooks/useData'
import { useFilters } from '~/stores/filters'
import { BAIRROS, ZONAS } from '~/data/constants'
import { formatDate, initials } from '~/lib/utils'
import type { Apoio, Eleitor } from '~/data/types'

const schema = z.object({
  nome: z.string().min(2, 'Informe o nome'),
  cpf: z.string().min(11, 'CPF inválido'),
  idade: z.coerce.number().min(16, 'Idade mínima 16').max(120),
  sexo: z.enum(['Masculino', 'Feminino']),
  bairro: z.string().min(1),
  cidade: z.string().min(1),
  zona: z.coerce.number().min(1),
  secao: z.coerce.number().min(1),
  telefone: z.string().min(8),
  email: z.string().email('E-mail inválido'),
  escolaridade: z.enum(['Fundamental', 'Médio', 'Superior', 'Pós-graduação']),
  apoio: z.enum(['ferrenho', 'provavel', 'indeciso', 'adversario']),
})
type FormData = z.infer<typeof schema>

export const Route = createFileRoute('/_app/eleitores')({
  head: () => ({ meta: [{ title: 'Eleitores — VotoGeral 360' }] }),
  component: Eleitores,
})

function Eleitores() {
  const filtros = useFilters()
  const eleitores = useEleitores({
    search: filtros.search,
    bairro: filtros.bairro,
    apoio: filtros.apoio,
  })
  const [modalOpen, setModalOpen] = useState(false)
  const [detalhe, setDetalhe] = useState<Eleitor | null>(null)

  const columns: Column<Eleitor>[] = [
    {
      key: 'nome',
      header: 'Nome',
      sortable: true,
      sortValue: (e) => e.nome,
      render: (e) => (
        <div className="flex items-center gap-3">
          <AvatarInitials name={e.nome} className="size-8" />
          <div>
            <p className="font-medium">{e.nome}</p>
            <p className="text-xs text-muted-foreground">{e.cpf}</p>
          </div>
        </div>
      ),
    },
    { key: 'bairro', header: 'Bairro', sortable: true, sortValue: (e) => e.bairro },
    { key: 'idade', header: 'Idade', sortable: true, sortValue: (e) => e.idade },
    { key: 'zona', header: 'Zona/Sec', render: (e) => `${e.zona}/${e.secao}` },
    {
      key: 'apoio',
      header: 'Apoio',
      sortable: true,
      sortValue: (e) => e.apoio,
      render: (e) => (
        <Badge variant={APOIO_META[e.apoio].variant}>{APOIO_META[e.apoio].label}</Badge>
      ),
    },
    {
      key: 'acao',
      header: '',
      render: (e) => (
        <Button variant="ghost" size="sm" onClick={() => setDetalhe(e)}>
          Detalhes
        </Button>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Eleitores"
        description={`${eleitores.length} eleitores no seu banco`}
        actions={
          <Button onClick={() => setModalOpen(true)}>
            <Plus /> Novo eleitor
          </Button>
        }
      />

      <Card className="flex flex-wrap items-end gap-3 p-4">
        <div className="relative min-w-[200px] flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={filtros.search}
            onChange={(e) => filtros.setSearch(e.target.value)}
            placeholder="Buscar por nome, CPF ou e-mail…"
            className="pl-9"
          />
        </div>
        <div className="w-44">
          <Label className="mb-1 block text-xs">Bairro</Label>
          <Select value={filtros.bairro} onChange={(e) => filtros.setBairro(e.target.value)}>
            <option value="todos">Todos</option>
            {BAIRROS.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </Select>
        </div>
        <div className="w-40">
          <Label className="mb-1 block text-xs">Apoio</Label>
          <Select value={filtros.apoio} onChange={(e) => filtros.setApoio(e.target.value as Apoio | 'todos')}>
            <option value="todos">Todos</option>
            <option value="ferrenho">Ferrenho</option>
            <option value="provavel">Provável</option>
            <option value="indeciso">Indeciso</option>
            <option value="adversario">Adversário</option>
          </Select>
        </div>
        <Button variant="outline" onClick={filtros.reset}>
          <Filter /> Limpar
        </Button>
      </Card>

      <DataTable columns={columns} data={eleitores} pageSize={9} />

      {modalOpen && <EleitorModal onClose={() => setModalOpen(false)} />}

      <Dialog open={!!detalhe} onOpenChange={(o) => !o && setDetalhe(null)}>
        <DialogContent className="max-w-md">
          {detalhe && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <AvatarInitials name={detalhe.nome} className="size-8" />
                  {detalhe.nome}
                </DialogTitle>
                <p className="text-sm text-muted-foreground">
                  {detalhe.bairro} · Zona {detalhe.zona} / Seção {detalhe.secao}
                </p>
              </DialogHeader>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Apoio</span>
                  <Badge variant={APOIO_META[detalhe.apoio].variant}>
                    {APOIO_META[detalhe.apoio].label}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Contato</span>
                  <span>{detalhe.telefone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">E-mail</span>
                  <span className="truncate">{detalhe.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Escolaridade</span>
                  <span>{detalhe.escolaridade}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Cadastrado em</span>
                  <span>{formatDate(detalhe.cadastradoEm)}</span>
                </div>
              </div>
              <div className="rounded-lg border border-border p-3">
                <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">
                  Linha do tempo
                </p>
                <ul className="space-y-2 text-xs">
                  <li className="flex gap-2"><span className="text-muted-foreground">{formatDate(detalhe.cadastradoEm)}</span> Cadastro inicial</li>
                  <li className="flex gap-2"><span className="text-muted-foreground">{formatDate(detalhe.ultimaInteracao)}</span> Última interação</li>
                  <li className="flex gap-2"><span className="text-muted-foreground">—</span> Próxima visita agendada</li>
                </ul>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

function EleitorModal({ onClose }: { onClose: () => void }) {
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      sexo: 'Feminino',
      bairro: BAIRROS[0],
      cidade: 'São Paulo',
      escolaridade: 'Médio',
      apoio: 'indeciso',
      zona: 1,
      secao: 1,
    },
  })

  function submit(d: FormData) {
    toast.success('Eleitor cadastrado!', { description: d.nome })
    onClose()
  }

  const f = (name: keyof FormData) => ({
    ...form.register(name),
    error: form.formState.errors[name]?.message as string | undefined,
  })

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Novo eleitor</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(submit)} className="space-y-4">
          <Tabs defaultValue="pessoais">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="pessoais">Pessoais</TabsTrigger>
              <TabsTrigger value="contato">Contato</TabsTrigger>
              <TabsTrigger value="endereco">Endereço</TabsTrigger>
              <TabsTrigger value="politica">Política</TabsTrigger>
            </TabsList>

            <TabsContent value="pessoais" className="grid grid-cols-2 gap-3">
              <Field label="Nome" error={f('nome').error}>
                <Input {...form.register('nome')} placeholder="Maria Silva" />
              </Field>
              <Field label="CPF" error={f('cpf').error}>
                <Input {...form.register('cpf')} placeholder="000.000.000-00" />
              </Field>
              <Field label="Idade" error={f('idade').error}>
                <Input type="number" {...form.register('idade')} />
              </Field>
              <Field label="Sexo" error={f('sexo').error}>
                <Select {...form.register('sexo')}>
                  <option value="Feminino">Feminino</option>
                  <option value="Masculino">Masculino</option>
                </Select>
              </Field>
            </TabsContent>

            <TabsContent value="contato" className="grid grid-cols-1 gap-3">
              <Field label="Telefone" error={f('telefone').error}>
                <Input {...form.register('telefone')} placeholder="(11) 9..." />
              </Field>
              <Field label="E-mail" error={f('email').error}>
                <Input {...form.register('email')} placeholder="voce@email.com" />
              </Field>
            </TabsContent>

            <TabsContent value="endereco" className="grid grid-cols-2 gap-3">
              <Field label="Bairro" error={f('bairro').error}>
                <Select {...form.register('bairro')}>
                  {BAIRROS.map((b) => <option key={b}>{b}</option>)}
                </Select>
              </Field>
              <Field label="Cidade" error={f('cidade').error}>
                <Input {...form.register('cidade')} />
              </Field>
              <Field label="Zona" error={f('zona').error}>
                <Input type="number" {...form.register('zona')} />
              </Field>
              <Field label="Seção" error={f('secao').error}>
                <Input type="number" {...form.register('secao')} />
              </Field>
            </TabsContent>

            <TabsContent value="politica" className="grid grid-cols-2 gap-3">
              <Field label="Escolaridade" error={f('escolaridade').error}>
                <Select {...form.register('escolaridade')}>
                  <option value="Fundamental">Fundamental</option>
                  <option value="Médio">Médio</option>
                  <option value="Superior">Superior</option>
                  <option value="Pós-graduação">Pós-graduação</option>
                </Select>
              </Field>
              <Field label="Grau de apoio" error={f('apoio').error}>
                <Select {...form.register('apoio')}>
                  <option value="ferrenho">Ferrenho</option>
                  <option value="provavel">Provável</option>
                  <option value="indeciso">Indeciso</option>
                  <option value="adversario">Adversário</option>
                </Select>
              </Field>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              <X /> Cancelar
            </Button>
            <Button type="submit">
              <Plus /> Salvar eleitor
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function Field({
  label, error, children,
}: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
