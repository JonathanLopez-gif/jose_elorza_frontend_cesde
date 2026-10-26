import { useMemo, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { AlertCircle, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'

import { cancelAppointment, createAppointment } from '@/api/appointments'
import { Stepper } from '@/components/common/Stepper'
import { Container } from '@/components/layout/Container'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { APP_ROUTES } from '@/constants/routes'
import { AppointmentSummaryCard } from '@/features/booking/components/AppointmentSummary'
import { AvailabilityCalendar } from '@/features/booking/components/AvailabilityCalendar'
import { SlotPicker } from '@/features/booking/components/SlotPicker'
import { useAvailability } from '@/features/booking/hooks/useAvailability'
import { buildSummary } from '@/features/booking/utils'
import { CheckoutPanel } from '@/features/payments/components/CheckoutPanel'
import { useService } from '@/features/services/hooks/useServices'
import { useTimezone } from '@/hooks/useTimezone'
import type { TimeSlot } from '@/types/appointment'

type Step = 'select' | 'summary' | 'payment'
const STEP_INDEX: Record<Step, number> = { select: 0, summary: 1, payment: 2 }

export function BookingPage() {
  const { serviceId } = useParams<{ serviceId: string }>()
  const tz = useTimezone()
  const [step, setStep] = useState<Step>('select')
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null)
  /** Cita ya creada (con horario retenido) para no duplicarla si el pago se reintenta. */
  const createdId = useRef<string | null>(null)

  const {
    data: service,
    isLoading: serviceLoading,
    isError: serviceError,
    error: serviceErr,
  } = useService(serviceId)
  const {
    data: availability,
    isLoading: availLoading,
    isError: availError,
    error: availErr,
    refetch: refetchAvail,
    isFetching: availFetching,
  } = useAvailability({ serviceId, date: selectedDate })

  const summary = useMemo(() => {
    if (!service || !selectedSlot) return null
    return buildSummary({
      serviceId: service.id,
      serviceName: service.name,
      durationMinutes: service.durationMinutes,
      priceCop: service.priceCop,
      priceUsd: service.priceUsd,
      startUtc: selectedSlot.startUtc,
      endUtc: selectedSlot.endUtc,
      timezone: tz,
    })
  }, [service, selectedSlot, tz])

  /** Si ya se había retenido un horario y el usuario cambia de idea, se libera. */
  function releaseHeldSlot() {
    if (createdId.current) {
      void cancelAppointment(createdId.current).catch(() => undefined)
      createdId.current = null
    }
  }

  function handleDateChange(date: string) {
    releaseHeldSlot()
    setSelectedDate(date)
    setSelectedSlot(null)
    setStep('select')
  }

  function goToSummary() {
    if (!selectedSlot) {
      toast.error('Selecciona un horario disponible.')
      return
    }
    const stillAvailable = availability?.slots?.some(
      (s) => s.startUtc === selectedSlot.startUtc && s.available
    )
    if (availability && stillAvailable === false) {
      toast.error('Este horario acaba de ser ocupado. Actualizamos la disponibilidad.')
      setSelectedSlot(null)
      void refetchAvail()
      return
    }
    setStep('summary')
  }

  function handleSlotLost() {
    createdId.current = null
    setSelectedSlot(null)
    setStep('select')
    void refetchAvail()
  }

  async function ensureAppointment(): Promise<string> {
    if (createdId.current) return createdId.current
    const appointment = await createAppointment({
      serviceId: service!.id,
      startUtc: selectedSlot!.startUtc,
      timezone: tz,
    })
    createdId.current = appointment.id
    return appointment.id
  }

  if (serviceLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }
  if (serviceError || !service) {
    return (
      <Container className="py-20">
        <div role="alert" className="mx-auto max-w-md text-center">
          <AlertCircle className="mx-auto size-10 text-destructive" />
          <p className="mt-4 font-semibold">Servicio no disponible</p>
          <p className="mt-1 text-sm text-muted-foreground">{(serviceErr as Error)?.message}</p>
          <Button className="mt-6" asChild>
            <Link to={APP_ROUTES.services}>Ir al catálogo</Link>
          </Button>
        </div>
      </Container>
    )
  }

  return (
    <div className="min-h-[70vh] bg-background py-10 sm:py-12">
      <Container>
        <Link
          to={APP_ROUTES.serviceDetail(service.id)}
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="size-4" /> Volver al servicio
        </Link>
        <header className="mb-8 mt-6 flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">
              Agendamiento
            </p>
            <h1 className="mt-2 font-heading text-3xl font-bold tracking-tight text-[#153b65]">
              {service.name}
            </h1>
            <p className="mt-2 text-muted-foreground">
              {service.durationMinutes} min · Tu zona horaria: {tz}
            </p>
          </div>
          <Stepper steps={['Fecha y hora', 'Resumen', 'Pago']} current={STEP_INDEX[step]} />
        </header>

        {step === 'select' && (
          <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
            <div className="space-y-6">
              <AvailabilityCalendar
                serviceId={service.id}
                value={selectedDate}
                onChange={handleDateChange}
              />
              {!selectedDate && (
                <p className="text-sm text-muted-foreground">
                  Selecciona un día marcado para ver sus horarios.
                </p>
              )}
            </div>
            <div>
              {selectedDate && (
                <>
                  <div className="mb-3 flex items-center justify-between">
                    <h2 className="text-base font-semibold">Horarios disponibles</h2>
                    {availFetching && !availLoading && (
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Spinner size="sm" /> Actualizando
                      </span>
                    )}
                  </div>
                  <SlotPicker
                    slots={availability?.slots}
                    isLoading={availLoading}
                    isError={availError}
                    errorMessage={(availErr as Error)?.message}
                    selectedStartUtc={selectedSlot?.startUtc ?? null}
                    onSelect={setSelectedSlot}
                    onRetry={() => void refetchAvail()}
                  />
                  {selectedSlot && (
                    <Button
                      className="mt-6 w-full rounded-full bg-[#153b65] px-8 text-white hover:bg-[#0f2c4c] sm:w-auto"
                      onClick={goToSummary}
                    >
                      Continuar al resumen
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {step === 'summary' && summary && (
          <div className="mx-auto max-w-lg space-y-6">
            <AppointmentSummaryCard
              summary={summary}
              note="Tu horario se reserva por 15 minutos cuando inicias el pago. La cita queda confirmada al aprobarse el pago."
            />
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button variant="outline" className="flex-1" onClick={() => setStep('select')}>
                Cambiar horario
              </Button>
              <Button
                className="flex-1 bg-[#153b65] text-white hover:bg-[#0f2c4c]"
                onClick={() => setStep('payment')}
              >
                Continuar al pago
              </Button>
            </div>
          </div>
        )}

        {step === 'payment' && summary && (
          <div className="mx-auto grid max-w-4xl gap-8 lg:grid-cols-[1fr_1.1fr]">
            <div className="space-y-4">
              <AppointmentSummaryCard summary={summary} />
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  releaseHeldSlot()
                  setStep('select')
                }}
              >
                Cambiar horario
              </Button>
            </div>
            <CheckoutPanel
              summary={summary}
              ensureAppointment={ensureAppointment}
              onSlotLost={handleSlotLost}
            />
          </div>
        )}
      </Container>
    </div>
  )
}
