import { useMemo } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Timer } from 'lucide-react'

import { getAppointment } from '@/api/appointments'
import { getServiceById } from '@/api/services'
import { ErrorState, LoadingBlock } from '@/components/common/States'
import { Container } from '@/components/layout/Container'
import { Button } from '@/components/ui/button'
import { APP_ROUTES } from '@/constants/routes'
import { AppointmentSummaryCard } from '@/features/booking/components/AppointmentSummary'
import { buildSummary } from '@/features/booking/utils'
import { CheckoutPanel } from '@/features/payments/components/CheckoutPanel'
import { formatCountdown, useCountdown } from '@/hooks/useCountdown'
import { useTimezone } from '@/hooks/useTimezone'
import { getErrorMessage } from '@/api/helpers'

/** Retoma el pago de una cita que quedó en "Pago pendiente" (mientras dure la reserva de 15 min). */
export function PayAppointmentPage() {
  const { appointmentId } = useParams<{ appointmentId: string }>()
  const tz = useTimezone()
  const {
    data: appointment,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['appointment', appointmentId],
    queryFn: () => getAppointment(appointmentId!),
    enabled: Boolean(appointmentId),
  })
  const { data: service } = useQuery({
    queryKey: ['services', appointment?.serviceId],
    queryFn: () => getServiceById(appointment!.serviceId),
    enabled: Boolean(appointment),
  })
  const seconds = useCountdown(appointment?.holdExpiresAt)

  const summary = useMemo(
    () =>
      appointment && service
        ? buildSummary({
            serviceId: service.id,
            serviceName: service.name,
            durationMinutes: service.durationMinutes,
            priceCop: appointment.priceCop,
            priceUsd: appointment.priceUsd,
            startUtc: appointment.startUtc,
            endUtc: appointment.endUtc,
            timezone: tz,
          })
        : null,
    [appointment, service, tz]
  )

  if (isLoading) return <LoadingBlock />
  if (isError || !appointment) {
    return (
      <Container className="py-16">
        <ErrorState message={getErrorMessage(error)} onRetry={() => void refetch()} />
      </Container>
    )
  }
  if (appointment.status === 'CONFIRMED')
    return <Navigate to={APP_ROUTES.account.appointments} replace />

  const expired = appointment.status !== 'PENDING_PAYMENT' || seconds === 0

  return (
    <div className="min-h-[70vh] py-10 sm:py-12">
      <Container>
        <header className="mb-8 max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            Completar pago
          </p>
          <h1 className="mt-2 font-heading text-3xl font-bold tracking-tight text-[#153b65]">
            {appointment.serviceName}
          </h1>
        </header>
        {expired || !summary ? (
          <div role="alert" className="mx-auto max-w-lg rounded-xl border bg-card p-8 text-center">
            <Timer className="mx-auto size-10 text-muted-foreground" />
            <p className="mt-4 text-lg font-semibold">La reserva de este horario expiró</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Los horarios se retienen 15 minutos mientras se paga. Elige uno nuevo para continuar.
            </p>
            <Button
              asChild
              className="mt-6 rounded-full bg-[#153b65] text-white hover:bg-[#0f2c4c]"
            >
              <Link to={APP_ROUTES.bookingDetail(appointment.serviceId)}>Elegir otro horario</Link>
            </Button>
          </div>
        ) : (
          <div className="mx-auto grid max-w-4xl gap-8 lg:grid-cols-[1fr_1.1fr]">
            <div className="space-y-4">
              <p
                role="timer"
                className="flex items-center gap-2 rounded-xl bg-[#153b65] px-4 py-3 text-sm font-semibold text-white"
              >
                <Timer className="size-4" /> Tu horario está reservado por{' '}
                {formatCountdown(seconds)}
              </p>
              <AppointmentSummaryCard summary={summary} />
            </div>
            <CheckoutPanel summary={summary} ensureAppointment={async () => appointment.id} />
          </div>
        )}
      </Container>
    </div>
  )
}
