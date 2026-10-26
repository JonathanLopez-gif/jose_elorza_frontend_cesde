import { useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Calendar, Link2, Unlink, AlertCircle, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import { useSearchParams } from 'react-router-dom'
import { PageHeader } from '@/components/common/PageHeader'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import {
  disconnectGoogleCalendar,
  getGoogleCalendarAuthUrl,
  getGoogleCalendarStatus,
} from '@/api/google-calendar'

const statusLabel = {
  CONNECTED: 'Conectado',
  DISCONNECTED: 'Desconectado',
  EXPIRED: 'Token expirado',
  ERROR: 'Error',
} as const

export function GoogleCalendarPage() {
  const queryClient = useQueryClient()
  const [searchParams, setSearchParams] = useSearchParams()
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['google-calendar-status'],
    queryFn: getGoogleCalendarStatus,
  })

  const connectMutation = useMutation({
    mutationFn: getGoogleCalendarAuthUrl,
    onSuccess: (url) => {
      window.location.href = url
    },
    onError: (err: Error) => toast.error(err.message || 'No se pudo iniciar la autorización.'),
  })

  const disconnectMutation = useMutation({
    mutationFn: disconnectGoogleCalendar,
    onSuccess: () => {
      toast.success('Integración desconectada.')
      queryClient.invalidateQueries({ queryKey: ['google-calendar-status'] })
    },
    onError: (err: Error) => toast.error(err.message || 'No se pudo desconectar.'),
  })

  useEffect(() => {
    const status = searchParams.get('google_calendar')
    if (status === 'success') {
      toast.success('Google Calendar conectado correctamente.')
      queryClient.invalidateQueries({ queryKey: ['google-calendar-status'] })
      setSearchParams({}, { replace: true })
    } else if (status === 'error') {
      toast.error(searchParams.get('message') || 'Error al conectar Google Calendar.')
      setSearchParams({}, { replace: true })
    } else if (status === 'cancelled') {
      toast.message('Conexión con Google cancelada.')
      setSearchParams({}, { replace: true })
    }
  }, [searchParams, queryClient, setSearchParams])

  return (
    <>
      <PageHeader
        eyebrow="Administración"
        title="Google Calendar"
        description="Conecta la cuenta de Google del sistema para sincronizar la agenda."
      />
      <Card className="max-w-xl">
        <CardHeader className="flex flex-row items-center gap-3 space-y-0">
          <Calendar className="size-6 text-primary" />
          <CardTitle>Estado de la integración</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {isLoading && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Spinner size="sm" /> Cargando estado…
            </div>
          )}
          {isError && (
            <div
              role="alert"
              className="flex gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4"
            >
              <AlertCircle className="size-5 shrink-0 text-destructive" />
              <div>
                <p className="font-medium">No se pudo consultar el estado</p>
                <p className="text-sm text-muted-foreground">{(error as Error)?.message}</p>
                <Button variant="outline" size="sm" className="mt-2" onClick={() => refetch()}>
                  Reintentar
                </Button>
              </div>
            </div>
          )}
          {data && (
            <>
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant={data.status === 'CONNECTED' ? 'default' : 'secondary'}>
                  {data.status === 'CONNECTED' && <CheckCircle2 className="mr-1 size-3" />}
                  {statusLabel[data.status] ?? data.status}
                </Badge>
                {data.email && <span className="text-sm text-muted-foreground">{data.email}</span>}
              </div>
              {data.message && <p className="text-sm text-muted-foreground">{data.message}</p>}
              <div className="flex flex-wrap gap-3">
                {data.status !== 'CONNECTED' && (
                  <Button
                    onClick={() => connectMutation.mutate()}
                    disabled={connectMutation.isPending}
                    className="gap-2"
                  >
                    {connectMutation.isPending ? (
                      <Spinner size="sm" />
                    ) : (
                      <Link2 className="size-4" />
                    )}
                    Conectar con Google
                  </Button>
                )}
                {data.status === 'CONNECTED' && (
                  <Button
                    variant="outline"
                    onClick={() => disconnectMutation.mutate()}
                    disabled={disconnectMutation.isPending}
                    className="gap-2"
                  >
                    {disconnectMutation.isPending ? (
                      <Spinner size="sm" />
                    ) : (
                      <Unlink className="size-4" />
                    )}
                    Desconectar
                  </Button>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </>
  )
}
