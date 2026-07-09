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
import { useSession } from '~/stores/session'
import './auth.css'

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
    <div className="auth-page grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between overflow-hidden p-10 lg:flex">
        <div className="relative flex items-center gap-2.5">
          <div className="flex size-10 items-center justify-center rounded-xl" style={{ background: 'var(--button-gradient)', color: '#fff' }}>
            <Building2 className="size-5" />
          </div>
          <span className="text-lg font-semibold">VotoGeral 360</span>
        </div>
        <div className="relative space-y-6">
          <h1 className="max-w-md text-3xl font-semibold leading-tight tracking-tight">
            Prospecção eleitoral inteligente para campanhas que vencem.
          </h1>
          <ul className="space-y-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
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
        <p className="relative text-xs" style={{ color: 'var(--text-muted)' }}>
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
            <div className="flex size-9 items-center justify-center rounded-xl" style={{ background: 'var(--button-gradient)', color: '#fff' }}>
              <Building2 className="size-5" />
            </div>
            <span className="font-semibold">VotoGeral 360</span>
          </div>

          {!mfaOpen ? (
            <>
              {/* Abas customizadas */}
              <div className="login-card p-6">
                <div className="mb-6 flex rounded-xl p-1" style={{ background: '#1A1E2D' }}>
                  <button
                    onClick={() => setTab('login')}
                    className={`tab flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${tab === 'login' ? 'active' : ''}`}
                  >
                    Entrar
                  </button>
                  <button
                    onClick={() => setTab('registro')}
                    className={`tab flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${tab === 'registro' ? 'active' : ''}`}
                  >
                    Criar conta
                  </button>
                </div>

                {tab === 'login' && (
                  <form
                    onSubmit={loginForm.handleSubmit(onLogin)}
                    className="space-y-4"
                  >
                    <Field
                      label="E-mail"
                      error={loginForm.formState.errors.email?.message}
                    >
                      <input
                        {...loginForm.register('email')}
                        placeholder="voce@campanha.com"
                        className="w-full px-4 py-2.5 text-sm outline-none"
                      />
                    </Field>
                    <Field
                      label="Senha"
                      error={loginForm.formState.errors.senha?.message}
                    >
                      <input
                        type="password"
                        {...loginForm.register('senha')}
                        placeholder="••••••••"
                        className="w-full px-4 py-2.5 text-sm outline-none"
                      />
                    </Field>
                    <button
                      type="button"
                      onClick={() => setTab('esqueci')}
                      className="text-xs hover:underline"
                      style={{ color: 'var(--primary)' }}
                    >
                      Esqueci minha senha
                    </button>
                    <button type="submit" className="btn-primary w-full px-4 py-2.5 text-sm font-semibold">
                      Entrar <ArrowRight className="inline size-4" />
                    </button>
                  </form>
                )}

                {tab === 'registro' && (
                  <form
                    onSubmit={registroForm.handleSubmit(onRegistro)}
                    className="space-y-4"
                  >
                    <Field
                      label="Nome completo"
                      error={registroForm.formState.errors.nome?.message}
                    >
                      <input {...registroForm.register('nome')} placeholder="Maria Silva" className="w-full px-4 py-2.5 text-sm outline-none" />
                    </Field>
                    <Field
                      label="E-mail"
                      error={registroForm.formState.errors.email?.message}
                    >
                      <input {...registroForm.register('email')} placeholder="voce@campanha.com" className="w-full px-4 py-2.5 text-sm outline-none" />
                    </Field>
                    <Field
                      label="Senha"
                      error={registroForm.formState.errors.senha?.message}
                    >
                      <input type="password" {...registroForm.register('senha')} placeholder="••••••••" className="w-full px-4 py-2.5 text-sm outline-none" />
                    </Field>
                    <Field
                      label="Confirmar senha"
                      error={registroForm.formState.errors.confirmar?.message}
                    >
                      <input type="password" {...registroForm.register('confirmar')} placeholder="••••••••" className="w-full px-4 py-2.5 text-sm outline-none" />
                    </Field>
                    <button type="submit" className="btn-primary w-full px-4 py-2.5 text-sm font-semibold">
                      Criar conta <ArrowRight className="inline size-4" />
                    </button>
                  </form>
                )}

                {tab === 'esqueci' && (
                  <RecuperarSenha onBack={() => setTab('login')} />
                )}
              </div>
            </>
          ) : (
            <div className="login-card space-y-5 p-6">
              <div className="flex flex-col items-center gap-2 text-center">
                <div className="flex size-12 items-center justify-center rounded-xl" style={{ background: 'rgba(124,92,255,.15)', color: 'var(--primary)' }}>
                  <ShieldCheck className="size-6" />
                </div>
                <h2 className="text-lg font-semibold">Verificação em duas etapas</h2>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
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
                    className="h-12 w-11 rounded-lg text-center text-lg font-semibold outline-none"
                  />
                ))}
              </div>
              <button className="btn-primary w-full px-4 py-2.5 text-sm font-semibold" onClick={submitMfa}>
                Verificar e entrar <ArrowRight className="inline size-4" />
              </button>
              <button
                onClick={() => setMfaOpen(false)}
                className="w-full text-center text-xs hover:underline"
                style={{ color: 'var(--text-muted)' }}
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
      <label className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{label}</label>
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }}>
            {icon}
          </span>
        )}
        <div className={icon ? '[&_input]:pl-9' : ''}>{children}</div>
      </div>
      {error && <p className="text-xs" style={{ color: 'var(--secondary)' }}>{error}</p>}
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
      <Field label="E-mail da conta">
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="voce@campanha.com"
          className="w-full px-4 py-2.5 text-sm outline-none"
        />
      </Field>
      <button type="submit" className="btn-primary w-full px-4 py-2.5 text-sm font-semibold">
        Enviar link de recuperação <ArrowRight className="inline size-4" />
      </button>
      <button
        type="button"
        onClick={onBack}
        className="w-full text-center text-xs hover:underline"
        style={{ color: 'var(--text-muted)' }}
      >
        Voltar ao login
      </button>
    </form>
  )
}

function UsersCheck() {
  return <User className="size-4" style={{ color: 'var(--primary)' }} />
}