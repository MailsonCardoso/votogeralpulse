import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Eleitor } from '~/data/types'

interface EleitoresState {
  cadastrados: Eleitor[]
  adicionar: (e: Eleitor) => void
  atualizar: (e: Eleitor) => void
  limpar: () => void
}

export const useEleitoresStore = create<EleitoresState>()(
  persist(
    (set) => ({
      cadastrados: [],
      adicionar: (e) => set((s) => ({ cadastrados: [e, ...s.cadastrados] })),
      atualizar: (e) => set((s) => ({ cadastrados: s.cadastrados.map((x) => (x.id === e.id ? e : x)) })),
      limpar: () => set({ cadastrados: [] }),
    }),
    { name: 'vg-eleitores' },
  ),
)
