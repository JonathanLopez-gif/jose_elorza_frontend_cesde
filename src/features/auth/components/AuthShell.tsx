import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

import { APP_ROUTES } from '@/constants/routes'

interface AuthShellProps {
  eyebrow: string
  title: string
  description: string
  children: ReactNode
  footer?: ReactNode
}

/** Marco común de login, registro y recuperación: panel de marca + formulario. */
export function AuthShell({ eyebrow, title, description, children, footer }: AuthShellProps) {
  return (
    <div className="grid min-h-[calc(100vh-76px)] lg:grid-cols-[1fr_1.1fr]">
      <aside className="relative hidden overflow-hidden bg-[#153b65] px-12 py-14 text-white lg:flex lg:flex-col lg:justify-between">
        <img
          src="/brand/logo-mark-oscuro.svg"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -bottom-16 w-[34rem] max-w-none opacity-[0.14]"
        />
        <Link to={APP_ROUTES.home} className="relative z-10 flex items-center gap-3">
          <img src="/brand/logo-mark-oscuro.svg" alt="" width={48} height={48} />
          <span className="leading-tight">
            <span className="block text-lg font-light text-[#3fbfb7]">José</span>
            <span className="block text-lg font-bold">Elorza</span>
          </span>
        </Link>
        <div className="relative z-10">
          <p className="mb-5 text-xs font-bold uppercase tracking-[0.22em] text-[#3fbfb7]">
            Un espacio para ti
          </p>
          <p className="max-w-md font-heading text-4xl font-bold leading-tight text-white">
            La claridad también se construye acompañado.
          </p>
        </div>
        <p className="relative z-10 text-sm text-white/60">Sesiones online · Colombia y el mundo</p>
      </aside>

      <section className="flex items-center justify-center px-5 py-12 sm:px-8 sm:py-16">
        <div className="w-full max-w-md">
          <Link
            to={APP_ROUTES.home}
            className="text-sm font-semibold text-[#153b65] hover:underline"
          >
            ← Volver al inicio
          </Link>
          <p className="mt-10 text-xs font-bold uppercase tracking-[0.2em] text-[#3fbfb7]">
            {eyebrow}
          </p>
          <h1 className="mt-2 font-heading text-3xl font-bold text-[#153b65] sm:text-4xl">
            {title}
          </h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">{description}</p>
          <div className="mt-8">{children}</div>
          {footer && <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-sm">{footer}</div>}
        </div>
      </section>
    </div>
  )
}

export function AuthLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link to={to} className="font-semibold text-[#153b65] underline-offset-4 hover:underline">
      {children}
    </Link>
  )
}
