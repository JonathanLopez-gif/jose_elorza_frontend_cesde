/**
 * Base de datos simulada para desarrollo (MSW).
 * Vive en memoria y se persiste en localStorage para que el estado sobreviva a recargas.
 * Se reinicia con `window.__resetMockDb()` desde la consola.
 */
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

import type { Appointment, AppointmentStatus } from '@/types/appointment'
import type { GoogleCalendarIntegration } from '@/types/google-calendar'
import type { Payment, PaymentGateway, PaymentStatus } from '@/types/payment'
import type { Service } from '@/types/service'
import type { SocialLink } from '@/types/social'
import type { User } from '@/types/auth'
import { splitIva } from '@/utils/timezone'
import { seedServices, seedSocialLinks } from './data'

dayjs.extend(utc)
dayjs.extend(timezone)

export const BUSINESS_TZ = 'America/Bogota'

export interface MockUser extends User {
  password: string
}

export interface MockPayment extends Payment {
  /** Para simular el webhook de una pasarela que responde "pendiente" y luego aprueba. */
  resolveAt?: string | null
}

interface ResetToken {
  token: string
  userId: string
  expiresAt: string
}

export interface MockDB {
  users: MockUser[]
  services: Service[]
  socialLinks: SocialLink[]
  appointments: Appointment[]
  payments: MockPayment[]
  resetTokens: ResetToken[]
  google: GoogleCalendarIntegration
  seq: number
}

const STORAGE_KEY = 'mock_db_v4'

function rng(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const NAMES = [
  'María Fernanda Gómez',
  'Carlos Andrés Ruiz',
  'Laura Valentina Pérez',
  'Juan Sebastián Torres',
  'Daniela Ortiz',
  'Santiago Herrera',
  'Camila Restrepo',
  'Andrés Felipe Cardona',
  'Paula Andrea Mejía',
  'Julián Vargas',
  'Natalia Salazar',
  'Sofía Londoño',
]
const ZONES = [
  'America/Bogota',
  'America/Bogota',
  'America/Mexico_City',
  'Europe/Madrid',
  'America/New_York',
]

function seedUsers(now: dayjs.Dayjs): MockUser[] {
  const users: MockUser[] = [
    {
      id: 'usr-admin',
      name: 'José Fernando Elorza',
      email: 'admin@joseelorza.com',
      password: 'Admin123!',
      role: 'ADMIN',
      phone: '+57 315 462 7900',
      timezone: BUSINESS_TZ,
      emailNotifications: true,
      active: true,
      createdAt: now.subtract(8, 'month').toISOString(),
    },
    {
      id: 'usr-demo',
      name: 'Valentina Rojas',
      email: 'usuario@correo.com',
      password: 'Usuario123!',
      role: 'USER',
      phone: '+57 300 123 4567',
      timezone: BUSINESS_TZ,
      emailNotifications: true,
      active: true,
      createdAt: now.subtract(4, 'month').toISOString(),
    },
  ]
  NAMES.forEach((name, i) => {
    users.push({
      id: `usr-${i + 1}`,
      name,
      email: `${name.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').split(' ').slice(0, 2).join('.')}@correo.com`,
      password: 'Usuario123!',
      role: 'USER',
      phone: null,
      timezone: ZONES[i % ZONES.length],
      emailNotifications: i % 4 !== 0,
      active: i !== 7,
      createdAt: now
        .subtract(6 - (i % 6), 'month')
        .subtract(i, 'day')
        .toISOString(),
    })
  })
  return users
}

export function buildSeed(): MockDB {
  const now = dayjs()
  const rand = rng(20261021)
  const users = seedUsers(now)
  const regular = users.filter((u) => u.role === 'USER' && u.active)
  const services = seedServices.map((s) => ({
    ...s,
    createdAt: now.subtract(8, 'month').toISOString(),
  }))
  const active = services.filter((s) => s.status === 'ACTIVE')
  const appointments: Appointment[] = []
  const payments: MockPayment[] = []
  let seq = 1

  const add = (
    start: dayjs.Dayjs,
    status: AppointmentStatus,
    user: MockUser,
    withVideo: boolean
  ) => {
    const service = active[Math.floor(rand() * active.length)]
    const id = `apt-${String(seq).padStart(4, '0')}`
    const startUtc = start.utc()
    const endUtc = startUtc.add(service.durationMinutes, 'minute')
    appointments.push({
      id,
      serviceId: service.id,
      serviceName: service.name,
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      startUtc: startUtc.toISOString(),
      endUtc: endUtc.toISOString(),
      timezone: user.timezone,
      status,
      priceCop: service.priceCop,
      priceUsd: service.priceUsd,
      videoUrl: withVideo
        ? `https://meet.google.com/jfe-${Math.floor(rand() * 9000 + 1000)}-sess`
        : null,
      createdAt: (startUtc.subtract(10, 'day').isAfter(now)
        ? now.utc().subtract(2, 'day')
        : startUtc.subtract(10, 'day')
      ).toISOString(),
    })
    const gateway: PaymentGateway =
      user.timezone === BUSINESS_TZ ? 'WOMPI' : rand() > 0.5 ? 'GLOBAL66' : 'WOMPI'
    const currency = gateway === 'WOMPI' ? 'COP' : 'USD'
    const total = currency === 'COP' ? service.priceCop : service.priceUsd
    const b = splitIva(total, currency === 'COP' ? 0 : 2)
    let pStatus: PaymentStatus = 'APPROVED'
    if (status === 'CANCELLED') pStatus = rand() > 0.5 ? 'REFUNDED' : 'APPROVED'
    // El pago nunca puede quedar en el futuro (citas lejanas se pagaron "hace unos días").
    let paidMoment = startUtc.subtract(9, 'day')
    if (paidMoment.isAfter(now)) paidMoment = now.utc().subtract(1 + Math.floor(rand() * 4), 'day')
    const paidAt = paidMoment.toISOString()
    payments.push({
      id: `pay-${String(seq).padStart(4, '0')}`,
      reference: `JFE-${paidMoment.format('YYMM')}-${String(seq).padStart(4, '0')}`,
      appointmentId: id,
      userId: user.id,
      userName: user.name,
      serviceName: service.name,
      gateway,
      currency,
      status: pStatus,
      amount: total,
      baseAmount: b.base,
      ivaAmount: b.iva,
      createdAt: paidAt,
      paidAt,
      refundedAt: pStatus === 'REFUNDED' ? startUtc.subtract(8, 'day').toISOString() : null,
      refundNote: pStatus === 'REFUNDED' ? 'Reembolso procesado manualmente' : null,
    })
    seq++
  }

  // Historial de los últimos 6 meses.
  for (let m = 6; m >= 1; m--) {
    const count = 5 + Math.floor(rand() * 6)
    for (let i = 0; i < count; i++) {
      const day = now
        .subtract(m, 'month')
        .startOf('month')
        .add(Math.floor(rand() * 26), 'day')
      const hour = 14 + Math.floor(rand() * 5) // 9:00–13:00 hora Bogotá
      const start = day.utc().hour(hour).minute(0).second(0).millisecond(0)
      if (start.isAfter(now)) continue
      const r = rand()
      const status: AppointmentStatus = r < 0.78 ? 'COMPLETED' : r < 0.9 ? 'CANCELLED' : 'NO_SHOW'
      const u = regular[Math.floor(rand() * regular.length)]
      add(start, status, u, status === 'COMPLETED')
    }
  }
  // Mes en curso (ya ocurridas).
  for (let d = 1; d < Math.min(now.date(), 20); d += 3) {
    const start = now
      .utc()
      .startOf('month')
      .add(d, 'day')
      .hour(15)
      .minute(0)
      .second(0)
      .millisecond(0)
    if (start.isBefore(now)) add(start, 'COMPLETED', regular[d % regular.length], true)
  }
  // Citas futuras confirmadas (incluye al usuario demo).
  const future: [number, number, number, boolean][] = [
    [2, 15, 0, false],
    [3, 16, 1, true],
    [5, 15, 2, true],
    [9, 17, 3, false],
    [12, 14, 4, true],
    [15, 16, 5, false],
    [20, 15, 1, true],
  ]
  future.forEach(([days, hour, idx, video], i) => {
    const start = now.utc().add(days, 'day').hour(hour).minute(0).second(0).millisecond(0)
    if (start.day() === 0) return // sin domingos
    add(
      start,
      'CONFIRMED',
      i === 1 ? users[1] : i === 4 ? users[1] : regular[idx % regular.length],
      video
    )
  })
  // Una cita del usuario demo pasada, completada, para ver historial.
  add(
    now.utc().subtract(18, 'day').hour(15).minute(0).second(0).millisecond(0),
    'COMPLETED',
    users[1],
    true
  )

  return {
    users,
    services,
    socialLinks: seedSocialLinks.map((l) => ({ ...l })),
    appointments,
    payments,
    resetTokens: [],
    google: {
      status: 'DISCONNECTED',
      email: null,
      connectedAt: null,
      expiresAt: null,
      message: 'Aún no hay una cuenta de Google vinculada al sistema.',
    },
    seq,
  }
}

function load(): MockDB {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as MockDB
  } catch {
    /* se regenera */
  }
  return buildSeed()
}

export const db: MockDB = load()

export function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db))
  } catch {
    /* sin persistencia en modo privado */
  }
}

export function resetDb() {
  Object.assign(db, buildSeed())
  save()
}

export function nextId(prefix: string): string {
  db.seq += 1
  return `${prefix}-${String(db.seq).padStart(4, '0')}`
}

if (typeof window !== 'undefined') {
  ;(window as unknown as { __resetMockDb: () => void }).__resetMockDb = () => {
    resetDb()
    location.reload()
  }
}
save()
