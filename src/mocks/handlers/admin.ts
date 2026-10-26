import { delay, http } from 'msw'
import dayjs from 'dayjs'

import type { AdminUser } from '@/types/admin'
import { expireHolds } from '../availability'
import { BUSINESS_TZ, db, save } from '../db'
import { API, fail, guard, ok } from './common'

function toAdminUser(u: (typeof db.users)[number]): AdminUser {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    phone: u.phone,
    timezone: u.timezone,
    active: u.active,
    createdAt: u.createdAt,
    appointmentsCount: db.appointments.filter((a) => a.userId === u.id).length,
  }
}

export const adminHandlers = [
  http.get(`${API}/admin/dashboard`, async ({ request }) => {
    await delay(400)
    const g = guard(request, { admin: true })
    if (g.response) return g.response
    expireHolds()
    const now = dayjs().tz(BUSINESS_TZ)
    const today = now.format('YYYY-MM-DD')
    const month = now.format('YYYY-MM')
    const onDay = (iso: string) => dayjs(iso).tz(BUSINESS_TZ).format('YYYY-MM-DD')
    const real = db.appointments.filter(
      (a) =>
        a.status !== 'CANCELLED' && a.status !== 'PENDING_PAYMENT' && a.status !== 'RESCHEDULED'
    )
    const paid = db.payments.filter((p) => p.status === 'APPROVED' && p.paidAt)

    const monthly = Array.from({ length: 6 }, (_, i) => {
      const m = now.subtract(5 - i, 'month')
      const key = m.format('YYYY-MM')
      const inMonth = paid.filter((p) => dayjs(p.paidAt!).tz(BUSINESS_TZ).format('YYYY-MM') === key)
      return {
        month: m.locale('es').format('MMM YY'),
        incomeCop: inMonth.filter((p) => p.currency === 'COP').reduce((s, p) => s + p.amount, 0),
        incomeUsd: inMonth.filter((p) => p.currency === 'USD').reduce((s, p) => s + p.amount, 0),
        appointments: real.filter(
          (a) => dayjs(a.startUtc).tz(BUSINESS_TZ).format('YYYY-MM') === key
        ).length,
      }
    })
    const inThisMonth = paid.filter(
      (p) => dayjs(p.paidAt!).tz(BUSINESS_TZ).format('YYYY-MM') === month
    )
    const statusCount = new Map<string, number>()
    db.appointments.forEach((a) => statusCount.set(a.status, (statusCount.get(a.status) ?? 0) + 1))

    return ok({
      appointmentsToday: real.filter((a) => onDay(a.startUtc) === today).length,
      appointmentsMonth: real.filter(
        (a) => dayjs(a.startUtc).tz(BUSINESS_TZ).format('YYYY-MM') === month
      ).length,
      incomeMonthCop: inThisMonth
        .filter((p) => p.currency === 'COP')
        .reduce((s, p) => s + p.amount, 0),
      incomeMonthUsd: inThisMonth
        .filter((p) => p.currency === 'USD')
        .reduce((s, p) => s + p.amount, 0),
      pendingPayments: db.appointments.filter((a) => a.status === 'PENDING_PAYMENT').length,
      totalUsers: db.users.filter((u) => u.role === 'USER').length,
      monthly,
      byStatus: [...statusCount].map(([status, count]) => ({ status, count })),
      upcoming: db.appointments
        .filter((a) => a.status === 'CONFIRMED' && new Date(a.startUtc).getTime() > Date.now())
        .sort((a, b) => a.startUtc.localeCompare(b.startUtc))
        .slice(0, 6),
    })
  }),

  http.get(`${API}/admin/users`, async ({ request }) => {
    await delay(300)
    const g = guard(request, { admin: true })
    if (g.response) return g.response
    const url = new URL(request.url)
    const search = url.searchParams.get('search')?.toLowerCase()
    const active = url.searchParams.get('active')
    const page = Math.max(1, Number(url.searchParams.get('page')) || 1)
    const pageSize = Math.min(50, Math.max(1, Number(url.searchParams.get('pageSize')) || 10))
    const filtered = db.users
      .filter((u) => !search || `${u.name} ${u.email}`.toLowerCase().includes(search))
      .filter((u) => active === null || active === '' || String(u.active) === active)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    return ok({
      items: filtered.slice((page - 1) * pageSize, page * pageSize).map(toAdminUser),
      total: filtered.length,
      page,
      pageSize,
    })
  }),

  http.patch(`${API}/admin/users/:id/status`, async ({ params, request }) => {
    await delay(300)
    const g = guard(request, { admin: true })
    if (g.response) return g.response
    const user = db.users.find((u) => u.id === params.id)
    if (!user) return fail(404, 'Usuario no encontrado')
    if (user.id === g.user.id) return fail(400, 'No puedes desactivar tu propia cuenta.')
    const { active } = (await request.json()) as { active: boolean }
    user.active = Boolean(active)
    save()
    return ok(toAdminUser(user), user.active ? 'Usuario activado' : 'Usuario desactivado')
  }),

  http.get(`${API}/admin/google-calendar/status`, async ({ request }) => {
    await delay(200)
    const g = guard(request, { admin: true })
    if (g.response) return g.response
    return ok(db.google)
  }),

  http.get(`${API}/admin/google-calendar/auth-url`, async ({ request }) => {
    await delay(200)
    const g = guard(request, { admin: true })
    if (g.response) return g.response
    // El mock "autoriza" de inmediato; el backend real devolverá la URL de consentimiento de Google.
    db.google = {
      status: 'CONNECTED',
      email: 'agenda@joseelorza.com',
      connectedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 24 * 3600_000).toISOString(),
      message: 'Sincronización simulada activa.',
    }
    save()
    return ok({ url: `${window.location.origin}/admin/google-calendar?google_calendar=success` })
  }),

  http.post(`${API}/admin/google-calendar/disconnect`, async ({ request }) => {
    await delay(200)
    const g = guard(request, { admin: true })
    if (g.response) return g.response
    db.google = {
      status: 'DISCONNECTED',
      email: null,
      connectedAt: null,
      expiresAt: null,
      message: 'Integración desconectada.',
    }
    save()
    return ok(null, 'Desconectado')
  }),
]
