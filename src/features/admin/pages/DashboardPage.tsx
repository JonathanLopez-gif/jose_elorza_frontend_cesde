import { Link } from 'react-router-dom'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { CalendarCheck, CalendarClock, Clock3, DollarSign, Users } from 'lucide-react'
import type { ReactNode } from 'react'

import { ErrorState, LoadingBlock } from '@/components/common/States'
import { PageHeader } from '@/components/common/PageHeader'
import { AppointmentStatusBadge } from '@/components/common/StatusBadge'
import { APP_ROUTES } from '@/constants/routes'
import { es } from '@/i18n/es'
import { getErrorMessage } from '@/api/helpers'
import { formatCurrencyCop, formatCurrencyUsd, formatDateTime } from '@/utils/timezone'
import { useTimezone } from '@/hooks/useTimezone'
import { useDashboard } from '../hooks/useAdminData'

const STATUS_COLORS: Record<string, string> = {
  CONFIRMED: '#3fbfb7',
  COMPLETED: '#153b65',
  PENDING_PAYMENT: '#f0a05a',
  CANCELLED: '#e05a5a',
  NO_SHOW: '#8a94a6',
  RESCHEDULED: '#c3cad6',
}

function Kpi({
  icon,
  label,
  value,
  hint,
}: {
  icon: ReactNode
  label: string
  value: string
  hint?: string
}) {
  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <span className="flex size-9 items-center justify-center rounded-lg bg-[#153b65]/[0.07] text-[#153b65]">
          {icon}
        </span>
      </div>
      <p className="mt-3 font-heading text-2xl font-bold text-[#153b65]">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  )
}

export function DashboardPage() {
  const tz = useTimezone()
  const { data, isLoading, isError, error, refetch } = useDashboard()

  if (isLoading) return <LoadingBlock label="Cargando métricas…" />
  if (isError || !data)
    return <ErrorState message={getErrorMessage(error)} onRetry={() => void refetch()} />

  const statusData = data.byStatus.map((s) => ({
    ...s,
    name: es.appointmentStatus[s.status as keyof typeof es.appointmentStatus] ?? s.status,
  }))

  return (
    <>
      <PageHeader
        eyebrow="Panel administrativo"
        title="Resumen del negocio"
        description="Métricas del día y del mes en curso."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi
          icon={<CalendarClock className="size-5" />}
          label="Citas de hoy"
          value={String(data.appointmentsToday)}
        />
        <Kpi
          icon={<CalendarCheck className="size-5" />}
          label="Citas del mes"
          value={String(data.appointmentsMonth)}
        />
        <Kpi
          icon={<DollarSign className="size-5" />}
          label="Ingresos del mes"
          value={formatCurrencyCop(data.incomeMonthCop)}
          hint={`+ ${formatCurrencyUsd(data.incomeMonthUsd)} en dólares (Global66)`}
        />
        <Kpi
          icon={<Clock3 className="size-5" />}
          label="Pagos pendientes"
          value={String(data.pendingPayments)}
          hint="Citas con horario retenido"
        />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <section
          aria-label="Ingresos por mes"
          className="rounded-xl border bg-white p-5 shadow-sm xl:col-span-2"
        >
          <h2 className="text-base font-semibold text-[#153b65]">
            Ingresos en COP · últimos 6 meses
          </h2>
          <div
            className="mt-4 h-64"
            role="img"
            aria-label="Gráfica de barras con los ingresos mensuales en pesos colombianos"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.monthly} margin={{ left: 4, right: 8, top: 8 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis
                  tickFormatter={(v: number) => `${Math.round(v / 1000)}k`}
                  tickLine={false}
                  axisLine={false}
                  fontSize={12}
                  width={44}
                />
                <Tooltip
                  formatter={(v) => formatCurrencyCop(Number(v))}
                  labelClassName="font-semibold"
                />
                <Bar dataKey="incomeCop" name="Ingresos COP" fill="#153b65" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section aria-label="Citas por estado" className="rounded-xl border bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-[#153b65]">Citas por estado</h2>
          <div
            className="mt-4 h-64"
            role="img"
            aria-label="Gráfica circular con la distribución de citas por estado"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="count"
                  nameKey="name"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                >
                  {statusData.map((s) => (
                    <Cell key={s.status} fill={STATUS_COLORS[s.status] ?? '#999'} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <section aria-label="Citas por mes" className="rounded-xl border bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-[#153b65]">Citas por mes</h2>
          <div
            className="mt-4 h-52"
            role="img"
            aria-label="Gráfica de líneas con el número de citas por mes"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.monthly} margin={{ left: -16, right: 8, top: 8 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis allowDecimals={false} tickLine={false} axisLine={false} fontSize={12} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="appointments"
                  name="Citas"
                  stroke="#3fbfb7"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
            <Users className="size-4" /> {data.totalUsers} usuarios registrados
          </p>
        </section>

        <section
          aria-label="Próximas citas"
          className="rounded-xl border bg-white p-5 shadow-sm xl:col-span-2"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-[#153b65]">Próximas citas</h2>
            <Link
              to={APP_ROUTES.admin.agenda}
              className="text-sm font-semibold text-[#153b65] hover:underline"
            >
              Ver agenda
            </Link>
          </div>
          {data.upcoming.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">
              No hay citas confirmadas próximas.
            </p>
          ) : (
            <ul className="mt-3 divide-y">
              {data.upcoming.map((a) => (
                <li
                  key={a.id}
                  className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm"
                >
                  <div>
                    <p className="font-semibold">{a.userName}</p>
                    <p className="text-xs text-muted-foreground">{a.serviceName}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">
                      {formatDateTime(a.startUtc, tz)}
                    </span>
                    <AppointmentStatusBadge status={a.status} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  )
}
