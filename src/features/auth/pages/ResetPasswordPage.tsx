import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'

import { resetPassword } from '@/api/auth'
import { getErrorMessage } from '@/api/helpers'
import { Field } from '@/components/ui/field'
import { APP_ROUTES } from '@/constants/routes'
import { AuthShell } from '../components/AuthShell'
import { PasswordInput } from '../components/PasswordInput'
import { SubmitButton } from '../components/SubmitButton'
import { resetSchema } from '../schemas/auth.schemas'
import type { ResetValues } from '../schemas/auth.schemas'

export function ResetPasswordPage() {
  const [params] = useSearchParams()
  const token = params.get('token')
  const navigate = useNavigate()
  const [formError, setFormError] = useState('')
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: { password: '', confirmPassword: '' },
  })

  async function onSubmit({ password }: ResetValues) {
    setFormError('')
    try {
      await resetPassword({ token: token!, password })
      toast.success('Contraseña actualizada. Ya puedes ingresar.')
      navigate(APP_ROUTES.login, { replace: true })
    } catch (error) {
      setFormError(getErrorMessage(error))
    }
  }

  return (
    <AuthShell
      eyebrow="Nueva contraseña"
      title="Crea una nueva contraseña"
      description="Elige una contraseña segura que no uses en otros sitios."
    >
      {!token ? (
        <div
          role="alert"
          className="rounded-xl border border-destructive/30 bg-destructive/5 p-5 text-sm"
        >
          <p className="font-semibold">El enlace no es válido.</p>
          <p className="mt-1 text-muted-foreground">Solicita uno nuevo para continuar.</p>
          <Link
            to={APP_ROUTES.recover}
            className="mt-3 inline-block font-semibold text-[#153b65] underline"
          >
            Solicitar nuevo enlace
          </Link>
        </div>
      ) : (
        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Field
            label="Nueva contraseña"
            htmlFor="password"
            error={errors.password?.message}
            hint="Mínimo 8 caracteres, con letras y números."
          >
            <PasswordInput
              id="password"
              autoComplete="new-password"
              aria-invalid={Boolean(errors.password)}
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
              aria-invalid={Boolean(errors.confirmPassword)}
              {...register('confirmPassword')}
            />
          </Field>
          {formError && (
            <p
              role="alert"
              className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
            >
              {formError}{' '}
              <Link to={APP_ROUTES.recover} className="font-semibold underline">
                Solicitar nuevo enlace
              </Link>
            </p>
          )}
          <SubmitButton loading={isSubmitting}>Guardar contraseña</SubmitButton>
        </form>
      )}
    </AuthShell>
  )
}
