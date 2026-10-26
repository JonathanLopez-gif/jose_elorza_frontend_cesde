import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Cookie } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { APP_ROUTES } from '@/constants/routes'
import { storage } from '@/lib/storage'
import type { CookieConsent } from '@/lib/storage'

/** Consentimiento de cookies (Ley 1581 de 2012 / GDPR). Se muestra hasta que el usuario decide. */
export function CookieBanner() {
  const [choice, setChoice] = useState<CookieConsent | null>(() => storage.getCookieConsent())
  if (choice) return null

  function decide(value: CookieConsent) {
    storage.setCookieConsent(value)
    setChoice(value)
  }

  return (
    <section
      aria-label="Consentimiento de cookies"
      className="fixed inset-x-3 bottom-3 z-[60] mx-auto max-w-3xl rounded-2xl border border-[#153b65]/10 bg-white p-4 shadow-xl sm:p-5"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <Cookie className="hidden size-8 shrink-0 text-[#3fbfb7] sm:block" aria-hidden="true" />
        <p className="flex-1 text-sm leading-6 text-[#153b65]/80">
          Usamos cookies necesarias para que la plataforma funcione y, con tu permiso, cookies de
          analítica para mejorarla. Conoce más en nuestra{' '}
          <Link
            to={APP_ROUTES.privacy}
            className="font-semibold text-[#153b65] underline underline-offset-2"
          >
            política de privacidad
          </Link>
          .
        </p>
        <div className="flex gap-2 sm:flex-col lg:flex-row">
          <Button
            variant="outline"
            className="flex-1 rounded-full"
            onClick={() => decide('necessary')}
          >
            Solo necesarias
          </Button>
          <Button
            className="flex-1 rounded-full bg-[#153b65] text-white hover:bg-[#0f2c4c]"
            onClick={() => decide('all')}
          >
            Aceptar todas
          </Button>
        </div>
      </div>
    </section>
  )
}
