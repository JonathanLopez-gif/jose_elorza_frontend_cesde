import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './index.css'

import { AppProviders } from '@/providers'
import { AppRouter } from '@/router'
import '@/api'

async function bootstrap() {
  const { enableMocking } = await import('@/mocks')
  await enableMocking()

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <AppProviders>
        <AppRouter />
      </AppProviders>
    </StrictMode>
  )
}

bootstrap()
