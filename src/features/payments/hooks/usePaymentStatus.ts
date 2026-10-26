import { useRef } from 'react'
import { useQuery } from '@tanstack/react-query'

import { getPayment } from '@/api/payments'

export const POLL_INTERVAL_MS = 3000
export const POLL_TIMEOUT_MS = 90_000

/**
 * Consulta el pago cada 3 s mientras siga PENDIENTE (equivale a esperar el webhook de la pasarela).
 * Se detiene al llegar a un estado final o al pasar 90 s desde que se abrió la página;
 * en ese caso la UI ofrece seguir desde "Mis citas".
 */
export function usePaymentStatus(paymentId: string | null) {
  // Momento en que empezó la espera de este pago. `dataUpdatedAt` no sirve: se renueva en cada consulta.
  // Se fija en la primera evaluación del intervalo (fuera del render) y se reinicia si cambia el pago.
  const started = useRef<{ id: string | null; at: number } | null>(null)

  return useQuery({
    queryKey: ['payment', paymentId],
    queryFn: () => getPayment(paymentId!),
    enabled: Boolean(paymentId),
    staleTime: 0,
    refetchInterval: (query) => {
      const data = query.state.data
      if (!data || data.status !== 'PENDING') return false
      if (started.current?.id !== paymentId) started.current = { id: paymentId, at: Date.now() }
      return Date.now() - started.current.at >= POLL_TIMEOUT_MS ? false : POLL_INTERVAL_MS
    },
  })
}
