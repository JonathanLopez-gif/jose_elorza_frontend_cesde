import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'

import { CookieBanner } from '@/components/common/CookieBanner'
import { Toaster } from '@/components/ui/toaster'

function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      // Deja que la página pinte antes de buscar el ancla (#sobre-mi, #contacto…).
      const id = hash.slice(1)
      const t = window.setTimeout(
        () => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }),
        50
      )
      return () => window.clearTimeout(t)
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])
  return null
}

/** Raíz de todas las rutas: notificaciones, consentimiento de cookies y scroll. */
export function RootLayout() {
  return (
    <>
      <ScrollToTop />
      <Outlet />
      <Toaster />
      <CookieBanner />
    </>
  )
}
