import { Clock, Globe2 } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { AppointmentSummary as Summary } from '@/types/appointment'
import {
  formatCurrencyCop,
  formatCurrencyUsd,
  formatDate,
  formatTime,
  formatUtc,
} from '@/utils/timezone'

export function AppointmentSummaryCard({ summary, note }: { summary: Summary; note?: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Resumen de la cita</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5 pb-6 text-sm">
        <div>
          <p className="text-muted-foreground">Servicio</p>
          <p className="mt-0.5 font-semibold text-foreground">{summary.serviceName}</p>
        </div>
        <div className="flex items-start gap-2">
          <Clock className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
          <div>
            <p className="font-medium">
              {formatDate(summary.startUtc, summary.userTimezone)} ·{' '}
              {formatTime(summary.startUtc, summary.userTimezone)}
            </p>
            <p className="text-muted-foreground">Tu hora local ({summary.userTimezone})</p>
            <p className="mt-1 flex items-center gap-1 text-muted-foreground">
              <Globe2 className="size-3.5" />
              {formatUtc(summary.startUtc)} — duración {summary.durationMinutes} min
            </p>
          </div>
        </div>
        <dl className="space-y-2 border-t pt-4">
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Precio sin IVA</dt>
            <dd>
              {formatCurrencyCop(summary.cop.base)} / {formatCurrencyUsd(summary.usd.base)}
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">IVA (19 %)</dt>
            <dd>
              {formatCurrencyCop(summary.cop.iva)} / {formatCurrencyUsd(summary.usd.iva)}
            </dd>
          </div>
          <div className="flex justify-between gap-4 border-t pt-2 text-base font-semibold">
            <dt>Total (IVA incluido)</dt>
            <dd>
              {formatCurrencyCop(summary.cop.total)} / {formatCurrencyUsd(summary.usd.total)}
            </dd>
          </div>
        </dl>
        {note && (
          <p className="rounded-lg bg-muted/50 px-3 py-2 text-xs text-muted-foreground">{note}</p>
        )}
      </CardContent>
    </Card>
  )
}
