import { CalendarClock, CalendarPlus, CreditCard, Globe2, Video } from 'lucide-react'
import { Link } from 'react-router-dom'

import { AppointmentStatusBadge } from '@/components/common/StatusBadge'
import { Button } from '@/components/ui/button'
import { APP_ROUTES } from '@/constants/routes'
import { formatCountdown, useCountdown } from '@/hooks/useCountdown'
import { es } from '@/i18n/es'
import type { Appointment } from '@/types/appointment'
import { downloadIcs } from '@/utils/calendar'
import { PENALTY_PERCENT, PENALTY_WINDOW_DAYS } from '@/utils/policy'
import { dayjs, formatDate, formatTime, formatUtc } from '@/utils/timezone'

function HoldTimer({ until }: { until: string }) {
  const seconds = useCountdown(until)
  if (seconds <= 0)
    return (
      <p className="text-xs font-medium text-destructive">
        La reserva expiró. Cancela esta cita y elige un nuevo horario.
      </p>
    )
  return (
    <p className="text-xs font-medium text-amber-700">
      Horario reservado por {formatCountdown(seconds)} para completar el pago.
    </p>
  )
}

interface AppointmentCardProps {
  appointment: Appointment
  timezone: string
  onCancel: (a: Appointment) => void
  onReschedule: (a: Appointment) => void
}

export function AppointmentCard({
  appointment: a,
  timezone,
  onCancel,
  onReschedule,
}: AppointmentCardProps) {
  const future = dayjs(a.startUtc).isAfter(dayjs())
  const soon = future && dayjs(a.startUtc).diff(dayjs(), 'day', true) < PENALTY_WINDOW_DAYS
  const confirmed = a.status === 'CONFIRMED'
  const pending = a.status === 'PENDING_PAYMENT'

  return (
    <article className="rounded-xl border bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-heading text-lg font-bold text-[#153b65]">{a.serviceName}</h3>
          <p className="mt-1 flex items-center gap-2 text-sm font-medium">
            <CalendarClock className="size-4 text-[#3fbfb7]" aria-hidden="true" />
            {formatDate(a.startUtc, timezone, 'dddd D [de] MMMM YYYY')} ·{' '}
            {formatTime(a.startUtc, timezone)}
          </p>
          <p className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
            <Globe2 className="size-3.5" aria-hidden="true" /> {timezone} · {formatUtc(a.startUtc)}
          </p>
        </div>
        <AppointmentStatusBadge status={a.status} />
      </div>

      {(confirmed || a.status === 'COMPLETED') && (
        <div className="mt-4 text-sm">
          {a.videoUrl ? (
            <a
              href={a.videoUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#153b65] px-4 py-2 text-xs font-bold uppercase tracking-wide text-white hover:bg-[#0f2c4c]"
            >
              <Video className="size-4" />{' '}
              {confirmed ? 'Unirme a la videollamada' : 'Enlace de la sesión'}
            </a>
          ) : confirmed ? (
            <p className="text-muted-foreground">
              El enlace de la videollamada aparecerá aquí apenas José lo asigne.
            </p>
          ) : null}
        </div>
      )}

      {pending && a.holdExpiresAt && (
        <div className="mt-4">
          <HoldTimer until={a.holdExpiresAt} />
        </div>
      )}

      {confirmed && soon && (
        <p className="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-xs leading-5 text-amber-900">
          Faltan menos de {PENALTY_WINDOW_DAYS} días: cancelar o reagendar ahora retiene el{' '}
          {PENALTY_PERCENT} % de lo pagado.
        </p>
      )}
      {a.status === 'NO_SHOW' && (
        <p className="mt-4 rounded-lg bg-muted px-3 py-2 text-xs leading-5 text-muted-foreground">
          No registramos tu asistencia ni una cancelación previa, por eso esta cita no tiene
          reembolso.
        </p>
      )}
      {a.status === 'CANCELLED' && a.penaltyApplied && (
        <p className="mt-4 rounded-lg bg-muted px-3 py-2 text-xs leading-5 text-muted-foreground">
          Se canceló con menos de {PENALTY_WINDOW_DAYS} días de anticipación: se retuvo el{' '}
          {PENALTY_PERCENT} % del valor pagado.
        </p>
      )}
      {a.status === 'RESCHEDULED' && (
        <p className="mt-4 text-xs text-muted-foreground">
          Esta cita se movió a otra fecha; busca la nueva en «Próximas».
        </p>
      )}
      {a.rescheduledFromId && a.penaltyApplied && confirmed && (
        <p className="mt-4 text-xs text-muted-foreground">
          Reagendada con penalización del {PENALTY_PERCENT} %.
        </p>
      )}

      {(confirmed && future) || pending ? (
        <div className="mt-5 flex flex-wrap gap-2 border-t pt-4">
          {pending && (
            <Button
              asChild
              size="sm"
              className="rounded-full bg-[#153b65] text-white hover:bg-[#0f2c4c]"
            >
              <Link to={APP_ROUTES.payment.pay(a.id)}>
                <CreditCard /> Completar pago
              </Link>
            </Button>
          )}
          {confirmed && future && (
            <>
              <Button
                size="sm"
                variant="outline"
                className="rounded-full"
                onClick={() => onReschedule(a)}
              >
                Reagendar
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="rounded-full"
                onClick={() => downloadIcs(a)}
              >
                <CalendarPlus /> Calendario
              </Button>
            </>
          )}
          <Button
            size="sm"
            variant="destructive"
            className="rounded-full"
            onClick={() => onCancel(a)}
          >
            Cancelar
          </Button>
        </div>
      ) : null}
      <p className="sr-only">{es.appointmentStatus[a.status]}</p>
    </article>
  )
}
