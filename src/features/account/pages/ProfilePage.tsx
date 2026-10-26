import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { z } from 'zod'

import { updateProfile } from '@/api/auth'
import { getErrorMessage } from '@/api/helpers'
import { TimezoneSelect } from '@/components/common/TimezoneSelect'
import { Button } from '@/components/ui/button'
import { Field } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { Switch } from '@/components/ui/switch'
import { useAuthStore } from '@/store/slices/auth.store'

const schema = z.object({
  name: z.string().trim().min(3, 'Ingresa tu nombre completo'),
  phone: z
    .string()
    .trim()
    .regex(/^$|^\+?[\d\s()-]{7,20}$/, 'Ingresa un teléfono válido'),
  timezone: z.string().min(1, 'Selecciona tu zona horaria'),
  emailNotifications: z.boolean(),
})
type Values = z.infer<typeof schema>

export function ProfilePage() {
  const user = useAuthStore((s) => s.user)!
  const setUser = useAuthStore((s) => s.setUser)
  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors, isDirty },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: user.name,
      phone: user.phone ?? '',
      timezone: user.timezone,
      emailNotifications: user.emailNotifications,
    },
  })
  const notifications = useWatch({ control, name: 'emailNotifications' })

  const save = useMutation({
    mutationFn: (v: Values) =>
      updateProfile({
        name: v.name,
        phone: v.phone || null,
        timezone: v.timezone,
        emailNotifications: v.emailNotifications,
      }),
    onSuccess: (updated) => {
      setUser(updated)
      reset({
        name: updated.name,
        phone: updated.phone ?? '',
        timezone: updated.timezone,
        emailNotifications: updated.emailNotifications,
      })
      toast.success('Perfil actualizado.')
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  })

  return (
    <form
      onSubmit={handleSubmit((v) => save.mutate(v))}
      noValidate
      className="mx-auto max-w-2xl space-y-8 rounded-2xl border bg-white p-6 shadow-sm sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Nombre completo"
          htmlFor="name"
          error={errors.name?.message}
          className="sm:col-span-2"
        >
          <Input
            id="name"
            className="h-11"
            aria-invalid={Boolean(errors.name)}
            {...register('name')}
          />
        </Field>
        <Field label="Correo electrónico" htmlFor="email" hint="El correo no se puede cambiar.">
          <Input id="email" className="h-11" value={user.email} readOnly disabled />
        </Field>
        <Field label="Teléfono (opcional)" htmlFor="phone" error={errors.phone?.message}>
          <Input
            id="phone"
            type="tel"
            className="h-11"
            placeholder="+57 300 000 0000"
            aria-invalid={Boolean(errors.phone)}
            {...register('phone')}
          />
        </Field>
        <Field
          label="Zona horaria"
          htmlFor="timezone"
          error={errors.timezone?.message}
          hint="Todos los horarios de la plataforma se muestran en esta zona, junto a su equivalente en UTC."
          className="sm:col-span-2"
        >
          <TimezoneSelect id="timezone" className="h-11" {...register('timezone')} />
        </Field>
      </div>

      <div className="flex items-start justify-between gap-6 rounded-xl border bg-muted/30 p-5">
        <div>
          <label htmlFor="emailNotifications" className="font-semibold">
            Notificaciones por correo
          </label>
          <p className="mt-1 text-sm text-muted-foreground">
            Recibe la confirmación de tus citas, recordatorios y cambios de horario en{' '}
            <strong>{user.email}</strong>.
          </p>
          <p className="mt-2 text-xs font-semibold text-[#153b65]">
            {notifications ? 'Activadas' : 'Desactivadas'}
          </p>
        </div>
        <Switch
          id="emailNotifications"
          checked={notifications}
          onCheckedChange={(v) => setValue('emailNotifications', v, { shouldDirty: true })}
          aria-label="Notificaciones por correo"
        />
      </div>

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          disabled={!isDirty || save.isPending}
          onClick={() => reset()}
        >
          Descartar
        </Button>
        <Button
          type="submit"
          disabled={!isDirty || save.isPending}
          className="bg-[#153b65] text-white hover:bg-[#0f2c4c]"
        >
          {save.isPending && <Spinner size="sm" className="text-white" />} Guardar cambios
        </Button>
      </div>
    </form>
  )
}
