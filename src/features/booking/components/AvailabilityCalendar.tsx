import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { useMonthAvailability } from '@/features/booking/hooks/useAvailability'
import { useTimezone } from '@/hooks/useTimezone'
import { cn } from '@/lib/utils'
import type { DayAvailability } from '@/types/appointment'
import { dayjs } from '@/utils/timezone'

/** Hasta cuántos meses hacia adelante se puede navegar. */
const MAX_MONTHS_AHEAD = 6
const WEEKDAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

type DayState = 'past' | 'loading' | 'closed' | 'full' | 'available'

interface AvailabilityCalendarProps {
  serviceId: string | undefined
  /** Fecha seleccionada (AAAA-MM-DD, en la zona del usuario). */
  value: string | null
  onChange: (date: string) => void
}

function stateOf(
  date: string,
  today: string,
  info: DayAvailability | undefined,
  loading: boolean
): DayState {
  if (date < today) return 'past'
  if (!info) return loading ? 'loading' : 'closed'
  if (info.total === 0) return 'closed'
  return info.available > 0 ? 'available' : 'full'
}

function describe(state: DayState, info: DayAvailability | undefined): string {
  switch (state) {
    case 'past':
      return 'fecha pasada'
    case 'loading':
      return 'consultando disponibilidad'
    case 'closed':
      return 'sin horarios de atención'
    case 'full':
      return 'todos los horarios ocupados'
    default:
      return `${info!.available} ${info!.available === 1 ? 'horario disponible' : 'horarios disponibles'}`
  }
}

/**
 * Calendario mensual con la disponibilidad real del servicio: marca los días con cupo,
 * bloquea los días llenos o sin atención y muestra cuántos horarios quedan.
 */
export function AvailabilityCalendar({ serviceId, value, onChange }: AvailabilityCalendarProps) {
  const tz = useTimezone()
  const today = dayjs().tz(tz).format('YYYY-MM-DD')
  // Se trabaja con fechas "de calendario" (sin zona) a partir del día de hoy en la zona del usuario.
  const firstMonth = dayjs(today).startOf('month')
  const lastMonth = firstMonth.add(MAX_MONTHS_AHEAD, 'month')
  const [visible, setVisible] = useState(() => (value ? dayjs(value).startOf('month') : firstMonth))

  const month = visible.format('YYYY-MM')
  const { data, isLoading, isFetching, isError, refetch } = useMonthAvailability(serviceId, month)
  const byDate = new Map((data?.month === month ? data.days : []).map((d) => [d.date, d]))

  // Celdas: huecos iniciales (semana empieza el lunes) + días del mes.
  const leading = (visible.day() + 6) % 7
  const cells: (string | null)[] = [
    ...Array.from({ length: leading }, () => null),
    ...Array.from({ length: visible.daysInMonth() }, (_, i) =>
      visible.date(i + 1).format('YYYY-MM-DD')
    ),
  ]

  const canPrev = visible.isAfter(firstMonth, 'month')
  const canNext = visible.isBefore(lastMonth, 'month')
  const monthLabel = visible.locale('es').format('MMMM YYYY')
  const freeDays = [...byDate.values()].filter((d) => d.date >= today && d.available > 0).length

  return (
    <div className="rounded-2xl border bg-card p-4 sm:p-5">
      <div className="flex items-center justify-between gap-2">
        <Button
          type="button"
          size="icon-sm"
          variant="ghost"
          aria-label="Mes anterior"
          disabled={!canPrev}
          onClick={() => setVisible((v) => v.subtract(1, 'month'))}
        >
          <ChevronLeft />
        </Button>
        <h2
          className="flex items-center gap-2 text-base font-semibold capitalize text-[#153b65]"
          aria-live="polite"
        >
          {monthLabel}
          {isFetching && <Spinner size="sm" />}
        </h2>
        <Button
          type="button"
          size="icon-sm"
          variant="ghost"
          aria-label="Mes siguiente"
          disabled={!canNext}
          onClick={() => setVisible((v) => v.add(1, 'month'))}
        >
          <ChevronRight />
        </Button>
      </div>

      {isError ? (
        <div
          role="alert"
          className="mt-4 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-center text-sm"
        >
          <p className="font-medium">No pudimos cargar la disponibilidad del mes.</p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-3"
            onClick={() => void refetch()}
          >
            Reintentar
          </Button>
        </div>
      ) : (
        <>
          <div
            className="mt-4 grid grid-cols-7 gap-1 text-center text-xs font-semibold uppercase text-muted-foreground"
            aria-hidden="true"
          >
            {WEEKDAYS.map((d) => (
              <span key={d} className="py-1">
                {d}
              </span>
            ))}
          </div>
          <div
            className="mt-1 grid grid-cols-7 gap-1"
            role="group"
            aria-label={`Días de ${monthLabel}`}
          >
            {cells.map((date, i) => {
              if (!date) return <span key={`empty-${i}`} aria-hidden="true" />
              const info = byDate.get(date)
              const state = stateOf(date, today, info, isLoading)
              const selected = value === date
              const selectable = state === 'available'
              const label = `${dayjs(date).locale('es').format('dddd D [de] MMMM')}: ${describe(state, info)}`
              return (
                <button
                  key={date}
                  type="button"
                  disabled={!selectable}
                  aria-pressed={selected}
                  aria-label={label}
                  title={label}
                  onClick={() => onChange(date)}
                  className={cn(
                    'relative flex aspect-square min-h-10 flex-col items-center justify-center rounded-lg text-sm transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50',
                    state === 'available' &&
                      !selected &&
                      'bg-[#3fbfb7]/12 font-semibold text-[#153b65] hover:bg-[#3fbfb7]/25',
                    selected && 'bg-[#153b65] font-semibold text-white',
                    state === 'full' &&
                      'cursor-not-allowed bg-[repeating-linear-gradient(135deg,transparent,transparent_4px,rgba(220,38,38,0.12)_4px,rgba(220,38,38,0.12)_6px)] text-red-700/70 line-through',
                    (state === 'past' || state === 'closed') &&
                      'cursor-not-allowed text-muted-foreground/45',
                    state === 'loading' && 'animate-pulse text-muted-foreground',
                    date === today && !selected && 'ring-1 ring-[#153b65]/40'
                  )}
                >
                  <span>{dayjs(date).date()}</span>
                  {state === 'available' && (
                    <span
                      className={cn(
                        'mt-0.5 text-[10px] leading-none font-medium',
                        selected ? 'text-white/80' : 'text-[#3fbfb7]'
                      )}
                      aria-hidden="true"
                    >
                      {info!.available}
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
            <li className="flex items-center gap-1.5">
              <span className="size-3 rounded bg-[#3fbfb7]/30" aria-hidden="true" /> Con horarios
              (n.º = cupos)
            </li>
            <li className="flex items-center gap-1.5">
              <span
                className="size-3 rounded bg-[repeating-linear-gradient(135deg,transparent,transparent_2px,rgba(220,38,38,0.35)_2px,rgba(220,38,38,0.35)_3px)]"
                aria-hidden="true"
              />{' '}
              Lleno
            </li>
            <li className="flex items-center gap-1.5">
              <span
                className="size-3 rounded border border-dashed border-muted-foreground/40"
                aria-hidden="true"
              />{' '}
              Sin atención
            </li>
          </ul>
          {!isLoading && freeDays === 0 && (
            <p className="mt-3 rounded-lg bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
              No quedan horarios este mes.{canNext && ' Revisa el mes siguiente.'}
            </p>
          )}
          <p className="mt-3 text-xs text-muted-foreground">Fechas en tu zona horaria: {tz}</p>
        </>
      )}
    </div>
  )
}
