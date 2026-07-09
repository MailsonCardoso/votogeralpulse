'use client'

import { useEffect } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import {
  Search, Bell, Moon, Sun, LogOut, Settings, UserCircle,
  Command, Building2,
} from 'lucide-react'
import { cn } from '~/lib/utils'
import { useThemeStore } from '~/stores/theme'
import { useUI } from '~/stores/ui'
import { useSession } from '~/stores/session'
import { AvatarInitials } from '~/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '~/components/ui/dropdown-menu'
import { useNotificacoes } from '~/hooks/useData'
import { relativeTime } from '~/lib/utils'
import { CommandPalette } from './CommandPalette'

export function AppNavbar() {
  const theme = useThemeStore((s) => s.theme)
  const toggle = useThemeStore((s) => s.toggle)
  const setCommandOpen = useUI((s) => s.setCommandOpen)
  const commandOpen = useUI((s) => s.commandOpen)
  const notificacoes = useNotificacoes()
  const user = useSession((s) => s.user)
  const logout = useSession((s) => s.logout)
  const navigate = useNavigate()
  const unread = notificacoes.filter((n) => !n.lida).length

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setCommandOpen(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [setCommandOpen])

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-[var(--card-border)] bg-[var(--bg)]/80 px-4 backdrop-blur-md">
      <Link to="/dashboard" className="flex items-center gap-2 md:hidden">
        <div className="flex size-8 items-center justify-center rounded-lg brand-gradient text-white">
          <Building2 className="size-4" />
        </div>
      </Link>

      <button
        onClick={() => setCommandOpen(true)}
        className="flex h-9 flex-1 items-center gap-2 rounded-lg border border-[var(--card-border)] bg-[var(--bg-elevated)] px-3 text-sm text-muted transition-colors hover:border-brand-500/40 md:max-w-md"
      >
        <Search className="size-4" />
        <span className="flex-1 text-left">Buscar eleitores, bairros, ações…</span>
        <kbd className="hidden items-center gap-0.5 rounded border border-[var(--card-border)] px-1.5 py-0.5 text-[10px] font-medium sm:inline-flex">
          <Command className="size-3" />K
        </kbd>
      </button>

      <div className="ml-auto flex items-center gap-1.5">
        <button
          onClick={toggle}
          className="flex size-9 items-center justify-center rounded-lg text-muted transition-colors hover:bg-[var(--card-border)]/40"
          aria-label="Alternar tema"
        >
          {theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="relative flex size-9 items-center justify-center rounded-lg text-muted transition-colors hover:bg-[var(--card-border)]/40">
              <Bell className="size-4" />
              {unread > 0 && (
                <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-danger ring-2 ring-[var(--bg)]" />
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notificações</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notificacoes.map((n) => (
              <div key={n.id} className="flex gap-2.5 px-2.5 py-2">
                <span
                  className={cn(
                    'mt-1.5 size-2 shrink-0 rounded-full',
                    n.tipo === 'success' && 'bg-[var(--color-success)]',
                    n.tipo === 'warning' && 'bg-warning',
                    n.tipo === 'danger' && 'bg-danger',
                    n.tipo === 'info' && 'bg-info',
                  )}
                />
                <div className="min-w-0">
                  <p className="text-sm font-medium">{n.titulo}</p>
                  <p className="text-xs text-muted">{n.corpo}</p>
                  <p className="mt-0.5 text-[11px] text-muted">
                    {relativeTime(n.tempo)}
                  </p>
                </div>
              </div>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="ml-1 rounded-full outline-none ring-offset-2 ring-brand-500/40 focus-visible:ring-2">
              <AvatarInitials name={user?.name ?? 'Ana Coordenadora'} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel className="font-normal">
              <p className="text-sm font-medium">{user?.name ?? 'Ana'}</p>
              <p className="text-xs text-muted">{user?.email ?? 'ana@votogeral.com'}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate({ to: '/perfil' })}>
              <UserCircle /> Perfil
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate({ to: '/configuracoes' })}>
              <Settings /> Configurações
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                logout()
                navigate({ to: '/auth' })
              }}
            >
              <LogOut /> Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {commandOpen && <CommandPalette />}
    </header>
  )
}
