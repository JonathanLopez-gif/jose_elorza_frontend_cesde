import axios from 'axios'
import type { ApiResponse } from '@/types/api'
import { es } from '@/i18n/es'

/** El backend envuelve las respuestas en `{ success, message, data }`; aquí se desempaqueta. */
export function unwrap<T>(body: ApiResponse<T> | T): T {
  if (body && typeof body === 'object' && 'success' in body && 'data' in body) {
    return (body as ApiResponse<T>).data
  }
  return body as T
}

export class ApiError extends Error {
  status?: number
  code?: string
  constructor(message: string, status?: number, code?: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
  }
}

/** Convierte cualquier error de Axios en un mensaje en español listo para mostrar. */
export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as Partial<ApiResponse<unknown>> | undefined
    if (data?.message) return data.message
    if (!error.response) return es.errors.network
  }
  if (error instanceof Error && error.message) return error.message
  return es.errors.generic
}

export function getErrorCode(error: unknown): string | undefined {
  if (axios.isAxiosError(error)) {
    return (error.response?.data as Partial<ApiResponse<unknown>> | undefined)?.code
  }
  return undefined
}

export function getErrorStatus(error: unknown): number | undefined {
  return axios.isAxiosError(error) ? error.response?.status : undefined
}
