import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

import { APP_ROUTES } from '@/constants/routes'
import { endSession } from '@/features/auth/session'

/** Cierra la sesión (revoca el refresh token) y vuelve al inicio. */
export function useLogout() {
  const navigate = useNavigate()
  return async () => {
    await endSession()
    toast.success('Sesión cerrada.')
    navigate(APP_ROUTES.home)
  }
}
