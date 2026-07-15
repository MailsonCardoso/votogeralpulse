import { create } from 'zustand'
import type { Lideranca } from '~/data/types'
import { api } from '~/lib/api'

interface LiderancasState {
  cadastradas: Lideranca[]
  override: Record<string, Partial<Lideranca>>
  carregando: boolean
  erro: string | null
  load: () => Promise<void>
  adicionar: (l: Lideranca) => Promise<void>
  patch: (id: string, p: Partial<Lideranca>) => Promise<void>
  registrarConversao: (id: string, convertidosAtual: number) => Promise<void>
  limpar: () => void
}

export const useLiderancasStore = create<LiderancasState>((set) => ({
  cadastradas: [],
  override: {},
  carregando: false,
  erro: null,
  load: async () => {
    set({ carregando: true, erro: null })
    try {
      const data = await api.list<Lideranca>('liderancas')
      set({ cadastradas: data })
    } catch (e) {
      set({ erro: (e as Error).message })
    } finally {
      set({ carregando: false })
    }
  },
  adicionar: async (l) => {
    try {
      const created = await api.create<Lideranca>('liderancas', l)
      set((s) => ({
        cadastradas: [created, ...s.cadastradas.filter((x) => x.id !== l.id)],
      }))
    } catch (e) {
      console.error('Falha ao adicionar lideranca:', e)
    }
  },
  patch: async (id, p) => {
    try {
      const updated = await api.update<Lideranca>('liderancas', id, p)
      set((s) => ({
        cadastradas: s.cadastradas.map((l) => (l.id === id ? updated : l)),
      }))
    } catch (e) {
      console.error('Falha ao atualizar lideranca:', e)
    }
  },
  registrarConversao: async (id, convertidosAtual) => {
    try {
      const updated = await api.update<Lideranca>('liderancas', id, {
        convertidos: convertidosAtual + 1,
      })
      set((s) => ({
        cadastradas: s.cadastradas.map((l) => (l.id === id ? updated : l)),
        override: { ...s.override, [id]: { ...s.override[id], convertidos: convertidosAtual + 1 } },
      }))
    } catch (e) {
      console.error('Falha ao registrar conversao:', e)
    }
  },
  limpar: () => set({ cadastradas: [], override: {} }),
}))

useLiderancasStore.getState().load()
