import { delay, http } from 'msw'
import dayjs from 'dayjs'

import type { Payment, PaymentGateway } from '@/types/payment'
import { splitIva } from '@/utils/timezone'
import { expireHolds } from '../availability'
import { db, nextId, save } from '../db'
import type { MockPayment } from '../db'
import { API, fail, guard, inRange, ok } from './common'

function publicPayment(p: MockPayment): Payment {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { resolveAt, ...rest } = p
  return rest
}

function approve(p: MockPayment) {
  p.status = 'APPROVED'
  p.paidAt = new Date().toISOString()
  p.resolveAt = null
  const a = db.appointments.find((x) => x.id === p.appointmentId)
  if (a?.status === 'PENDING_PAYMENT') {
    a.status = 'CONFIRMED'
    a.holdExpiresAt = null
  } else if (a) {
    // La reserva había expirado: el pago entra, pero la cita no se confirma y se debe devolver.
    p.refundDue = p.amount
  }
  save()
}

/** Simula el webhook: un pago "pendiente" se aprueba solo unos segundos después. */
function resolvePending(p: MockPayment) {
  if (p.status === 'PENDING' && p.resolveAt && new Date(p.resolveAt).getTime() <= Date.now())
    approve(p)
}

export const paymentHandlers = [
  http.post(`${API}/payments`, async ({ request }) => {
    await delay(450)
    const g = guard(request)
    if (g.response) return g.response
    expireHolds()
    const { appointmentId, gateway } = (await request.json()) as {
      appointmentId: string
      gateway: PaymentGateway
    }
    if (gateway !== 'WOMPI' && gateway !== 'GLOBAL66') return fail(400, 'Pasarela no válida.')
    const a = db.appointments.find((x) => x.id === appointmentId && x.userId === g.user.id)
    if (!a) return fail(404, 'Cita no encontrada')
    if (a.status !== 'PENDING_PAYMENT') {
      return fail(
        409,
        'La reserva expiró o ya fue pagada. Vuelve a elegir un horario.',
        'HOLD_EXPIRED'
      )
    }
    // Cada intento reemplaza a los anteriores que quedaron sin resolver.
    for (const old of db.payments)
      if (old.appointmentId === a.id && old.status === 'PENDING') old.status = 'DECLINED'
    const currency = gateway === 'WOMPI' ? 'COP' : 'USD'
    const total = currency === 'COP' ? a.priceCop : a.priceUsd
    const parts = splitIva(total, currency === 'COP' ? 0 : 2)
    const payment: MockPayment = {
      id: nextId('pay'),
      reference: `JFE-${dayjs().format('YYMM')}-${String(db.seq).padStart(4, '0')}`,
      appointmentId: a.id,
      userId: g.user.id,
      userName: g.user.name,
      serviceName: a.serviceName,
      gateway,
      currency,
      status: 'PENDING',
      amount: total,
      baseAmount: parts.base,
      ivaAmount: parts.iva,
      createdAt: new Date().toISOString(),
      paidAt: null,
    }
    db.payments.push(payment)
    save()
    return ok(
      {
        payment: publicPayment(payment),
        checkoutUrl: `${window.location.origin}/pago/checkout-simulado?paymentId=${payment.id}`,
      },
      'Pago iniciado',
      201
    )
  }),

  http.get(`${API}/payments/my-payments`, async ({ request }) => {
    await delay(300)
    const g = guard(request)
    if (g.response) return g.response
    db.payments.forEach(resolvePending)
    return ok(
      db.payments
        .filter((p) => p.userId === g.user.id)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        .map(publicPayment)
    )
  }),

  http.get(`${API}/payments/:id`, async ({ params, request }) => {
    await delay(200)
    const g = guard(request)
    if (g.response) return g.response
    const p = db.payments.find((x) => x.id === params.id)
    if (!p || (p.userId !== g.user.id && g.user.role !== 'ADMIN'))
      return fail(404, 'Pago no encontrado')
    resolvePending(p)
    return ok(publicPayment(p))
  }),

  /* Simulador de la pasarela (solo desarrollo): lo usa la página /pago/checkout-simulado. */
  http.post(`${API}/__mock/gateway/:paymentId`, async ({ params, request }) => {
    await delay(700)
    const g = guard(request)
    if (g.response) return g.response
    const p = db.payments.find((x) => x.id === params.paymentId)
    if (!p) return fail(404, 'Pago no encontrado')
    const { result } = (await request.json()) as { result: 'APPROVED' | 'DECLINED' | 'PENDING' }
    if (result === 'APPROVED') approve(p)
    else if (result === 'DECLINED') p.status = 'DECLINED'
    else p.resolveAt = new Date(Date.now() + 8000).toISOString()
    save()
    return ok(publicPayment(p))
  }),

  /* ---------- Administración ---------- */

  http.get(`${API}/admin/payments`, async ({ request }) => {
    await delay(300)
    const g = guard(request, { admin: true })
    if (g.response) return g.response
    db.payments.forEach(resolvePending)
    const url = new URL(request.url)
    const status = url.searchParams.get('status')
    const gateway = url.searchParams.get('gateway')
    const from = url.searchParams.get('from')
    const to = url.searchParams.get('to')
    const search = url.searchParams.get('search')?.toLowerCase()
    const list = db.payments
      .filter((p) => !status || p.status === status)
      .filter((p) => !gateway || p.gateway === gateway)
      .filter((p) => inRange(p.createdAt, from, to))
      .filter(
        (p) =>
          !search || `${p.userName} ${p.serviceName} ${p.reference}`.toLowerCase().includes(search)
      )
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    return ok(list.map(publicPayment))
  }),

  http.patch(`${API}/admin/payments/:id/refund`, async ({ params, request }) => {
    await delay(400)
    const g = guard(request, { admin: true })
    if (g.response) return g.response
    const p = db.payments.find((x) => x.id === params.id)
    if (!p) return fail(404, 'Pago no encontrado')
    if (p.status !== 'APPROVED')
      return fail(409, 'Solo se pueden reembolsar pagos aprobados.', 'INVALID_STATE')
    const { note } = (await request.json()) as { note?: string }
    p.status = 'REFUNDED'
    p.refundedAt = new Date().toISOString()
    p.refundNote = note?.trim() || 'Reembolso registrado manualmente'
    save()
    return ok(publicPayment(p), 'Reembolso registrado (la devolución del dinero es manual)')
  }),
]
