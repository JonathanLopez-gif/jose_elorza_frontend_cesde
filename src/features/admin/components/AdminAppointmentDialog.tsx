import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { CalendarClock, Globe2, Mail, User } from 'lucide-react'
import { toast } from 'sonner'

import {
  adminCancelAppointment,
  adminRescheduleAppointment,
  patchAdminAppointment,
} from '@/api/appointments'
import type { AdminAppointmentPatch } from '@/api/appointments'
import { getErrorCode, getErrorMessage } from '@/api/helpers'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { AppointmentStatusBadge } from '@/components/common/StatusBadge'
import { Button } from '@/components/ui/button'
import { Field } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  Modal,
  ModalContent,
  ModalDescription,
  ModalHeader,
  ModalTitle,
} from '@/components/ui/modal'
import { Spinner } from '@/components/ui/spinner'
import { AvailabilityCalendar } from '@/features/booking/components/AvailabilityCalendar'
import { SlotPicker } from '@/features/booking/components/SlotPicker'
import { useAvailability } from '@/features/booking/hooks/useAvailability'
import { useTimezone } from '@/hooks/useTimezone'
import type { Appointment, TimeSlot } from '@/types/appointment'
import { dayjs, formatDate, formatTime, formatUtc } from '@/utils/timezone'

type Mode = 'details' | 'reschedule'

/** Se remonta por cita (key) para que el estado interno siempre arranque limpio. */
export function AdminAppointmentDialog(props: {
  appointment: Appointment | null
  onClose: () => void
}) {
  return <AppointmentDialogBody key={props.appointment?.id ?? 'none'} {...props} />
}

function AppointmentDialogBody({
  appointment,
  onClose,
}: {
  appointment: Appointment | null
  onClose: () => void
}) {
  const tz = useTimezone()
  const queryClient = useQueryClient()
  const [mode, setMode] = useState<Mode>('details')
  const [video, setVideo] = useState(appointment?.videoUrl ?? '')
  const [confirmCancel, setConfirmCancel] = useState(false)
  const [date, setDate] = useState<string | null>(null)
  const [slot, setSlot] = useState<TimeSlot | null>(null)
  const availability = useAvailability({
    serviceId: mode === 'reschedule' ? appointment?.serviceId : undefined,
    date,
  })

  function refresh() {
    void queryClient.invalidateQueries({ queryKey: ['admin-appointments'] })
    void queryClient.invalidateQueries({ queryKey: ['admin-payments'] })
    void queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] })
    void queryClient.invalidateQueries({ queryKey: ['availability'] })
  }

  const patch = useMutation({
    mutationFn: (p: AdminAppointmentPatch) => patchAdminAppointment(appointment!.id, p),
    onSuccess: () => {
      toast.success('Cita actualizada.')
      refresh()
      onClose()
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  })
  const cancel = useMutation({
    mutationFn: () => adminCancelAppointment(appointment!.id),
    onSuccess: () => {
      toast.success('Cita cancelada. El usuario fue notificado.')
      refresh()
      onClose()
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  })
  const reschedule = useMutation({
    mutationFn: () =>
      adminRescheduleAppointment(appointment!.id, { startUtc: slot!.startUtc, timezone: tz }),
    onSuccess: () => {
      toast.success('Cita reagendada sin penalización.')
      refresh()
      onClose()
    },
    onError: (e) => {
      toast.error(getErrorMessage(e))
      if (getErrorCode(e) === 'SLOT_UNAVAILABLE') {
        setSlot(null)
        void availability.refetch()
      }
    },
  })

  const busy = patch.isPending || cancel.isPending || reschedule.isPending
  const a = appointment
  const confirmed = a?.status === 'CONFIRMED'
  const started = a ? dayjs(a.startUtc).isBefore(dayjs()) : false

  return (
    <>
      <Modal open={Boolean(a) && !confirmCancel} onOpenChange={(o) => !o && !busy && onClose()}>
        <ModalContent className="max-h-[92vh] w-[calc(100%-2rem)] max-w-xl overflow-y-auto">
          {a && (
            <>
              <ModalHeader>
                <ModalTitle>
                  {mode === 'details' ? 'Detalle de la cita' : 'Reagendar cita'}
                </ModalTitle>
                <ModalDescription>{a.serviceName}</ModalDescription>
              </ModalHeader>

              {mode === 'details' ? (
                <div className="mt-5 space-y-5 text-sm">
                  <div className="flex items-center justify-between">
                    <AppointmentStatusBadge status={a.status} />
                    <span className="text-xs text-muted-foreground">{a.id}</span>
                  </div>
                  <dl className="space-y-3 rounded-xl bg-muted/40 p-4">
                    <div className="flex items-start gap-2">
                      <User className="mt-0.5 size-4 text-muted-foreground" />
                      <div>
                        <dt className="sr-only">Cliente</dt>
                        <dd className="font-semibold">{a.userName}</dd>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Mail className="mt-0.5 size-4 text-muted-foreground" />
                      <dd>{a.userEmail}</dd>
                    </div>
                    <div className="flex items-start gap-2">
                      <CalendarClock className="mt-0.5 size-4 text-muted-foreground" />
                      <dd>
                        {formatDate(a.startUtc, tz, 'dddd D [de] MMMM YYYY')} ·{' '}
                        {formatTime(a.startUtc, tz)} – {formatTime(a.endUtc, tz)}
                      </dd>
                    </div>
                    <div className="flex items-start gap-2">
                      <Globe2 className="mt-0.5 size-4 text-muted-foreground" />
                      <dd className="text-muted-foreground">
                        {formatUtc(a.startUtc)} · cliente en {a.timezone}
                      </dd>
                    </div>
                  </dl>

                  {(confirmed || a.status === 'COMPLETED') && (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault()
                        patch.mutate({ videoUrl: video.trim() || null })
                      }}
                      className="space-y-2"
                    >
                      <Field
                        label="Enlace de videollamada"
                        htmlFor="adm-video"
                        hint="El usuario lo ve de inmediato en «Mis citas», sin pasos extra."
                      >
                        <div className="flex gap-2">
                          <Input
                            id="adm-video"
                            type="url"
                            placeholder="https://meet.google.com/…"
                            value={video}
                            onChange={(e) => setVideo(e.target.value)}
                          />
                          <Button
                            type="submit"
                            variant="outline"
                            disabled={busy || video.trim() === (a.videoUrl ?? '')}
                          >
                            Guardar
                          </Button>
                        </div>
                      </Field>
                    </form>
                  )}

                  {confirmed && (
                    <div className="flex flex-wrap gap-2 border-t pt-4">
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={busy || !started}
                        onClick={() => patch.mutate({ status: 'COMPLETED' })}
                        title={!started ? 'Disponible cuando inicie la cita' : undefined}
                      >
                        Marcar completada
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={busy || !started}
                        onClick={() => patch.mutate({ status: 'NO_SHOW' })}
                        title={!started ? 'Disponible cuando inicie la cita' : undefined}
                      >
                        No asistió
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={busy}
                        onClick={() => setMode('reschedule')}
                      >
                        Reagendar
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        disabled={busy}
                        onClick={() => setConfirmCancel(true)}
                      >
                        Cancelar cita
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="mt-5 space-y-5">
                  <p className="rounded-lg bg-[#3fbfb7]/15 px-4 py-3 text-sm text-[#153b65]">
                    Como administrador, reagendar no genera penalización para el cliente.
                  </p>
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
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setMode('details')} disabled={busy}>
                      Volver
                    </Button>
                    <Button
                      disabled={!slot || busy}
                      onClick={() => reschedule.mutate()}
                      className="bg-[#153b65] text-white hover:bg-[#0f2c4c]"
                    >
                      {reschedule.isPending && <Spinner size="sm" className="text-white" />}{' '}
                      Confirmar
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </ModalContent>
      </Modal>

      <ConfirmDialog
        open={confirmCancel}
        onOpenChange={setConfirmCancel}
        title="¿Cancelar esta cita?"
        description={a ? `${a.userName} · ${a.serviceName}` : undefined}
        confirmLabel="Sí, cancelar"
        destructive
        loading={cancel.isPending}
        onConfirm={() => cancel.mutate()}
      >
        <p className="text-sm text-muted-foreground">
          Cancelas tú, así que no se aplica penalización: el pago queda marcado para reembolso total
          (la devolución es manual).
        </p>
      </ConfirmDialog>
    </>
  )
}
