import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowDown, ArrowUp, ExternalLink, Pencil, Plus, Share2, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

import { deleteSocialLink, reorderSocialLinks, updateSocialLink } from '@/api/social-links'
import { getErrorMessage } from '@/api/helpers'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { Td, TableShell, Th } from '@/components/common/DataTable'
import { PageHeader } from '@/components/common/PageHeader'
import { EmptyState, ErrorState, LoadingBlock } from '@/components/common/States'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { SocialPlatformIcon } from '@/features/social/components/SocialPlatformIcon'
import {
  ADMIN_SOCIAL_LINKS_KEY,
  SOCIAL_LINKS_KEY,
  useAdminSocialLinks,
} from '@/features/social/hooks/useSocialLinks'
import { es } from '@/i18n/es'
import type { SocialLink } from '@/types/social'
import { SocialLinkFormDialog } from '../components/SocialLinkFormDialog'

export function SocialLinksPage() {
  const queryClient = useQueryClient()
  const { data, isLoading, isError, error, refetch } = useAdminSocialLinks()
  const [editing, setEditing] = useState<SocialLink | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [toDelete, setToDelete] = useState<SocialLink | null>(null)

  function refresh() {
    void queryClient.invalidateQueries({ queryKey: ADMIN_SOCIAL_LINKS_KEY })
    void queryClient.invalidateQueries({ queryKey: SOCIAL_LINKS_KEY })
  }

  const toggle = useMutation({
    mutationFn: (l: SocialLink) => updateSocialLink(l.id, { active: !l.active }),
    onSuccess: (l) => {
      toast.success(l.active ? `«${l.name}» ahora es visible.` : `«${l.name}» quedó oculto.`)
      refresh()
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  })

  const reorder = useMutation({
    mutationFn: reorderSocialLinks,
    // Actualización optimista: la fila se mueve al instante y vuelve a su sitio si falla.
    onMutate: async (ids: string[]) => {
      await queryClient.cancelQueries({ queryKey: ADMIN_SOCIAL_LINKS_KEY })
      const previous = queryClient.getQueryData<SocialLink[]>(ADMIN_SOCIAL_LINKS_KEY)
      if (previous) {
        const byId = new Map(previous.map((l) => [l.id, l]))
        queryClient.setQueryData(
          ADMIN_SOCIAL_LINKS_KEY,
          ids.map((id, i) => ({ ...byId.get(id)!, order: i + 1 }))
        )
      }
      return { previous }
    },
    onError: (e, _ids, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(ADMIN_SOCIAL_LINKS_KEY, ctx.previous)
      toast.error(getErrorMessage(e))
    },
    onSettled: refresh,
  })

  const remove = useMutation({
    mutationFn: (l: SocialLink) => deleteSocialLink(l.id),
    onSuccess: (_d, l) => {
      toast.success(`«${l.name}» eliminado.`)
      refresh()
      setToDelete(null)
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  })

  function move(index: number, delta: -1 | 1) {
    if (!data) return
    const ids = data.map((l) => l.id)
    const target = index + delta
    ;[ids[index], ids[target]] = [ids[target], ids[index]]
    reorder.mutate(ids)
  }

  function openForm(l: SocialLink | null) {
    setEditing(l)
    setFormOpen(true)
  }

  return (
    <>
      <PageHeader
        eyebrow="Administración"
        title="Redes sociales"
        description="Gestiona los canales externos que se muestran en la landing y en el pie de página. El orden de la tabla es el orden en que se ven."
        actions={
          <Button
            onClick={() => openForm(null)}
            className="bg-[#153b65] text-white hover:bg-[#0f2c4c]"
          >
            <Plus /> Nuevo enlace
          </Button>
        }
      />

      {isLoading ? (
        <LoadingBlock />
      ) : isError ? (
        <ErrorState message={getErrorMessage(error)} onRetry={() => void refetch()} />
      ) : !data || data.length === 0 ? (
        <EmptyState
          icon={Share2}
          title="Aún no hay redes sociales"
          description="Agrega el primer canal para mostrarlo en el sitio."
          action={
            <Button onClick={() => openForm(null)}>
              <Plus /> Nuevo enlace
            </Button>
          }
        />
      ) : (
        <TableShell className="min-w-[760px]">
          <thead>
            <tr>
              <Th className="w-28">Orden</Th>
              <Th>Canal</Th>
              <Th>Enlace</Th>
              <Th>Visible</Th>
              <Th className="text-right">Acciones</Th>
            </tr>
          </thead>
          <tbody>
            {data.map((l, i) => (
              <tr key={l.id} className={l.active ? undefined : 'text-muted-foreground'}>
                <Td>
                  <div className="flex items-center gap-1">
                    <span className="w-5 text-center font-semibold tabular-nums">{i + 1}</span>
                    <Button
                      size="icon-sm"
                      variant="ghost"
                      aria-label={`Subir ${l.name}`}
                      disabled={i === 0 || reorder.isPending}
                      onClick={() => move(i, -1)}
                    >
                      <ArrowUp />
                    </Button>
                    <Button
                      size="icon-sm"
                      variant="ghost"
                      aria-label={`Bajar ${l.name}`}
                      disabled={i === data.length - 1 || reorder.isPending}
                      onClick={() => move(i, 1)}
                    >
                      <ArrowDown />
                    </Button>
                  </div>
                </Td>
                <Td className="max-w-xs">
                  <div className="flex items-center gap-3">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#153b65] text-white">
                      <SocialPlatformIcon platform={l.platform} className="size-[18px]" />
                    </span>
                    <div className="min-w-0">
                      <p className="font-medium text-foreground">{l.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {es.socialPlatform[l.platform]}
                      </p>
                    </div>
                  </div>
                </Td>
                <Td className="max-w-[16rem]">
                  <a
                    href={l.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex max-w-full items-center gap-1 text-[#153b65] underline-offset-2 hover:underline"
                  >
                    <span className="truncate">{l.url.replace(/^https?:\/\//, '')}</span>
                    <ExternalLink className="size-3.5 shrink-0" aria-hidden="true" />
                  </a>
                </Td>
                <Td>
                  <Switch
                    checked={l.active}
                    disabled={toggle.isPending}
                    aria-label={`${l.active ? 'Ocultar' : 'Mostrar'} ${l.name}`}
                    onCheckedChange={() => toggle.mutate(l)}
                  />
                </Td>
                <Td className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      size="icon-sm"
                      variant="ghost"
                      aria-label={`Editar ${l.name}`}
                      onClick={() => openForm(l)}
                    >
                      <Pencil />
                    </Button>
                    <Button
                      size="icon-sm"
                      variant="ghost"
                      aria-label={`Eliminar ${l.name}`}
                      onClick={() => setToDelete(l)}
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

      <SocialLinkFormDialog open={formOpen} link={editing} onClose={() => setFormOpen(false)} />
      <ConfirmDialog
        open={Boolean(toDelete)}
        onOpenChange={(o) => !o && setToDelete(null)}
        title="¿Eliminar este enlace?"
        description={toDelete?.name}
        confirmLabel="Eliminar"
        destructive
        loading={remove.isPending}
        onConfirm={() => toDelete && remove.mutate(toDelete)}
      >
        <p className="text-sm text-muted-foreground">
          Dejará de mostrarse en el sitio. Si solo quieres ocultarlo un tiempo, usa el interruptor
          «Visible».
        </p>
      </ConfirmDialog>
    </>
  )
}
