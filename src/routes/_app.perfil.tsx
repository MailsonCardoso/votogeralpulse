'use client'

import { createFileRoute } from '@tanstack/react-router'
import { CircleUser, Camera } from 'lucide-react'
import { toast } from 'sonner'
import { PageHeader } from '~/components/ui/page-header'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Input, Label, Badge } from '~/components/ui/input'
import { AvatarInitials } from '~/components/ui/avatar'
import { useSession } from '~/stores/session'

export const Route = createFileRoute('/_app/perfil')({
  head: () => ({ meta: [{ title: 'Perfil — VotoGeral 360' }] }),
  component: Perfil,
})

function Perfil() {
  const user = useSession((s) => s.user)

  return (
    <div className="space-y-6">
      <PageHeader title="Perfil" description="Seu cartão de visitas na plataforma." />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="flex flex-col items-center p-6 text-center">
          <div className="relative">
            <AvatarInitials name={user?.name ?? 'Ana Coordenadora'} className="size-24 text-2xl" />
            <button className="absolute bottom-0 right-0 flex size-8 items-center justify-center rounded-full brand-gradient text-white shadow-sm">
              <Camera className="size-4" />
            </button>
          </div>
          <h3 className="mt-4 text-lg font-semibold">{user?.name ?? 'Ana Coordenadora'}</h3>
          <p className="text-sm text-muted">{user?.email ?? 'ana@votogeral.com'}</p>
          <div className="mt-3 flex gap-2">
            <Badge variant="info">{user?.role ?? 'Coordenador'}</Badge>
            <Badge variant="success">{user?.plan ?? 'Enterprise'}</Badge>
          </div>
          <div className="mt-5 grid w-full grid-cols-2 gap-3 text-center">
            <div className="rounded-lg border border-[var(--card-border)] p-3">
              <p className="text-xl font-semibold">1.240</p>
              <p className="text-xs text-muted">Convertidos</p>
            </div>
            <div className="rounded-lg border border-[var(--card-border)] p-3">
              <p className="text-xl font-semibold">18</p>
              <p className="text-xs text-muted">Lideranças</p>
            </div>
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Editar perfil</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Nome completo</Label>
                <Input defaultValue={user?.name ?? 'Ana Coordenadora'} />
              </div>
              <div className="space-y-1.5">
                <Label>Cargo</Label>
                <Input defaultValue={user?.role ?? 'Coordenador de Campanha'} />
              </div>
              <div className="space-y-1.5">
                <Label>Telefone</Label>
                <Input defaultValue="(11) 98888-0000" />
              </div>
              <div className="space-y-1.5">
                <Label>Cidade base</Label>
                <Input defaultValue={user?.city ?? 'São Paulo'} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Bio</Label>
              <textarea
                className="flex min-h-[80px] w-full rounded-lg border border-[var(--card-border)] bg-[var(--bg-elevated)] px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40"
                defaultValue="Coordenadora apaixonada por mobilização de base e dados eleitorais."
              />
            </div>
            <Button onClick={() => toast.success('Perfil atualizado!')}>Salvar perfil</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
