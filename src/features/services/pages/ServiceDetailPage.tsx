import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Clock, MapPin, Users, Video, AlertCircle } from 'lucide-react'
import { Container } from '@/components/layout/Container'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { APP_ROUTES } from '@/constants/routes'
import { useService } from '@/features/services/hooks/useServices'
import { useAuthStore } from '@/store/slices/auth.store'
import { formatCurrencyCop, formatCurrencyUsd } from '@/utils/timezone'

const modalityLabel = { VIRTUAL: 'Virtual', PRESENCIAL: 'Presencial', HIBRIDA: 'Híbrida' } as const
const typeLabel = { INDIVIDUAL: 'Individual', GRUPAL: 'Grupal' } as const

export function ServiceDetailPage() {
  const { serviceId } = useParams<{ serviceId: string }>()
  const navigate = useNavigate()
  const { data: service, isLoading, isError, error, refetch } = useService(serviceId)
  const authed = useAuthStore((s) => s.status === 'authenticated')

  function handleBook() {
    if (!serviceId) return
    // Sin sesión, ProtectedRoute lleva al login y regresa aquí después.
    navigate(APP_ROUTES.bookingDetail(serviceId))
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  if (isError || !service) {
    return (
      <Container className="py-20">
        <div role="alert" className="mx-auto max-w-md text-center">
          <AlertCircle className="mx-auto size-10 text-destructive" />
          <p className="mt-4 font-semibold">No pudimos cargar este servicio</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {(error as Error)?.message || 'No disponible.'}
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Button variant="outline" asChild>
              <Link to={APP_ROUTES.services}>Volver al catálogo</Link>
            </Button>
            <Button onClick={() => refetch()}>Reintentar</Button>
          </div>
        </div>
      </Container>
    )
  }

  const ModalityIcon =
    service.modality === 'PRESENCIAL' ? MapPin : service.modality === 'HIBRIDA' ? Users : Video

  return (
    <div className="min-h-[70vh] bg-background py-12">
      <Container>
        <Link
          to={APP_ROUTES.services}
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="size-4" /> Volver al catálogo
        </Link>
        <div className="mt-8 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">{typeLabel[service.type]}</Badge>
              <Badge variant="outline" className="gap-1">
                <ModalityIcon className="size-3" />
                {modalityLabel[service.modality]}
              </Badge>
            </div>
            <h1 className="mt-4 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
              {service.name}
            </h1>
            <p className="mt-6 whitespace-pre-line text-base leading-relaxed text-muted-foreground">
              {service.description}
            </p>
            <div className="mt-8 flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="size-4" /> Duración: {service.durationMinutes} minutos
            </div>
          </div>
          <aside className="h-fit rounded-2xl border bg-card p-6 shadow-sm">
            <p className="text-sm font-medium text-muted-foreground">Inversión</p>
            <p className="mt-2 text-3xl font-bold">{formatCurrencyCop(service.priceCop)}</p>
            <p className="text-muted-foreground">{formatCurrencyUsd(service.priceUsd)}</p>
            <p className="mt-2 text-xs text-muted-foreground">Precio con IVA del 19 % incluido.</p>
            <Button className="mt-6 w-full" size="lg" onClick={handleBook}>
              Agendar cita
            </Button>
            {!authed && (
              <p className="mt-3 text-center text-xs text-muted-foreground">
                Necesitas iniciar sesión para agendar.
              </p>
            )}
          </aside>
        </div>
      </Container>
    </div>
  )
}
