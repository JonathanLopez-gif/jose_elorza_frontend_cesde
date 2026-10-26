import { z } from 'zod'

const email = z.string().trim().min(1, 'Ingresa tu correo').email('Ingresa un correo válido')

const password = z
  .string()
  .min(8, 'Mínimo 8 caracteres')
  .regex(/[A-Za-z]/, 'Debe incluir al menos una letra')
  .regex(/\d/, 'Debe incluir al menos un número')

export const loginSchema = z.object({
  email,
  password: z.string().min(1, 'Ingresa tu contraseña'),
})

export const registerSchema = z
  .object({
    name: z.string().trim().min(3, 'Ingresa tu nombre completo'),
    email,
    password,
    confirmPassword: z.string().min(1, 'Confirma tu contraseña'),
    timezone: z.string().min(1, 'Selecciona tu zona horaria'),
    acceptedTerms: z
      .boolean()
      .refine((v) => v, 'Debes aceptar los términos y la política de privacidad'),
  })
  .refine((d) => d.password === d.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Las contraseñas no coinciden',
  })

export const forgotSchema = z.object({ email })

export const resetSchema = z
  .object({ password, confirmPassword: z.string().min(1, 'Confirma tu contraseña') })
  .refine((d) => d.password === d.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Las contraseñas no coinciden',
  })

export type LoginValues = z.infer<typeof loginSchema>
export type RegisterValues = z.infer<typeof registerSchema>
export type ForgotValues = z.infer<typeof forgotSchema>
export type ResetValues = z.infer<typeof resetSchema>
