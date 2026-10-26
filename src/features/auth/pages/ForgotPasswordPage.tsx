import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'react-router-dom'
import { CheckCircle2 } from 'lucide-react'

import { forgotPassword } from '@/api/auth'
import { getErrorMessage } from '@/api/helpers'
import { Field } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { APP_ROUTES } from '@/constants/routes'
import { env } from '@/config/env'
import { AuthLink, AuthShell } from '../components/AuthShell'
import { SubmitButton } from '../components/SubmitButton'
import { forgotSchema } from '../schemas/auth.schemas'
import type { ForgotValues } from '../schemas/auth.schemas'

export function ForgotPasswordPage() {
  const [sent, setSent] = useState<{ email: string; devLink?: string } | null>(null)
  const [formError, setFormError] = useState('')
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotValues>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: '' },
  })

  async function onSubmit({ email }: ForgotValues) {
    setFormError('')
    try {
      const result = await forgotPassword(email)
      setSent({ email, devLink: result.devResetLink })
    } catch (error) {
      setFormError(getErrorMessage(error))
    }
  }

  return (
    <AuthShell
      eyebrow="Recupera el acceso"
      title="¿Olvidaste tu contraseña?"
      description="Escribe tu correo y te enviaremos un enlace para crear una nueva."
      footer={
        <>
          <AuthLink to={APP_ROUTES.login}>Volver a ingresar</AuthLink>
          <AuthLink to={APP_ROUTES.register}>Crear cuenta</AuthLink>
        </>
      }
    >
      {sent ? (
        <div role="status" className="rounded-xl border border-[#3fbfb7]/40 bg-[#3fbfb7]/10 p-5">
          <p className="flex items-center gap-2 font-semibold text-[#153b65]">
            <CheckCircle2 className="size-5 text-[#3fbfb7]" /> Revisa tu correo
          </p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Si <strong>{sent.email}</strong> está registrado, recibirás en unos minutos un enlace
            para restablecer tu contraseña. El enlace vence en 30 minutos.
          </p>
          {env.mocksEnabled && sent.devLink && (
            <p className="mt-4 rounded-lg border border-dashed border-[#153b65]/25 bg-white p-3 text-xs text-muted-foreground">
              <strong className="text-[#153b65]">Modo demostración:</strong> no se envía correo
              real.{' '}
              <Link
                to={sent.devLink.replace(window.location.origin, '')}
                className="font-semibold text-[#153b65] underline"
              >
                Abrir enlace de recuperación
              </Link>
            </p>
          )}
        </div>
      ) : (
        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Field label="Correo electrónico" htmlFor="email" error={errors.email?.message}>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="nombre@correo.com"
              className="h-11"
              aria-invalid={Boolean(errors.email)}
              {...register('email')}
            />
          </Field>
          {formError && (
            <p
              role="alert"
              className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
            >
              {formError}
            </p>
          )}
          <SubmitButton loading={isSubmitting}>Enviar instrucciones</SubmitButton>
        </form>
      )}
    </AuthShell>
  )
}
