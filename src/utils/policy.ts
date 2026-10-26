import dayjs from 'dayjs'
import type { PenaltyInfo } from '@/types/appointment'
import type { Payment } from '@/types/payment'

export const PENALTY_PERCENT = 10
export const PENALTY_WINDOW_DAYS = 7
/** Tiempo que se reserva el horario mientras el usuario paga. */
export const HOLD_MINUTES = 15

/**
 * Cancelar o reagendar con menos de 7 días de anticipación retiene el 10 % de lo pagado.
 * Las citas no asistidas (NO_SHOW) no tienen reembolso.
 */
export function getPenaltyInfo(
  startUtc: string,
  payment?: Pick<Payment, 'amount' | 'currency' | 'status'> | null,
  now = dayjs()
): PenaltyInfo {
  const daysAhead = dayjs(startUtc).diff(now, 'day', true)
  const applies = daysAhead < PENALTY_WINDOW_DAYS
  const paid = payment && payment.status === 'APPROVED' ? payment : null
  const decimals = paid?.currency === 'COP' ? 0 : 2
  const factor = 10 ** decimals
  const penalty =
    paid && applies ? Math.round(paid.amount * (PENALTY_PERCENT / 100) * factor) / factor : 0
  return {
    applies: applies && Boolean(paid),
    percent: PENALTY_PERCENT,
    penalty,
    refund: paid ? Math.round((paid.amount - penalty) * factor) / factor : 0,
    currency: paid?.currency ?? null,
    daysAhead: Math.max(0, Math.floor(daysAhead)),
  }
}
