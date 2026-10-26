import type { Appointment } from '@/types/appointment'
import type { Payment } from '@/types/payment'
import { es } from '@/i18n/es'
import { formatDateTime } from '@/utils/timezone'

export const APPOINTMENT_CSV_COLUMNS = [
  { key: 'id', label: 'ID' },
  { key: 'cliente', label: 'Cliente' },
  { key: 'correo', label: 'Correo' },
  { key: 'servicio', label: 'Servicio' },
  { key: 'inicioLocal', label: 'Inicio (hora local)' },
  { key: 'inicioUtc', label: 'Inicio (UTC)' },
  { key: 'finUtc', label: 'Fin (UTC)' },
  { key: 'estado', label: 'Estado' },
  { key: 'precioCop', label: 'Precio COP' },
  { key: 'precioUsd', label: 'Precio USD' },
  { key: 'enlace', label: 'Enlace videollamada' },
] as const

export function appointmentsToCsvRows(list: Appointment[], tz: string) {
  return list.map((a) => ({
    id: a.id,
    cliente: a.userName,
    correo: a.userEmail,
    servicio: a.serviceName,
    inicioLocal: formatDateTime(a.startUtc, tz),
    inicioUtc: a.startUtc,
    finUtc: a.endUtc,
    estado: es.appointmentStatus[a.status],
    precioCop: a.priceCop,
    precioUsd: a.priceUsd,
    enlace: a.videoUrl ?? '',
  }))
}

export const PAYMENT_CSV_COLUMNS = [
  { key: 'referencia', label: 'Referencia' },
  { key: 'fecha', label: 'Fecha' },
  { key: 'cliente', label: 'Cliente' },
  { key: 'servicio', label: 'Servicio' },
  { key: 'pasarela', label: 'Pasarela' },
  { key: 'moneda', label: 'Moneda' },
  { key: 'base', label: 'Base sin IVA' },
  { key: 'iva', label: 'IVA 19%' },
  { key: 'total', label: 'Total' },
  { key: 'estado', label: 'Estado' },
  { key: 'nota', label: 'Nota de reembolso' },
] as const

export function paymentsToCsvRows(list: Payment[], tz: string) {
  return list.map((p) => ({
    referencia: p.reference,
    fecha: formatDateTime(p.paidAt ?? p.createdAt, tz),
    cliente: p.userName,
    servicio: p.serviceName,
    pasarela: es.gateway[p.gateway],
    moneda: p.currency,
    base: p.baseAmount,
    iva: p.ivaAmount,
    total: p.amount,
    estado: es.paymentStatus[p.status],
    nota: p.refundNote ?? '',
  }))
}
