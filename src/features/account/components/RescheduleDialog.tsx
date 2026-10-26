import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { rescheduleAppointment } from '@/api/appointments'
import { getErrorCode, getErrorMessage } from '@/api/helpers'
import { Button } from '@/components/ui/button'
import {
  Modal,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from '@/components/ui/modal'
import { Spinner } from '@/components/ui/spinner'
import { AvailabilityCalendar } from '@/features/booking/components/AvailabilityCalendar'
import { SlotPicker } from '@/features/booking/components/SlotPicker'
import { useAvailability } from '@/features/booking/hooks/useAvailability'
import { getPenaltyInfo, PENALTY_PERCENT, PENALTY_WINDOW_DAYS } from '@/utils/policy'
import { formatDate, formatTime } from '@/utils/timezone'
import type { Appointment, TimeSlot } from '@/types/appointment'
import type { Payment } from '@/types/payment'
import { formatMoney as money } from '@/utils/money'

interface RescheduleDialogProps {
  appointment: Appointment | null
  payment?: Payment | null
  timezone: string
  onClose: () => void
}

export function RescheduleDialog({
  appointment,
  payment,
  timezone,
  onClose,
}: RescheduleDialogProps) {
  const queryClient = useQueryClient()
  const [date, setDate] = useState<string | null>(null)
  const [slot, setSlot] = useState<TimeSlot | null>(null)
  const availability = useAvailability({ serviceId: appointment?.serviceId, date })

  const mutation = useMutation({
    mutationFn: () =>
      rescheduleAppointment(appointment!.id, { startUtc: slot!.startUtc, timezone }),
    onSuccess: () => {
      toast.success('Tu cita fue reagendada.')
      void queryClient.invalidateQueries({ queryKey: ['my-appointments'] })
      void queryClient.invalidateQueries({ queryKey: ['my-payments'] })
      void queryClient.invalidateQueries({ queryKey: ['availability'] })
      handleClose()
    },
    onError: (e) => {
      toast.error(getErrorMessage(e))
      if (getErrorCode(e) === 'SLOT_UNAVAILABLE') {
        setSlot(null)
        void availability.refetch()
      }
    },
  })

  function handleClose() {
    setDate(null)
    setSlot(null)
    onClose()
  }

  const info = appointment ? getPenaltyInfo(appointment.startUtc, payment) : null

  return (
    <Modal
      open={Boolean(appointment)}
      onOpenChange={(o) => !o && !mutation.isPending && handleClose()}
    >
      <ModalContent className="max-h-[90vh] w-[calc(100%-2rem)] max-w-2xl overflow-y-auto">
        <ModalHeader>
          <ModalTitle>Reagendar cita</ModalTitle>
          {appointment && (
            <ModalDescription>
              {appointment.serviceName} · actualmente {formatDate(appointment.startUtc, timezone)}{' '}
              {formatTime(appointment.startUtc, timezone)}
            </ModalDescription>
          )}
        </ModalHeader>

        {info?.applies && (
          <div
            role="alert"
            className="mt-4 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-950"
          >
            <p className="font-semibold">
              Reagendar ahora tiene una penalización del {PENALTY_PERCENT} %
            </p>
            <p className="mt-1">
              Faltan menos de {PENALTY_WINDOW_DAYS} días para tu cita. Se retendrán{' '}
              <strong>{money(info.penalty, info.currency)}</strong> del valor pagado.
            </p>
          </div>
        )}

        <div className="mt-5 space-y-5">
          <AvailabilityCalendar
            serviceId={appointment?.serviceId}
            value={date}
            onChange={(d) => {
              setDate(d)
              setSlot(null)
            }}
          />
          {date && (
            <SlotPicker
              slots={availability.data?.slots}
              isLoading={availability.isLoading}
              isError={availability.isError}
              errorMessage={(availability.error as Error | null)?.message}
              selectedStartUtc={slot?.startUtc ?? null}
              onSelect={setSlot}
              onRetry={() => void availability.refetch()}
            />
          )}
        </div>

        <ModalFooter className="mt-6">
          <Button variant="outline" onClick={handleClose} disabled={mutation.isPending}>
            Volver
          </Button>
          <Button
            disabled={!slot || mutation.isPending}
            onClick={() => mutation.mutate()}
            className="bg-[#153b65] text-white hover:bg-[#0f2c4c]"
          >
            {mutation.isPending && <Spinner size="sm" className="text-white" />}
            Confirmar nuevo horario
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
