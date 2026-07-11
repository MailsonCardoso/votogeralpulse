'use client'

import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plus, Filter, Search, X, Users } from 'lucide-react'
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
import { CIDADES, regioesDaCidade, bairrosDaRegiao } from '~/data/constants'
import { formatDate, initials } from '~/lib/utils'
import type { Apoio, Eleitor } from '~/data/types'

const schema = z.object({
  nome: z.string().min(2, 'Informe o nome'),
  cpf: z.string().min(11, 'CPF inválido'),
  idade: z.coerce.number().min(16, 'Idade mínima 16').max(120),
  sexo: z.enum(['Masculino', 'Feminino']),
  cidade: z.string().min(1),
  regiao: z.string().min(1),
  bairro: z.string().min(1),
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
  const [cadastrados, setCadastrados] = useState<Eleitor[]>([])
  const eleitores = useEleitores({
    search: filtros.search,
    bairro: filtros.bairro,
    apoio: filtros.apoio,
  })
  const listaBase = [...cadastrados, ...eleitores]
  const lista = listaBase.filter((e) => {
    if (filtros.cidade !== 'todos' && e.cidade !== filtros.cidade) return false
    if (filtros.regiao !== 'todos' && e.regiao !== filtros.regiao) return false
    if (filtros.bairro !== 'todos' && e.bairro !== filtros.bairro) return false
    if (filtros.apoio !== 'todos' && e.apoio !== filtros.apoio) return false
    if (filtros.search) {
      const q = filtros.search.toLowerCase()
      if (!e.nome.toLowerCase().includes(q) && !e.cpf.includes(q) && !e.email.toLowerCase().includes(q)) return false
    }
    return true
  })
  const [modalOpen, setModalOpen] = useState(false)
  const [detalhe, setDetalhe] = useState<Eleitor | null>(null)

  const regioesFiltro = filtros.cidade === 'todos' ? [] : regioesDaCidade(filtros.cidade)
  const bairrosFiltro = filtros.cidade === 'todos' || filtros.regiao === 'todos'
    ? []
    : bairrosDaRegiao(filtros.cidade, filtros.regiao)

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
    { key: 'regiao', header: 'Região', sortable: true, sortValue: (e) => e.regiao },
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
        description={`${lista.length} eleitores no seu banco`}
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
          <Label className="mb-1 block text-xs">Cidade</Label>
          <Select value={filtros.cidade} onChange={(e) => filtros.setCidade(e.target.value)}>
            <option value="todos">Todas</option>
            {CIDADES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </Select>
        </div>
        <div className="w-44">
          <Label className="mb-1 block text-xs">Região</Label>
          <Select value={filtros.regiao} onChange={(e) => filtros.setRegiao(e.target.value)}>
            <option value="todos">Todas</option>
            {regioesFiltro.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </Select>
        </div>
        <div className="w-44">
          <Label className="mb-1 block text-xs">Bairro</Label>
          <Select value={filtros.bairro} onChange={(e) => filtros.setBairro(e.target.value)}>
            <option value="todos">Todos</option>
            {bairrosFiltro.map((b) => (
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

      {lista.length === 0 ? (
        <Card className="flex flex-col items-center justify-center gap-4 py-20 text-center">
          <Users className="size-16 text-muted-foreground/40" />
          <div>
            <p className="text-lg font-semibold">Nenhum eleitor cadastrado</p>
            <p className="text-sm text-muted-foreground">
              Clique em "Novo eleitor" para cadastrar o primeiro.
            </p>
          </div>
        </Card>
      ) : (
        <DataTable columns={columns} data={lista} pageSize={9} />
      )}

      {modalOpen && (
        <EleitorModal
          onSave={(d) => {
            const novo: Eleitor = {
              id: `elt-${Date.now()}`,
              nome: d.nome,
              cpf: d.cpf,
              idade: d.idade,
              sexo: d.sexo,
              cidade: d.cidade,
              regiao: d.regiao,
              bairro: d.bairro,
              zona: d.zona,
              secao: d.secao,
              telefone: d.telefone,
              email: d.email,
              escolaridade: d.escolaridade,
              apoio: d.apoio,
              liderancaId: '',
              caboId: '',
              cadastradoEm: new Date().toISOString(),
              ultimaInteracao: new Date().toISOString(),
            }
            setCadastrados((prev) => [novo, ...prev])
            toast.success('Eleitor cadastrado!', { description: d.nome })
            setModalOpen(false)
          }}
          onClose={() => setModalOpen(false)}
        />
      )}

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
                  {detalhe.regiao} · {detalhe.bairro} · Zona {detalhe.zona} / Seção {detalhe.secao}
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
                  <span className="text-muted-foreground">Cidade</span>
                  <span>{detalhe.cidade}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Região</span>
                  <span>{detalhe.regiao}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Bairro</span>
                  <span>{detalhe.bairro}</span>
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

function EleitorModal({ onSave, onClose }: { onSave: (d: FormData) => void; onClose: () => void }) {
  const [cidadeSelecionada, setCidadeSelecionada] = useState(CIDADES[0])
  const [regiaoSelecionada, setRegiaoSelecionada] = useState(regioesDaCidade(CIDADES[0])[0])
  const bairrosDaRegiaoAtual = bairrosDaRegiao(cidadeSelecionada, regiaoSelecionada)

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      sexo: 'Feminino',
      cidade: CIDADES[0],
      regiao: regioesDaCidade(CIDADES[0])[0],
      bairro: bairrosDaRegiao(CIDADES[0], regioesDaCidade(CIDADES[0])[0])[0] ?? '',
      escolaridade: 'Médio',
      apoio: 'indeciso',
      zona: 1,
      secao: 1,
    },
  })

  function submit(d: FormData) {
    onSave(d)
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
              <Field label="Cidade" error={f('cidade').error}>
                <Select
                  value={cidadeSelecionada}
                  onChange={(e) => {
                    const novaCidade = e.target.value
                    const novasRegioes = regioesDaCidade(novaCidade)
                    const novaRegiao = novasRegioes[0]
                    setCidadeSelecionada(novaCidade)
                    setRegiaoSelecionada(novaRegiao)
                    form.setValue('cidade', novaCidade, { shouldValidate: true })
                    form.setValue('regiao', novaRegiao, { shouldValidate: true })
                    form.setValue('bairro', bairrosDaRegiao(novaCidade, novaRegiao)[0] ?? '', { shouldValidate: true })
                  }}
                >
                  {CIDADES.map((c) => <option key={c}>{c}</option>)}
                </Select>
              </Field>
              <Field label="Região" error={f('regiao').error}>
                <Select
                  value={regiaoSelecionada}
                  onChange={(e) => {
                    const novaRegiao = e.target.value
                    setRegiaoSelecionada(novaRegiao)
                    form.setValue('regiao', novaRegiao, { shouldValidate: true })
                    form.setValue('bairro', bairrosDaRegiao(cidadeSelecionada, novaRegiao)[0] ?? '', { shouldValidate: true })
                  }}
                >
                  {regioesDaCidade(cidadeSelecionada).map((r) => <option key={r}>{r}</option>)}
                </Select>
              </Field>
              <Field label="Bairro" error={f('bairro').error}>
                <Select
                  value={form.watch('bairro')}
                  onChange={(e) => form.setValue('bairro', e.target.value, { shouldValidate: true })}
                >
                  {bairrosDaRegiaoAtual.map((b) => <option key={b}>{b}</option>)}
                </Select>
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
