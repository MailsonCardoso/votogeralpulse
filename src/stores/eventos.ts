import { create } from 'zustand'
import type { Evento } from '~/data/types'
import { api } from '~/lib/api'

interface EventosState {
  eventos: Evento[]
  carregando: boolean
  erro: string | null
  load: () => Promise<void>
  adicionar: (e: Evento) => Promise<void>
}

export const useEventosStore = create<EventosState>((set) => ({
  eventos: [],
  carregando: false,
  erro: null,
  load: async () => {
    set({ carregando: true, erro: null })
    try {
      const data = await api.list<Evento>('eventos')
      set({ eventos: data })
    } catch (e) {
      set({ erro: (e as Error).message })
    } finally {
      set({ carregando: false })
    }
  },
  adicionar: async (e) => {
    try {
      const created = await api.create<Evento>('eventos', e)
      set((s) => ({ eventos: [created, ...s.eventos.filter((x) => x.id !== e.id)] }))
    } catch (err) {
      console.error('Falha ao adicionar evento:', err)
    }
  },
}))

useEventosStore.getState().load()
