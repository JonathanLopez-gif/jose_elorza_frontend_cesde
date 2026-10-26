import { useEffect, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Search, UserX } from 'lucide-react'
import { toast } from 'sonner'

import { setUserActive } from '@/api/users'
import { getErrorMessage } from '@/api/helpers'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { Td, TableShell, Th } from '@/components/common/DataTable'
import { PageHeader } from '@/components/common/PageHeader'
import { Pagination } from '@/components/common/Pagination'
import { EmptyState, ErrorState, LoadingBlock } from '@/components/common/States'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { es } from '@/i18n/es'
import type { AdminUser } from '@/types/admin'
import { useTimezone } from '@/hooks/useTimezone'
import { useAuthStore } from '@/store/slices/auth.store'
import { formatDate } from '@/utils/timezone'
import { useAdminUsers } from '../hooks/useAdminData'

const PAGE_SIZE = 8

export function UsersPage() {
  const tz = useTimezone()
  const me = useAuthStore((s) => s.user?.id)
  const queryClient = useQueryClient()
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [active, setActive] = useState<'' | 'true' | 'false'>('')
  const [page, setPage] = useState(1)
  const [target, setTarget] = useState<AdminUser | null>(null)

  useEffect(() => {
    const t = window.setTimeout(() => {
      setSearch(searchInput.trim())
      setPage(1)
    }, 300)
    return () => window.clearTimeout(t)
  }, [searchInput])

  const { data, isLoading, isError, error, refetch, isFetching } = useAdminUsers({
    search,
    active,
    page,
    pageSize: PAGE_SIZE,
  })

  const toggle = useMutation({
    mutationFn: (u: AdminUser) => setUserActive(u.id, !u.active),
    onSuccess: (u) => {
      toast.success(u.active ? 'Usuario activado.' : 'Usuario desactivado.')
      void queryClient.invalidateQueries({ queryKey: ['admin-users'] })
      setTarget(null)
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  })

  return (
    <>
      <PageHeader
        eyebrow="Administración"
        title="Usuarios"
        description="Consulta las cuentas registradas y activa o desactiva el acceso."
      />

      <div className="mb-4 flex flex-wrap gap-3">
        <div className="relative min-w-60 flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            aria-label="Buscar usuarios"
            placeholder="Buscar por nombre o correo"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="h-10 pl-9"
          />
        </div>
        <Select
          aria-label="Filtrar por estado"
          value={active}
          onChange={(e) => {
            setActive(e.target.value as typeof active)
            setPage(1)
          }}
          className="h-10 w-44"
        >
          <option value="">Todos los estados</option>
          <option value="true">Activos</option>
          <option value="false">Inactivos</option>
        </Select>
      </div>

      {isLoading ? (
        <LoadingBlock />
      ) : isError ? (
        <ErrorState message={getErrorMessage(error)} onRetry={() => void refetch()} />
      ) : !data || data.items.length === 0 ? (
        <EmptyState icon={UserX} title="No hay usuarios con esos filtros" />
      ) : (
        <div className={isFetching ? 'opacity-70 transition-opacity' : undefined}>
          <TableShell>
            <thead>
              <tr>
                <Th>Usuario</Th>
                <Th>Rol</Th>
                <Th>Zona horaria</Th>
                <Th className="text-right">Citas</Th>
                <Th>Registro</Th>
                <Th>Activo</Th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((u) => (
                <tr key={u.id}>
                  <Td>
                    <p className="font-medium">{u.name}</p>
                    <p className="text-xs text-muted-foreground">{u.email}</p>
                  </Td>
                  <Td>
                    <Badge variant={u.role === 'ADMIN' ? 'default' : 'outline'}>
                      {es.role[u.role]}
                    </Badge>
                  </Td>
                  <Td className="text-xs text-muted-foreground">{u.timezone}</Td>
                  <Td className="text-right">{u.appointmentsCount}</Td>
                  <Td className="whitespace-nowrap">{formatDate(u.createdAt, tz)}</Td>
                  <Td>
                    <Switch
                      checked={u.active}
                      disabled={u.id === me}
                      aria-label={`${u.active ? 'Desactivar' : 'Activar'} a ${u.name}`}
                      onCheckedChange={() => setTarget(u)}
                    />
                  </Td>
                </tr>
              ))}
            </tbody>
          </TableShell>
          <Pagination
            page={data.page}
            pageSize={data.pageSize}
            total={data.total}
            onPageChange={setPage}
          />
        </div>
      )}

      <ConfirmDialog
        open={Boolean(target)}
        onOpenChange={(o) => !o && setTarget(null)}
        title={target?.active ? '¿Desactivar este usuario?' : '¿Activar este usuario?'}
        description={target ? `${target.name} (${target.email})` : undefined}
        confirmLabel={target?.active ? 'Desactivar' : 'Activar'}
        destructive={target?.active}
        loading={toggle.isPending}
        onConfirm={() => target && toggle.mutate(target)}
      >
        <p className="text-sm text-muted-foreground">
          {target?.active
            ? 'No podrá iniciar sesión ni agendar mientras esté desactivado. Sus citas existentes no se modifican.'
            : 'Podrá volver a iniciar sesión y agendar.'}
        </p>
      </ConfirmDialog>
    </>
  )
}
