import { delay, http } from 'msw'

import { db, nextId, save } from '../db'
import {
  ACCESS_TTL_MS,
  API,
  fail,
  getRefreshCookie,
  guard,
  ok,
  setRefreshCookie,
  signToken,
  toPublicUser,
} from './common'

function session(userId: string) {
  const user = db.users.find((u) => u.id === userId)!
  return { token: signToken(user.id), user: toPublicUser(user) }
}

export const authHandlers = [
  http.post(`${API}/auth/login`, async ({ request }) => {
    await delay(400)
    const { email, password } = (await request.json()) as { email: string; password: string }
    const user = db.users.find((u) => u.email.toLowerCase() === String(email).toLowerCase())
    if (!user || user.password !== password)
      return fail(401, 'Correo o contraseña incorrectos.', 'INVALID_CREDENTIALS')
    if (!user.active)
      return fail(
        403,
        'Tu cuenta está desactivada. Comunícate con José Fernando.',
        'ACCOUNT_DISABLED'
      )
    setRefreshCookie(user.id)
    return ok(session(user.id), 'Sesión iniciada')
  }),

  http.post(`${API}/auth/register`, async ({ request }) => {
    await delay(500)
    const body = (await request.json()) as {
      name: string
      email: string
      password: string
      timezone: string
      acceptedTerms: boolean
    }
    if (!body.acceptedTerms)
      return fail(400, 'Debes aceptar los términos y la política de privacidad.', 'TERMS_REQUIRED')
    if (db.users.some((u) => u.email.toLowerCase() === body.email.toLowerCase())) {
      return fail(409, 'Ya existe una cuenta con ese correo.', 'EMAIL_TAKEN')
    }
    const user = {
      id: nextId('usr'),
      name: body.name.trim(),
      email: body.email.trim(),
      password: body.password,
      role: 'USER' as const,
      phone: null,
      timezone: body.timezone || 'America/Bogota',
      emailNotifications: true,
      active: true,
      createdAt: new Date().toISOString(),
    }
    db.users.push(user)
    save()
    setRefreshCookie(user.id)
    return ok(session(user.id), 'Cuenta creada', 201)
  }),

  http.post(`${API}/auth/refresh`, async () => {
    await delay(150)
    const userId = getRefreshCookie()
    const user = db.users.find((u) => u.id === userId)
    if (!user || !user.active) {
      setRefreshCookie(null)
      return ok(null, 'No hay sesión activa')
    }
    return ok(session(user.id))
  }),

  http.post(`${API}/auth/logout`, async () => {
    setRefreshCookie(null)
    return ok(null, 'Sesión cerrada')
  }),

  http.post(`${API}/auth/forgot-password`, async ({ request }) => {
    await delay(500)
    const { email } = (await request.json()) as { email: string }
    const user = db.users.find((u) => u.email.toLowerCase() === String(email).toLowerCase())
    // Respuesta idéntica exista o no el correo, para no revelar qué cuentas existen.
    if (!user) return ok({}, 'Si el correo está registrado, recibirás instrucciones.')
    const token = `rst-${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`
    db.resetTokens = db.resetTokens.filter((t) => t.userId !== user.id)
    db.resetTokens.push({
      token,
      userId: user.id,
      expiresAt: new Date(Date.now() + 30 * 60_000).toISOString(),
    })
    save()
    const devResetLink = `${window.location.origin}/restablecer?token=${token}`
    console.info('[mock] enlace de recuperación:', devResetLink)
    return ok({ devResetLink }, 'Si el correo está registrado, recibirás instrucciones.')
  }),

  http.post(`${API}/auth/reset-password`, async ({ request }) => {
    await delay(400)
    const { token, password } = (await request.json()) as { token: string; password: string }
    const entry = db.resetTokens.find((t) => t.token === token)
    if (!entry || new Date(entry.expiresAt).getTime() < Date.now()) {
      return fail(400, 'El enlace de recuperación no es válido o ya expiró.', 'INVALID_RESET_TOKEN')
    }
    const user = db.users.find((u) => u.id === entry.userId)
    if (!user) return fail(400, 'El enlace de recuperación no es válido.', 'INVALID_RESET_TOKEN')
    user.password = password
    db.resetTokens = db.resetTokens.filter((t) => t.token !== token)
    save()
    return ok(null, 'Contraseña actualizada')
  }),

  http.put(`${API}/users/me`, async ({ request }) => {
    await delay(350)
    const g = guard(request)
    if (g.response) return g.response
    const body = (await request.json()) as {
      name: string
      phone?: string | null
      timezone: string
      emailNotifications: boolean
    }
    if (!body.name || body.name.trim().length < 3)
      return fail(400, 'El nombre debe tener al menos 3 caracteres.')
    const user = db.users.find((u) => u.id === g.user.id)!
    user.name = body.name.trim()
    user.phone = body.phone?.trim() || null
    user.timezone = body.timezone
    user.emailNotifications = body.emailNotifications
    save()
    return ok(toPublicUser(user), 'Perfil actualizado')
  }),
]

export { ACCESS_TTL_MS }
