import type { AppointmentSummary } from '@/types/appointment'
import { splitIva } from '@/utils/timezone'

interface SummaryInput {
  serviceId: string
  serviceName: string
  durationMinutes: number
  priceCop: number
  priceUsd: number
  startUtc: string
  endUtc: string
  timezone: string
}

/** Los precios del catálogo ya incluyen IVA: aquí solo se desglosan para mostrarlos. */
export function buildSummary(i: SummaryInput): AppointmentSummary {
  return {
    serviceId: i.serviceId,
    serviceName: i.serviceName,
    durationMinutes: i.durationMinutes,
    startUtc: i.startUtc,
    endUtc: i.endUtc,
    userTimezone: i.timezone,
    cop: splitIva(i.priceCop, 0),
    usd: splitIva(i.priceUsd, 2),
  }
}
