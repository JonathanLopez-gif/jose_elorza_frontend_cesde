import type { ComponentProps } from 'react'

import { Select } from '@/components/ui/select'

const FALLBACK = [
  'America/Bogota',
  'America/Mexico_City',
  'America/Lima',
  'America/Santiago',
  'America/Argentina/Buenos_Aires',
  'America/New_York',
  'America/Chicago',
  'America/Los_Angeles',
  'Europe/Madrid',
  'Europe/London',
  'UTC',
]

function zones(): string[] {
  try {
    const list = (
      Intl as unknown as { supportedValuesOf?: (k: string) => string[] }
    ).supportedValuesOf?.('timeZone')
    if (list?.length) return list
  } catch {
    /* navegador sin soporte */
  }
  return FALLBACK
}

/** Selector de zona horaria IANA (la hora se muestra siempre en la zona del usuario). */
export function TimezoneSelect(props: ComponentProps<typeof Select>) {
  const list = zones()
  return (
    <Select {...props}>
      {list.map((z) => (
        <option key={z} value={z}>
          {z.replace(/_/g, ' ')}
        </option>
      ))}
    </Select>
  )
}
