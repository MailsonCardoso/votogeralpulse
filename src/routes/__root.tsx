import {
  Outlet,
  createRootRoute,
  HeadContent,
} from '@tanstack/react-router'
import { Toaster } from 'sonner'
import { useApplyTheme } from '~/stores/theme'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'VotoGeral 360 — CRM de Prospecção Eleitoral' },
      {
        name: 'description',
        content:
          'Plataforma SaaS de prospecção eleitoral: eleitores, lideranças, cabos, pesquisas e CRM de campanha.',
      },
    ],
  }),
  component: RootComponent,
})

function RootComponent() {
  useApplyTheme()
  return (
    <>
      <HeadContent />
      <Outlet />
      <Toaster richColors position="bottom-right" theme="system" />
    </>
  )
}
