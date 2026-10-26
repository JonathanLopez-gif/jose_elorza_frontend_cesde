import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

import { register as registerRequest } from '@/api/auth'
import { getErrorMessage } from '@/api/helpers'
import { TimezoneSelect } from '@/components/common/TimezoneSelect'
import { Field } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { APP_ROUTES } from '@/constants/routes'
import { getUserTimezone } from '@/utils/timezone'
import { AuthLink, AuthShell } from '../components/AuthShell'
import { PasswordInput } from '../components/PasswordInput'
import { SubmitButton } from '../components/SubmitButton'
import { registerSchema } from '../schemas/auth.schemas'
import type { RegisterValues } from '../schemas/auth.schemas'
import { startSession } from '../session'

export function RegisterPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from
  const [formError, setFormError] = useState('')
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      timezone: getUserTimezone(),
      acceptedTerms: false,
    },
  })

  async function onSubmit(values: RegisterValues) {
    setFormError('')
    try {
      const session = await registerRequest({
        name: values.name,
        email: values.email,
        password: values.password,
        timezone: values.timezone,
        acceptedTerms: values.acceptedTerms,
      })
      startSession(session)
      toast.success('¡Cuenta creada! Ya puedes agendar tu primera sesión.')
      navigate(from ?? APP_ROUTES.services, { replace: true })
    } catch (error) {
      setFormError(getErrorMessage(error))
    }
  }

  const invalid = (name: keyof RegisterValues) => ({
    'aria-invalid': Boolean(errors[name]),
    'aria-describedby': errors[name] ? `${name}-error` : undefined,
  })

  return (
    <AuthShell
      eyebrow="Comienza aquí"
      title="Crea tu cuenta"
      description="Guarda tus citas y recibe la información importante de tus sesiones."
      footer={<AuthLink to={APP_ROUTES.login}>Ya tengo cuenta</AuthLink>}
    >
      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Field label="Nombre completo" htmlFor="name" error={errors.name?.message}>
          <Input
            id="name"
            autoComplete="name"
            placeholder="Tu nombre"
            className="h-11"
            {...invalid('name')}
            {...register('name')}
          />
        </Field>
        <Field label="Correo electrónico" htmlFor="email" error={errors.email?.message}>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="nombre@correo.com"
            className="h-11"
            {...invalid('email')}
            {...register('email')}
          />
        </Field>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label="Contraseña"
            htmlFor="password"
            error={errors.password?.message}
            hint="Mínimo 8 caracteres, con letras y números."
          >
            <PasswordInput
              id="password"
              autoComplete="new-password"
              {...invalid('password')}
              {...register('password')}
            />
          </Field>
          <Field
            label="Confirmar contraseña"
            htmlFor="confirmPassword"
            error={errors.confirmPassword?.message}
          >
            <PasswordInput
              id="confirmPassword"
              autoComplete="new-password"
              {...invalid('confirmPassword')}
              {...register('confirmPassword')}
            />
          </Field>
        </div>
        <Field
          label="Zona horaria"
          htmlFor="timezone"
          error={errors.timezone?.message}
          hint="Verás todos los horarios en tu hora local, con su equivalente en UTC."
        >
          <TimezoneSelect
            id="timezone"
            className="h-11"
            {...invalid('timezone')}
            {...register('timezone')}
          />
        </Field>

        <div>
          <label className="flex items-start gap-3 text-sm leading-6 text-muted-foreground">
            <input
              type="checkbox"
              className="mt-1.5 size-4 accent-[#153b65]"
              {...invalid('acceptedTerms')}
              {...register('acceptedTerms')}
            />
            <span>
              Acepto los{' '}
              <Link
                to={APP_ROUTES.terms}
                target="_blank"
                className="font-semibold text-[#153b65] underline"
              >
                términos de uso
              </Link>{' '}
              y la{' '}
              <Link
                to={APP_ROUTES.privacy}
                target="_blank"
                className="font-semibold text-[#153b65] underline"
              >
                política de privacidad
              </Link>
              , y autorizo el tratamiento de mis datos personales (Ley 1581 de 2012).
            </span>
          </label>
          {errors.acceptedTerms && (
            <p
              id="acceptedTerms-error"
              role="alert"
              className="mt-1.5 text-xs font-medium text-destructive"
            >
              {errors.acceptedTerms.message}
            </p>
          )}
        </div>

        {formError && (
          <p
            role="alert"
            className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
          >
            {formError}
          </p>
        )}
        <SubmitButton loading={isSubmitting}>Crear cuenta</SubmitButton>
      </form>
    </AuthShell>
  )
}
