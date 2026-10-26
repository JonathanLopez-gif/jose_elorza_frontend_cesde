import { Badge } from '@/components/ui/badge'
import { es } from '@/i18n/es'
import type { AppointmentStatus } from '@/types/appointment'
import type { PaymentStatus } from '@/types/payment'

type BadgeVariant =
  'default' | 'secondary' | 'outline' | 'destructive' | 'success' | 'warning' | 'info'

const appointmentVariant: Record<AppointmentStatus, BadgeVariant> = {
  PENDING_PAYMENT: 'warning',
  CONFIRMED: 'success',
  CANCELLED: 'destructive',
  COMPLETED: 'info',
  NO_SHOW: 'outline',
  RESCHEDULED: 'outline',
}

const paymentVariant: Record<PaymentStatus, BadgeVariant> = {
  PENDING: 'warning',
  APPROVED: 'success',
  DECLINED: 'destructive',
  REFUNDED: 'outline',
}

export function AppointmentStatusBadge({ status }: { status: AppointmentStatus }) {
  return <Badge variant={appointmentVariant[status]}>{es.appointmentStatus[status]}</Badge>
}

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  return <Badge variant={paymentVariant[status]}>{es.paymentStatus[status]}</Badge>
}
