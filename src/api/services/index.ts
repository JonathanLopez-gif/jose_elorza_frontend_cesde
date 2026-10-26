import { apiClient } from '@/api/client'
import { API_ENDPOINTS } from '@/api/endpoints'
import { unwrap } from '@/api/helpers'
import type { Service, ServiceFilters, ServiceInput } from '@/types/service'

export async function getServices(filters?: ServiceFilters): Promise<Service[]> {
  const params: Record<string, string> = {}
  if (filters?.modality) params.modality = filters.modality
  if (filters?.type) params.type = filters.type
  if (filters?.search) params.search = filters.search
  const { data } = await apiClient.get(API_ENDPOINTS.services.list, { params })
  return unwrap<Service[]>(data) ?? []
}

export async function getAllServices(): Promise<Service[]> {
  const { data } = await apiClient.get(API_ENDPOINTS.services.all)
  return unwrap<Service[]>(data) ?? []
}

export async function getServiceById(id: string): Promise<Service> {
  const { data } = await apiClient.get(API_ENDPOINTS.services.detail(id))
  return unwrap<Service>(data)
}

export async function createService(input: ServiceInput): Promise<Service> {
  const { data } = await apiClient.post(API_ENDPOINTS.services.list, input)
  return unwrap<Service>(data)
}

export async function updateService(id: string, input: ServiceInput): Promise<Service> {
  const { data } = await apiClient.put(API_ENDPOINTS.services.detail(id), input)
  return unwrap<Service>(data)
}

export async function deleteService(id: string): Promise<void> {
  await apiClient.delete(API_ENDPOINTS.services.detail(id))
}
