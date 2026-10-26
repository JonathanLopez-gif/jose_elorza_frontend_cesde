import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

interface FieldProps {
  label: string
  htmlFor: string
  error?: string
  hint?: string
  className?: string
  children: ReactNode
}

/** Etiqueta + control + mensaje de error accesible (aria-describedby lo conecta el control). */
export function Field({ label, htmlFor, error, hint, className, children }: FieldProps) {
  return (
    <div className={cn('space-y-1.5', className)}>
      <label htmlFor={htmlFor} className="block text-sm font-semibold text-foreground">
        {label}
      </label>
      {children}
      {hint && !error && (
        <p id={`${htmlFor}-hint`} className="text-xs text-muted-foreground">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${htmlFor}-error`} role="alert" className="text-xs font-medium text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}
