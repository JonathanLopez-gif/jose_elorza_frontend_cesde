import { Link } from 'react-router-dom'
import { Logo } from '@/components/layout/Logo'
import { CTA } from '@/constants/cta'
import { APP_ROUTES } from '@/constants/routes'
import { useAuthStore } from '@/store/slices/auth.store'
import { Navigation } from './Navigation'
import { UserMenu } from './UserMenu'

export function NavbarDesktop() {
  const authenticated = useAuthStore((s) => s.status === 'authenticated')
  return (
    <div className="hidden h-[76px] w-full items-center gap-6 lg:flex">
      <Logo />
      <div className="flex flex-1 items-center justify-center">
        <Navigation />
      </div>
      {authenticated ? (
        <UserMenu />
      ) : (
        <Link
          to={APP_ROUTES.login}
          className="shrink-0 text-[0.78rem] font-bold uppercase tracking-[0.06em] text-[#153b65] hover:underline"
        >
          Ingresar
        </Link>
      )}
      <Link
        to={APP_ROUTES.services}
        className="inline-flex h-11 shrink-0 items-center justify-center rounded-full bg-[#1a3a5c] px-6 text-[0.72rem] font-bold uppercase tracking-[0.06em] text-white transition-colors hover:bg-[#142d48]"
      >
        {CTA.bookAppointment}
      </Link>
    </div>
  )
}
