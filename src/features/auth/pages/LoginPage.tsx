import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { KeyRound } from 'lucide-react'

import { login } from '@/api/auth'
import { getErrorMessage } from '@/api/helpers'
import { Field } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { APP_ROUTES } from '@/constants/routes'
import { env } from '@/config/env'
import { AuthLink, AuthShell } from '../components/AuthShell'
import { PasswordInput } from '../components/PasswordInput'
import { SubmitButton } from '../components/SubmitButton'
import { loginSchema } from '../schemas/auth.schemas'
import type { LoginValues } from '../schemas/auth.schemas'
import { startSession } from '../session'

const DEMO = [
  { label: 'Usuario', email: 'usuario@correo.com', password: 'Usuario123!' },
  { label: 'Administrador', email: 'admin@joseelorza.com', password: 'Admin123!' },
]

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from
  const [formError, setFormError] = useState('')
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  async function onSubmit(values: LoginValues) {
    setFormError('')
    try {
      const session = await login(values)
      startSession(session)
      toast.success(`¡Hola, ${session.user.name.split(' ')[0]}!`)
      navigate(
        from ??
          (session.user.role === 'ADMIN' ? APP_ROUTES.admin.root : APP_ROUTES.account.appointments),
        { replace: true }
      )
    } catch (error) {
      setFormError(getErrorMessage(error))
    }
  }

  return (
    <AuthShell
      eyebrow="Qué bueno verte"
      title="Ingresa a tu espacio"
      description="Consulta tus sesiones, tus pagos y continúa tu proceso."
      footer={
        <>
          <AuthLink to={APP_ROUTES.register}>Crear cuenta</AuthLink>
          <AuthLink to={APP_ROUTES.recover}>Olvidé mi contraseña</AuthLink>
        </>
      }
    >
      {from && (
        <p className="mb-5 rounded-lg bg-[#3fbfb7]/15 px-4 py-3 text-sm text-[#153b65]">
          Inicia sesión para continuar con tu reserva.
        </p>
      )}
      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Field label="Correo electrónico" htmlFor="email" error={errors.email?.message}>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="nombre@correo.com"
            className="h-11"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'email-error' : undefined}
            {...register('email')}
          />
        </Field>
        <Field label="Contraseña" htmlFor="password" error={errors.password?.message}>
          <PasswordInput
            id="password"
            autoComplete="current-password"
            placeholder="Tu contraseña"
            aria-invalid={Boolean(errors.password)}
            aria-describedby={errors.password ? 'password-error' : undefined}
            {...register('password')}
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
        <SubmitButton loading={isSubmitting}>Ingresar</SubmitButton>
      </form>

      {env.mocksEnabled && (
        <div className="mt-8 rounded-xl border border-dashed border-[#153b65]/25 bg-[#153b65]/[0.03] p-4">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#153b65]">
            <KeyRound className="size-3.5" /> Modo demostración
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Datos simulados. Elige un perfil para rellenar el formulario.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {DEMO.map((d) => (
              <button
                key={d.label}
                type="button"
                onClick={() => {
                  setValue('email', d.email, { shouldValidate: true })
                  setValue('password', d.password, { shouldValidate: true })
                }}
                className="rounded-full border border-[#153b65]/20 bg-white px-3 py-1.5 text-xs font-semibold text-[#153b65] hover:bg-[#153b65] hover:text-white"
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </AuthShell>
  )
}
