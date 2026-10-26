import { NavLink } from 'react-router-dom'
import { NAVIGATION } from '@/constants/navigation'
import { cn } from '@/lib/utils'

type NavigationProps = {
  direction?: 'row' | 'column'
  onNavigate?: () => void
}

export function Navigation({ direction = 'row', onNavigate }: NavigationProps) {
  return (
    <nav aria-label="Navegación principal">
      <ul
        className={cn(
          'flex items-center',
          direction === 'row' ? 'gap-7 xl:gap-9' : 'flex-col items-start gap-5'
        )}
      >
        {NAVIGATION.map((item) => (
          <li key={item.label}>
            <NavLink
              to={item.href}
              onClick={onNavigate}
              className={cn(
                'text-[0.9rem] font-semibold text-[#1a3a5c]/90 transition-colors hover:text-[#1a3a5c]'
              )}
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
