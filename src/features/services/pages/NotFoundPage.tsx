import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { APP_ROUTES } from '@/constants/routes'

export function NotFoundPage() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-6 py-20 text-center">
      <img src="/brand/logo-mark.svg" alt="" width={88} height={88} className="opacity-90" />
      <p className="mt-8 text-xs font-bold uppercase tracking-[0.22em] text-[#3fbfb7]">Error 404</p>
      <h1 className="mt-3 font-heading text-4xl font-bold text-[#153b65]">Esta página no existe</h1>
      <p className="mt-4 text-muted-foreground">
        Puede que el enlace esté roto o que la página se haya movido. Vuelve al inicio o explora los
        servicios.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button asChild className="rounded-full bg-[#153b65] px-6 text-white hover:bg-[#0f2c4c]">
          <Link to={APP_ROUTES.home}>Ir al inicio</Link>
        </Button>
        <Button asChild variant="outline" className="rounded-full px-6">
          <Link to={APP_ROUTES.services}>Ver servicios</Link>
        </Button>
      </div>
    </main>
  )
}
