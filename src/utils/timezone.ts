import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import 'dayjs/locale/es'
import type { PriceBreakdown } from '@/types/appointment'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.locale('es')

export function getUserTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
  } catch {
    return 'UTC'
  }
}

export function utcToLocal(utcIso: string, tz?: string): dayjs.Dayjs {
  const zone = tz || getUserTimezone()
  return dayjs.utc(utcIso).tz(zone)
}

export function localToUtc(localIsoOrDate: string | Date, tz?: string): dayjs.Dayjs {
  const zone = tz || getUserTimezone()
  return dayjs.tz(localIsoOrDate, zone).utc()
}

export function formatDate(
  value: string | dayjs.Dayjs,
  tz?: string,
  pattern = 'DD MMM YYYY'
): string {
  const d = typeof value === 'string' ? utcToLocal(value, tz) : value.tz(tz || getUserTimezone())
  return d.format(pattern)
}

export function formatTime(value: string | dayjs.Dayjs, tz?: string, pattern = 'hh:mm A'): string {
  const d = typeof value === 'string' ? utcToLocal(value, tz) : value.tz(tz || getUserTimezone())
  return d.format(pattern)
}

export function formatDateTime(value: string | dayjs.Dayjs, tz?: string): string {
  const d = typeof value === 'string' ? utcToLocal(value, tz) : value.tz(tz || getUserTimezone())
  return d.format('DD MMM YYYY · hh:mm A')
}

export function formatUtc(value: string | dayjs.Dayjs, pattern = 'HH:mm [UTC]'): string {
  const d = typeof value === 'string' ? dayjs.utc(value) : value.utc()
  return d.format(pattern)
}

export function formatCurrencyCop(amount: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatCurrencyUsd(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
}

export const IVA_RATE = 0.19

/**
 * Los precios del catálogo ya incluyen el IVA del 19 %.
 * Esta función los desglosa para mostrarlos en el resumen y en el comprobante.
 */
export function splitIva(total: number, decimals = 2): PriceBreakdown {
  const factor = 10 ** decimals
  const base = Math.round((total / (1 + IVA_RATE)) * factor) / factor
  const iva = Math.round((total - base) * factor) / factor
  return { base, iva, total }
}

export { dayjs }
