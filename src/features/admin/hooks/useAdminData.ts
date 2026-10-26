import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { getDashboard } from '@/api/admin'
import { getAdminAppointments } from '@/api/appointments'
import { getAdminPayments } from '@/api/payments'
import { getAllServices } from '@/api/services'
import { getAdminUsers } from '@/api/users'
import type { UserFilters } from '@/types/admin'
import type { AppointmentFilters } from '@/types/appointment'
import type { PaymentFilters } from '@/types/payment'

export const useDashboard = () => useQuery({ queryKey: ['admin-dashboard'], queryFn: getDashboard })

export const useAdminUsers = (filters: UserFilters) =>
  useQuery({
    queryKey: ['admin-users', filters],
    queryFn: () => getAdminUsers(filters),
    placeholderData: keepPreviousData,
  })

export const useAdminServices = () =>
  useQuery({ queryKey: ['admin-services'], queryFn: getAllServices })

export const useAdminAppointments = (filters: AppointmentFilters, enabled = true) =>
  useQuery({
    queryKey: ['admin-appointments', filters],
    queryFn: () => getAdminAppointments(filters),
    placeholderData: keepPreviousData,
    enabled,
  })

export const useAdminPayments = (filters: PaymentFilters) =>
  useQuery({
    queryKey: ['admin-payments', filters],
    queryFn: () => getAdminPayments(filters),
    placeholderData: keepPreviousData,
  })
