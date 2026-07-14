import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Lideranca } from '~/data/types'

interface LiderancasState {
  cadastradas: Lideranca[]
  override: Record<string, Partial<Lideranca>>
  adicionar: (l: Lideranca) => void
  patch: (id: string, p: Partial<Lideranca>) => void
  registrarConversao: (id: string, convertidosAtual: number) => void
  limpar: () => void
}

export const useLiderancasStore = create<LiderancasState>()(
  persist(
    (set) => ({
      cadastradas: [],
      override: {},
      adicionar: (l) => set((s) => ({ cadastradas: [l, ...s.cadastradas] })),
      patch: (id, p) => set((s) => ({ override: { ...s.override, [id]: { ...s.override[id], ...p } } })),
      registrarConversao: (id, convertidosAtual) =>
        set((s) => ({
          override: { ...s.override, [id]: { ...s.override[id], convertidos: convertidosAtual + 1 } },
        })),
      limpar: () => set({ cadastradas: [], override: {} }),
    }),
    { name: 'vg-liderancas' },
  ),
)
