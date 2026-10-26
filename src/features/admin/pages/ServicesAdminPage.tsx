import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Briefcase, Pencil, Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

import { deleteService } from '@/api/services'
import { getErrorMessage } from '@/api/helpers'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { Td, TableShell, Th } from '@/components/common/DataTable'
import { PageHeader } from '@/components/common/PageHeader'
import { EmptyState, ErrorState, LoadingBlock } from '@/components/common/States'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { es } from '@/i18n/es'
import type { Service } from '@/types/service'
import { formatCurrencyCop, formatCurrencyUsd } from '@/utils/timezone'
import { ServiceFormDialog } from '../components/ServiceFormDialog'
import { useAdminServices } from '../hooks/useAdminData'

export function ServicesAdminPage() {
  const queryClient = useQueryClient()
  const { data, isLoading, isError, error, refetch } = useAdminServices()
  const [editing, setEditing] = useState<Service | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [toDelete, setToDelete] = useState<Service | null>(null)

  const remove = useMutation({
    mutationFn: (s: Service) => deleteService(s.id),
    onSuccess: (_d, s) => {
      toast.success(`«${s.name}» eliminado o desactivado.`)
      void queryClient.invalidateQueries({ queryKey: ['admin-services'] })
      void queryClient.invalidateQueries({ queryKey: ['services'] })
      setToDelete(null)
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  })

  function openForm(s: Service | null) {
    setEditing(s)
    setFormOpen(true)
  }

  return (
    <>
      <PageHeader
        eyebrow="Administración"
        title="Servicios"
        description="Crea, edita y desactiva los servicios que ven los usuarios en el catálogo."
        actions={
          <Button
            onClick={() => openForm(null)}
            className="bg-[#153b65] text-white hover:bg-[#0f2c4c]"
          >
            <Plus /> Nuevo servicio
          </Button>
        }
      />

      {isLoading ? (
        <LoadingBlock />
      ) : isError ? (
        <ErrorState message={getErrorMessage(error)} onRetry={() => void refetch()} />
      ) : !data || data.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="Aún no hay servicios"
          description="Crea el primero para que aparezca en el catálogo."
          action={
            <Button onClick={() => openForm(null)}>
              <Plus /> Nuevo servicio
            </Button>
          }
        />
      ) : (
        <TableShell className="min-w-[760px]">
          <thead>
            <tr>
              <Th>Servicio</Th>
              <Th>Tipo</Th>
              <Th>Modalidad</Th>
              <Th>Duración</Th>
              <Th className="text-right">Precio (IVA incl.)</Th>
              <Th>Estado</Th>
              <Th className="text-right">Acciones</Th>
            </tr>
          </thead>
          <tbody>
            {data.map((s) => (
              <tr key={s.id}>
                <Td className="max-w-xs">
                  <p className="font-medium">{s.name}</p>
                  <p className="line-clamp-1 text-xs text-muted-foreground">{s.description}</p>
                </Td>
                <Td>{es.serviceType[s.type]}</Td>
                <Td>{es.modality[s.modality]}</Td>
                <Td className="whitespace-nowrap">{s.durationMinutes} min</Td>
                <Td className="whitespace-nowrap text-right">
                  <p className="font-semibold">{formatCurrencyCop(s.priceCop)}</p>
                  <p className="text-xs text-muted-foreground">{formatCurrencyUsd(s.priceUsd)}</p>
                </Td>
                <Td>
                  <Badge variant={s.status === 'ACTIVE' ? 'success' : 'outline'}>
                    {es.serviceStatus[s.status]}
                  </Badge>
                </Td>
                <Td className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      size="icon-sm"
                      variant="ghost"
                      aria-label={`Editar ${s.name}`}
                      onClick={() => openForm(s)}
                    >
                      <Pencil />
                    </Button>
                    <Button
                      size="icon-sm"
                      variant="ghost"
                      aria-label={`Eliminar ${s.name}`}
                      onClick={() => setToDelete(s)}
                    >
                      <Trash2 className="text-destructive" />
                    </Button>
                  </div>
                </Td>
              </tr>
            ))}
          </tbody>
        </TableShell>
      )}

      <ServiceFormDialog open={formOpen} service={editing} onClose={() => setFormOpen(false)} />
      <ConfirmDialog
        open={Boolean(toDelete)}
        onOpenChange={(o) => !o && setToDelete(null)}
        title="¿Eliminar este servicio?"
        description={toDelete?.name}
        confirmLabel="Eliminar"
        destructive
        loading={remove.isPending}
        onConfirm={() => toDelete && remove.mutate(toDelete)}
      >
        <p className="text-sm text-muted-foreground">
          Si el servicio ya tiene citas asociadas, se desactivará en lugar de borrarse para
          conservar el historial.
        </p>
      </ConfirmDialog>
    </>
  )
}
