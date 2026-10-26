import type { LucideIcon } from 'lucide-react'
import { AlertCircle, Inbox } from 'lucide-react'
import type { ReactNode } from 'react'

import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
}: {
  icon?: LucideIcon
  title: string
  description?: string
  action?: ReactNode
}) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-dashed bg-muted/30 px-6 py-12 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Icon className="size-6" />
      </span>
      <p className="mt-4 font-semibold">{title}</p>
      {description && <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}

export function ErrorState({ message, onRetry }: { message?: string; onRetry?: () => void }) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center rounded-xl border border-destructive/30 bg-destructive/5 px-6 py-10 text-center"
    >
      <AlertCircle className="size-8 text-destructive" />
      <p className="mt-3 font-semibold">No pudimos cargar la información</p>
      {message && <p className="mt-1 text-sm text-muted-foreground">{message}</p>}
      {onRetry && (
        <Button variant="outline" size="sm" className="mt-4" onClick={onRetry}>
          Reintentar
        </Button>
      )}
    </div>
  )
}

export function LoadingBlock({ label = 'Cargando…' }: { label?: string }) {
  return (
    <div
      role="status"
      className="flex items-center justify-center gap-3 py-16 text-sm text-muted-foreground"
    >
      <Spinner size="md" /> {label}
    </div>
  )
}

/** Pantalla de carga a página completa (arranque de la app, restauración de sesión). */
export function LoadingScreen() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#f7f5f1]"
    >
      <img src="/brand/logo-mark.svg" alt="" width={72} height={72} className="animate-pulse" />
      <p className="text-sm font-medium text-[#153b65]">Cargando…</p>
    </div>
  )
}
