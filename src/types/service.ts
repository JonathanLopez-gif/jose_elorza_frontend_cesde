export type ServiceModality = 'VIRTUAL' | 'PRESENCIAL' | 'HIBRIDA'
export type ServiceType = 'INDIVIDUAL' | 'GRUPAL'
export type ServiceStatus = 'ACTIVE' | 'INACTIVE'

export interface Service {
  id: string
  name: string
  description: string
  priceCop: number
  priceUsd: number
  durationMinutes: number
  modality: ServiceModality
  type: ServiceType
  status: ServiceStatus
  createdAt?: string
  updatedAt?: string
}

export interface ServiceFilters {
  modality?: ServiceModality | ''
  type?: ServiceType | ''
  search?: string
}

export type ServiceInput = Omit<Service, 'id' | 'createdAt' | 'updatedAt'>
