import { useQuery } from '@tanstack/react-query'
import { getServices, getServiceById } from '@/api/services'
import type { ServiceFilters } from '@/types/service'

export function useServices(filters?: ServiceFilters) {
  return useQuery({
    queryKey: ['services', filters],
    queryFn: () => getServices(filters),
  })
}

export function useService(id: string | undefined) {
  return useQuery({
    queryKey: ['services', id],
    queryFn: () => getServiceById(id!),
    enabled: Boolean(id),
  })
}
