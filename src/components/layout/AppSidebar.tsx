'use client'

import { Link, useLocation } from '@tanstack/react-router'
import {
  LayoutDashboard, Users, Crown, Network, UsersRound, CalendarDays,
  MapPinned, MessageCircle, Megaphone, Wallet, BarChart3, Settings,
  CircleUser, Flag, PanelLeftClose, PanelLeft, Building2,
} from 'lucide-react'
import { cn } from '~/lib/utils'
import { useUI } from '~/stores/ui'

const NAV = [
  {
    group: 'Prospecção',
    items: [
      { to: '/dashboard', label: 'Painel Geral', icon: LayoutDashboard },
      { to: '/eleitores', label: 'Eleitores', icon: Users },
      { to: '/liderancas', label: 'Lideranças', icon: Crown },
      { to: '/cabos', label: 'Cabos Eleitorais', icon: Network },
      { to: '/equipe', label: 'Equipe', icon: UsersRound },
    ],
  },
  {
    group: 'Operação',
    items: [
      { to: '/agenda', label: 'Agenda', icon: CalendarDays },
      { to: '/visitas', label: 'Visitas', icon: MapPinned },
      { to: '/pesquisas', label: 'Pesquisas', icon: BarChart3 },
      { to: '/eventos', label: 'Eventos', icon: Flag },
      { to: '/whatsapp', label: 'WhatsApp CRM', icon: MessageCircle },
      { to: '/campanhas', label: 'Campanhas', icon: Megaphone },
    ],
  },
  {
    group: 'Estratégia',
    items: [
      { to: '/mapa', label: 'Mapa de Calor', icon: MapPinned },
      { to: '/financeiro', label: 'Financeiro', icon: Wallet },
      { to: '/relatorios', label: 'Relatórios', icon: BarChart3 },
    ],
  },
  {
    group: 'Conta',
    items: [
      { to: '/perfil', label: 'Perfil', icon: CircleUser },
      { to: '/configuracoes', label: 'Configurações', icon: Settings },
    ],
  },
]

export function AppSidebar() {
  const collapsed = useUI((s) => s.sidebarCollapsed)
  const toggle = useUI((s) => s.toggleSidebar)
  const location = useLocation()
  const user = { name: 'Ana Coordenadora', email: 'ana@votogeral.com' }

  return (
    <aside
      className={cn(
        'sticky top-0 flex h-screen flex-col border-r border-sidebar-border bg-sidebar transition-[width] duration-300',
        collapsed ? 'w-[72px]' : 'w-64',
      )}
    >
      <div className="flex h-16 items-center gap-2.5 border-b border-sidebar-border px-4">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl brand-gradient text-white shadow-sm">
          <Building2 className="size-5" />
        </div>
        {!collapsed && (
          <div className="leading-tight">
            <p className="text-sm font-semibold">VotoGeral 360</p>
            <p className="text-[11px] text-muted-foreground">Prospecção Eleitoral</p>
          </div>
        )}
      </div>

      <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-4">
        {NAV.map((section) => (
          <div key={section.group}>
            {!collapsed && (
              <p className="mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                {section.group}
              </p>
            )}
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const active = location.pathname.startsWith(item.to)
                const Icon = item.icon
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={cn(
                      'group flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors',
                      active
                        ? 'bg-brand/15 text-brand'
                        : 'text-muted-foreground hover:bg-accent/40 hover:text-foreground',
                      collapsed && 'justify-center',
                    )}
                    title={collapsed ? item.label : undefined}
                  >
                    <Icon className="size-4.5 shrink-0" />
                    {!collapsed && <span>{item.label}</span>}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-sidebar-border p-3">
        <div
          className={cn(
            'flex items-center gap-2.5 rounded-lg px-2 py-2',
            collapsed && 'justify-center',
          )}
        >
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand/15 text-xs font-semibold text-brand">
            {user.name
              .split(' ')
              .slice(0, 2)
              .map((p) => p[0])
              .join('')}
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1 leading-tight">
              <p className="truncate text-sm font-medium">{user.name}</p>
              <p className="truncate text-[11px] text-muted-foreground">{user.email}</p>
            </div>
          )}
        </div>
        <button
          onClick={toggle}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg px-2 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-accent/40"
        >
          {collapsed ? <PanelLeft /> : <PanelLeftClose />}
          {!collapsed && 'Recolher'}
        </button>
      </div>
    </aside>
  )
}