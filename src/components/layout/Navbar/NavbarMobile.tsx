import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { Logo } from '@/components/layout/Logo'
import { CTA } from '@/constants/cta'
import { APP_ROUTES } from '@/constants/routes'
import { useAuthStore } from '@/store/slices/auth.store'
import { Navigation } from './Navigation'
import { useLogout } from '@/hooks/useLogout'

const mobileLink = 'py-2 text-sm font-semibold text-[#153b65]'

export function NavbarMobile() {
  const [open, setOpen] = useState(false)
  const user = useAuthStore((s) => s.user)
  const logout = useLogout()
  const close = () => setOpen(false)
  return (
    <div className="lg:hidden">
      <div className="flex h-16 items-center justify-between">
        <Logo />
        <button
          type="button"
          className="inline-flex size-10 items-center justify-center rounded-lg text-[#1a3a5c]"
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>
      {open && (
        <div className="border-t border-[#1a3a5c]/10 pb-5 pt-4">
          <Navigation direction="column" onNavigate={close} />
          <div className="mt-4 flex flex-col border-t border-[#1a3a5c]/10 pt-3">
            {user ? (
              <>
                <p className="pb-1 text-xs text-muted-foreground">Sesión de {user.name}</p>
                {user.role === 'ADMIN' && (
                  <Link to={APP_ROUTES.admin.root} onClick={close} className={mobileLink}>
                    Panel administrativo
                  </Link>
                )}
                <Link to={APP_ROUTES.account.appointments} onClick={close} className={mobileLink}>
                  Mis citas
                </Link>
                <Link to={APP_ROUTES.account.payments} onClick={close} className={mobileLink}>
                  Mis pagos
                </Link>
                <Link to={APP_ROUTES.account.profile} onClick={close} className={mobileLink}>
                  Mi perfil
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    close()
                    void logout()
                  }}
                  className={`${mobileLink} text-left`}
                >
                  Cerrar sesión
                </button>
              </>
            ) : (
              <>
                <Link to={APP_ROUTES.login} onClick={close} className={mobileLink}>
                  Ingresar
                </Link>
                <Link to={APP_ROUTES.register} onClick={close} className={mobileLink}>
                  Crear cuenta
                </Link>
              </>
            )}
          </div>
          <Link
            to={APP_ROUTES.services}
            onClick={close}
            className="mt-5 inline-flex h-11 items-center justify-center rounded-full bg-[#1a3a5c] px-6 text-[0.72rem] font-bold uppercase tracking-[0.06em] text-white"
          >
            {CTA.bookAppointment}
          </Link>
        </div>
      )}
    </div>
  )
}
