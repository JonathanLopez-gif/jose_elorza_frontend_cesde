import { HttpResponse } from 'msw'
import dayjs from 'dayjs'

import { db } from '../db'
import type { MockUser } from '../db'

export const API = '*/api'

export function ok<T>(data: T, message = 'OK', status = 200) {
  return HttpResponse.json({ success: true, message, data }, { status })
}

export function fail(status: number, message: string, code?: string) {
  return HttpResponse.json({ success: false, message, code, data: null }, { status })
}

/* El access token simulado dura 15 minutos, como el real; así se ejercita el refresco automático. */
export const ACCESS_TTL_MS = 15 * 60 * 1000

export function signToken(userId: string): string {
  return `mock.${userId}.${Date.now() + ACCESS_TTL_MS}`
}

export function toPublicUser(u: MockUser) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...rest } = u
  return rest
}

export function userFromRequest(request: Request): MockUser | null {
  const header = request.headers.get('authorization')
  if (!header?.startsWith('Bearer ')) return null
  const [prefix, userId, exp] = header.slice(7).split('.')
  if (prefix !== 'mock' || !userId || Number(exp) < Date.now()) return null
  const user = db.users.find((u) => u.id === userId)
  return user && user.active ? user : null
}

type Guard = { user: MockUser; response?: undefined } | { user?: undefined; response: Response }

export function guard(request: Request, opts: { admin?: boolean } = {}): Guard {
  const user = userFromRequest(request)
  if (!user)
    return { response: fail(401, 'Sesión expirada. Inicia sesión de nuevo.', 'UNAUTHORIZED') }
  if (opts.admin && user.role !== 'ADMIN')
    return { response: fail(403, 'No tienes permisos para esta acción.', 'FORBIDDEN') }
  return { user }
}

export function getRefreshCookie(): string | null {
  const match = document.cookie.split('; ').find((c) => c.startsWith('mock_refresh='))
  return match ? decodeURIComponent(match.split('=')[1]) : null
}

export function setRefreshCookie(userId: string | null) {
  document.cookie = userId
    ? `mock_refresh=${encodeURIComponent(userId)}; path=/; max-age=${7 * 24 * 3600}; SameSite=Lax`
    : 'mock_refresh=; path=/; max-age=0'
}

export function inRange(
  iso: string,
  from?: string | null,
  to?: string | null,
  tz = 'America/Bogota'
) {
  const day = dayjs(iso).tz(tz).format('YYYY-MM-DD')
  if (from && day < from) return false
  if (to && day > to) return false
  return true
}
