import { APP_ROUTES } from '@/constants/routes'

export const NAVIGATION = [
  { label: 'Inicio', href: APP_ROUTES.home },
  { label: 'Sobre Mí', href: '/#sobre-mi' },
  { label: 'Servicios', href: APP_ROUTES.services },
  { label: '¿Cómo Trabajo?', href: '/#proceso' },
  { label: 'Recursos', href: '/#recursos' },
  { label: 'Contacto', href: '/#contacto' },
] as const
