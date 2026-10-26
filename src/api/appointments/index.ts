import { apiClient } from '@/api/client'
import { API_ENDPOINTS } from '@/api/endpoints'
import { unwrap } from '@/api/helpers'
import type {
  Appointment,
  AppointmentFilters,
  AppointmentStatus,
  AvailabilityResponse,
  MonthAvailabilityResponse,
  CreateAppointmentPayload,
} from '@/types/appointment'

export interface AvailabilityParams {
  serviceId: string
  date: string
  timezone: string
}

export async function getAvailability(params: AvailabilityParams): Promise<AvailabilityResponse> {
  const { data } = await apiClient.get(API_ENDPOINTS.appointments.availability, { params })
  return unwrap<AvailabilityResponse>(data)
}

export interface MonthAvailabilityParams {
  serviceId: string
  /** AAAA-MM */
  month: string
  timezone: string
}

/** Resumen por día del mes para pintar el calendario (días con cupo, llenos o sin atención). */
export async function getMonthAvailability(
  params: MonthAvailabilityParams
): Promise<MonthAvailabilityResponse> {
  const { data } = await apiClient.get(API_ENDPOINTS.appointments.monthAvailability, { params })
  return unwrap<MonthAvailabilityResponse>(data)
}

export async function createAppointment(payload: CreateAppointmentPayload): Promise<Appointment> {
  const { data } = await apiClient.post(API_ENDPOINTS.appointments.create, payload)
  return unwrap<Appointment>(data)
}

export async function getMyAppointments(): Promise<Appointment[]> {
  const { data } = await apiClient.get(API_ENDPOINTS.appointments.mine)
  return unwrap<Appointment[]>(data) ?? []
}

export async function getAppointment(id: string): Promise<Appointment> {
  const { data } = await apiClient.get(API_ENDPOINTS.appointments.detail(id))
  return unwrap<Appointment>(data)
}

export async function cancelAppointment(id: string): Promise<Appointment> {
  const { data } = await apiClient.post(API_ENDPOINTS.appointments.cancel(id))
  return unwrap<Appointment>(data)
}

export async function rescheduleAppointment(
  id: string,
  payload: { startUtc: string; timezone: string }
): Promise<Appointment> {
  const { data } = await apiClient.post(API_ENDPOINTS.appointments.reschedule(id), payload)
  return unwrap<Appointment>(data)
}

/* ---------- Administración ---------- */

export async function getAdminAppointments(filters?: AppointmentFilters): Promise<Appointment[]> {
  const { data } = await apiClient.get(API_ENDPOINTS.admin.appointments, { params: filters })
  return unwrap<Appointment[]>(data) ?? []
}

export interface AdminAppointmentPatch {
  status?: AppointmentStatus
  videoUrl?: string | null
}

export async function patchAdminAppointment(
  id: string,
  patch: AdminAppointmentPatch
): Promise<Appointment> {
  const { data } = await apiClient.patch(API_ENDPOINTS.admin.appointment(id), patch)
  return unwrap<Appointment>(data)
}

export async function adminRescheduleAppointment(
  id: string,
  payload: { startUtc: string; timezone: string }
): Promise<Appointment> {
  const { data } = await apiClient.post(
    API_ENDPOINTS.admin.appointment(id) + '/reschedule',
    payload
  )
  return unwrap<Appointment>(data)
}

export async function adminCancelAppointment(id: string): Promise<Appointment> {
  const { data } = await apiClient.post(API_ENDPOINTS.admin.appointment(id) + '/cancel')
  return unwrap<Appointment>(data)
}
