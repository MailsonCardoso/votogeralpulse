import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Visita } from '~/data/types'

interface VisitasState {
  visitas: Visita[]
  adicionar: (v: Visita) => void
  patch: (id: string, p: Partial<Visita>) => void
  remover: (id: string) => void
  limpar: () => void
}

export const useVisitasStore = create<VisitasState>()(
  persist(
    (set) => ({
      visitas: [],
      adicionar: (v) => set((s) => ({ visitas: [v, ...s.visitas] })),
      patch: (id, p) =>
        set((s) => ({
          visitas: s.visitas.map((v) => (v.id === id ? { ...v, ...p } : v)),
        })),
      remover: (id) => set((s) => ({ visitas: s.visitas.filter((v) => v.id !== id) })),
      limpar: () => set({ visitas: [] }),
    }),
    { name: 'vg-visitas' },
  ),
)
