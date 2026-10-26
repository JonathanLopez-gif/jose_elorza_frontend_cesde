import { apiClient } from '@/api/client'
import { API_ENDPOINTS } from '@/api/endpoints'
import { unwrap } from '@/api/helpers'
import type { SocialLink, SocialLinkInput } from '@/types/social'

/** Canales activos, ya ordenados (público). */
export async function getSocialLinks(): Promise<SocialLink[]> {
  const { data } = await apiClient.get(API_ENDPOINTS.socialLinks.list)
  return unwrap<SocialLink[]>(data) ?? []
}

/** Todos los canales, activos e inactivos (admin). */
export async function getAdminSocialLinks(): Promise<SocialLink[]> {
  const { data } = await apiClient.get(API_ENDPOINTS.admin.socialLinks.list)
  return unwrap<SocialLink[]>(data) ?? []
}

export async function createSocialLink(input: SocialLinkInput): Promise<SocialLink> {
  const { data } = await apiClient.post(API_ENDPOINTS.admin.socialLinks.list, input)
  return unwrap<SocialLink>(data)
}

export async function updateSocialLink(
  id: string,
  input: Partial<SocialLinkInput>
): Promise<SocialLink> {
  const { data } = await apiClient.put(API_ENDPOINTS.admin.socialLinks.detail(id), input)
  return unwrap<SocialLink>(data)
}

export async function deleteSocialLink(id: string): Promise<void> {
  await apiClient.delete(API_ENDPOINTS.admin.socialLinks.detail(id))
}

/** Guarda el nuevo orden: la lista de ids de primero a último. */
export async function reorderSocialLinks(ids: string[]): Promise<SocialLink[]> {
  const { data } = await apiClient.put(API_ENDPOINTS.admin.socialLinks.order, { ids })
  return unwrap<SocialLink[]>(data) ?? []
}
