import { create } from 'zustand'
import type { MembroEquipe } from '~/data/types'
import { api } from '~/lib/api'

interface EquipeState {
  cadastrados: MembroEquipe[]
  carregando: boolean
  erro: string | null
  load: () => Promise<void>
  adicionar: (m: MembroEquipe) => Promise<void>
  patch: (id: string, p: Partial<MembroEquipe>) => Promise<void>
  remover: (id: string) => Promise<void>
  limpar: () => void
}

export const useEquipeStore = create<EquipeState>((set) => ({
  cadastrados: [],
  carregando: false,
  erro: null,
  load: async () => {
    set({ carregando: true, erro: null })
    try {
      const data = await api.list<MembroEquipe>('funcionarios')
      set({ cadastrados: data })
    } catch (e) {
      set({ erro: (e as Error).message })
    } finally {
      set({ carregando: false })
    }
  },
  adicionar: async (m) => {
    try {
      const created = await api.create<MembroEquipe>('funcionarios', m)
      set((s) => ({
        cadastrados: [created, ...s.cadastrados.filter((x) => x.id !== m.id)],
      }))
    } catch (e) {
      console.error('Falha ao adicionar funcionário:', e)
    }
  },
  patch: async (id, p) => {
    try {
      const updated = await api.update<MembroEquipe>('funcionarios', id, p)
      set((s) => ({
        cadastrados: s.cadastrados.map((m) => (m.id === id ? updated : m)),
      }))
    } catch (e) {
      console.error('Falha ao atualizar funcionário:', e)
    }
  },
  remover: async (id) => {
    try {
      await api.remove('funcionarios', id)
      set((s) => ({ cadastrados: s.cadastrados.filter((m) => m.id !== id) }))
    } catch (e) {
      console.error('Falha ao remover funcionário:', e)
    }
  },
  limpar: () => set({ cadastrados: [] }),
}))

useEquipeStore.getState().load()
