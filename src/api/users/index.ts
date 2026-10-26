import { apiClient } from '@/api/client'
import { API_ENDPOINTS } from '@/api/endpoints'
import { unwrap } from '@/api/helpers'
import type { AdminUser, PaginatedResult, UserFilters } from '@/types/admin'

export async function getAdminUsers(filters: UserFilters): Promise<PaginatedResult<AdminUser>> {
  const { data } = await apiClient.get(API_ENDPOINTS.admin.users, { params: filters })
  return unwrap<PaginatedResult<AdminUser>>(data)
}

export async function setUserActive(id: string, active: boolean): Promise<AdminUser> {
  const { data } = await apiClient.patch(API_ENDPOINTS.admin.userStatus(id), { active })
  return unwrap<AdminUser>(data)
}
