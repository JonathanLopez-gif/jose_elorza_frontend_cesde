import { useQuery } from '@tanstack/react-query'

import { getAdminSocialLinks, getSocialLinks } from '@/api/social-links'

export const SOCIAL_LINKS_KEY = ['social-links'] as const
export const ADMIN_SOCIAL_LINKS_KEY = ['admin-social-links'] as const

/** Canales activos para la landing y el footer. Cambian poco: se cachean 5 minutos. */
export const useSocialLinks = () =>
  useQuery({ queryKey: SOCIAL_LINKS_KEY, queryFn: getSocialLinks, staleTime: 5 * 60_000 })

export const useAdminSocialLinks = () =>
  useQuery({ queryKey: ADMIN_SOCIAL_LINKS_KEY, queryFn: getAdminSocialLinks })
