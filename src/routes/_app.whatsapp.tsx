'use client'

import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { MessageCircle, Send, Search, Paperclip, Tag } from 'lucide-react'
import { PageHeader } from '~/components/ui/page-header'
import { Card } from '~/components/ui/card'
import { Badge, Input } from '~/components/ui/input'
import { Button } from '~/components/ui/button'
import { AvatarInitials } from '~/components/ui/avatar'
import { useConversas, useTemplates, APOIO_META } from '~/hooks/useData'
import { cn } from '~/lib/utils'
import type { Conversa, Mensagem } from '~/data/types'

export const Route = createFileRoute('/_app/whatsapp')({
  head: () => ({ meta: [{ title: 'WhatsApp CRM — VotoGeral 360' }] }),
  component: WhatsApp,
})

function WhatsApp() {
  const conversas = useConversas()
  const templates = useTemplates()
  const [ativa, setAtiva] = useState<Conversa>(conversas[0])
  const [mensagens, setMensagens] = useState<Mensagem[]>(conversas[0].mensagens)
  const [texto, setTexto] = useState('')

  function selecionar(c: Conversa) {
    setAtiva(c)
    setMensagens(c.mensagens)
  }

  function enviar() {
    if (!texto.trim()) return
    const msg: Mensagem = {
      id: Math.random().toString(36).slice(2),
      de: 'cabo',
      texto: texto.trim(),
      hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    }
    setMensagens((prev) => [...prev, msg])
    setTexto('')
  }

  return (
    <div className="flex h-[calc(100vh-9rem)] flex-col">
      <PageHeader title="WhatsApp CRM" description="Atendimento e prospecção direta pelo WhatsApp." />

      <div className="mt-4 grid min-h-0 flex-1 gap-4 lg:grid-cols-[300px_1fr_280px]">
        {/* Lista */}
        <Card className="flex min-h-0 flex-col overflow-hidden">
          <div className="border-b border-border p-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Buscar conversa…" className="pl-9" />
            </div>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto">
            {conversas.map((c) => (
              <button
                key={c.id}
                onClick={() => selecionar(c)}
                className={cn(
                  'flex w-full items-center gap-3 border-b border-border/60 p-3 text-left transition-colors',
                  ativa.id === c.id ? 'bg-brand/10' : 'hover:bg-accent/30',
                )}
              >
                <div className="relative">
                  <AvatarInitials name={c.nome} className="size-9" />
                  {c.online && (
                    <span className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full bg-[var(--success)] ring-2 ring-card" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{c.nome}</p>
                  <p className="truncate text-xs text-muted-foreground">{c.bairro}</p>
                </div>
                {c.naoLidas > 0 && (
                  <span className="flex size-5 items-center justify-center rounded-full bg-brand text-[10px] font-semibold text-white">
                    {c.naoLidas}
                  </span>
                )}
              </button>
            ))}
          </div>
        </Card>

        {/* Chat */}
        <Card className="flex min-h-0 flex-col overflow-hidden">
          <div className="flex items-center gap-3 border-b border-border p-3">
            <AvatarInitials name={ativa.nome} className="size-9" />
            <div>
              <p className="text-sm font-medium">{ativa.nome}</p>
              <p className="text-xs text-muted-foreground">{ativa.online ? 'online' : 'offline'}</p>
            </div>
          </div>
          <div className="min-h-0 flex-1 space-y-3 overflow-y-auto bg-card p-4">
            {mensagens.map((m) => (
              <div key={m.id} className={cn('flex', m.de === 'cabo' ? 'justify-end' : 'justify-start')}>
                <div
                  className={cn(
                    'max-w-[75%] rounded-2xl px-3 py-2 text-sm',
                    m.de === 'cabo'
                      ? 'brand-gradient text-white'
                      : 'bg-card border border-border',
                  )}
                >
                  <p>{m.texto}</p>
                  <p className={cn('mt-0.5 text-[10px]', m.de === 'cabo' ? 'text-white/70' : 'text-muted-foreground')}>
                    {m.hora}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 border-t border-border p-3">
            <Button variant="ghost" size="icon"><Paperclip /></Button>
            <Input
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && enviar()}
              placeholder="Digite uma mensagem…"
            />
            <Button size="icon" onClick={enviar}><Send /></Button>
          </div>
        </Card>

        {/* Detalhes + templates */}
        <Card className="flex min-h-0 flex-col overflow-hidden p-4">
          <div className="border-b border-border pb-3">
            <p className="text-sm font-semibold">{ativa.nome}</p>
            <div className="mt-2 flex flex-wrap gap-1">
              {ativa.tags.map((t) => (
                <Badge key={t} variant={APOIO_META[t as keyof typeof APOIO_META]?.variant ?? 'outline'}>
                  <Tag className="size-3" /> {t}
                </Badge>
              ))}
            </div>
            <p className="mt-2 text-xs text-muted-foreground">{ativa.bairro}</p>
          </div>
          <p className="py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Templates
          </p>
          <div className="min-h-0 flex-1 space-y-2 overflow-y-auto">
            {templates.map((t) => (
              <button
                key={t.id}
                onClick={() => setTexto(t.texto)}
                className="block w-full rounded-lg border border-border p-3 text-left text-xs transition-colors hover:bg-accent/30"
              >
                <p className="mb-1 font-medium text-brand">{t.nome}</p>
                <p className="line-clamp-2 text-muted-foreground">{t.texto}</p>
              </button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
