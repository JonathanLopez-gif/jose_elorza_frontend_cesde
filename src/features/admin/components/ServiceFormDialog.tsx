import { useEffect } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { z } from 'zod'

import { createService, updateService } from '@/api/services'
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
import { es } from '@/i18n/es'
import type { Service } from '@/types/service'
import { splitIva } from '@/utils/timezone'
import { formatCurrencyCop, formatCurrencyUsd } from '@/utils/timezone'

const num = (label: string, min = 0) =>
  z.number({ message: `Ingresa ${label}` }).min(min, `Mínimo ${min}`)

const schema = z.object({
  name: z.string().trim().min(3, 'Mínimo 3 caracteres'),
  description: z.string().trim().min(10, 'Describe el servicio (mínimo 10 caracteres)'),
  priceCop: num('el precio en COP'),
  priceUsd: num('el precio en USD'),
  durationMinutes: num('la duración', 15),
  modality: z.enum(['VIRTUAL', 'PRESENCIAL', 'HIBRIDA']),
  type: z.enum(['INDIVIDUAL', 'GRUPAL']),
  status: z.enum(['ACTIVE', 'INACTIVE']),
})
type Values = z.infer<typeof schema>

const EMPTY: Values = {
  name: '',
  description: '',
  priceCop: 0,
  priceUsd: 0,
  durationMinutes: 60,
  modality: 'VIRTUAL',
  type: 'INDIVIDUAL',
  status: 'ACTIVE',
}

interface Props {
  open: boolean
  service: Service | null
  onClose: () => void
}

/** Alta y edición de servicios. Los precios en COP y USD son independientes y ya incluyen IVA. */
export function ServiceFormDialog({ open, service, onClose }: Props) {
  const queryClient = useQueryClient()
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<Values>({ resolver: zodResolver(schema), defaultValues: EMPTY })

  useEffect(() => {
    if (open) reset(service ? { ...EMPTY, ...service } : EMPTY)
  }, [open, service, reset])

  const save = useMutation({
    mutationFn: (v: Values) => (service ? updateService(service.id, v) : createService(v)),
    onSuccess: () => {
      toast.success(service ? 'Servicio actualizado.' : 'Servicio creado.')
      void queryClient.invalidateQueries({ queryKey: ['admin-services'] })
      void queryClient.invalidateQueries({ queryKey: ['services'] })
      onClose()
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  })

  const cop = Number(useWatch({ control, name: 'priceCop' })) || 0
  const usd = Number(useWatch({ control, name: 'priceUsd' })) || 0
  const err = (k: keyof Values) => ({ 'aria-invalid': Boolean(errors[k]) })

  return (
    <Modal open={open} onOpenChange={(o) => !o && !save.isPending && onClose()}>
      <ModalContent className="max-h-[92vh] w-[calc(100%-2rem)] max-w-2xl overflow-y-auto">
        <ModalHeader>
          <ModalTitle>{service ? 'Editar servicio' : 'Nuevo servicio'}</ModalTitle>
          <ModalDescription>
            Los precios son independientes en COP y USD y ya incluyen el IVA del 19 %.
          </ModalDescription>
        </ModalHeader>
        <form
          onSubmit={handleSubmit((v) => save.mutate(v))}
          noValidate
          className="mt-5 grid gap-4 sm:grid-cols-2"
        >
          <Field
            label="Nombre"
            htmlFor="svc-name"
            error={errors.name?.message}
            className="sm:col-span-2"
          >
            <Input id="svc-name" {...err('name')} {...register('name')} />
          </Field>
          <Field
            label="Descripción"
            htmlFor="svc-desc"
            error={errors.description?.message}
            className="sm:col-span-2"
          >
            <Textarea id="svc-desc" rows={5} {...err('description')} {...register('description')} />
          </Field>
          <Field
            label="Precio en COP"
            htmlFor="svc-cop"
            error={errors.priceCop?.message}
            hint={
              cop > 0
                ? `Base ${formatCurrencyCop(splitIva(cop, 0).base)} + IVA ${formatCurrencyCop(splitIva(cop, 0).iva)}`
                : undefined
            }
          >
            <Input
              id="svc-cop"
              type="number"
              min={0}
              step={1000}
              inputMode="numeric"
              {...err('priceCop')}
              {...register('priceCop', { valueAsNumber: true })}
            />
          </Field>
          <Field
            label="Precio en USD"
            htmlFor="svc-usd"
            error={errors.priceUsd?.message}
            hint={
              usd > 0
                ? `Base ${formatCurrencyUsd(splitIva(usd).base)} + IVA ${formatCurrencyUsd(splitIva(usd).iva)}`
                : undefined
            }
          >
            <Input
              id="svc-usd"
              type="number"
              min={0}
              step={1}
              inputMode="decimal"
              {...err('priceUsd')}
              {...register('priceUsd', { valueAsNumber: true })}
            />
          </Field>
          <Field
            label="Duración (minutos)"
            htmlFor="svc-dur"
            error={errors.durationMinutes?.message}
          >
            <Input
              id="svc-dur"
              type="number"
              min={15}
              step={15}
              inputMode="numeric"
              {...err('durationMinutes')}
              {...register('durationMinutes', { valueAsNumber: true })}
            />
          </Field>
          <Field label="Estado" htmlFor="svc-status">
            <Select id="svc-status" {...register('status')}>
              <option value="ACTIVE">{es.serviceStatus.ACTIVE}</option>
              <option value="INACTIVE">{es.serviceStatus.INACTIVE}</option>
            </Select>
          </Field>
          <Field label="Modalidad" htmlFor="svc-mod">
            <Select id="svc-mod" {...register('modality')}>
              {Object.entries(es.modality).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Tipo" htmlFor="svc-type">
            <Select id="svc-type" {...register('type')}>
              {Object.entries(es.serviceType).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </Select>
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
              {service ? 'Guardar cambios' : 'Crear servicio'}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}
