import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { cancelAppointment } from '@/api/appointments'
import { getErrorMessage } from '@/api/helpers'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { formatMoney as money } from '@/utils/money'
import { formatDate, formatTime } from '@/utils/timezone'
import { getPenaltyInfo, PENALTY_PERCENT, PENALTY_WINDOW_DAYS } from '@/utils/policy'
import type { Appointment } from '@/types/appointment'
import type { Payment } from '@/types/payment'

interface CancelDialogProps {
  appointment: Appointment | null
  payment?: Payment | null
  timezone: string
  onClose: () => void
}

/** Cancelación con aviso explícito de la penalización antes de confirmar. */
export function CancelDialog({ appointment, payment, timezone, onClose }: CancelDialogProps) {
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: (id: string) => cancelAppointment(id),
    onSuccess: () => {
      toast.success('Tu cita fue cancelada.')
      void queryClient.invalidateQueries({ queryKey: ['my-appointments'] })
      void queryClient.invalidateQueries({ queryKey: ['my-payments'] })
      void queryClient.invalidateQueries({ queryKey: ['availability'] })
      onClose()
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  })

  const info =
    appointment && appointment.status === 'CONFIRMED'
      ? getPenaltyInfo(appointment.startUtc, payment)
      : null
  const paid = Boolean(info && info.currency)

  return (
    <ConfirmDialog
      open={Boolean(appointment)}
      onOpenChange={(open) => !open && onClose()}
      title="¿Cancelar esta cita?"
      description={
        appointment
          ? `${appointment.serviceName} · ${formatDate(appointment.startUtc, timezone)} ${formatTime(appointment.startUtc, timezone)}`
          : undefined
      }
      confirmLabel="Sí, cancelar cita"
      destructive
      loading={mutation.isPending}
      onConfirm={() => appointment && mutation.mutate(appointment.id)}
    >
      {appointment?.status === 'PENDING_PAYMENT' && (
        <p className="rounded-lg bg-muted px-4 py-3 text-sm">
          Aún no has pagado esta cita, así que no se genera ningún cobro y el horario se libera.
        </p>
      )}
      {info && paid && info.applies && (
        <div
          role="alert"
          className="space-y-2 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-950"
        >
          <p className="font-semibold">Se aplica una penalización del {PENALTY_PERCENT} %</p>
          <p>
            Faltan {info.daysAhead} día(s) para la cita y la política exige al menos{' '}
            {PENALTY_WINDOW_DAYS}. Se retendrán{' '}
            <strong>{money(info.penalty, info.currency)}</strong> y se te devolverán{' '}
            <strong>{money(info.refund, info.currency)}</strong>.
          </p>
          <p className="text-xs text-amber-900/80">
            La devolución la registra José manualmente; no es automática.
          </p>
        </div>
      )}
      {info && paid && !info.applies && (
        <p className="rounded-lg bg-[#3fbfb7]/15 px-4 py-3 text-sm text-[#153b65]">
          Cancelas con más de {PENALTY_WINDOW_DAYS} días de anticipación: sin penalización. Se te
          devolverán <strong>{money(info.refund, info.currency)}</strong> (devolución manual).
        </p>
      )}
    </ConfirmDialog>
  )
}
