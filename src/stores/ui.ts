import { create } from 'zustand'

interface UIState {
  sidebarCollapsed: boolean
  toggleSidebar: () => void
  setSidebar: (v: boolean) => void
  commandOpen: boolean
  setCommandOpen: (v: boolean) => void
}

export const useUI = create<UIState>((set) => ({
  sidebarCollapsed: false,
  toggleSidebar: () =>
    set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  setSidebar: (v) => set({ sidebarCollapsed: v }),
  commandOpen: false,
  setCommandOpen: (v) => set({ commandOpen: v }),
}))
