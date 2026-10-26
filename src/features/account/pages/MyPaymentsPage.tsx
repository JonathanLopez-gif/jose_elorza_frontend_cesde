import { Download, Receipt } from 'lucide-react'
import { toast } from 'sonner'

import { PaymentStatusBadge } from '@/components/common/StatusBadge'
import { Td, TableShell, Th } from '@/components/common/DataTable'
import { EmptyState, ErrorState, LoadingBlock } from '@/components/common/States'
import { Button } from '@/components/ui/button'
import { getErrorMessage } from '@/api/helpers'
import { es } from '@/i18n/es'
import { useTimezone } from '@/hooks/useTimezone'
import { downloadReceiptPdf } from '@/utils/receipt'
import { formatCurrencyCop, formatCurrencyUsd, formatDateTime } from '@/utils/timezone'
import { useMyPayments } from '../hooks/useAccount'

export function MyPaymentsPage() {
  const tz = useTimezone()
  const { data, isLoading, isError, error, refetch } = useMyPayments()

  if (isLoading) return <LoadingBlock label="Cargando tus pagos…" />
  if (isError) return <ErrorState message={getErrorMessage(error)} onRetry={() => void refetch()} />
  if (!data || data.length === 0) {
    return (
      <EmptyState
        icon={Receipt}
        title="Todavía no tienes pagos"
        description="Cuando pagues una sesión verás aquí el estado y podrás descargar tu comprobante."
      />
    )
  }

  return (
    <section aria-label="Historial de pagos">
      <TableShell>
        <thead>
          <tr>
            <Th>Fecha</Th>
            <Th>Servicio</Th>
            <Th>Pasarela</Th>
            <Th className="text-right">Monto</Th>
            <Th>Estado</Th>
            <Th className="text-right">Comprobante</Th>
          </tr>
        </thead>
        <tbody>
          {data.map((p) => (
            <tr key={p.id}>
              <Td className="whitespace-nowrap">{formatDateTime(p.paidAt ?? p.createdAt, tz)}</Td>
              <Td>
                <p className="font-medium">{p.serviceName}</p>
                <p className="text-xs text-muted-foreground">{p.reference}</p>
                {p.status === 'APPROVED' && p.refundDue ? (
                  <p className="mt-1 text-xs text-amber-700">
                    Reembolso pendiente:{' '}
                    {p.currency === 'COP'
                      ? formatCurrencyCop(p.refundDue)
                      : formatCurrencyUsd(p.refundDue)}{' '}
                    (lo gestiona José)
                  </p>
                ) : null}
              </Td>
              <Td>{es.gateway[p.gateway]}</Td>
              <Td className="whitespace-nowrap text-right font-semibold">
                {p.currency === 'COP' ? formatCurrencyCop(p.amount) : formatCurrencyUsd(p.amount)}
              </Td>
              <Td>
                <PaymentStatusBadge status={p.status} />
              </Td>
              <Td className="text-right">
                {p.status === 'APPROVED' || p.status === 'REFUNDED' ? (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      downloadReceiptPdf(p, tz).catch(() =>
                        toast.error('No se pudo generar el PDF.')
                      )
                    }
                  >
                    <Download /> PDF
                  </Button>
                ) : (
                  <span className="text-xs text-muted-foreground">—</span>
                )}
              </Td>
            </tr>
          ))}
        </tbody>
      </TableShell>
      <p className="mt-3 text-xs text-muted-foreground">
        Los precios incluyen IVA del 19 %, desglosado en el comprobante.
      </p>
    </section>
  )
}
