import { useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  CalendarPlus,
  CheckCircle2,
  Clock3,
  Download,
  MailCheck,
  RotateCcw,
  Video,
  XCircle,
} from 'lucide-react'
import { toast } from 'sonner'

import { getAppointment } from '@/api/appointments'
import { getErrorMessage } from '@/api/helpers'
import { ErrorState, LoadingBlock } from '@/components/common/States'
import { Container } from '@/components/layout/Container'
import { Button } from '@/components/ui/button'
import { APP_ROUTES } from '@/constants/routes'
import { POLL_TIMEOUT_MS, usePaymentStatus } from '@/features/payments/hooks/usePaymentStatus'
import { es } from '@/i18n/es'
import { useTimezone } from '@/hooks/useTimezone'
import { useAuthStore } from '@/store/slices/auth.store'
import { downloadIcs } from '@/utils/calendar'
import { downloadReceiptPdf } from '@/utils/receipt'
import { formatDate, formatTime, formatUtc } from '@/utils/timezone'

/**
 * Página de retorno de la pasarela. Muestra el resultado (éxito / fallo / pendiente),
 * espera la confirmación con polling y, al aprobarse, deja visible el resumen de la cita.
 */
export function PaymentResultPage() {
  const [params] = useSearchParams()
  const paymentId = params.get('paymentId')
  const tz = useTimezone()
  const user = useAuthStore((s) => s.user)
  const queryClient = useQueryClient()
  const { data: payment, isLoading, isError, error, refetch } = usePaymentStatus(paymentId)
  const { data: appointment } = useQuery({
    queryKey: ['appointment', payment?.appointmentId],
    queryFn: () => getAppointment(payment!.appointmentId),
    enabled: Boolean(payment?.appointmentId),
  })
  const announced = useRef(false)
  const [waitedLong, setWaitedLong] = useState(false)

  useEffect(() => {
    if (payment?.status === 'APPROVED' && !announced.current) {
      announced.current = true
      toast.success('¡Pago aprobado! Tu cita quedó confirmada.')
      void queryClient.invalidateQueries({ queryKey: ['my-appointments'] })
      void queryClient.invalidateQueries({ queryKey: ['my-payments'] })
      void queryClient.invalidateQueries({ queryKey: ['availability'] })
      void queryClient.invalidateQueries({ queryKey: ['appointment'] })
    }
  }, [payment?.status, queryClient])

  useEffect(() => {
    if (payment?.status !== 'PENDING') return
    const t = window.setTimeout(() => setWaitedLong(true), POLL_TIMEOUT_MS)
    return () => window.clearTimeout(t)
  }, [payment?.status])

  if (!paymentId) {
    return (
      <Container className="py-20">
        <ErrorState message="No encontramos la referencia del pago." />
      </Container>
    )
  }
  if (isLoading) return <LoadingBlock label="Consultando tu pago…" />
  if (isError || !payment) {
    return (
      <Container className="py-16">
        <ErrorState message={getErrorMessage(error)} onRetry={() => void refetch()} />
      </Container>
    )
  }

  return (
    <div className="min-h-[70vh] bg-[#f7f5f1] py-12 sm:py-16">
      <Container className="max-w-2xl">
        <div className="rounded-2xl border bg-white p-6 shadow-sm sm:p-10">
          {payment.status === 'APPROVED' && (
            <>
              <span className="flex size-14 items-center justify-center rounded-full bg-[#3fbfb7]/15">
                <CheckCircle2 className="size-8 text-[#3fbfb7]" aria-hidden="true" />
              </span>
              <h1 className="mt-5 font-heading text-3xl font-bold text-[#153b65]">
                ¡Tu cita está confirmada!
              </h1>
              <p className="mt-2 text-muted-foreground">
                Recibimos tu pago correctamente. Referencia <strong>{payment.reference}</strong>.
              </p>

              {appointment && (
                <dl className="mt-8 space-y-4 rounded-xl bg-muted/40 p-5 text-sm">
                  <div>
                    <dt className="text-muted-foreground">Servicio</dt>
                    <dd className="font-semibold">{appointment.serviceName}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Fecha y hora ({tz})</dt>
                    <dd className="font-semibold">
                      {formatDate(appointment.startUtc, tz, 'dddd D [de] MMMM YYYY')} ·{' '}
                      {formatTime(appointment.startUtc, tz)}
                    </dd>
                    <dd className="text-xs text-muted-foreground">
                      Equivale a {formatUtc(appointment.startUtc)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Videollamada</dt>
                    <dd>
                      {appointment.videoUrl ? (
                        <a
                          href={appointment.videoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 font-semibold text-[#153b65] underline"
                        >
                          <Video className="size-4" /> Unirme a la sesión
                        </a>
                      ) : (
                        <span className="text-muted-foreground">
                          José compartirá el enlace aquí apenas lo asigne; lo verás en «Mis citas».
                        </span>
                      )}
                    </dd>
                  </div>
                </dl>
              )}

              {user?.emailNotifications && (
                <p className="mt-5 flex items-center gap-2 text-sm text-muted-foreground">
                  <MailCheck className="size-4 text-[#3fbfb7]" aria-hidden="true" />
                  Te enviamos la confirmación a {user.email}.
                </p>
              )}

              <div className="mt-8 flex flex-wrap gap-3">
                <Button
                  asChild
                  className="rounded-full bg-[#153b65] px-6 text-white hover:bg-[#0f2c4c]"
                >
                  <Link to={APP_ROUTES.account.appointments}>Ver mis citas</Link>
                </Button>
                {appointment && (
                  <Button
                    variant="outline"
                    className="rounded-full"
                    onClick={() => downloadIcs(appointment)}
                  >
                    <CalendarPlus /> Añadir al calendario
                  </Button>
                )}
                <Button
                  variant="outline"
                  className="rounded-full"
                  onClick={() => void downloadReceiptPdf(payment, tz)}
                >
                  <Download /> Comprobante
                </Button>
              </div>
            </>
          )}

          {payment.status === 'PENDING' && (
            <div role="status" aria-live="polite">
              <span className="flex size-14 items-center justify-center rounded-full bg-amber-100">
                <Clock3 className="size-8 text-amber-600" aria-hidden="true" />
              </span>
              <h1 className="mt-5 font-heading text-3xl font-bold text-[#153b65]">
                Estamos confirmando tu pago
              </h1>
              <p className="mt-2 text-muted-foreground">
                {waitedLong
                  ? 'La pasarela aún no confirma el pago. No lo repitas: apenas llegue la confirmación tu cita quedará activa y la verás en «Mis citas».'
                  : 'Esto toma unos segundos. Mantén esta página abierta: se actualiza sola.'}
              </p>
              {!waitedLong && (
                <p className="mt-6 flex items-center gap-3 text-sm text-muted-foreground">
                  <span className="size-2.5 animate-ping rounded-full bg-amber-500" /> Verificando
                  con {es.gateway[payment.gateway]}…
                </p>
              )}
              <Button asChild variant="outline" className="mt-8 rounded-full">
                <Link to={APP_ROUTES.account.appointments}>Ir a mis citas</Link>
              </Button>
            </div>
          )}

          {payment.status === 'DECLINED' && (
            <>
              <span className="flex size-14 items-center justify-center rounded-full bg-red-100">
                <XCircle className="size-8 text-red-600" aria-hidden="true" />
              </span>
              <h1 className="mt-5 font-heading text-3xl font-bold text-[#153b65]">
                No se completó el pago
              </h1>
              <p className="mt-2 text-muted-foreground">
                La pasarela rechazó o canceló la operación y no se realizó ningún cobro. Tu horario
                se mantiene reservado unos minutos para que puedas reintentar.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button
                  asChild
                  className="rounded-full bg-[#153b65] px-6 text-white hover:bg-[#0f2c4c]"
                >
                  <Link to={APP_ROUTES.payment.pay(payment.appointmentId)}>
                    <RotateCcw /> Reintentar el pago
                  </Link>
                </Button>
                <Button asChild variant="outline" className="rounded-full">
                  <Link to={APP_ROUTES.services}>Elegir otro servicio</Link>
                </Button>
              </div>
            </>
          )}

          {payment.status === 'REFUNDED' && (
            <>
              <h1 className="font-heading text-3xl font-bold text-[#153b65]">
                Este pago fue reembolsado
              </h1>
              <p className="mt-2 text-muted-foreground">{payment.refundNote}</p>
              <Button asChild className="mt-8 rounded-full">
                <Link to={APP_ROUTES.account.payments}>Ver mis pagos</Link>
              </Button>
            </>
          )}
        </div>
      </Container>
    </div>
  )
}
