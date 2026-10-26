import { useEffect, useState } from 'react'

/** Segundos que faltan hasta `iso` (0 si ya pasó o no hay fecha). Se actualiza cada segundo. */
export function useCountdown(iso?: string | null): number {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    if (!iso) return
    const id = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(id)
  }, [iso])
  return iso ? Math.max(0, Math.floor((new Date(iso).getTime() - now) / 1000)) : 0
}

export function formatCountdown(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}
