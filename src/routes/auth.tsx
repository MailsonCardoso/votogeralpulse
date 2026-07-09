'use client'

import { useState } from 'react'
import { useNavigate, createFileRoute } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import {
  Building2, Mail, Lock, User, ArrowRight, ShieldCheck, LineChart,
} from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Input, Label } from '~/components/ui/input'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '~/components/ui/tabs'
import { useSession } from '~/stores/session'

const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  senha: z.string().min(6, 'Mínimo de 6 caracteres'),
})
const registroSchema = z
  .object({
    nome: z.string().min(2, 'Informe seu nome'),
    email: z.string().email('E-mail inválido'),
    senha: z.string().min(6, 'Mínimo de 6 caracteres'),
    confirmar: z.string(),
  })
  .refine((d) => d.senha === d.confirmar, {
    message: 'Senhas não conferem',
    path: ['confirmar'],
  })

export const Route = createFileRoute('/auth')({
  component: AuthPage,
})

function AuthPage() {
  const navigate = useNavigate()
  const login = useSession((s) => s.login)
  const [tab, setTab] = useState('login')
  const [mfa, setMfa] = useState<string[]>(Array(6).fill(''))
  const [mfaOpen, setMfaOpen] = useState(false)
  const [pendingEmail, setPendingEmail] = useState('')

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
  })
  const registroForm = useForm<z.infer<typeof registroSchema>>({
    resolver: zodResolver(registroSchema),
  })

  function finish(email: string, name?: string) {
    login(email, name)
    toast.success('Acesso liberado!', {
      description: 'Redirecionando para o painel…',
    })
    setTimeout(() => navigate({ to: '/dashboard' }), 600)
  }

  function onLogin(d: { email: string; senha: string }) {
    setPendingEmail(d.email)
    setMfaOpen(true)
    toast('Verificação em duas etapas', {
      description: 'Informe o código de 6 dígitos enviado.',
    })
  }

  function onRegistro(d: { nome: string; email: string; senha: string }) {
    toast.success('Conta criada!', { description: 'Faça login para continuar.' })
    setTab('login')
    loginForm.setValue('email', d.email)
  }

  function onMfaChange(i: number, v: string) {
    if (!/^\d?$/.test(v)) return
    setMfa((prev) => {
      const next = [...prev]
      next[i] = v
      return next
    })
    if (v && i < 5) {
      const el = document.getElementById(`mfa-${i + 1}`)
      el?.focus()
    }
  }

  function submitMfa() {
    if (mfa.join('').length < 6) {
      toast.error('Código incompleto')
      return
    }
    setMfaOpen(false)
    finish(pendingEmail)
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between overflow-hidden bg-card p-10 lg:flex">
        <div className="grid-bg absolute inset-0 opacity-40" />
        <div className="relative flex items-center gap-2.5">
          <div className="flex size-10 items-center justify-center rounded-xl brand-gradient text-white shadow-elegant">
            <Building2 className="size-5" />
          </div>
          <span className="text-lg font-semibold">VotoGeral 360</span>
        </div>
        <div className="relative space-y-6">
          <h1 className="max-w-md text-3xl font-semibold leading-tight tracking-tight">
            Prospecção eleitoral inteligente para campanhas que vencem.
          </h1>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-center gap-2.5">
              <UsersCheck /> 120 mil eleitores mapeados
            </li>
            <li className="flex items-center gap-2.5">
              <LineChart /> Intenção de voto em tempo real
            </li>
            <li className="flex items-center gap-2.5">
              <ShieldCheck /> CRM WhatsApp e lideranças
            </li>
          </ul>
        </div>
        <p className="relative text-xs text-muted-foreground">
          © 2026 VotoGeral 360 — Demonstração com dados fictícios.
        </p>
      </div>

      <div className="flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm"
        >
          <div className="mb-6 flex items-center gap-2.5 lg:hidden">
            <div className="flex size-9 items-center justify-center rounded-xl brand-gradient text-white">
              <Building2 className="size-5" />
            </div>
            <span className="font-semibold">VotoGeral 360</span>
          </div>

          {!mfaOpen ? (
            <Tabs value={tab} onValueChange={setTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Entrar</TabsTrigger>
                <TabsTrigger value="registro">Criar conta</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form
                  onSubmit={loginForm.handleSubmit(onLogin)}
                  className="space-y-4"
                >
                  <Field
                    label="E-mail"
                    icon={<Mail className="size-4" />}
                    error={loginForm.formState.errors.email?.message}
                  >
                    <Input
                      {...loginForm.register('email')}
                      placeholder="voce@campanha.com"
                    />
                  </Field>
                  <Field
                    label="Senha"
                    icon={<Lock className="size-4" />}
                    error={loginForm.formState.errors.senha?.message}
                  >
                    <Input
                      type="password"
                      {...loginForm.register('senha')}
                      placeholder="••••••••"
                    />
                  </Field>
                  <button
                    type="button"
                    onClick={() => setTab('esqueci')}
                    className="text-xs text-brand hover:underline"
                  >
                    Esqueci minha senha
                  </button>
                  <Button type="submit" className="w-full">
                    Entrar <ArrowRight />
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="registro">
                <form
                  onSubmit={registroForm.handleSubmit(onRegistro)}
                  className="space-y-4"
                >
                  <Field
                    label="Nome completo"
                    icon={<User className="size-4" />}
                    error={registroForm.formState.errors.nome?.message}
                  >
                    <Input {...registroForm.register('nome')} placeholder="Maria Silva" />
                  </Field>
                  <Field
                    label="E-mail"
                    icon={<Mail className="size-4" />}
                    error={registroForm.formState.errors.email?.message}
                  >
                    <Input {...registroForm.register('email')} placeholder="voce@campanha.com" />
                  </Field>
                  <Field
                    label="Senha"
                    icon={<Lock className="size-4" />}
                    error={registroForm.formState.errors.senha?.message}
                  >
                    <Input type="password" {...registroForm.register('senha')} placeholder="••••••••" />
                  </Field>
                  <Field
                    label="Confirmar senha"
                    icon={<Lock className="size-4" />}
                    error={registroForm.formState.errors.confirmar?.message}
                  >
                    <Input type="password" {...registroForm.register('confirmar')} placeholder="••••••••" />
                  </Field>
                  <Button type="submit" className="w-full">
                    Criar conta <ArrowRight />
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="esqueci">
                <RecuperarSenha onBack={() => setTab('login')} />
              </TabsContent>
            </Tabs>
          ) : (
            <div className="space-y-5">
              <div className="flex flex-col items-center gap-2 text-center">
                <div className="flex size-12 items-center justify-center rounded-xl bg-brand/15 text-brand">
                  <ShieldCheck className="size-6" />
                </div>
                <h2 className="text-lg font-semibold">Verificação em duas etapas</h2>
                <p className="text-sm text-muted-foreground">
                  Digite o código de 6 dígitos enviado para {pendingEmail}.
                </p>
              </div>
              <div className="flex justify-center gap-2">
                {mfa.map((d, i) => (
                  <input
                    key={i}
                    id={`mfa-${i}`}
                    value={d}
                    onChange={(e) => onMfaChange(i, e.target.value)}
                    inputMode="numeric"
                    className="h-12 w-11 rounded-lg border border-border bg-card text-center text-lg font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                ))}
              </div>
              <Button className="w-full" onClick={submitMfa}>
                Verificar e entrar <ArrowRight />
              </Button>
              <button
                onClick={() => setMfaOpen(false)}
                className="w-full text-center text-xs text-muted-foreground hover:underline"
              >
                Voltar
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

function Field({
  label,
  icon,
  error,
  children,
}: {
  label: string
  icon?: React.ReactNode
  error?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {icon}
          </span>
        )}
        <div className={icon ? '[&_input]:pl-9' : ''}>{children}</div>
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}

function RecuperarSenha({ onBack }: { onBack: () => void }) {
  const [email, setEmail] = useState('')
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        toast.success('Link enviado!', {
          description: `Enviamos instruções para ${email || 'seu e-mail'}.`,
        })
        onBack()
      }}
      className="space-y-4"
    >
      <Field label="E-mail da conta" icon={<Mail className="size-4" />}>
        <Input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="voce@campanha.com"
        />
      </Field>
      <Button type="submit" className="w-full">
        Enviar link de recuperação <ArrowRight />
      </Button>
      <button
        type="button"
        onClick={onBack}
        className="w-full text-center text-xs text-muted-foreground hover:underline"
      >
        Voltar ao login
      </button>
    </form>
  )
}

function UsersCheck() {
  return <User className="size-4 text-brand" />
}
