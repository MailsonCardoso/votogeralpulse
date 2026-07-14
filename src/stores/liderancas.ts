import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Lideranca } from '~/data/types'

interface LiderancasState {
  cadastradas: Lideranca[]
  adicionar: (l: Lideranca) => void
  limpar: () => void
}

export const useLiderancasStore = create<LiderancasState>()(
  persist(
    (set) => ({
      cadastradas: [],
      adicionar: (l) => set((s) => ({ cadastradas: [l, ...s.cadastradas] })),
      limpar: () => set({ cadastradas: [] }),
    }),
    { name: 'vg-liderancas' },
  ),
)
