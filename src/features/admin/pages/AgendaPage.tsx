import { useMemo, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import esLocale from '@fullcalendar/core/locales/es'
import type { DatesSetArg, EventClickArg } from '@fullcalendar/core'
import { CalendarSearch } from 'lucide-react'

import { getErrorMessage } from '@/api/helpers'
import { Td, TableShell, Th } from '@/components/common/DataTable'
import { PageHeader } from '@/components/common/PageHeader'
import { Pagination } from '@/components/common/Pagination'
import { EmptyState, ErrorState, LoadingBlock } from '@/components/common/States'
import { AppointmentStatusBadge } from '@/components/common/StatusBadge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { es } from '@/i18n/es'
import { useTimezone } from '@/hooks/useTimezone'
import { cn } from '@/lib/utils'
import type { Appointment, AppointmentFilters, AppointmentStatus } from '@/types/appointment'
import { dayjs, formatDateTime } from '@/utils/timezone'
import { AdminAppointmentDialog } from '../components/AdminAppointmentDialog'
import { useAdminAppointments, useAdminServices } from '../hooks/useAdminData'

type View = 'calendar' | 'list'

const EVENT_COLORS: Partial<Record<AppointmentStatus, string>> = {
  CONFIRMED: '#153b65',
  PENDING_PAYMENT: '#f0a05a',
  COMPLETED: '#3fbfb7',
  NO_SHOW: '#8a94a6',
}
const PAGE_SIZE = 10

function CalendarView({ onSelect }: { onSelect: (a: Appointment) => void }) {
  const [range, setRange] = useState<{ from: string; to: string } | null>(null)
  const { data, isError, error, refetch, isFetching } = useAdminAppointments(
    range ?? {},
    Boolean(range)
  )

  const events = useMemo(
    () =>
      (data ?? [])
        .filter((a) => EVENT_COLORS[a.status])
        .map((a) => ({
          id: a.id,
          title: `${a.userName.split(' ')[0]} · ${a.serviceName}`,
          start: a.startUtc,
          end: a.endUtc,
          backgroundColor: EVENT_COLORS[a.status],
          borderColor: EVENT_COLORS[a.status],
        })),
    [data]
  )

  function onDates(arg: DatesSetArg) {
    const from = dayjs(arg.start).format('YYYY-MM-DD')
    const to = dayjs(arg.end).format('YYYY-MM-DD')
    setRange((prev) => (prev && prev.from === from && prev.to === to ? prev : { from, to }))
  }

  function onEvent(arg: EventClickArg) {
    const a = data?.find((x) => x.id === arg.event.id)
    if (a) onSelect(a)
  }

  return (
    <div className="rounded-xl border bg-white p-3 shadow-sm sm:p-5">
      {isError && <ErrorState message={getErrorMessage(error)} onRetry={() => void refetch()} />}
      <div className="mb-3 flex flex-wrap gap-4 text-xs text-muted-foreground" aria-label="Leyenda">
        {Object.entries(EVENT_COLORS).map(([status, color]) => (
          <span key={status} className="inline-flex items-center gap-1.5">
            <span className="size-2.5 rounded-full" style={{ background: color }} />
            {es.appointmentStatus[status as AppointmentStatus]}
          </span>
        ))}
        {isFetching && <span>Actualizando…</span>}
      </div>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        locales={[esLocale]}
        locale="es"
        initialView="timeGridWeek"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay',
        }}
        buttonText={{ today: 'Hoy', month: 'Mes', week: 'Semana', day: 'Día' }}
        slotMinTime="07:00:00"
        slotMaxTime="21:00:00"
        allDaySlot={false}
        nowIndicator
        height="auto"
        events={events}
        datesSet={onDates}
        eventClick={onEvent}
        eventTimeFormat={{ hour: '2-digit', minute: '2-digit', hour12: false }}
      />
    </div>
  )
}

function ListView({ onSelect }: { onSelect: (a: Appointment) => void }) {
  const tz = useTimezone()
  const { data: services } = useAdminServices()
  const [filters, setFilters] = useState<AppointmentFilters>({
    status: '',
    serviceId: '',
    from: '',
    to: '',
    search: '',
  })
  const [page, setPage] = useState(1)
  const clean = Object.fromEntries(
    Object.entries(filters).filter(([, v]) => v)
  ) as AppointmentFilters
  const { data, isLoading, isError, error, refetch } = useAdminAppointments(clean)
  const set = (k: keyof AppointmentFilters, v: string) => {
    setFilters((f) => ({ ...f, [k]: v }))
    setPage(1)
  }
  const paged = (data ?? []).slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <>
      <div className="mb-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <Input
          aria-label="Buscar citas"
          placeholder="Buscar cliente o servicio"
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
          {Object.entries(es.appointmentStatus).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </Select>
        <Select
          aria-label="Servicio"
          value={filters.serviceId}
          onChange={(e) => set('serviceId', e.target.value)}
          className="h-10"
        >
          <option value="">Todos los servicios</option>
          {services?.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
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
      {isLoading ? (
        <LoadingBlock />
      ) : isError ? (
        <ErrorState message={getErrorMessage(error)} onRetry={() => void refetch()} />
      ) : !data || data.length === 0 ? (
        <EmptyState icon={CalendarSearch} title="No hay citas con esos filtros" />
      ) : (
        <>
          <TableShell>
            <thead>
              <tr>
                <Th>Cliente</Th>
                <Th>Servicio</Th>
                <Th>Fecha ({tz})</Th>
                <Th>Estado</Th>
                <Th className="text-right">Acciones</Th>
              </tr>
            </thead>
            <tbody>
              {paged.map((a) => (
                <tr key={a.id}>
                  <Td>
                    <p className="font-medium">{a.userName}</p>
                    <p className="text-xs text-muted-foreground">{a.userEmail}</p>
                  </Td>
                  <Td>{a.serviceName}</Td>
                  <Td className="whitespace-nowrap">{formatDateTime(a.startUtc, tz)}</Td>
                  <Td>
                    <AppointmentStatusBadge status={a.status} />
                  </Td>
                  <Td className="text-right">
                    <Button size="sm" variant="outline" onClick={() => onSelect(a)}>
                      Gestionar
                    </Button>
                  </Td>
                </tr>
              ))}
            </tbody>
          </TableShell>
          <Pagination page={page} pageSize={PAGE_SIZE} total={data.length} onPageChange={setPage} />
        </>
      )}
    </>
  )
}

export function AgendaPage() {
  const [view, setView] = useState<View>('calendar')
  const [selected, setSelected] = useState<Appointment | null>(null)
  return (
    <>
      <PageHeader
        eyebrow="Administración"
        title="Agenda"
        description="Consulta las sesiones, asigna el enlace de videollamada, reagenda o cancela."
        actions={
          <div
            role="tablist"
            aria-label="Vista de agenda"
            className="inline-flex rounded-full bg-white p-1 shadow-sm"
          >
            {(['calendar', 'list'] as const).map((v) => (
              <button
                key={v}
                role="tab"
                aria-selected={view === v}
                onClick={() => setView(v)}
                className={cn(
                  'rounded-full px-5 py-2 text-sm font-semibold',
                  view === v
                    ? 'bg-[#153b65] text-white'
                    : 'text-muted-foreground hover:text-[#153b65]'
                )}
              >
                {v === 'calendar' ? 'Calendario' : 'Lista'}
              </button>
            ))}
          </div>
        }
      />
      {view === 'calendar' ? (
        <CalendarView onSelect={setSelected} />
      ) : (
        <ListView onSelect={setSelected} />
      )}
      <AdminAppointmentDialog appointment={selected} onClose={() => setSelected(null)} />
    </>
  )
}
