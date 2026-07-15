import { create } from 'zustand'
import type { Visita } from '~/data/types'
import { api } from '~/lib/api'

interface VisitasState {
  visitas: Visita[]
  carregando: boolean
  erro: string | null
  load: () => Promise<void>
  adicionar: (v: Visita) => Promise<void>
  patch: (id: string, p: Partial<Visita>) => Promise<void>
  remover: (id: string) => Promise<void>
  limpar: () => void
}

export const useVisitasStore = create<VisitasState>((set) => ({
  visitas: [],
  carregando: false,
  erro: null,
  load: async () => {
    set({ carregando: true, erro: null })
    try {
      const data = await api.list<Visita>('visitas')
      set({ visitas: data })
    } catch (e) {
      set({ erro: (e as Error).message })
    } finally {
      set({ carregando: false })
    }
  },
  adicionar: async (v) => {
    try {
      const created = await api.create<Visita>('visitas', v)
      set((s) => ({
        visitas: [created, ...s.visitas.filter((x) => x.id !== v.id)],
      }))
    } catch (e) {
      console.error('Falha ao adicionar visita:', e)
    }
  },
  patch: async (id, p) => {
    try {
      const updated = await api.update<Visita>('visitas', id, p)
      set((s) => ({
        visitas: s.visitas.map((v) => (v.id === id ? updated : v)),
      }))
    } catch (e) {
      console.error('Falha ao atualizar visita:', e)
    }
  },
  remover: async (id) => {
    try {
      await api.remove('visitas', id)
      set((s) => ({ visitas: s.visitas.filter((v) => v.id !== id) }))
    } catch (e) {
      console.error('Falha ao remover visita:', e)
    }
  },
  limpar: () => set({ visitas: [] }),
}))

useVisitasStore.getState().load()
