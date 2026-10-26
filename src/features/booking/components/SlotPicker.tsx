import { AlertCircle, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { cn } from '@/lib/utils'
import type { TimeSlot } from '@/types/appointment'
import { useTimezone } from '@/hooks/useTimezone'
import { formatTime, formatUtc } from '@/utils/timezone'

interface SlotPickerProps {
  slots: TimeSlot[] | undefined
  isLoading: boolean
  isError: boolean
  errorMessage?: string
  selectedStartUtc: string | null
  onSelect: (slot: TimeSlot) => void
  onRetry?: () => void
}

/** Horarios del día en la zona del usuario. Los ocupados se ven en su lugar, bloqueados. */
export function SlotPicker({
  slots,
  isLoading,
  isError,
  errorMessage,
  selectedStartUtc,
  onSelect,
  onRetry,
}: SlotPickerProps) {
  const tz = useTimezone()
  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-2 py-10 text-sm text-muted-foreground">
        <Spinner size="sm" /> Consultando disponibilidad…
      </div>
    )
  }
  if (isError) {
    return (
      <div
        role="alert"
        className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-center"
      >
        <AlertCircle className="mx-auto size-6 text-destructive" />
        <p className="mt-2 text-sm font-medium">No pudimos obtener la disponibilidad</p>
        <p className="mt-1 text-xs text-muted-foreground">{errorMessage}</p>
        {onRetry && (
          <Button variant="outline" size="sm" className="mt-3" onClick={onRetry}>
            Reintentar
          </Button>
        )}
      </div>
    )
  }
  if (!slots || slots.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        No hay horarios publicados para esta fecha. Elige otro día.
      </p>
    )
  }
  const availableCount = slots.filter((s) => s.available).length

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Horarios en tu zona ({tz}), con su equivalencia UTC. {availableCount} de {slots.length}{' '}
        disponibles.
      </p>
      {availableCount === 0 && (
        <p role="status" className="rounded-lg bg-muted/50 px-3 py-2 text-sm text-muted-foreground">
          Todos los horarios de este día están ocupados. Prueba otra fecha.
        </p>
      )}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
        {slots.map((slot) => {
          const selected = selectedStartUtc === slot.startUtc
          const time = formatTime(slot.startUtc, tz)
          if (!slot.available) {
            return (
              <button
                key={slot.startUtc}
                type="button"
                disabled
                aria-label={`${time}: ocupado`}
                className="cursor-not-allowed rounded-lg border border-dashed border-muted-foreground/30 bg-muted/40 px-3 py-2.5 text-left text-sm text-muted-foreground/70"
              >
                <span className="flex items-center justify-between gap-1 font-medium line-through">
                  {time}
                  <Lock className="size-3.5 shrink-0" aria-hidden="true" />
                </span>
                <span className="block text-xs">Ocupado</span>
              </button>
            )
          }
          return (
            <button
              key={slot.startUtc}
              type="button"
              aria-pressed={selected}
              onClick={() => onSelect(slot)}
              className={cn(
                'rounded-lg border px-3 py-2.5 text-left text-sm transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50',
                selected
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-input bg-background hover:border-primary/50 hover:bg-muted/40'
              )}
            >
              <span className="block font-medium">{time}</span>
              <span
                className={cn(
                  'block text-xs',
                  selected ? 'text-primary-foreground/80' : 'text-muted-foreground'
                )}
              >
                {formatUtc(slot.startUtc)}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
