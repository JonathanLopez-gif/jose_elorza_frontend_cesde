import type { Appointment } from '@/types/appointment'
import { dayjs } from '@/utils/timezone'

const stamp = (iso: string) => dayjs.utc(iso).format('YYYYMMDD[T]HHmmss[Z]')
const escape = (s: string) => s.replace(/([,;\\])/g, '\\$1').replace(/\n/g, '\\n')

/** Descarga un archivo .ics para añadir la cita a cualquier calendario. */
export function downloadIcs(a: Appointment) {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Jose Fernando Elorza//Agenda//ES',
    'BEGIN:VEVENT',
    `UID:${a.id}@joseelorza.com`,
    `DTSTAMP:${stamp(new Date().toISOString())}`,
    `DTSTART:${stamp(a.startUtc)}`,
    `DTEND:${stamp(a.endUtc)}`,
    `SUMMARY:${escape(a.serviceName)} · José Fernando Elorza`,
    `DESCRIPTION:${escape(a.videoUrl ? `Enlace de la sesión: ${a.videoUrl}` : 'El enlace de la videollamada se publicará en Mis citas.')}`,
    ...(a.videoUrl ? [`URL:${a.videoUrl}`] : []),
    'END:VEVENT',
    'END:VCALENDAR',
  ]
  const blob = new Blob([lines.join('\r\n')], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `cita-${a.id}.ics`
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}
