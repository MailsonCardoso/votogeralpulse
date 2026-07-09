import { createFileRoute, redirect } from '@tanstack/react-router'
import { useSession } from '~/stores/session'

export const Route = createFileRoute('/')({
  beforeLoad: () => {
    const authed = useSession.getState().isAuthenticated
    throw redirect({ to: authed ? '/dashboard' : '/auth' })
  },
  component: () => null,
})
