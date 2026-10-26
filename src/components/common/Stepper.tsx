import { Check } from 'lucide-react'

import { cn } from '@/lib/utils'

export function Stepper({ steps, current }: { steps: string[]; current: number }) {
  return (
    <ol aria-label="Progreso" className="flex items-center gap-2 text-sm">
      {steps.map((label, i) => {
        const done = i < current
        const active = i === current
        return (
          <li
            key={label}
            className="flex items-center gap-2"
            aria-current={active ? 'step' : undefined}
          >
            <span
              className={cn(
                'flex size-7 items-center justify-center rounded-full text-xs font-bold',
                done && 'bg-[#3fbfb7] text-white',
                active && 'bg-[#153b65] text-white',
                !done && !active && 'bg-muted text-muted-foreground'
              )}
            >
              {done ? <Check className="size-4" /> : i + 1}
            </span>
            <span
              className={cn(
                'hidden font-medium sm:inline',
                active ? 'text-[#153b65]' : 'text-muted-foreground'
              )}
            >
              {label}
            </span>
            {i < steps.length - 1 && (
              <span aria-hidden="true" className="mx-1 h-px w-6 bg-border sm:w-10" />
            )}
          </li>
        )
      })}
    </ol>
  )
}
