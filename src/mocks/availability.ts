import dayjs from 'dayjs'

import type { Appointment, TimeSlot } from '@/types/appointment'
import type { Service } from '@/types/service'
import { BUSINESS_TZ, db, save } from './db'

export const MIN_NOTICE_HOURS = 12
const OPEN_HOUR = 9
const CLOSE_HOUR = 19

/** Libera las reservas temporales (15 min) que no se pagaron a tiempo. */
export function expireHolds() {
  const now = Date.now()
  let changed = false
  for (const a of db.appointments) {
    if (
      a.status === 'PENDING_PAYMENT' &&
      a.holdExpiresAt &&
      new Date(a.holdExpiresAt).getTime() < now
    ) {
      a.status = 'CANCELLED'
      a.cancelledAt = new Date().toISOString()
      a.holdExpiresAt = null
      for (const p of db.payments) {
        if (p.appointmentId === a.id && p.status === 'PENDING') p.status = 'DECLINED'
      }
      changed = true
    }
  }
  if (changed) save()
}

export function blockingAppointments(excludeId?: string): Appointment[] {
  expireHolds()
  return db.appointments.filter(
    (a) => a.id !== excludeId && (a.status === 'CONFIRMED' || a.status === 'PENDING_PAYMENT')
  )
}

function overlaps(startMs: number, endMs: number, list: Appointment[]) {
  return list.some(
    (a) => startMs < new Date(a.endUtc).getTime() && endMs > new Date(a.startUtc).getTime()
  )
}

/**
 * Horario de atención: lunes a sábado, 9:00–19:00 (hora de Bogotá), con inicio cada hora.
 * La fecha pedida se interpreta en la zona del usuario, así que se revisan los días
 * contiguos y se conservan solo los cupos que caen en esa fecha local.
 */
export function computeSlots(
  service: Service,
  date: string,
  timezone: string,
  excludeId?: string
): TimeSlot[] {
  const blocking = blockingAppointments(excludeId)
  const earliest = dayjs().add(MIN_NOTICE_HOURS, 'hour').valueOf()
  const slots: TimeSlot[] = []
  for (const offset of [-1, 0, 1]) {
    const day = dayjs.tz(`${date} 12:00`, BUSINESS_TZ).add(offset, 'day').format('YYYY-MM-DD')
    if (dayjs.tz(`${day} 12:00`, BUSINESS_TZ).day() === 0) continue
    for (let h = OPEN_HOUR; h < CLOSE_HOUR; h++) {
      const start = dayjs.tz(`${day} ${String(h).padStart(2, '0')}:00`, BUSINESS_TZ)
      const end = start.add(service.durationMinutes, 'minute')
      const closeAt = dayjs.tz(`${day} ${CLOSE_HOUR}:00`, BUSINESS_TZ)
      if (end.isAfter(closeAt)) continue
      if (start.tz(timezone).format('YYYY-MM-DD') !== date) continue
      if (start.valueOf() < earliest) continue
      slots.push({
        startUtc: start.utc().toISOString(),
        endUtc: end.utc().toISOString(),
        available: !overlaps(start.valueOf(), end.valueOf(), blocking),
      })
    }
  }
  return slots.sort((a, b) => a.startUtc.localeCompare(b.startUtc))
}

export function isSlotBookable(
  service: Service,
  startUtc: string,
  timezone: string,
  excludeId?: string
): boolean {
  const date = dayjs(startUtc).tz(timezone).format('YYYY-MM-DD')
  return computeSlots(service, date, timezone, excludeId).some(
    (s) => dayjs(s.startUtc).isSame(dayjs(startUtc)) && s.available
  )
}
