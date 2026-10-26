import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { CalendarX2 } from 'lucide-react'

import { EmptyState, ErrorState, LoadingBlock } from '@/components/common/States'
import { Button } from '@/components/ui/button'
import { APP_ROUTES } from '@/constants/routes'
import { useTimezone } from '@/hooks/useTimezone'
import { cn } from '@/lib/utils'
import { getErrorMessage } from '@/api/helpers'
import type { Appointment } from '@/types/appointment'
import { dayjs } from '@/utils/timezone'
import { AppointmentCard } from '../components/AppointmentCard'
import { CancelDialog } from '../components/CancelDialog'
import { RescheduleDialog } from '../components/RescheduleDialog'
import { useMyAppointments, useMyPayments } from '../hooks/useAccount'

type Tab = 'upcoming' | 'history'

export function MyAppointmentsPage() {
  const tz = useTimezone()
  const [tab, setTab] = useState<Tab>('upcoming')
  const [toCancel, setToCancel] = useState<Appointment | null>(null)
  const [toReschedule, setToReschedule] = useState<Appointment | null>(null)
  const { data: appointments, isLoading, isError, error, refetch } = useMyAppointments()
  const { data: payments } = useMyPayments()

  const { upcoming, history } = useMemo(() => {
    const list = appointments ?? []
    const now = dayjs()
    const isUpcoming = (a: Appointment) =>
      a.status === 'PENDING_PAYMENT' || (a.status === 'CONFIRMED' && dayjs(a.endUtc).isAfter(now))
    return {
      upcoming: list.filter(isUpcoming).sort((a, b) => a.startUtc.localeCompare(b.startUtc)),
      history: list
        .filter((a) => !isUpcoming(a))
        .sort((a, b) => b.startUtc.localeCompare(a.startUtc)),
    }
  }, [appointments])

  const paymentOf = (a: Appointment | null) =>
    payments?.find((p) => p.appointmentId === a?.id && p.status === 'APPROVED') ?? null
  const shown = tab === 'upcoming' ? upcoming : history

  if (isLoading) return <LoadingBlock label="Cargando tus citas…" />
  if (isError) return <ErrorState message={getErrorMessage(error)} onRetry={() => void refetch()} />

  return (
    <section aria-labelledby="citas-titulo">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h2 id="citas-titulo" className="sr-only">
          Mis citas
        </h2>
        <div
          role="tablist"
          aria-label="Filtrar citas"
          className="inline-flex rounded-full bg-white p-1 shadow-sm"
        >
          {(
            [
              ['upcoming', `Próximas (${upcoming.length})`],
              ['history', `Historial (${history.length})`],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              role="tab"
              aria-selected={tab === id}
              onClick={() => setTab(id)}
              className={cn(
                'rounded-full px-5 py-2 text-sm font-semibold transition-colors',
                tab === id
                  ? 'bg-[#153b65] text-white'
                  : 'text-muted-foreground hover:text-[#153b65]'
              )}
            >
              {label}
            </button>
          ))}
        </div>
        <Button asChild className="rounded-full bg-[#153b65] text-white hover:bg-[#0f2c4c]">
          <Link to={APP_ROUTES.services}>Agendar nueva sesión</Link>
        </Button>
      </div>

      {shown.length === 0 ? (
        <EmptyState
          icon={CalendarX2}
          title={tab === 'upcoming' ? 'No tienes citas próximas' : 'Aún no tienes historial'}
          description={
            tab === 'upcoming'
              ? 'Cuando agendes una sesión la verás aquí con su enlace de videollamada.'
              : 'Tus sesiones pasadas, canceladas y reagendadas aparecerán aquí.'
          }
          action={
            tab === 'upcoming' ? (
              <Button asChild className="rounded-full">
                <Link to={APP_ROUTES.services}>Ver servicios</Link>
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="grid gap-4">
          {shown.map((a) => (
            <AppointmentCard
              key={a.id}
              appointment={a}
              timezone={tz}
              onCancel={setToCancel}
              onReschedule={setToReschedule}
            />
          ))}
        </div>
      )}

      <CancelDialog
        appointment={toCancel}
        payment={paymentOf(toCancel)}
        timezone={tz}
        onClose={() => setToCancel(null)}
      />
      <RescheduleDialog
        appointment={toReschedule}
        payment={paymentOf(toReschedule)}
        timezone={tz}
        onClose={() => setToReschedule(null)}
      />
    </section>
  )
}
