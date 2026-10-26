export type UserRole = 'USER' | 'ADMIN'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  phone?: string | null
  timezone: string
  emailNotifications: boolean
  active: boolean
  createdAt: string
}

export interface AuthSession {
  token: string
  user: User
}

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  name: string
  email: string
  password: string
  timezone: string
  acceptedTerms: boolean
}

export interface UpdateProfilePayload {
  name: string
  phone?: string | null
  timezone: string
  emailNotifications: boolean
}

export interface ForgotPasswordResult {
  /** Solo el mock lo devuelve, para poder probar el flujo sin correo real. */
  devResetLink?: string
}
