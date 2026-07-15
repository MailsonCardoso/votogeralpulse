import { create } from 'zustand'
import type { Eleitor } from '~/data/types'
import { api } from '~/lib/api'

interface EleitoresState {
  cadastrados: Eleitor[]
  carregando: boolean
  erro: string | null
  load: () => Promise<void>
  adicionar: (e: Eleitor) => Promise<void>
  atualizar: (e: Eleitor) => Promise<void>
  limpar: () => void
}

export const useEleitoresStore = create<EleitoresState>((set) => ({
  cadastrados: [],
  carregando: false,
  erro: null,
  load: async () => {
    set({ carregando: true, erro: null })
    try {
      const data = await api.list<Eleitor>('eleitores')
      set({ cadastrados: data })
    } catch (e) {
      set({ erro: (e as Error).message })
    } finally {
      set({ carregando: false })
    }
  },
  adicionar: async (e) => {
    try {
      const created = await api.create<Eleitor>('eleitores', e)
      set((s) => ({
        cadastrados: [created, ...s.cadastrados.filter((x) => x.id !== e.id)],
      }))
    } catch (err) {
      console.error('Falha ao adicionar eleitor:', err)
    }
  },
  atualizar: async (e) => {
    try {
      const updated = await api.update<Eleitor>('eleitores', e.id, e)
      set((s) => ({
        cadastrados: s.cadastrados.map((x) => (x.id === e.id ? updated : x)),
      }))
    } catch (err) {
      console.error('Falha ao atualizar eleitor:', err)
    }
  },
  limpar: () => set({ cadastrados: [] }),
}))

useEleitoresStore.getState().load()
