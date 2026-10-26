import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { z } from 'zod'

import { createSocialLink, updateSocialLink } from '@/api/social-links'
import { getErrorMessage } from '@/api/helpers'
import { Button } from '@/components/ui/button'
import { Field } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  Modal,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from '@/components/ui/modal'
import { Select } from '@/components/ui/select'
import { Spinner } from '@/components/ui/spinner'
import { Textarea } from '@/components/ui/textarea'
import { ADMIN_SOCIAL_LINKS_KEY, SOCIAL_LINKS_KEY } from '@/features/social/hooks/useSocialLinks'
import { es } from '@/i18n/es'
import type { SocialLink } from '@/types/social'

const schema = z.object({
  platform: z.enum(['YOUTUBE', 'INSTAGRAM', 'FACEBOOK', 'SPOTIFY', 'WHATSAPP', 'OTHER']),
  name: z.string().trim().min(2, 'Mínimo 2 caracteres').max(60, 'Máximo 60 caracteres'),
  description: z.string().trim().max(160, 'Máximo 160 caracteres'),
  url: z
    .string()
    .trim()
    .url('Ingresa una URL válida')
    .refine((v) => /^https?:\/\//i.test(v), 'La URL debe empezar por https://'),
  active: z.enum(['true', 'false']),
})
type Values = z.infer<typeof schema>

const EMPTY: Values = { platform: 'YOUTUBE', name: '', description: '', url: '', active: 'true' }

interface Props {
  open: boolean
  link: SocialLink | null
  onClose: () => void
}

/** Alta y edición de un canal externo del negocio. */
export function SocialLinkFormDialog({ open, link, onClose }: Props) {
  const queryClient = useQueryClient()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Values>({ resolver: zodResolver(schema), defaultValues: EMPTY })

  useEffect(() => {
    if (open) reset(link ? { ...link, active: link.active ? 'true' : 'false' } : EMPTY)
  }, [open, link, reset])

  const save = useMutation({
    mutationFn: (v: Values) => {
      const input = { ...v, active: v.active === 'true' }
      return link ? updateSocialLink(link.id, input) : createSocialLink(input)
    },
    onSuccess: () => {
      toast.success(link ? 'Enlace actualizado.' : 'Enlace creado.')
      void queryClient.invalidateQueries({ queryKey: ADMIN_SOCIAL_LINKS_KEY })
      void queryClient.invalidateQueries({ queryKey: SOCIAL_LINKS_KEY })
      onClose()
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  })

  const err = (k: keyof Values) => ({ 'aria-invalid': Boolean(errors[k]) })

  return (
    <Modal open={open} onOpenChange={(o) => !o && !save.isPending && onClose()}>
      <ModalContent className="max-h-[92vh] w-[calc(100%-2rem)] max-w-xl overflow-y-auto">
        <ModalHeader>
          <ModalTitle>{link ? 'Editar enlace' : 'Nuevo enlace'}</ModalTitle>
          <ModalDescription>
            Los enlaces activos aparecen en la landing y en el pie de página.
          </ModalDescription>
        </ModalHeader>
        <form
          onSubmit={handleSubmit((v) => save.mutate(v))}
          noValidate
          className="mt-5 grid gap-4 sm:grid-cols-2"
        >
          <Field label="Plataforma" htmlFor="soc-platform">
            <Select id="soc-platform" {...register('platform')}>
              {Object.entries(es.socialPlatform).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Estado" htmlFor="soc-active">
            <Select id="soc-active" {...register('active')}>
              <option value="true">Activo (visible)</option>
              <option value="false">Inactivo (oculto)</option>
            </Select>
          </Field>
          <Field
            label="Nombre visible"
            htmlFor="soc-name"
            error={errors.name?.message}
            className="sm:col-span-2"
          >
            <Input
              id="soc-name"
              placeholder="Ej.: EmprenSer Podcast"
              {...err('name')}
              {...register('name')}
            />
          </Field>
          <Field
            label="URL"
            htmlFor="soc-url"
            error={errors.url?.message}
            className="sm:col-span-2"
          >
            <Input
              id="soc-url"
              type="url"
              inputMode="url"
              placeholder="https://"
              {...err('url')}
              {...register('url')}
            />
          </Field>
          <Field
            label="Descripción (opcional)"
            htmlFor="soc-desc"
            error={errors.description?.message}
            className="sm:col-span-2"
          >
            <Textarea id="soc-desc" rows={3} {...err('description')} {...register('description')} />
          </Field>
          <ModalFooter className="mt-2 sm:col-span-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={save.isPending}>
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={save.isPending}
              className="bg-[#153b65] text-white hover:bg-[#0f2c4c]"
            >
              {save.isPending && <Spinner size="sm" className="text-white" />}{' '}
              {link ? 'Guardar cambios' : 'Crear enlace'}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}
