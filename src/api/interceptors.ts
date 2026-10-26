import axios from 'axios'
import type { AxiosError, InternalAxiosRequestConfig } from 'axios'

import { env } from '@/config/env'
import { API_ENDPOINTS } from './endpoints'
import { apiClient } from './client'
import { useAuthStore } from '@/store/slices/auth.store'
import { unwrap } from './helpers'
import type { AuthSession } from '@/types/auth'

type RetriableConfig = InternalAxiosRequestConfig & { _retried?: boolean }

const AUTH_URLS: string[] = [
  API_ENDPOINTS.auth.login,
  API_ENDPOINTS.auth.register,
  API_ENDPOINTS.auth.refresh,
  API_ENDPOINTS.auth.logout,
]

let refreshing: Promise<string> | null = null

/** Pide un nuevo access token con la cookie de refresh. Una sola petición aunque fallen varias a la vez. */
export function refreshAccessToken(): Promise<string> {
  if (!refreshing) {
    refreshing = axios
      .post(
        `${env.apiUrl}${API_ENDPOINTS.auth.refresh}`,
        {},
        { withCredentials: true, timeout: 10000 }
      )
      .then((res) => {
        // Sin sesión activa el backend responde 200 con `data: null` (evita un 401 ruidoso al abrir la app).
        const session = unwrap<AuthSession | null>(res.data)
        if (!session) throw new Error('NO_SESSION')
        useAuthStore.getState().setSession(session.token, session.user)
        return session.token
      })
      .finally(() => {
        refreshing = null
      })
  }
  return refreshing
}

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as RetriableConfig | undefined
    const isAuthCall = AUTH_URLS.some((u) => original?.url?.endsWith(u))

    if (error.response?.status === 401 && original && !original._retried && !isAuthCall) {
      original._retried = true
      try {
        const token = await refreshAccessToken()
        original.headers.Authorization = `Bearer ${token}`
        return apiClient(original)
      } catch {
        // Sin sesión válida: ProtectedRoute redirige al login conservando la ruta de origen.
        useAuthStore.getState().clear()
      }
    }
    return Promise.reject(error)
  }
)
