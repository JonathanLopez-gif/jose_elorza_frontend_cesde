export interface MonthlyPoint {
  month: string
  incomeCop: number
  incomeUsd: number
  appointments: number
}

export interface StatusPoint {
  status: string
  count: number
}

export interface DashboardData {
  appointmentsToday: number
  appointmentsMonth: number
  incomeMonthCop: number
  incomeMonthUsd: number
  pendingPayments: number
  totalUsers: number
  monthly: MonthlyPoint[]
  byStatus: StatusPoint[]
  upcoming: import('./appointment').Appointment[]
}

export interface PaginatedResult<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
}

export interface UserFilters {
  search?: string
  active?: '' | 'true' | 'false'
  page?: number
  pageSize?: number
}

export interface AdminUser {
  id: string
  name: string
  email: string
  role: 'USER' | 'ADMIN'
  phone?: string | null
  timezone: string
  active: boolean
  createdAt: string
  appointmentsCount: number
}
