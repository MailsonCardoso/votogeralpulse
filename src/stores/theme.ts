import { useEffect } from 'react'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Theme = 'light' | 'dark'

interface ThemeState {
  theme: Theme
  setTheme: (t: Theme) => void
  toggleTheme: () => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'light',
      setTheme: (theme) => {
        set({ theme })
      },
      toggleTheme: () => {
        const next = get().theme === 'dark' ? 'light' : 'dark'
        set({ theme: next })
      },
    }),
    {
      name: 'vg-theme',
      onRehydrateStorage: () => (state) => {
        if (state) {
          if (typeof document !== 'undefined') {
            const root = document.documentElement
            if (state.theme === 'dark') root.classList.add('dark')
            else root.classList.remove('dark')
          }
        }
      },
    },
  ),
)

export function useApplyTheme() {
  const theme = useThemeStore((s) => s.theme)
  useEffect(() => {
    if (typeof document === 'undefined') return
    const root = document.documentElement
    if (theme === 'dark') root.classList.add('dark')
    else root.classList.remove('dark')
  }, [theme])
  return theme
}