import { create } from 'zustand'

export interface SessionUser {
  name: string
  email: string
  role: string
  city: string
  plan: string
}

interface SessionState {
  user: SessionUser | null
  isAuthenticated: boolean
  login: (email: string, name?: string) => void
  logout: () => void
  setRole: (role: string) => void
}

export const useSession = create<SessionState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: (email, name) =>
    set({
      user: {
        name: name ?? email.split('@')[0].replace(/^\w/, (c) => c.toUpperCase()),
        email,
        role: 'Coordenador de Campanha',
        city: 'São Paulo',
        plan: 'Enterprise',
      },
      isAuthenticated: true,
    }),
  logout: () => set({ user: null, isAuthenticated: false }),
  setRole: (role) =>
    set((s) => (s.user ? { user: { ...s.user, role } } : {})),
}))
