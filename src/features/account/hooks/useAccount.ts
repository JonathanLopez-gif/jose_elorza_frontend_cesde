import { useQuery } from '@tanstack/react-query'

import { getMyAppointments } from '@/api/appointments'
import { getMyPayments } from '@/api/payments'

export function useMyAppointments() {
  return useQuery({ queryKey: ['my-appointments'], queryFn: getMyAppointments, staleTime: 15_000 })
}

export function useMyPayments() {
  return useQuery({ queryKey: ['my-payments'], queryFn: getMyPayments, staleTime: 15_000 })
}
