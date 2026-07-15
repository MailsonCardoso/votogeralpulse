import { create } from 'zustand'
import type { Cabo } from '~/data/types'
import { api } from '~/lib/api'

interface CabosState {
  cadastrados: Cabo[]
  carregando: boolean
  erro: string | null
  load: () => Promise<void>
  adicionar: (c: Cabo) => Promise<void>
  patch: (id: string, p: Partial<Cabo>) => Promise<void>
  limpar: () => void
}

export const useCabosStore = create<CabosState>((set) => ({
  cadastrados: [],
  carregando: false,
  erro: null,
  load: async () => {
    set({ carregando: true, erro: null })
    try {
      const data = await api.list<Cabo>('cabos')
      set({ cadastrados: data })
    } catch (e) {
      set({ erro: (e as Error).message })
    } finally {
      set({ carregando: false })
    }
  },
  adicionar: async (c) => {
    try {
      const created = await api.create<Cabo>('cabos', c)
      set((s) => ({
        cadastrados: [created, ...s.cadastrados.filter((x) => x.id !== c.id)],
      }))
    } catch (e) {
      console.error('Falha ao adicionar cabo:', e)
    }
  },
  patch: async (id, p) => {
    try {
      const updated = await api.update<Cabo>('cabos', id, p)
      set((s) => ({
        cadastrados: s.cadastrados.map((c) => (c.id === id ? updated : c)),
      }))
    } catch (e) {
      console.error('Falha ao atualizar cabo:', e)
    }
  },
  limpar: () => set({ cadastrados: [] }),
}))

useCabosStore.getState().load()
