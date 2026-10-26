import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Lock, ShieldCheck } from 'lucide-react'
import { toast } from 'sonner'

import { createPayment } from '@/api/payments'
import { getErrorCode, getErrorMessage } from '@/api/helpers'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { useTimezone } from '@/hooks/useTimezone'
import type { AppointmentSummary } from '@/types/appointment'
import type { PaymentGateway } from '@/types/payment'
import { PENALTY_PERCENT, PENALTY_WINDOW_DAYS } from '@/utils/policy'
import { formatCurrencyCop, formatCurrencyUsd } from '@/utils/timezone'
import { GatewayPicker } from './GatewayPicker'

interface CheckoutPanelProps {
  summary: AppointmentSummary
  /** Devuelve el id de la cita a pagar; en el flujo de reserva la crea (y retiene el horario 15 min). */
  ensureAppointment: () => Promise<string>
  /** El horario ya no estaba disponible. */
  onSlotLost?: () => void
}

/** Paso 3 del agendamiento: elegir pasarela y salir al checkout externo. */
export function CheckoutPanel({ summary, ensureAppointment, onSlotLost }: CheckoutPanelProps) {
  const timezone = useTimezone()
  const [gateway, setGateway] = useState<PaymentGateway>(
    timezone.startsWith('America/Bogota') ? 'WOMPI' : 'GLOBAL66'
  )
  const [accepted, setAccepted] = useState(false)

  const pay = useMutation({
    mutationFn: async () => {
      const appointmentId = await ensureAppointment()
      return createPayment({ appointmentId, gateway })
    },
    onSuccess: ({ checkoutUrl }) => {
      toast.info('Te llevamos al checkout seguro de la pasarela…')
      window.location.assign(checkoutUrl)
    },
    onError: (error) => {
      const code = getErrorCode(error)
      if (code === 'SLOT_UNAVAILABLE' || code === 'HOLD_EXPIRED') {
        toast.error(getErrorMessage(error))
        onSlotLost?.()
        return
      }
      toast.error(getErrorMessage(error))
    },
  })

  const totals = {
    COP: formatCurrencyCop(summary.cop.total),
    USD: formatCurrencyUsd(summary.usd.total),
  }

  return (
    <div className="space-y-6">
      <GatewayPicker value={gateway} onChange={setGateway} totals={totals} />

      <div className="rounded-xl border border-amber-300/60 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
        <p className="font-semibold">Política de cancelación</p>
        <ul className="mt-1 list-disc space-y-1 pl-5 text-amber-900/90">
          <li>
            Cancelar o reagendar con menos de {PENALTY_WINDOW_DAYS} días de anticipación retiene el{' '}
            {PENALTY_PERCENT} % del valor pagado.
          </li>
          <li>Si no asistes y no cancelas, la cita queda como «No asistió» y no hay reembolso.</li>
        </ul>
      </div>

      <label className="flex items-start gap-3 text-sm leading-6 text-muted-foreground">
        <input
          type="checkbox"
          checked={accepted}
          onChange={(e) => setAccepted(e.target.checked)}
          className="mt-1.5 size-4 accent-[#153b65]"
        />
        <span>
          He leído y acepto la política de cancelación y el pago obligatorio para confirmar mi cita.
        </span>
      </label>

      <Button
        size="lg"
        disabled={!accepted || pay.isPending}
        onClick={() => pay.mutate()}
        className="h-12 w-full rounded-full bg-[#153b65] text-sm font-bold uppercase tracking-wide text-white hover:bg-[#0f2c4c]"
      >
        {pay.isPending ? <Spinner size="sm" className="text-white" /> : <Lock />}
        {pay.isPending
          ? 'Preparando pago…'
          : `Pagar ${gateway === 'WOMPI' ? totals.COP : totals.USD}`}
      </Button>
      <p className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
        <ShieldCheck className="size-4 text-[#3fbfb7]" aria-hidden="true" />
        Pago seguro en la plataforma de la pasarela. No almacenamos datos de tu tarjeta.
      </p>
    </div>
  )
}
