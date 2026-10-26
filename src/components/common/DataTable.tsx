import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

/** Contenedor de tabla con scroll horizontal en móvil. */
export function TableShell({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className="overflow-x-auto rounded-xl border bg-card">
      <table className={cn('w-full min-w-[640px] text-left text-sm', className)}>{children}</table>
    </div>
  )
}

export function Th({ children, className }: { children?: ReactNode; className?: string }) {
  return (
    <th
      scope="col"
      className={cn(
        'whitespace-nowrap border-b bg-muted/40 px-4 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground',
        className
      )}
    >
      {children}
    </th>
  )
}

export function Td({ children, className }: { children?: ReactNode; className?: string }) {
  return (
    <td className={cn('border-b px-4 py-3 align-middle last:border-b-0', className)}>{children}</td>
  )
}
