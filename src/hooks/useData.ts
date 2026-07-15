import { useEffect, useMemo, useState } from 'react'
import * as mock from '~/data/mock'
import type {
  Apoio,
  Atividade,
  Conversa,
  Eleitor,
  Evento,
  Lideranca,
  MembroEquipe,
  Movimentacao,
  Notificacao,
  Pesquisa,
  Visita,
} from '~/data/types'
import { api, type Resource } from '~/lib/api'
import { useEleitoresStore } from '~/stores/eleitores'
import { useLiderancasStore } from '~/stores/liderancas'
import { useCabosStore } from '~/stores/cabos'
import { useEquipeStore } from '~/stores/equipe'
import { useVisitasStore } from '~/stores/visitas'
import { useEventosStore } from '~/stores/eventos'
import { usePesquisasStore } from '~/stores/pesquisas'

/**
 * Hooks de leitura. Os 6 recursos extras (pesquisas, eventos, conversas,
 * movimentacoes, notificacoes, atividades) são buscados da API. Métricas,
 * demografia e densidade são derivados dos dados reais de eleitores/visitas.
 */

const cache: Partial<Record<Resource, unknown[]>> = {}
const inflight: Partial<Record<Resource, Promise<unknown[]>>> = {}

function loadResource<T>(resource: Resource): Promise<T[]> {
  if (cache[resource]) return Promise.resolve(cache[resource] as T[])
  if (inflight[resource]) return inflight[resource] as Promise<T[]>
  const p = api
    .list<T>(resource)
    .then((res) => {
      cache[resource] = res
      delete inflight[resource]
      return res
    })
    .catch((e) => {
      delete inflight[resource]
      throw e
    })
  inflight[resource] = p
  return p
}

function useResourceList<T>(resource: Resource): T[] {
  const [data, setData] = useState<T[]>(() => (cache[resource] as T[]) ?? [])
  useEffect(() => {
    let active = true
    loadResource<T>(resource)
      .then((res) => {
        if (active) setData(res)
      })
      .catch((e) => console.error(`Falha ao carregar ${resource}:`, e))
    return () => {
      active = false
    }
  }, [resource])
  return data
}

export function useEleitores(_filtros?: {
  search?: string
  bairro?: string
  apoio?: Apoio | 'todos'
}) {
  return useEleitoresStore((s) => s.cadastrados)
}

export function useLiderancas() {
  return useLiderancasStore((s) => s.cadastradas)
}
export function useCabos() {
  return useCabosStore((s) => s.cadastrados)
}
export function useEquipe(): MembroEquipe[] {
  return useEquipeStore((s) => s.cadastrados)
}
export function useVisitas() {
  return useVisitasStore((s) => s.visitas)
}
export function usePesquisas(): Pesquisa[] {
  return usePesquisasStore((s) => s.pesquisas)
}
export function useEventos(): Evento[] {
  return useEventosStore((s) => s.eventos)
}
export function useConversas(): Conversa[] {
  return useResourceList<Conversa>('conversas')
}
export function useFinanceiro(): Movimentacao[] {
  return useResourceList<Movimentacao>('movimentacoes')
}
export function useNotificacoes(): Notificacao[] {
  return useResourceList<Notificacao>('notificacoes')
}
export function useAtividades(): Atividade[] {
  return useResourceList<Atividade>('atividades')
}
export function useMetricasSemana() {
  const visitas = useVisitasStore((s) => s.visitas)
  return useMemo(() => {
    const dias = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
    const contatos = new Array(7).fill(0)
    const conversoes = new Array(7).fill(0)
    for (const v of visitas) {
      const d = new Date(v.data).getDay()
      contatos[d]++
      if (v.status === 'concluida') conversoes[d]++
    }
    return dias.map((dia, i) => ({ dia, contatos: contatos[i], conversoes: conversoes[i] }))
  }, [visitas])
}
export function useDemografia() {
  const eleitores = useEleitoresStore((s) => s.cadastrados)
  const idade = useMemo(() => {
    const faixas: Record<string, number> = { '16-24': 0, '25-39': 0, '40-59': 0, '60+': 0 }
    for (const e of eleitores) {
      if (e.idade <= 24) faixas['16-24']++
      else if (e.idade <= 39) faixas['25-39']++
      else if (e.idade <= 59) faixas['40-59']++
      else faixas['60+']++
    }
    return Object.entries(faixas).map(([faixa, v]) => ({ faixa, eleitores: v }))
  }, [eleitores])
  return { idade }
}
export function useDensidade() {
  const eleitores = useEleitoresStore((s) => s.cadastrados)
  return useMemo(() => {
    const map = new Map<string, { bairro: string; densidade: number; convertidos: number }>()
    for (const e of eleitores) {
      const d = map.get(e.bairro) ?? { bairro: e.bairro, densidade: 0, convertidos: 0 }
      d.densidade++
      if (e.apoio === 'ferrenho' || e.apoio === 'provavel') d.convertidos++
      map.set(e.bairro, d)
    }
    return [...map.values()]
  }, [eleitores])
}
export function useTemplates() {
  return mock.TEMPLATES_WHATSAPP
}

export const APOIO_META: Record<
  Apoio,
  { label: string; color: string; variant: 'success' | 'info' | 'warning' | 'danger' }
> = {
  ferrenho: { label: 'Ferrenho', color: 'var(--color-success)', variant: 'success' },
  provavel: { label: 'Provável', color: 'var(--color-info)', variant: 'info' },
  indeciso: { label: 'Indeciso', color: 'var(--color-warning)', variant: 'warning' },
  adversario: { label: 'Adversário', color: 'var(--color-danger)', variant: 'danger' },
}
