import { formatCurrencyCop, formatCurrencyUsd } from '@/utils/timezone'

export function formatMoney(amount: number, currency: 'COP' | 'USD' | null) {
  return currency === 'USD' ? formatCurrencyUsd(amount) : formatCurrencyCop(amount)
}
