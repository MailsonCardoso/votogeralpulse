import { create } from 'zustand'
import type { Pesquisa } from '~/data/types'
import { api } from '~/lib/api'

interface PesquisasState {
  pesquisas: Pesquisa[]
  carregando: boolean
  erro: string | null
  load: () => Promise<void>
  adicionar: (p: Pesquisa) => Promise<void>
}

export const usePesquisasStore = create<PesquisasState>((set) => ({
  pesquisas: [],
  carregando: false,
  erro: null,
  load: async () => {
    set({ carregando: true, erro: null })
    try {
      const data = await api.list<Pesquisa>('pesquisas')
      set({ pesquisas: data })
    } catch (e) {
      set({ erro: (e as Error).message })
    } finally {
      set({ carregando: false })
    }
  },
  adicionar: async (p) => {
    try {
      const created = await api.create<Pesquisa>('pesquisas', p)
      set((s) => ({ pesquisas: [created, ...s.pesquisas.filter((x) => x.id !== p.id)] }))
    } catch (err) {
      console.error('Falha ao adicionar pesquisa:', err)
    }
  },
}))

usePesquisasStore.getState().load()
