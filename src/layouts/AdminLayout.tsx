import { useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import {
  Blocks,
  Briefcase,
  CalendarDays,
  CalendarSync,
  CreditCard,
  ExternalLink,
  FileBarChart,
  LayoutDashboard,
  LogOut,
  Menu,
  Share2,
  Users,
  X,
} from 'lucide-react'

import { APP_ROUTES } from '@/constants/routes'
import { useLogout } from '@/hooks/useLogout'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/slices/auth.store'

const ITEMS = [
  { to: APP_ROUTES.admin.root, label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: APP_ROUTES.admin.agenda, label: 'Agenda', icon: CalendarDays },
  { to: APP_ROUTES.admin.services, label: 'Servicios', icon: Briefcase },
  { to: APP_ROUTES.admin.users, label: 'Usuarios', icon: Users },
  { to: APP_ROUTES.admin.payments, label: 'Pagos', icon: CreditCard },
  { to: APP_ROUTES.admin.socialLinks, label: 'Redes sociales', icon: Share2 },
  { to: APP_ROUTES.admin.reports, label: 'Reportes', icon: FileBarChart },
  { to: APP_ROUTES.admin.googleCalendar, label: 'Google Calendar', icon: CalendarSync },
] as const

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const user = useAuthStore((s) => s.user)
  const logout = useLogout()
  return (
    <div className="flex h-full flex-col">
      <Link
        to={APP_ROUTES.admin.root}
        onClick={onNavigate}
        className="flex items-center gap-3 px-5 py-6"
      >
        <img src="/brand/logo-mark-oscuro.svg" alt="" width={40} height={40} />
        <span className="leading-tight">
          <span className="block text-base font-light text-[#3fbfb7]">José</span>
          <span className="block text-base font-bold text-white">Elorza · Admin</span>
        </span>
      </Link>
      <nav aria-label="Panel administrativo" className="flex-1 space-y-1 px-3">
        {ITEMS.map(({ to, label, icon: Icon, ...rest }) => (
          <NavLink
            key={to}
            to={to}
            end={'end' in rest}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors',
                isActive
                  ? 'bg-white/15 text-white'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              )
            }
          >
            <Icon className="size-[18px]" aria-hidden="true" /> {label}
          </NavLink>
        ))}
      </nav>
      <div className="space-y-1 border-t border-white/10 px-3 py-4">
        <p className="truncate px-3 pb-2 text-xs text-white/60">{user?.email}</p>
        <Link
          to={APP_ROUTES.home}
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-white/70 hover:bg-white/10 hover:text-white"
        >
          <ExternalLink className="size-[18px]" aria-hidden="true" /> Ver sitio público
        </Link>
        <Link
          to={APP_ROUTES.components}
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-white/70 hover:bg-white/10 hover:text-white"
        >
          <Blocks className="size-[18px]" aria-hidden="true" /> Componentes UI
        </Link>
        <button
          type="button"
          onClick={() => void logout()}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-white/70 hover:bg-white/10 hover:text-white"
        >
          <LogOut className="size-[18px]" aria-hidden="true" /> Cerrar sesión
        </button>
      </div>
    </div>
  )
}

export function AdminLayout() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const current = ITEMS.find((i) => ('end' in i ? pathname === i.to : pathname.startsWith(i.to)))
  return (
    <div className="min-h-screen bg-[#f4f6f9] lg:grid lg:grid-cols-[16rem_1fr]">
      <aside className="sticky top-0 hidden h-screen bg-[#153b65] lg:block">
        <SidebarContent />
      </aside>

      <div className="flex min-w-0 flex-col">
        <header className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b bg-white px-4 lg:hidden">
          <button
            type="button"
            aria-label="Abrir menú"
            aria-expanded={open}
            onClick={() => setOpen(true)}
            className="flex size-10 items-center justify-center rounded-lg text-[#153b65]"
          >
            <Menu className="size-6" />
          </button>
          <span className="font-heading font-bold text-[#153b65]">{current?.label ?? 'Panel'}</span>
        </header>

        {open && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <button
              type="button"
              aria-label="Cerrar menú"
              className="absolute inset-0 bg-black/50"
              onClick={() => setOpen(false)}
            />
            <aside className="absolute inset-y-0 left-0 w-72 max-w-[85%] bg-[#153b65] shadow-xl">
              <button
                type="button"
                aria-label="Cerrar menú"
                onClick={() => setOpen(false)}
                className="absolute right-3 top-4 flex size-9 items-center justify-center rounded-lg text-white/80 hover:bg-white/10"
              >
                <X className="size-5" />
              </button>
              <SidebarContent onNavigate={() => setOpen(false)} />
            </aside>
          </div>
        )}

        <main className="min-w-0 flex-1 px-4 py-8 sm:px-6 lg:px-10">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
