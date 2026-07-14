import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Cabo } from '~/data/types'

interface CabosState {
  cadastrados: Cabo[]
  adicionar: (c: Cabo) => void
  limpar: () => void
}

export const useCabosStore = create<CabosState>()(
  persist(
    (set) => ({
      cadastrados: [],
      adicionar: (c) => set((s) => ({ cadastrados: [c, ...s.cadastrados] })),
      limpar: () => set({ cadastrados: [] }),
    }),
    { name: 'vg-cabos' },
  ),
)
