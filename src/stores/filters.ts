import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Apoio = 'ferrenho' | 'provavel' | 'indeciso' | 'adversario'

interface FilterState {
  search: string
  bairro: string
  zona: string
  apoio: Apoio | 'todos'
  setSearch: (v: string) => void
  setBairro: (v: string) => void
  setZona: (v: string) => void
  setApoio: (v: Apoio | 'todos') => void
  reset: () => void
}

const initial = {
  search: '',
  bairro: 'todos',
  zona: 'todos',
  apoio: 'todos' as const,
}

export const useFilters = create<FilterState>()(
  persist(
    (set) => ({
      ...initial,
      setSearch: (search) => set({ search }),
      setBairro: (bairro) => set({ bairro }),
      setZona: (zona) => set({ zona }),
      setApoio: (apoio) => set({ apoio }),
      reset: () => set({ ...initial }),
    }),
    { name: 'vg-filters' },
  ),
)
