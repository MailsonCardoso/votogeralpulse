import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Eleitor } from '~/data/types'

interface EleitoresState {
  cadastrados: Eleitor[]
  adicionar: (e: Eleitor) => void
  limpar: () => void
}

export const useEleitoresStore = create<EleitoresState>()(
  persist(
    (set) => ({
      cadastrados: [],
      adicionar: (e) => set((s) => ({ cadastrados: [e, ...s.cadastrados] })),
      limpar: () => set({ cadastrados: [] }),
    }),
    { name: 'vg-eleitores' },
  ),
)
