import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { ServiceFilters as Filters, ServiceModality, ServiceType } from '@/types/service'

interface Props {
  filters: Filters
  onChange: (filters: Filters) => void
}

const modalities: { value: ServiceModality | ''; label: string }[] = [
  { value: '', label: 'Todas las modalidades' },
  { value: 'VIRTUAL', label: 'Virtual' },
  { value: 'PRESENCIAL', label: 'Presencial' },
  { value: 'HIBRIDA', label: 'Híbrida' },
]
const types: { value: ServiceType | ''; label: string }[] = [
  { value: '', label: 'Todos los tipos' },
  { value: 'INDIVIDUAL', label: 'Individual' },
  { value: 'GRUPAL', label: 'Grupal' },
]

export function ServiceFiltersBar({ filters, onChange }: Props) {
  const hasActive = Boolean(filters.modality || filters.type || filters.search)
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
      <label className="flex flex-1 flex-col gap-1.5 text-sm">
        <span className="font-medium text-muted-foreground">Buscar</span>
        <input
          type="search"
          value={filters.search ?? ''}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
          placeholder="Nombre o descripción…"
          className="h-10 rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </label>
      <label className="flex min-w-[160px] flex-col gap-1.5 text-sm">
        <span className="font-medium text-muted-foreground">Modalidad</span>
        <select
          value={filters.modality ?? ''}
          onChange={(e) =>
            onChange({ ...filters, modality: e.target.value as ServiceModality | '' })
          }
          className="h-10 rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {modalities.map((m) => (
            <option key={m.value || 'all'} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>
      </label>
      <label className="flex min-w-[160px] flex-col gap-1.5 text-sm">
        <span className="font-medium text-muted-foreground">Tipo</span>
        <select
          value={filters.type ?? ''}
          onChange={(e) => onChange({ ...filters, type: e.target.value as ServiceType | '' })}
          className="h-10 rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {types.map((t) => (
            <option key={t.value || 'all'} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </label>
      {hasActive && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onChange({ modality: '', type: '', search: '' })}
          className="gap-1"
        >
          <X className="size-4" /> Limpiar
        </Button>
      )}
    </div>
  )
}
