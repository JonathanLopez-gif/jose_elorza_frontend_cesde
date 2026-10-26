import { delay, http } from 'msw'

import type { SocialLinkInput, SocialPlatform } from '@/types/social'
import { db, nextId, save } from '../db'
import { API, fail, guard, ok } from './common'

const PLATFORMS: SocialPlatform[] = [
  'YOUTUBE',
  'INSTAGRAM',
  'FACEBOOK',
  'SPOTIFY',
  'WHATSAPP',
  'OTHER',
]

const sorted = () => [...db.socialLinks].sort((a, b) => a.order - b.order)

/** Vuelve a numerar 1..n según el orden actual. */
function renumber() {
  sorted().forEach((l, i) => (l.order = i + 1))
}

function validate(input: Partial<SocialLinkInput>): string | null {
  if (!input.platform || !PLATFORMS.includes(input.platform))
    return 'Selecciona una plataforma válida.'
  if (!input.name || input.name.trim().length < 2)
    return 'El nombre debe tener al menos 2 caracteres.'
  try {
    const url = new URL(input.url ?? '')
    if (url.protocol !== 'https:' && url.protocol !== 'http:') throw new Error()
  } catch {
    return 'Ingresa una URL válida (https://…).'
  }
  return null
}

export const socialHandlers = [
  http.get(`${API}/social-links`, async () => {
    await delay(200)
    return ok(sorted().filter((l) => l.active))
  }),

  http.get(`${API}/admin/social-links`, async ({ request }) => {
    await delay(250)
    const g = guard(request, { admin: true })
    if (g.response) return g.response
    return ok(sorted())
  }),

  http.post(`${API}/admin/social-links`, async ({ request }) => {
    await delay(350)
    const g = guard(request, { admin: true })
    if (g.response) return g.response
    const input = (await request.json()) as SocialLinkInput
    const error = validate(input)
    if (error) return fail(400, error)
    const link = {
      id: nextId('soc'),
      platform: input.platform,
      name: input.name.trim(),
      description: input.description?.trim() ?? '',
      url: input.url.trim(),
      active: input.active ?? true,
      order: db.socialLinks.length + 1,
    }
    db.socialLinks.push(link)
    save()
    return ok(link, 'Enlace creado', 201)
  }),

  // Debe ir antes de `/:id` para que "order" no se tome como id.
  http.put(`${API}/admin/social-links/order`, async ({ request }) => {
    await delay(250)
    const g = guard(request, { admin: true })
    if (g.response) return g.response
    const { ids } = (await request.json()) as { ids: string[] }
    const known = new Set(db.socialLinks.map((l) => l.id))
    if (!Array.isArray(ids) || ids.length !== known.size || !ids.every((id) => known.has(id))) {
      return fail(400, 'El orden enviado no coincide con los enlaces existentes.')
    }
    ids.forEach((id, i) => {
      const link = db.socialLinks.find((l) => l.id === id)
      if (link) link.order = i + 1
    })
    save()
    return ok(sorted(), 'Orden actualizado')
  }),

  http.put(`${API}/admin/social-links/:id`, async ({ params, request }) => {
    await delay(300)
    const g = guard(request, { admin: true })
    if (g.response) return g.response
    const link = db.socialLinks.find((l) => l.id === params.id)
    if (!link) return fail(404, 'Enlace no encontrado')
    const input = (await request.json()) as Partial<SocialLinkInput>
    const merged = { ...link, ...input }
    const error = validate(merged)
    if (error) return fail(400, error)
    Object.assign(link, merged, {
      name: merged.name.trim(),
      url: merged.url.trim(),
      description: merged.description?.trim() ?? '',
    })
    save()
    return ok(link, 'Enlace actualizado')
  }),

  http.delete(`${API}/admin/social-links/:id`, async ({ params, request }) => {
    await delay(300)
    const g = guard(request, { admin: true })
    if (g.response) return g.response
    if (!db.socialLinks.some((l) => l.id === params.id)) return fail(404, 'Enlace no encontrado')
    db.socialLinks = db.socialLinks.filter((l) => l.id !== params.id)
    renumber()
    save()
    return ok(null, 'Enlace eliminado')
  }),
]
