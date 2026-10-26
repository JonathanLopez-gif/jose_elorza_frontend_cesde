import { useState } from 'react'
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Lock } from 'lucide-react'

import { getPayment, simulateGatewayResult } from '@/api/payments'
import { getErrorMessage } from '@/api/helpers'
import { ErrorState, LoadingBlock } from '@/components/common/States'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { APP_ROUTES } from '@/constants/routes'
import { env } from '@/config/env'
import { es } from '@/i18n/es'
import { formatCurrencyCop, formatCurrencyUsd } from '@/utils/timezone'

type Result = 'APPROVED' | 'DECLINED' | 'PENDING'

/**
 * Pasarela simulada (solo desarrollo con datos de prueba). En producción el backend devuelve
 * la URL real del checkout de Wompi o Global66 y el usuario vuelve a /pago/resultado.
 */
export function GatewaySimulatorPage() {
  const [params] = useSearchParams()
  const paymentId = params.get('paymentId')
  const navigate = useNavigate()
  const [busy, setBusy] = useState<Result | null>(null)
  const [error, setError] = useState('')
  const {
    data: payment,
    isLoading,
    isError,
    error: loadError,
  } = useQuery({
    queryKey: ['payment', paymentId, 'simulator'],
    queryFn: () => getPayment(paymentId!),
    enabled: Boolean(paymentId),
  })

  if (!env.mocksEnabled || !paymentId) return <Navigate to={APP_ROUTES.home} replace />

  async function choose(result: Result) {
    setBusy(result)
    setError('')
    try {
      await simulateGatewayResult(paymentId!, result)
      navigate(`${APP_ROUTES.payment.result}?paymentId=${paymentId}`, { replace: true })
    } catch (e) {
      setError(getErrorMessage(e))
      setBusy(null)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl">
        <div className="bg-slate-800 px-6 py-4 text-white">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-300">
            <Lock className="size-3.5" /> Checkout de pruebas
          </p>
          <p className="mt-1 text-lg font-bold text-white">
            {payment ? es.gateway[payment.gateway] : 'Pasarela'} · simulador
          </p>
        </div>
        <div className="space-y-5 p-6">
          {isLoading && <LoadingBlock />}
          {isError && <ErrorState message={getErrorMessage(loadError)} />}
          {payment && (
            <>
              <div className="rounded-xl bg-slate-50 p-4 text-sm">
                <p className="text-slate-500">Comercio</p>
                <p className="font-semibold">José Fernando Elorza</p>
                <p className="mt-3 text-slate-500">Concepto</p>
                <p className="font-semibold">{payment.serviceName}</p>
                <p className="mt-3 text-slate-500">Total a pagar</p>
                <p className="text-2xl font-bold">
                  {payment.currency === 'COP'
                    ? formatCurrencyCop(payment.amount)
                    : formatCurrencyUsd(payment.amount)}
                </p>
                <p className="text-xs text-slate-500">Ref. {payment.reference}</p>
              </div>
              <p className="text-sm text-slate-600">
                Elige qué respuesta debe devolver la pasarela para probar el flujo:
              </p>
              <div className="space-y-2.5">
                <Button
                  className="h-11 w-full bg-emerald-600 text-white hover:bg-emerald-700"
                  disabled={busy !== null}
                  onClick={() => void choose('APPROVED')}
                >
                  {busy === 'APPROVED' && <Spinner size="sm" className="text-white" />} Pago
                  aprobado
                </Button>
                <Button
                  className="h-11 w-full bg-amber-500 text-white hover:bg-amber-600"
                  disabled={busy !== null}
                  onClick={() => void choose('PENDING')}
                >
                  {busy === 'PENDING' && <Spinner size="sm" className="text-white" />} Dejar
                  pendiente (se aprueba en ~8 s)
                </Button>
                <Button
                  className="h-11 w-full bg-red-600 text-white hover:bg-red-700"
                  disabled={busy !== null}
                  onClick={() => void choose('DECLINED')}
                >
                  {busy === 'DECLINED' && <Spinner size="sm" className="text-white" />} Pago
                  rechazado
                </Button>
              </div>
              {error && (
                <p role="alert" className="text-sm text-destructive">
                  {error}
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  )
}
