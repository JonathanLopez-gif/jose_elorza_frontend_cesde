import type { ComponentProps } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'

type LogoProps = Omit<ComponentProps<'a'>, 'href'> & {
  showSubtitle?: boolean
}

export function Logo({ className }: LogoProps) {
  return (
    <Link
      to="/"
      className={cn('inline-flex items-center gap-2.5 shrink-0', className)}
      aria-label="José Elorza — Inicio"
    >
      <img
        src="/brand/logo-mark.svg"
        alt=""
        className="h-14 w-14 object-contain"
        width={56}
        height={56}
      />
      <span className="flex flex-col leading-[1.05]">
        <span className="text-[1.3rem] font-light text-[#3fbfb7]">José</span>
        <span className="text-[1.3rem] font-bold tracking-tight text-[#153b65]">Elorza</span>
      </span>
    </Link>
  )
}
