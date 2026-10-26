import { useMemo, useState } from 'react'
import { AlertCircle } from 'lucide-react'
import { Container } from '@/components/layout/Container'
import { Spinner } from '@/components/ui/spinner'
import { ServiceCard } from '@/features/services/components/ServiceCard'
import { ServiceFiltersBar } from '@/features/services/components/ServiceFilters'
import { ServiceSkeleton } from '@/features/services/components/ServiceSkeleton'
import { useServices } from '@/features/services/hooks/useServices'
import type { ServiceFilters } from '@/types/service'

export function ServicesPage() {
  const [filters, setFilters] = useState<ServiceFilters>({ modality: '', type: '', search: '' })
  const { data, isLoading, isError, error, refetch, isFetching } = useServices({
    modality: filters.modality || undefined,
    type: filters.type || undefined,
  })

  const services = useMemo(() => {
    const list = data ?? []
    const q = (filters.search ?? '').trim().toLowerCase()
    return list.filter((s) => {
      if (s.status && s.status !== 'ACTIVE') return false
      if (!q) return true
      return s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q)
    })
  }, [data, filters.search])

  return (
    <div className="min-h-[70vh] bg-background py-12">
      <Container>
        <header className="mb-10 max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">Catálogo</p>
          <h1 className="mt-2 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            Servicios
          </h1>
          <p className="mt-3 text-muted-foreground">
            Explora las sesiones disponibles y agenda el momento que mejor se adapte a ti.
          </p>
        </header>
        <div className="mb-8">
          <ServiceFiltersBar filters={filters} onChange={setFilters} />
        </div>
        {isLoading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <ServiceSkeleton key={i} />
            ))}
          </div>
        )}
        {isError && (
          <div
            role="alert"
            className="flex flex-col items-center gap-4 rounded-xl border border-destructive/30 bg-destructive/5 px-6 py-12 text-center"
          >
            <AlertCircle className="size-10 text-destructive" />
            <div>
              <p className="font-semibold">No pudimos cargar los servicios</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {(error as Error)?.message || 'Intenta de nuevo.'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => refetch()}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
            >
              Reintentar
            </button>
          </div>
        )}
        {!isLoading && !isError && services.length === 0 && (
          <div className="rounded-xl border border-dashed px-6 py-16 text-center">
            <p className="text-lg font-medium">No encontramos servicios disponibles.</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Prueba a limpiar los filtros o vuelve más tarde.
            </p>
          </div>
        )}
        {!isLoading && !isError && services.length > 0 && (
          <>
            {isFetching && (
              <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
                <Spinner size="sm" /> Actualizando…
              </div>
            )}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          </>
        )}
      </Container>
    </div>
  )
}
