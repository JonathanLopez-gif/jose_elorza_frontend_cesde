import { apiClient } from '@/api/client'
import { API_ENDPOINTS } from '@/api/endpoints'
import { unwrap } from '@/api/helpers'
import type { GoogleCalendarAuthUrl, GoogleCalendarIntegration } from '@/types/google-calendar'

export async function getGoogleCalendarStatus(): Promise<GoogleCalendarIntegration> {
  const { data } = await apiClient.get(API_ENDPOINTS.admin.googleCalendar.status)
  return unwrap<GoogleCalendarIntegration>(data)
}

export async function getGoogleCalendarAuthUrl(): Promise<string> {
  const { data } = await apiClient.get(API_ENDPOINTS.admin.googleCalendar.authUrl)
  return unwrap<GoogleCalendarAuthUrl>(data).url
}

export async function disconnectGoogleCalendar(): Promise<void> {
  await apiClient.post(API_ENDPOINTS.admin.googleCalendar.disconnect)
}
