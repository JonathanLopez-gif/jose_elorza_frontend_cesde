import { Navigate, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'

import { useAuthStore } from '@/store/slices/auth.store'
import { APP_ROUTES } from '@/constants/routes'
import { LoadingScreen } from '@/components/common/States'
import type { UserRole } from '@/types/auth'

interface ProtectedRouteProps {
  children: ReactNode
  /** Si se indica, solo ese rol puede entrar. */
  role?: UserRole
}

/** Protege rutas privadas; sin sesión redirige al login recordando a dónde quería ir. */
export function ProtectedRoute({ children, role }: ProtectedRouteProps) {
  const location = useLocation()
  const status = useAuthStore((s) => s.status)
  const user = useAuthStore((s) => s.user)

  if (status === 'loading') return <LoadingScreen />

  if (status !== 'authenticated' || !user) {
    return (
      <Navigate
        to={APP_ROUTES.login}
        replace
        state={{ from: location.pathname + location.search }}
      />
    )
  }

  if (role && user.role !== role) {
    return <Navigate to={user.role === 'ADMIN' ? APP_ROUTES.admin.root : APP_ROUTES.home} replace />
  }

  return <>{children}</>
}

/** Evita que un usuario con sesión vea login/registro. */
export function GuestRoute({ children }: { children: ReactNode }) {
  const status = useAuthStore((s) => s.status)
  const user = useAuthStore((s) => s.user)
  const location = useLocation()
  if (status === 'loading') return <LoadingScreen />
  if (status === 'authenticated' && user) {
    const from = (location.state as { from?: string } | null)?.from
    return (
      <Navigate
        to={
          from ?? (user.role === 'ADMIN' ? APP_ROUTES.admin.root : APP_ROUTES.account.appointments)
        }
        replace
      />
    )
  }
  return <>{children}</>
}
