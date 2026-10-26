import { env } from '@/config/env'

export async function enableMocking() {
  if (!env.mocksEnabled) return

  const { worker } = await import('./browser')

  return worker.start({
    onUnhandledFrame: 'bypass',
    quiet: true,
  })
}
