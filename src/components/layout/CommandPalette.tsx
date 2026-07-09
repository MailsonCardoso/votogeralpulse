'use client'

import * as React from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Search, Users, MapPinned, MessageCircle, Flag, BarChart3 } from 'lucide-react'
import { useUI } from '~/stores/ui'
import { useEleitores } from '~/hooks/useData'
import { Input } from '~/components/ui/input'

const ROTAS = [
  { to: '/dashboard', label: 'Painel Geral', icon: BarChart3 },
  { to: '/eleitores', label: 'Eleitores', icon: Users },
  { to: '/visitas', label: 'Visitas', icon: MapPinned },
  { to: '/whatsapp', label: 'WhatsApp CRM', icon: MessageCircle },
  { to: '/eventos', label: 'Eventos', icon: Flag },
  { to: '/pesquisas', label: 'Pesquisas', icon: BarChart3 },
]

export function CommandPalette() {
  const setOpen = useUI((s) => s.setCommandOpen)
  const navigate = useNavigate()
  const eleitores = useEleitores()
  const [q, setQ] = React.useState('')
  const inputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const rotas = ROTAS.filter((r) =>
    r.label.toLowerCase().includes(q.toLowerCase()),
  )
  const pessoas = eleitores
    .filter((e) => e.nome.toLowerCase().includes(q.toLowerCase()))
    .slice(0, 5)

  function go(to: string) {
    setOpen(false)
    navigate({ to })
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center bg-black/50 p-4 pt-[12vh] backdrop-blur-sm"
      onClick={() => setOpen(false)}
    >
      <div
        className="w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 border-b border-border px-4">
          <Search className="size-4 text-muted-foreground" />
          <Input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar… (Esc para fechar)"
            className="h-12 border-0 focus-visible:ring-0"
            onKeyDown={(e) => {
              if (e.key === 'Escape') setOpen(false)
              if (e.key === 'Enter' && rotas[0]) go(rotas[0].to)
            }}
          />
        </div>
        <div className="max-h-[50vh] overflow-y-auto p-2">
          {rotas.length > 0 && (
            <div className="mb-2">
              <p className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Navegar
              </p>
              {rotas.map((r) => (
                <button
                  key={r.to}
                  onClick={() => go(r.to)}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent/40"
                >
                  <r.icon className="size-4 text-muted-foreground" />
                  {r.label}
                </button>
              ))}
            </div>
          )}
          {pessoas.length > 0 && (
            <div>
              <p className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Eleitores
              </p>
              {pessoas.map((e) => (
                <button
                  key={e.id}
                  onClick={() => go('/eleitores')}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-accent/40"
                >
                  <Users className="size-4 text-muted-foreground" />
                  <span className="flex-1">{e.nome}</span>
                  <span className="text-xs text-muted-foreground">{e.bairro}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
