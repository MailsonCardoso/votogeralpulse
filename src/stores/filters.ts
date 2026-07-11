import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Apoio = 'ferrenho' | 'provavel' | 'indeciso' | 'adversario'

interface FilterState {
  search: string
  cidade: string
  regiao: string
  bairro: string
  zona: string
  apoio: Apoio | 'todos'
  setSearch: (v: string) => void
  setCidade: (v: string) => void
  setRegiao: (v: string) => void
  setBairro: (v: string) => void
  setZona: (v: string) => void
  setApoio: (v: Apoio | 'todos') => void
  reset: () => void
}

const initial = {
  search: '',
  cidade: 'todos',
  regiao: 'todos',
  bairro: 'todos',
  zona: 'todos',
  apoio: 'todos' as const,
}

export const useFilters = create<FilterState>()(
  persist(
    (set) => ({
      ...initial,
      setSearch: (search) => set({ search }),
      setCidade: (cidade) => set({ cidade, regiao: 'todos', bairro: 'todos' }),
      setRegiao: (regiao) => set({ regiao, bairro: 'todos' }),
      setBairro: (bairro) => set({ bairro }),
      setZona: (zona) => set({ zona }),
      setApoio: (apoio) => set({ apoio }),
      reset: () => set({ ...initial }),
    }),
    { name: 'vg-filters' },
  ),
)
