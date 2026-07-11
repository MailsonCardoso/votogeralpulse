import { useMemo } from 'react'
import * as mock from '~/data/mock'
import type { Apoio, Eleitor } from '~/data/types'

/**
 * Hooks que envolvem os dados mockados. Hoje retornam os mocks diretamente,
 * mas a assinatura é pensada para trocar por TanStack Query + Axios no futuro,
 * ex.: useQuery({ queryKey: ['eleitores'], queryFn: () => api.get(...) }).
 */

export function useEleitores(_filtros?: {
  search?: string
  bairro?: string
  apoio?: Apoio | 'todos'
}) {
  return [] as Eleitor[]
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
