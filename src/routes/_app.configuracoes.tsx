'use client'

import { createFileRoute } from '@tanstack/react-router'
import { Settings as SettingsIcon, Moon, Sun, ShieldCheck, UserCog } from 'lucide-react'
import { toast } from 'sonner'
import { PageHeader } from '~/components/ui/page-header'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Input, Label } from '~/components/ui/input'
import { Switch } from '~/components/ui/switch'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '~/components/ui/tabs'
import { useThemeStore } from '~/stores/theme'

export const Route = createFileRoute('/_app/configuracoes')({
  head: () => ({ meta: [{ title: 'Configurações — VotoGeral 360' }] }),
  component: Configuracoes,
})

function Configuracoes() {
  const theme = useThemeStore((s) => s.theme)
  const setTheme = useThemeStore((s) => s.setTheme)

  return (
    <div className="space-y-6">
      <PageHeader title="Configurações" description="Gerencie conta, preferências e segurança." />

      <Tabs defaultValue="conta">
        <TabsList>
          <TabsTrigger value="conta"><UserCog /> Conta</TabsTrigger>
          <TabsTrigger value="preferencias"><SettingsIcon /> Preferências</TabsTrigger>
          <TabsTrigger value="seguranca"><ShieldCheck /> Segurança</TabsTrigger>
        </TabsList>

        <TabsContent value="conta">
          <Card>
            <CardHeader>
              <CardTitle>Dados da conta</CardTitle>
              <CardDescription>Informações do coordenador responsável.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label>Nome</Label>
                  <Input defaultValue="Ana Coordenadora" />
                </div>
                <div className="space-y-1.5">
                  <Label>E-mail</Label>
                  <Input defaultValue="ana@votogeral.com" />
                </div>
                <div className="space-y-1.5">
                  <Label>Cargo</Label>
                  <Input defaultValue="Coordenador de Campanha" />
                </div>
                <div className="space-y-1.5">
                  <Label>Cidade</Label>
                  <Input defaultValue="São Paulo" />
                </div>
              </div>
              <Button onClick={() => toast.success('Alterações salvas!')}>Salvar alterações</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferencias">
          <Card>
            <CardHeader>
              <CardTitle>Aparência</CardTitle>
              <CardDescription>Escolha o tema da interface.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div className="flex items-center gap-3">
                  {theme === 'dark' ? <Moon className="size-5 text-brand" /> : <Sun className="size-5 text-brand" />}
                  <div>
                    <p className="font-medium">Modo escuro</p>
                    <p className="text-sm text-muted-foreground">Reduz o cansaço em longas jornadas.</p>
                  </div>
                </div>
                <Switch checked={theme === 'dark'} onCheckedChange={(v) => setTheme(v ? 'dark' : 'light')} />
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div>
                  <p className="font-medium">Notificações push</p>
                  <p className="text-sm text-muted-foreground">Alertas de metas e visitas.</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div>
                  <p className="font-medium">Relatório semanal</p>
                  <p className="text-sm text-muted-foreground">Resumo toda segunda-feira.</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seguranca">
          <Card>
            <CardHeader>
              <CardTitle>Autenticação de dois fatores</CardTitle>
              <CardDescription>Adicione uma camada extra de proteção.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="size-5 text-success" />
                  <div>
                    <p className="font-medium">MFA por aplicativo</p>
                    <p className="text-sm text-muted-foreground">Google Authenticator / Authy.</p>
                  </div>
                </div>
                <Switch />
              </div>
              <div className="space-y-1.5">
                <Label>Alterar senha</Label>
                <Input type="password" placeholder="Senha atual" />
                <Input type="password" placeholder="Nova senha" />
              </div>
              <Button onClick={() => toast.success('Segurança atualizada!')}>Atualizar segurança</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
