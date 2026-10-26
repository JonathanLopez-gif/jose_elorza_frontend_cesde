import { apiClient } from '@/api/client'
import { API_ENDPOINTS } from '@/api/endpoints'
import { unwrap } from '@/api/helpers'
import type {
  AuthSession,
  ForgotPasswordResult,
  LoginPayload,
  RegisterPayload,
  UpdateProfilePayload,
  User,
} from '@/types/auth'

export async function login(payload: LoginPayload): Promise<AuthSession> {
  const { data } = await apiClient.post(API_ENDPOINTS.auth.login, payload)
  return unwrap<AuthSession>(data)
}

export async function register(payload: RegisterPayload): Promise<AuthSession> {
  const { data } = await apiClient.post(API_ENDPOINTS.auth.register, payload)
  return unwrap<AuthSession>(data)
}

export async function logout(): Promise<void> {
  await apiClient.post(API_ENDPOINTS.auth.logout)
}

export async function forgotPassword(email: string): Promise<ForgotPasswordResult> {
  const { data } = await apiClient.post(API_ENDPOINTS.auth.forgotPassword, { email })
  return unwrap<ForgotPasswordResult>(data) ?? {}
}

export async function resetPassword(payload: { token: string; password: string }): Promise<void> {
  await apiClient.post(API_ENDPOINTS.auth.resetPassword, payload)
}

export async function updateProfile(payload: UpdateProfilePayload): Promise<User> {
  const { data } = await apiClient.put(API_ENDPOINTS.users.me, payload)
  return unwrap<User>(data)
}
