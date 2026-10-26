import { apiClient } from '@/api/client'
import { API_ENDPOINTS } from '@/api/endpoints'
import { unwrap } from '@/api/helpers'
import type { DashboardData } from '@/types/admin'

export async function getDashboard(): Promise<DashboardData> {
  const { data } = await apiClient.get(API_ENDPOINTS.admin.dashboard)
  return unwrap<DashboardData>(data)
}
