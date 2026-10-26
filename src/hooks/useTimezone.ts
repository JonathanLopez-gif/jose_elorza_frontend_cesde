import { useAuthStore } from '@/store/slices/auth.store'
import { getUserTimezone } from '@/utils/timezone'

/** Zona horaria efectiva: la del perfil del usuario o, si no hay sesión, la del navegador. */
export function useTimezone(): string {
  const tz = useAuthStore((s) => s.user?.timezone)
  return tz || getUserTimezone()
}
