import { delay, http } from 'msw'

import type { ServiceInput } from '@/types/service'
import { db, nextId, save } from '../db'
import { API, fail, guard, ok, userFromRequest } from './common'

function validate(input: Partial<ServiceInput>): string | null {
  if (!input.name || input.name.trim().length < 3)
    return 'El nombre debe tener al menos 3 caracteres.'
  if (!input.description || input.description.trim().length < 10)
    return 'La descripción debe tener al menos 10 caracteres.'
  if (!(Number(input.priceCop) >= 0) || !(Number(input.priceUsd) >= 0))
    return 'Los precios no pueden ser negativos.'
  if (!(Number(input.durationMinutes) >= 15)) return 'La duración mínima es de 15 minutos.'
  return null
}

export const serviceHandlers = [
  http.get(`${API}/services/all`, async ({ request }) => {
    await delay(250)
    const g = guard(request, { admin: true })
    if (g.response) return g.response
    return ok(db.services)
  }),

  http.get(`${API}/services`, async ({ request }) => {
    await delay(350)
    const url = new URL(request.url)
    const modality = url.searchParams.get('modality')
    const type = url.searchParams.get('type')
    const search = url.searchParams.get('search')?.toLowerCase()
    let list = db.services.filter((s) => s.status === 'ACTIVE')
    if (modality)
      list = list.filter(
        (s) => s.modality === modality || (s.modality === 'HIBRIDA' && modality !== 'HIBRIDA')
      )
    if (type) list = list.filter((s) => s.type === type)
    if (search)
      list = list.filter((s) => `${s.name} ${s.description}`.toLowerCase().includes(search))
    return ok(list)
  }),

  http.get(`${API}/services/:id`, async ({ params, request }) => {
    await delay(250)
    const service = db.services.find((s) => s.id === params.id)
    const isAdmin = userFromRequest(request)?.role === 'ADMIN'
    if (!service || (service.status === 'INACTIVE' && !isAdmin))
      return fail(404, 'Servicio no encontrado')
    return ok(service)
  }),

  http.post(`${API}/services`, async ({ request }) => {
    await delay(400)
    const g = guard(request, { admin: true })
    if (g.response) return g.response
    const input = (await request.json()) as ServiceInput
    const error = validate(input)
    if (error) return fail(400, error)
    const now = new Date().toISOString()
    const service = { ...input, id: nextId('svc'), createdAt: now, updatedAt: now }
    db.services.unshift(service)
    save()
    return ok(service, 'Servicio creado', 201)
  }),

  http.put(`${API}/services/:id`, async ({ params, request }) => {
    await delay(400)
    const g = guard(request, { admin: true })
    if (g.response) return g.response
    const index = db.services.findIndex((s) => s.id === params.id)
    if (index < 0) return fail(404, 'Servicio no encontrado')
    const input = (await request.json()) as ServiceInput
    const error = validate(input)
    if (error) return fail(400, error)
    db.services[index] = { ...db.services[index], ...input, updatedAt: new Date().toISOString() }
    save()
    return ok(db.services[index], 'Servicio actualizado')
  }),

  http.delete(`${API}/services/:id`, async ({ params, request }) => {
    await delay(350)
    const g = guard(request, { admin: true })
    if (g.response) return g.response
    const service = db.services.find((s) => s.id === params.id)
    if (!service) return fail(404, 'Servicio no encontrado')
    if (db.appointments.some((a) => a.serviceId === service.id)) {
      service.status = 'INACTIVE'
      save()
      return ok(service, 'El servicio tiene citas asociadas: se desactivó en lugar de eliminarse.')
    }
    db.services = db.services.filter((s) => s.id !== service.id)
    save()
    return ok(null, 'Servicio eliminado')
  }),
]
