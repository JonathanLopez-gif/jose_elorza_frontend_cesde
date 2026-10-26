import { NavLink, Outlet } from 'react-router-dom'

import { Container } from '@/components/layout/Container'
import { APP_ROUTES } from '@/constants/routes'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/slices/auth.store'

const TABS = [
  { to: APP_ROUTES.account.appointments, label: 'Mis citas' },
  { to: APP_ROUTES.account.payments, label: 'Mis pagos' },
  { to: APP_ROUTES.account.profile, label: 'Mi perfil' },
]

/** Marco del área "Mi cuenta": saludo + pestañas. Va dentro del layout público (con header y footer). */
export function UserLayout() {
  const name = useAuthStore((s) => s.user?.name ?? '')
  return (
    <div className="bg-[#f7f5f1]">
      <div className="border-b border-[#153b65]/10 bg-white">
        <Container className="max-w-5xl pt-10">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#3fbfb7]">Mi cuenta</p>
          <h1 className="mt-2 font-heading text-3xl font-bold text-[#153b65]">
            Hola, {name.split(' ')[0]}
          </h1>
          <nav
            aria-label="Secciones de mi cuenta"
            className="-mb-px mt-6 flex gap-1 overflow-x-auto"
          >
            {TABS.map((t) => (
              <NavLink
                key={t.to}
                to={t.to}
                className={({ isActive }) =>
                  cn(
                    'whitespace-nowrap border-b-2 px-4 py-3 text-sm font-semibold transition-colors',
                    isActive
                      ? 'border-[#153b65] text-[#153b65]'
                      : 'border-transparent text-muted-foreground hover:text-[#153b65]'
                  )
                }
              >
                {t.label}
              </NavLink>
            ))}
          </nav>
        </Container>
      </div>
      <Container className="min-h-[50vh] max-w-5xl py-10">
        <Outlet />
      </Container>
    </div>
  )
}
