import { useMemo } from 'react'
import * as mock from '~/data/mock'
import type { Apoio, Eleitor } from '~/data/types'

/**
 * Hooks que envolvem os dados mockados. Hoje retornam os mocks diretamente,
 * mas a assinatura é pensada para trocar por TanStack Query + Axios no futuro,
 * ex.: useQuery({ queryKey: ['eleitores'], queryFn: () => api.get(...) }).
 */

export function useEleitores(filtros?: {
  search?: string
  bairro?: string
  apoio?: Apoio | 'todos'
}) {
  return useMemo(() => {
    let list: Eleitor[] = mock.ELEITORES
    if (filtros?.search) {
      const q = filtros.search.toLowerCase()
      list = list.filter((e) =>
        e.nome.toLowerCase().includes(q) ||
        e.cpf.includes(q) ||
        e.email.toLowerCase().includes(q),
      )
    }
    if (filtros?.bairro && filtros.bairro !== 'todos') {
      list = list.filter((e) => e.bairro === filtros.bairro)
    }
    if (filtros?.apoio && filtros.apoio !== 'todos') {
      list = list.filter((e) => e.apoio === filtros.apoio)
    }
    return list
  }, [filtros?.search, filtros?.bairro, filtros?.apoio])
}

export function useLiderancas() {
  return mock.LIDERANCAS
}
export function useCabos() {
  return mock.CABOS
}
export function useEquipe() {
  return mock.EQUIPE
}
export function useVisitas() {
  return mock.VISITAS
}
export function usePesquisas() {
  return mock.PESQUISAS
}
export function useEventos() {
  return mock.EVENTOS
}
export function useConversas() {
  return mock.CONVERSAS
}
export function useFinanceiro() {
  return mock.FINANCEIRO
}
export function useNotificacoes() {
  return mock.NOTIFICACOES
}
export function useAtividades() {
  return mock.ATIVIDADES
}
export function useMetricasSemana() {
  return mock.METRICAS_SEMANA
}
export function useDemografia() {
  return { idade: mock.DEMOGRAFIA_IDADE }
}
export function useDensidade() {
  return mock.DENSIDADE_BAIRRO
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
