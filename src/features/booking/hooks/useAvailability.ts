import { useQuery } from '@tanstack/react-query'
import { getAvailability, getMonthAvailability } from '@/api/appointments'
import { useTimezone } from '@/hooks/useTimezone'

interface UseAvailabilityParams {
  serviceId: string | undefined
  date: string | null
}

export function useAvailability({ serviceId, date }: UseAvailabilityParams) {
  const timezone = useTimezone()
  return useQuery({
    queryKey: ['availability', serviceId, date, timezone],
    queryFn: () => getAvailability({ serviceId: serviceId!, date: date!, timezone }),
    enabled: Boolean(serviceId && date),
    staleTime: 30_000,
    refetchOnWindowFocus: true,
  })
}

/** Disponibilidad resumida de un mes completo (AAAA-MM) para el calendario. */
export function useMonthAvailability(serviceId: string | undefined, month: string) {
  const timezone = useTimezone()
  return useQuery({
    queryKey: ['availability', 'month', serviceId, month, timezone],
    queryFn: () => getMonthAvailability({ serviceId: serviceId!, month, timezone }),
    enabled: Boolean(serviceId),
    staleTime: 30_000,
    refetchOnWindowFocus: true,
  })
}
