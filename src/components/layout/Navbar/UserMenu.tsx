import { Link } from 'react-router-dom'
import { DropdownMenu } from 'radix-ui'
import {
  CalendarDays,
  ChevronDown,
  CreditCard,
  LayoutDashboard,
  LogOut,
  User as UserIcon,
} from 'lucide-react'

import { APP_ROUTES } from '@/constants/routes'
import { useLogout } from '@/hooks/useLogout'
import { useAuthStore } from '@/store/slices/auth.store'

const itemClass =
  'flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-[#153b65] outline-none data-[highlighted]:bg-[#153b65]/[0.07]'

function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join('')
}

export function UserMenu() {
  const user = useAuthStore((s) => s.user)
  const logout = useLogout()
  if (!user) return null
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger
        className="flex h-11 items-center gap-2.5 rounded-full border border-[#153b65]/15 bg-white pl-1.5 pr-3 text-sm font-semibold text-[#153b65] outline-none hover:bg-[#153b65]/[0.04] focus-visible:ring-2 focus-visible:ring-[#3fbfb7]"
        aria-label="Menú de tu cuenta"
      >
        <span className="flex size-8 items-center justify-center rounded-full bg-[#153b65] text-xs font-bold text-white">
          {initials(user.name)}
        </span>
        <span className="hidden max-w-[8rem] truncate xl:block">{user.name.split(' ')[0]}</span>
        <ChevronDown className="size-4 opacity-60" />
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={8}
          className="z-[70] min-w-60 rounded-xl border border-[#153b65]/10 bg-white p-1.5 shadow-xl"
        >
          <div className="px-3 pb-2 pt-1.5">
            <p className="truncate text-sm font-bold text-[#153b65]">{user.name}</p>
            <p className="truncate text-xs text-muted-foreground">{user.email}</p>
          </div>
          <DropdownMenu.Separator className="my-1 h-px bg-[#153b65]/10" />
          {user.role === 'ADMIN' && (
            <DropdownMenu.Item asChild className={itemClass}>
              <Link to={APP_ROUTES.admin.root}>
                <LayoutDashboard className="size-4" /> Panel administrativo
              </Link>
            </DropdownMenu.Item>
          )}
          <DropdownMenu.Item asChild className={itemClass}>
            <Link to={APP_ROUTES.account.appointments}>
              <CalendarDays className="size-4" /> Mis citas
            </Link>
          </DropdownMenu.Item>
          <DropdownMenu.Item asChild className={itemClass}>
            <Link to={APP_ROUTES.account.payments}>
              <CreditCard className="size-4" /> Mis pagos
            </Link>
          </DropdownMenu.Item>
          <DropdownMenu.Item asChild className={itemClass}>
            <Link to={APP_ROUTES.account.profile}>
              <UserIcon className="size-4" /> Mi perfil
            </Link>
          </DropdownMenu.Item>
          <DropdownMenu.Separator className="my-1 h-px bg-[#153b65]/10" />
          <DropdownMenu.Item className={itemClass} onSelect={() => void logout()}>
            <LogOut className="size-4" /> Cerrar sesión
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}
