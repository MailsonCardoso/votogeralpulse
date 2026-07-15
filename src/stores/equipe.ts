import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { MembroEquipe } from '~/data/types'

interface EquipeState {
  cadastrados: MembroEquipe[]
  adicionar: (m: MembroEquipe) => void
  patch: (id: string, p: Partial<MembroEquipe>) => void
  remover: (id: string) => void
  limpar: () => void
}

export const useEquipeStore = create<EquipeState>()(
  persist(
    (set) => ({
      cadastrados: [],
      adicionar: (m) => set((s) => ({ cadastrados: [m, ...s.cadastrados] })),
      patch: (id, p) =>
        set((s) => ({
          cadastrados: s.cadastrados.map((m) => (m.id === id ? { ...m, ...p } : m)),
        })),
      remover: (id) => set((s) => ({ cadastrados: s.cadastrados.filter((m) => m.id !== id) })),
      limpar: () => set({ cadastrados: [] }),
    }),
    { name: 'vg-equipe' },
  ),
)
