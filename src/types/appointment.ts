export type AppointmentStatus =
  'PENDING_PAYMENT' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'NO_SHOW' | 'RESCHEDULED'

export interface TimeSlot {
  startUtc: string
  endUtc: string
  available: boolean
}

/** Resumen de un día para el calendario: cuántos horarios hay y cuántos siguen libres. */
export interface DayAvailability {
  date: string
  total: number
  available: number
}

export interface MonthAvailabilityResponse {
  serviceId: string
  /** AAAA-MM */
  month: string
  timezone: string
  days: DayAvailability[]
}

export interface AvailabilityResponse {
  serviceId: string
  date: string
  timezone: string
  slots: TimeSlot[]
}

/** Desglose de un precio con IVA incluido. */
export interface PriceBreakdown {
  base: number
  iva: number
  total: number
}

export interface AppointmentSummary {
  serviceId: string
  serviceName: string
  durationMinutes: number
  startUtc: string
  endUtc: string
  userTimezone: string
  cop: PriceBreakdown
  usd: PriceBreakdown
}

export interface Appointment {
  id: string
  serviceId: string
  serviceName: string
  userId: string
  userName: string
  userEmail: string
  startUtc: string
  endUtc: string
  timezone: string
  status: AppointmentStatus
  priceCop: number
  priceUsd: number
  videoUrl?: string | null
  holdExpiresAt?: string | null
  /** Se aplicó la penalización del 10 % al cancelar/reagendar con menos de 7 días. */
  penaltyApplied?: boolean
  rescheduledFromId?: string | null
  cancelledAt?: string | null
  createdAt: string
}

export interface CreateAppointmentPayload {
  serviceId: string
  startUtc: string
  timezone: string
}

export interface AppointmentFilters {
  status?: AppointmentStatus | ''
  serviceId?: string
  from?: string
  to?: string
  search?: string
}

/** Política de cancelación/reagendamiento (plan 4.5). Montos en la moneda del pago. */
export interface PenaltyInfo {
  applies: boolean
  percent: number
  penalty: number
  refund: number
  currency: 'COP' | 'USD' | null
  daysAhead: number
}
