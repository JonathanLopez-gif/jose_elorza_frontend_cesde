import { useMemo, useState } from 'react'
import { CalendarRange, FileSpreadsheet } from 'lucide-react'
import type { ReactNode } from 'react'

import { getErrorMessage } from '@/api/helpers'
import { PageHeader } from '@/components/common/PageHeader'
import { Td, TableShell, Th } from '@/components/common/DataTable'
import { ErrorState, LoadingBlock } from '@/components/common/States'
import { Button } from '@/components/ui/button'
import { Field } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { useTimezone } from '@/hooks/useTimezone'
import { downloadCsv, toCsv } from '@/utils/csv'
import { dayjs, formatCurrencyCop, formatCurrencyUsd } from '@/utils/timezone'
import {
  APPOINTMENT_CSV_COLUMNS,
  appointmentsToCsvRows,
  PAYMENT_CSV_COLUMNS,
  paymentsToCsvRows,
} from '../csv'
import { useAdminAppointments, useAdminPayments } from '../hooks/useAdminData'

function Stat({ label, value, hint }: { label: string; value: ReactNode; hint?: string }) {
  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 font-heading text-2xl font-bold text-[#153b65]">{value}</p>
      {hint && <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>}
    </div>
  )
}

export function ReportsPage() {
  const tz = useTimezone()
  const [from, setFrom] = useState(dayjs().startOf('month').format('YYYY-MM-DD'))
  const [to, setTo] = useState(dayjs().format('YYYY-MM-DD'))
  const invalid = !from || !to || from > to
  const range = { from, to }
  const appointments = useAdminAppointments(range, !invalid)
  const payments = useAdminPayments(range)

  const stats = useMemo(() => {
    const a = appointments.data ?? []
    const p = payments.data ?? []
    const approved = p.filter((x) => x.status === 'APPROVED')
    const byService = new Map<string, { count: number; cop: number; usd: number }>()
    a.filter(
      (x) =>
        x.status !== 'CANCELLED' && x.status !== 'RESCHEDULED' && x.status !== 'PENDING_PAYMENT'
    ).forEach((x) => {
      const row = byService.get(x.serviceName) ?? { count: 0, cop: 0, usd: 0 }
      row.count += 1
      byService.set(x.serviceName, row)
    })
    approved.forEach((x) => {
      const row = byService.get(x.serviceName) ?? { count: 0, cop: 0, usd: 0 }
      if (x.currency === 'COP') row.cop += x.amount
      else row.usd += x.amount
      byService.set(x.serviceName, row)
    })
    return {
      total: a.length,
      completed: a.filter((x) => x.status === 'COMPLETED').length,
      cancelled: a.filter((x) => x.status === 'CANCELLED').length,
      noShow: a.filter((x) => x.status === 'NO_SHOW').length,
      incomeCop: approved.filter((x) => x.currency === 'COP').reduce((s, x) => s + x.amount, 0),
      incomeUsd: approved.filter((x) => x.currency === 'USD').reduce((s, x) => s + x.amount, 0),
      refunded: p.filter((x) => x.status === 'REFUNDED').length,
      services: [...byService].sort((x, y) => y[1].count - x[1].count),
    }
  }, [appointments.data, payments.data])

  const loading = appointments.isLoading || payments.isLoading
  const error = appointments.error ?? payments.error
  const suffix = `${from}_a_${to}`

  return (
    <>
      <PageHeader
        eyebrow="Administración"
        title="Reportes"
        description="Elige un rango de fechas, revisa el resumen y exporta los datos en CSV (compatible con Excel)."
      />

      <form
        onSubmit={(e) => e.preventDefault()}
        className="mb-6 flex flex-wrap items-end gap-4 rounded-xl border bg-white p-4 shadow-sm"
      >
        <Field label="Desde" htmlFor="rep-from">
          <Input
            id="rep-from"
            type="date"
            value={from}
            max={to || undefined}
            onChange={(e) => setFrom(e.target.value)}
            className="h-10"
          />
        </Field>
        <Field label="Hasta" htmlFor="rep-to">
          <Input
            id="rep-to"
            type="date"
            value={to}
            min={from || undefined}
            onChange={(e) => setTo(e.target.value)}
            className="h-10"
          />
        </Field>
        <div className="flex flex-wrap gap-2">
          {(
            [
              ['Este mes', dayjs().startOf('month'), dayjs()],
              [
                'Mes pasado',
                dayjs().subtract(1, 'month').startOf('month'),
                dayjs().subtract(1, 'month').endOf('month'),
              ],
              ['Últimos 90 días', dayjs().subtract(90, 'day'), dayjs()],
            ] as const
          ).map(([label, f, t]) => (
            <Button
              key={label}
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setFrom(f.format('YYYY-MM-DD'))
                setTo(t.format('YYYY-MM-DD'))
              }}
            >
              {label}
            </Button>
          ))}
        </div>
        {invalid && (
          <p role="alert" className="w-full text-sm text-destructive">
            La fecha inicial debe ser anterior o igual a la final.
          </p>
        )}
      </form>

      {loading ? (
        <LoadingBlock label="Generando reporte…" />
      ) : error ? (
        <ErrorState
          message={getErrorMessage(error)}
          onRetry={() => {
            void appointments.refetch()
            void payments.refetch()
          }}
        />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Stat
              label="Citas en el rango"
              value={stats.total}
              hint={`${stats.completed} completadas · ${stats.cancelled} canceladas · ${stats.noShow} no asistió`}
            />
            <Stat
              label="Ingresos COP"
              value={formatCurrencyCop(stats.incomeCop)}
              hint="Pagos aprobados (Wompi)"
            />
            <Stat
              label="Ingresos USD"
              value={formatCurrencyUsd(stats.incomeUsd)}
              hint="Pagos aprobados (Global66)"
            />
            <Stat
              label="Reembolsos"
              value={stats.refunded}
              hint="Pagos marcados como reembolsados"
            />
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button
              disabled={!appointments.data?.length}
              onClick={() =>
                downloadCsv(
                  `citas_${suffix}.csv`,
                  toCsv(appointmentsToCsvRows(appointments.data ?? [], tz), APPOINTMENT_CSV_COLUMNS)
                )
              }
              className="bg-[#153b65] text-white hover:bg-[#0f2c4c]"
            >
              <FileSpreadsheet /> Exportar citas (CSV)
            </Button>
            <Button
              disabled={!payments.data?.length}
              variant="outline"
              onClick={() =>
                downloadCsv(
                  `pagos_${suffix}.csv`,
                  toCsv(paymentsToCsvRows(payments.data ?? [], tz), PAYMENT_CSV_COLUMNS)
                )
              }
            >
              <FileSpreadsheet /> Exportar pagos (CSV)
            </Button>
          </div>

          <h2 className="mb-3 mt-8 flex items-center gap-2 text-base font-semibold text-[#153b65]">
            <CalendarRange className="size-4" /> Servicios más solicitados
          </h2>
          {stats.services.length === 0 ? (
            <p className="rounded-xl border border-dashed bg-muted/30 py-10 text-center text-sm text-muted-foreground">
              No hay actividad en este rango.
            </p>
          ) : (
            <TableShell className="min-w-[520px]">
              <thead>
                <tr>
                  <Th>Servicio</Th>
                  <Th className="text-right">Citas</Th>
                  <Th className="text-right">Ingresos COP</Th>
                  <Th className="text-right">Ingresos USD</Th>
                </tr>
              </thead>
              <tbody>
                {stats.services.map(([name, r]) => (
                  <tr key={name}>
                    <Td className="font-medium">{name}</Td>
                    <Td className="text-right">{r.count}</Td>
                    <Td className="text-right">{formatCurrencyCop(r.cop)}</Td>
                    <Td className="text-right">{formatCurrencyUsd(r.usd)}</Td>
                  </tr>
                ))}
              </tbody>
            </TableShell>
          )}
        </>
      )}
    </>
  )
}
