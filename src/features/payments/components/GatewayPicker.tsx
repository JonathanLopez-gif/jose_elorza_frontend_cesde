import { Globe2, Landmark } from 'lucide-react'

import { cn } from '@/lib/utils'
import type { PaymentGateway } from '@/types/payment'

const OPTIONS: {
  id: PaymentGateway
  name: string
  currency: 'COP' | 'USD'
  icon: typeof Globe2
  description: string
}[] = [
  {
    id: 'WOMPI',
    name: 'Wompi',
    currency: 'COP',
    icon: Landmark,
    description: 'Tarjetas, PSE, Nequi y Bancolombia. Pagas en pesos colombianos (COP).',
  },
  {
    id: 'GLOBAL66',
    name: 'Global66',
    currency: 'USD',
    icon: Globe2,
    description: 'Pagos internacionales con tarjeta o transferencia. Pagas en dólares (USD).',
  },
]

export function GatewayPicker({
  value,
  onChange,
  totals,
}: {
  value: PaymentGateway
  onChange: (g: PaymentGateway) => void
  totals: { COP: string; USD: string }
}) {
  return (
    <fieldset>
      <legend className="mb-3 text-sm font-semibold">Elige cómo quieres pagar</legend>
      <div className="grid gap-3 sm:grid-cols-2">
        {OPTIONS.map((o) => {
          const selected = value === o.id
          return (
            <label
              key={o.id}
              className={cn(
                'relative flex cursor-pointer flex-col gap-2 rounded-xl border-2 p-4 transition-colors focus-within:ring-3 focus-within:ring-ring/40',
                selected
                  ? 'border-[#153b65] bg-[#153b65]/[0.04]'
                  : 'border-input hover:border-[#153b65]/40'
              )}
            >
              <input
                type="radio"
                name="gateway"
                value={o.id}
                checked={selected}
                onChange={() => onChange(o.id)}
                className="sr-only"
              />
              <span className="flex items-center gap-2 font-bold text-[#153b65]">
                <o.icon className="size-5 text-[#3fbfb7]" aria-hidden="true" /> {o.name}
              </span>
              <span className="text-xs leading-5 text-muted-foreground">{o.description}</span>
              <span className="mt-1 text-lg font-bold">{totals[o.currency]}</span>
              <span
                aria-hidden="true"
                className={cn(
                  'absolute right-3 top-3 size-4 rounded-full border-2',
                  selected
                    ? 'border-[#153b65] bg-[#153b65] shadow-[inset_0_0_0_3px_white]'
                    : 'border-input'
                )}
              />
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}
