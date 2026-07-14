import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Cabo } from '~/data/types'

interface CabosState {
  cadastrados: Cabo[]
  adicionar: (c: Cabo) => void
  patch: (id: string, p: Partial<Cabo>) => void
  limpar: () => void
}

export const useCabosStore = create<CabosState>()(
  persist(
    (set) => ({
      cadastrados: [],
      adicionar: (c) => set((s) => ({ cadastrados: [c, ...s.cadastrados] })),
      patch: (id, p) =>
        set((s) => ({
          cadastrados: s.cadastrados.map((c) => (c.id === id ? { ...c, ...p } : c)),
        })),
      limpar: () => set({ cadastrados: [] }),
    }),
    { name: 'vg-cabos' },
  ),
)
