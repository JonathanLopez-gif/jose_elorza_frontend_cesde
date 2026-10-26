import { create } from 'zustand'
import type { User, UserRole } from '@/types/auth'

export type { UserRole }
export type AuthStatus = 'loading' | 'authenticated' | 'anonymous'

interface AuthState {
  /** El token de acceso vive solo en memoria: nunca en localStorage. */
  accessToken: string | null
  user: User | null
  status: AuthStatus
  setSession: (token: string, user: User) => void
  setUser: (user: User) => void
  setAccessToken: (token: string) => void
  clear: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: null,
  status: 'loading',
  setSession: (token, user) => set({ accessToken: token, user, status: 'authenticated' }),
  setUser: (user) => set({ user }),
  setAccessToken: (token) => set({ accessToken: token }),
  clear: () => set({ accessToken: null, user: null, status: 'anonymous' }),
}))

export const selectIsAdmin = (s: AuthState) => s.user?.role === 'ADMIN'
