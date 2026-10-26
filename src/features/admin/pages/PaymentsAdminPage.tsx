import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Download, FileSpreadsheet, Receipt, Undo2 } from 'lucide-react'
import { toast } from 'sonner'

import { refundPayment } from '@/api/payments'
import { getErrorMessage } from '@/api/helpers'
import { Td, TableShell, Th } from '@/components/common/DataTable'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { PageHeader } from '@/components/common/PageHeader'
import { Pagination } from '@/components/common/Pagination'
import { EmptyState, ErrorState, LoadingBlock } from '@/components/common/States'
import { PaymentStatusBadge } from '@/components/common/StatusBadge'
import { Button } from '@/components/ui/button'
import { Field } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { es } from '@/i18n/es'
import { useTimezone } from '@/hooks/useTimezone'
import type { Payment, PaymentFilters } from '@/types/payment'
import { downloadCsv, toCsv } from '@/utils/csv'
import { downloadReceiptPdf } from '@/utils/receipt'
import { formatCurrencyCop, formatCurrencyUsd, formatDateTime } from '@/utils/timezone'
import { paymentsToCsvRows, PAYMENT_CSV_COLUMNS } from '../csv'
import { useAdminPayments } from '../hooks/useAdminData'

const PAGE_SIZE = 10
const money = (p: Pick<Payment, 'amount' | 'currency'>) =>
  p.currency === 'COP' ? formatCurrencyCop(p.amount) : formatCurrencyUsd(p.amount)

export function PaymentsAdminPage() {
  const tz = useTimezone()
  const queryClient = useQueryClient()
  const [filters, setFilters] = useState<PaymentFilters>({
    status: '',
    gateway: '',
    from: '',
    to: '',
    search: '',
  })
  const [page, setPage] = useState(1)
  const [refunding, setRefunding] = useState<Payment | null>(null)
  const [note, setNote] = useState('')
  const clean = Object.fromEntries(Object.entries(filters).filter(([, v]) => v)) as PaymentFilters
  const { data, isLoading, isError, error, refetch } = useAdminPayments(clean)
  const set = (k: keyof PaymentFilters, v: string) => {
    setFilters((f) => ({ ...f, [k]: v }))
    setPage(1)
  }

  const refund = useMutation({
    mutationFn: (p: Payment) => refundPayment(p.id, note),
    onSuccess: () => {
      toast.success('Reembolso registrado. Recuerda devolver el dinero desde la pasarela.')
      void queryClient.invalidateQueries({ queryKey: ['admin-payments'] })
      void queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] })
      setRefunding(null)
      setNote('')
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  })

  const approved = (data ?? []).filter((p) => p.status === 'APPROVED')
  const totalCop = approved.filter((p) => p.currency === 'COP').reduce((s, p) => s + p.amount, 0)
  const totalUsd = approved.filter((p) => p.currency === 'USD').reduce((s, p) => s + p.amount, 0)
  const paged = (data ?? []).slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <>
      <PageHeader
        eyebrow="Administración"
        title="Pagos"
        description="Revisa los pagos de las pasarelas, marca reembolsos y descarga comprobantes."
        actions={
          <Button
            variant="outline"
            disabled={!data?.length}
            onClick={() =>
              downloadCsv(
                `pagos-${new Date().toISOString().slice(0, 10)}.csv`,
                toCsv(paymentsToCsvRows(data ?? [], tz), PAYMENT_CSV_COLUMNS)
              )
            }
          >
            <FileSpreadsheet /> Exportar CSV
          </Button>
        }
      />

      <div className="mb-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <Input
          aria-label="Buscar pagos"
          placeholder="Cliente, servicio o referencia"
          value={filters.search}
          onChange={(e) => set('search', e.target.value)}
          className="h-10"
        />
        <Select
          aria-label="Estado"
          value={filters.status}
          onChange={(e) => set('status', e.target.value)}
          className="h-10"
        >
          <option value="">Todos los estados</option>
          {Object.entries(es.paymentStatus).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </Select>
        <Select
          aria-label="Pasarela"
          value={filters.gateway}
          onChange={(e) => set('gateway', e.target.value)}
          className="h-10"
        >
          <option value="">Todas las pasarelas</option>
          {Object.entries(es.gateway).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </Select>
        <Input
          aria-label="Desde"
          type="date"
          value={filters.from}
          onChange={(e) => set('from', e.target.value)}
          className="h-10"
        />
        <Input
          aria-label="Hasta"
          type="date"
          value={filters.to}
          onChange={(e) => set('to', e.target.value)}
          className="h-10"
        />
      </div>

      {data && data.length > 0 && (
        <p className="mb-4 text-sm text-muted-foreground">
          {data.length} pago(s) · aprobados:{' '}
          <strong className="text-foreground">{formatCurrencyCop(totalCop)}</strong> y{' '}
          <strong className="text-foreground">{formatCurrencyUsd(totalUsd)}</strong>
        </p>
      )}

      {isLoading ? (
        <LoadingBlock />
      ) : isError ? (
        <ErrorState message={getErrorMessage(error)} onRetry={() => void refetch()} />
      ) : !data || data.length === 0 ? (
        <EmptyState icon={Receipt} title="No hay pagos con esos filtros" />
      ) : (
        <>
          <TableShell className="min-w-[820px]">
            <thead>
              <tr>
                <Th>Fecha</Th>
                <Th>Cliente</Th>
                <Th>Servicio</Th>
                <Th>Pasarela</Th>
                <Th className="text-right">Monto</Th>
                <Th>Estado</Th>
                <Th className="text-right">Acciones</Th>
              </tr>
            </thead>
            <tbody>
              {paged.map((p) => (
                <tr key={p.id}>
                  <Td className="whitespace-nowrap">
                    {formatDateTime(p.paidAt ?? p.createdAt, tz)}
                    <p className="text-xs text-muted-foreground">{p.reference}</p>
                  </Td>
                  <Td>{p.userName}</Td>
                  <Td>
                    {p.serviceName}
                    {p.refundDue ? (
                      <p className="text-xs text-amber-700">
                        Devolver{' '}
                        {p.currency === 'COP'
                          ? formatCurrencyCop(p.refundDue)
                          : formatCurrencyUsd(p.refundDue)}
                      </p>
                    ) : null}
                  </Td>
                  <Td>{es.gateway[p.gateway]}</Td>
                  <Td className="whitespace-nowrap text-right font-semibold">{money(p)}</Td>
                  <Td>
                    <PaymentStatusBadge status={p.status} />
                  </Td>
                  <Td className="text-right">
                    <div className="flex justify-end gap-1">
                      {(p.status === 'APPROVED' || p.status === 'REFUNDED') && (
                        <Button
                          size="icon-sm"
                          variant="ghost"
                          aria-label={`Descargar comprobante ${p.reference}`}
                          onClick={() =>
                            downloadReceiptPdf(p, tz).catch(() =>
                              toast.error('No se pudo generar el PDF.')
                            )
                          }
                        >
                          <Download />
                        </Button>
                      )}
                      {p.status === 'APPROVED' && (
                        <Button
                          size="icon-sm"
                          variant="ghost"
                          aria-label={`Marcar reembolso ${p.reference}`}
                          onClick={() => {
                            setRefunding(p)
                            setNote('')
                          }}
                        >
                          <Undo2 />
                        </Button>
                      )}
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </TableShell>
          <Pagination page={page} pageSize={PAGE_SIZE} total={data.length} onPageChange={setPage} />
        </>
      )}

      <ConfirmDialog
        open={Boolean(refunding)}
        onOpenChange={(o) => !o && setRefunding(null)}
        title="Marcar pago como reembolsado"
        description={
          refunding
            ? `${refunding.userName} · ${money(refunding)} · ${refunding.reference}`
            : undefined
        }
        confirmLabel="Marcar reembolso"
        destructive
        loading={refund.isPending}
        onConfirm={() => refunding && refund.mutate(refunding)}
      >
        <p className="mb-3 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-900">
          Este registro es informativo: la plataforma <strong>no devuelve el dinero</strong>. Hazlo
          desde el panel de la pasarela y deja aquí la constancia.
        </p>
        <Field label="Nota (opcional)" htmlFor="refund-note">
          <Textarea
            id="refund-note"
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Ej. Devuelto por Wompi el 21/10, ref. 12345"
          />
        </Field>
      </ConfirmDialog>
    </>
  )
}
