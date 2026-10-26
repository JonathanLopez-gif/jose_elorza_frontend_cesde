import { delay, http } from 'msw'
import dayjs from 'dayjs'

import type { Appointment } from '@/types/appointment'
import { HOLD_MINUTES, getPenaltyInfo } from '@/utils/policy'
import { computeSlots, expireHolds, isSlotBookable } from '../availability'
import { db, nextId, save } from '../db'
import { API, fail, guard, inRange, ok } from './common'

function paymentFor(appointmentId: string) {
  return db.payments.find(
    (p) => p.appointmentId === appointmentId && (p.status === 'APPROVED' || p.status === 'REFUNDED')
  )
}

/** Aplica penalización y deja registrado cuánto se debe devolver (la devolución es manual). */
function settleCancellation(appointment: Appointment, applyPolicy: boolean) {
  const payment = paymentFor(appointment.id)
  if (!payment || payment.status !== 'APPROVED') return
  if (applyPolicy) {
    const info = getPenaltyInfo(appointment.startUtc, payment)
    appointment.penaltyApplied = info.applies
    payment.refundDue = info.refund
  } else {
    payment.refundDue = payment.amount
  }
}

export const appointmentHandlers = [
  http.get(`${API}/appointments/availability/month`, async ({ request }) => {
    await delay(300)
    const url = new URL(request.url)
    const serviceId = url.searchParams.get('serviceId') ?? ''
    const month = url.searchParams.get('month') ?? ''
    const timezone = url.searchParams.get('timezone') || 'UTC'
    const service = db.services.find((s) => s.id === serviceId && s.status === 'ACTIVE')
    if (!service) return fail(404, 'Servicio no encontrado')
    if (!/^\d{4}-\d{2}$/.test(month)) return fail(400, 'El mes es obligatorio (AAAA-MM).')
    const daysInMonth = dayjs(`${month}-01`).daysInMonth()
    const days = Array.from({ length: daysInMonth }, (_, i) => {
      const date = `${month}-${String(i + 1).padStart(2, '0')}`
      const slots = computeSlots(service, date, timezone)
      return { date, total: slots.length, available: slots.filter((s) => s.available).length }
    })
    return ok({ serviceId, month, timezone, days })
  }),

  http.get(`${API}/appointments/availability`, async ({ request }) => {
    await delay(350)
    const url = new URL(request.url)
    const serviceId = url.searchParams.get('serviceId') ?? ''
    const date = url.searchParams.get('date') ?? ''
    const timezone = url.searchParams.get('timezone') || 'UTC'
    const service = db.services.find((s) => s.id === serviceId && s.status === 'ACTIVE')
    if (!service) return fail(404, 'Servicio no encontrado')
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return fail(400, 'La fecha es obligatoria (AAAA-MM-DD).')
    return ok({ serviceId, date, timezone, slots: computeSlots(service, date, timezone) })
  }),

  http.post(`${API}/appointments`, async ({ request }) => {
    await delay(400)
    const g = guard(request)
    if (g.response) return g.response
    const { serviceId, startUtc, timezone } = (await request.json()) as {
      serviceId: string
      startUtc: string
      timezone: string
    }
    const service = db.services.find((s) => s.id === serviceId && s.status === 'ACTIVE')
    if (!service) return fail(404, 'Servicio no encontrado')
    if (!isSlotBookable(service, startUtc, timezone)) {
      return fail(409, 'Ese horario acaba de ser ocupado. Elige otro.', 'SLOT_UNAVAILABLE')
    }
    const start = dayjs(startUtc).utc()
    const appointment: Appointment = {
      id: nextId('apt'),
      serviceId: service.id,
      serviceName: service.name,
      userId: g.user.id,
      userName: g.user.name,
      userEmail: g.user.email,
      startUtc: start.toISOString(),
      endUtc: start.add(service.durationMinutes, 'minute').toISOString(),
      timezone,
      status: 'PENDING_PAYMENT',
      priceCop: service.priceCop,
      priceUsd: service.priceUsd,
      videoUrl: null,
      holdExpiresAt: dayjs().add(HOLD_MINUTES, 'minute').toISOString(),
      createdAt: new Date().toISOString(),
    }
    db.appointments.push(appointment)
    save()
    return ok(appointment, 'Horario reservado mientras completas el pago', 201)
  }),

  http.get(`${API}/appointments/my-appointments`, async ({ request }) => {
    await delay(300)
    const g = guard(request)
    if (g.response) return g.response
    expireHolds()
    const list = db.appointments
      .filter((a) => a.userId === g.user.id)
      .sort((a, b) => b.startUtc.localeCompare(a.startUtc))
    return ok(list)
  }),

  http.get(`${API}/appointments/:id`, async ({ params, request }) => {
    await delay(200)
    const g = guard(request)
    if (g.response) return g.response
    expireHolds()
    const a = db.appointments.find((x) => x.id === params.id)
    if (!a || (a.userId !== g.user.id && g.user.role !== 'ADMIN'))
      return fail(404, 'Cita no encontrada')
    return ok(a)
  }),

  http.post(`${API}/appointments/:id/cancel`, async ({ params, request }) => {
    await delay(400)
    const g = guard(request)
    if (g.response) return g.response
    expireHolds()
    const a = db.appointments.find((x) => x.id === params.id && x.userId === g.user.id)
    if (!a) return fail(404, 'Cita no encontrada')
    if (a.status !== 'CONFIRMED' && a.status !== 'PENDING_PAYMENT') {
      return fail(409, 'Esta cita ya no se puede cancelar.', 'INVALID_STATE')
    }
    if (a.status === 'CONFIRMED') settleCancellation(a, true)
    a.status = 'CANCELLED'
    a.holdExpiresAt = null
    a.cancelledAt = new Date().toISOString()
    for (const p of db.payments)
      if (p.appointmentId === a.id && p.status === 'PENDING') p.status = 'DECLINED'
    save()
    return ok(a, 'Cita cancelada')
  }),

  http.post(`${API}/appointments/:id/reschedule`, async ({ params, request }) => {
    await delay(450)
    const g = guard(request)
    if (g.response) return g.response
    const old = db.appointments.find((x) => x.id === params.id && x.userId === g.user.id)
    if (!old) return fail(404, 'Cita no encontrada')
    if (old.status !== 'CONFIRMED')
      return fail(409, 'Solo se pueden reagendar citas confirmadas.', 'INVALID_STATE')
    const { startUtc, timezone } = (await request.json()) as { startUtc: string; timezone: string }
    const service = db.services.find((s) => s.id === old.serviceId)
    if (!service) return fail(404, 'Servicio no encontrado')
    if (!isSlotBookable(service, startUtc, timezone, old.id)) {
      return fail(409, 'Ese horario acaba de ser ocupado. Elige otro.', 'SLOT_UNAVAILABLE')
    }
    const payment = paymentFor(old.id)
    const info = getPenaltyInfo(old.startUtc, payment)
    const start = dayjs(startUtc).utc()
    const next: Appointment = {
      ...old,
      id: nextId('apt'),
      startUtc: start.toISOString(),
      endUtc: start.add(service.durationMinutes, 'minute').toISOString(),
      timezone,
      status: 'CONFIRMED',
      rescheduledFromId: old.id,
      penaltyApplied: info.applies,
      createdAt: new Date().toISOString(),
    }
    old.status = 'RESCHEDULED'
    if (payment) payment.appointmentId = next.id
    db.appointments.push(next)
    save()
    return ok(next, 'Cita reagendada')
  }),

  /* ---------- Administración ---------- */

  http.get(`${API}/admin/appointments`, async ({ request }) => {
    await delay(300)
    const g = guard(request, { admin: true })
    if (g.response) return g.response
    expireHolds()
    const url = new URL(request.url)
    const status = url.searchParams.get('status')
    const serviceId = url.searchParams.get('serviceId')
    const from = url.searchParams.get('from')
    const to = url.searchParams.get('to')
    const search = url.searchParams.get('search')?.toLowerCase()
    const list = db.appointments
      .filter((a) => !status || a.status === status)
      .filter((a) => !serviceId || a.serviceId === serviceId)
      .filter((a) => inRange(a.startUtc, from, to))
      .filter(
        (a) =>
          !search ||
          `${a.userName} ${a.userEmail} ${a.serviceName} ${a.id}`.toLowerCase().includes(search)
      )
      .sort((a, b) => b.startUtc.localeCompare(a.startUtc))
    return ok(list)
  }),

  http.patch(`${API}/admin/appointments/:id`, async ({ params, request }) => {
    await delay(300)
    const g = guard(request, { admin: true })
    if (g.response) return g.response
    const a = db.appointments.find((x) => x.id === params.id)
    if (!a) return fail(404, 'Cita no encontrada')
    const patch = (await request.json()) as {
      status?: Appointment['status']
      videoUrl?: string | null
    }
    if (patch.videoUrl !== undefined) {
      if (patch.videoUrl && !/^https?:\/\/\S+$/i.test(patch.videoUrl))
        return fail(400, 'El enlace debe empezar por http:// o https://')
      a.videoUrl = patch.videoUrl || null
    }
    if (patch.status) {
      if (patch.status !== 'COMPLETED' && patch.status !== 'NO_SHOW')
        return fail(400, 'Estado no permitido.')
      if (a.status !== 'CONFIRMED')
        return fail(409, 'Solo las citas confirmadas se pueden marcar.', 'INVALID_STATE')
      a.status = patch.status
    }
    save()
    return ok(a, 'Cita actualizada')
  }),

  http.post(`${API}/admin/appointments/:id/cancel`, async ({ params, request }) => {
    await delay(350)
    const g = guard(request, { admin: true })
    if (g.response) return g.response
    const a = db.appointments.find((x) => x.id === params.id)
    if (!a) return fail(404, 'Cita no encontrada')
    if (a.status !== 'CONFIRMED' && a.status !== 'PENDING_PAYMENT')
      return fail(409, 'Esta cita ya no se puede cancelar.', 'INVALID_STATE')
    if (a.status === 'CONFIRMED') settleCancellation(a, false) // cancela el administrador: sin penalización
    a.status = 'CANCELLED'
    a.cancelledAt = new Date().toISOString()
    save()
    return ok(a, 'Cita cancelada')
  }),

  http.post(`${API}/admin/appointments/:id/reschedule`, async ({ params, request }) => {
    await delay(400)
    const g = guard(request, { admin: true })
    if (g.response) return g.response
    const old = db.appointments.find((x) => x.id === params.id)
    if (!old) return fail(404, 'Cita no encontrada')
    if (old.status !== 'CONFIRMED')
      return fail(409, 'Solo se pueden reagendar citas confirmadas.', 'INVALID_STATE')
    const { startUtc, timezone } = (await request.json()) as { startUtc: string; timezone: string }
    const service = db.services.find((s) => s.id === old.serviceId)
    if (!service) return fail(404, 'Servicio no encontrado')
    if (!isSlotBookable(service, startUtc, timezone, old.id)) {
      return fail(409, 'Ese horario no está disponible.', 'SLOT_UNAVAILABLE')
    }
    const start = dayjs(startUtc).utc()
    const next: Appointment = {
      ...old,
      id: nextId('apt'),
      startUtc: start.toISOString(),
      endUtc: start.add(service.durationMinutes, 'minute').toISOString(),
      status: 'CONFIRMED',
      rescheduledFromId: old.id,
      penaltyApplied: false,
      createdAt: new Date().toISOString(),
    }
    old.status = 'RESCHEDULED'
    const payment = paymentFor(old.id)
    if (payment) payment.appointmentId = next.id
    db.appointments.push(next)
    save()
    return ok(next, 'Cita reagendada sin penalización')
  }),
]
