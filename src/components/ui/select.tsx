import type { ComponentProps } from 'react'

import { cn } from '@/lib/utils'

/** Select nativo con el estilo del sistema de diseño (accesible y cómodo en móvil). */
export function Select({ className, children, ...props }: ComponentProps<'select'>) {
  return (
    <select
      data-slot="select"
      className={cn(
        'h-9 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive',
        className
      )}
      {...props}
    >
      {children}
    </select>
  )
}
