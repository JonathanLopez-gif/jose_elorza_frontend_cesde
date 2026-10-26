import { useEffect } from 'react'
import type { ReactNode } from 'react'

import { LoadingScreen } from '@/components/common/States'
import { restoreSession } from '@/features/auth/session'
import { useAuthStore } from '@/store/slices/auth.store'
import { QueryProvider } from './QueryProvider'

interface AppProvidersProps {
  children: ReactNode
}

/** Restaura la sesión (refresh token) antes de pintar rutas, para que los guards no parpadeen. */
function SessionGate({ children }: { children: ReactNode }) {
  const status = useAuthStore((s) => s.status)
  useEffect(() => {
    void restoreSession()
  }, [])
  if (status === 'loading') return <LoadingScreen />
  return <>{children}</>
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <QueryProvider>
      <SessionGate>{children}</SessionGate>
    </QueryProvider>
  )
}
