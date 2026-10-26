import { logout as logoutRequest } from '@/api/auth'
import { refreshAccessToken } from '@/api/interceptors'
import { useAuthStore } from '@/store/slices/auth.store'
import type { AuthSession } from '@/types/auth'

/** Al abrir la app intenta recuperar la sesión con la cookie de refresh. */
export async function restoreSession(): Promise<void> {
  try {
    await refreshAccessToken()
  } catch {
    useAuthStore.getState().clear()
  }
}

export function startSession(session: AuthSession) {
  useAuthStore.getState().setSession(session.token, session.user)
}

export async function endSession() {
  try {
    await logoutRequest()
  } catch {
    /* aunque falle la red, la sesión local se cierra */
  }
  useAuthStore.getState().clear()
}
