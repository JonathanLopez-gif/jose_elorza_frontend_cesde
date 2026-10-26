import { Globe } from 'lucide-react'
import type { SVGProps } from 'react'

import {
  FacebookIcon,
  InstagramIcon,
  SpotifyIcon,
  WhatsappIcon,
  YoutubeIcon,
} from '@/components/icons/SocialIcons'
import type { SocialPlatform } from '@/types/social'

const ICONS: Record<
  Exclude<SocialPlatform, 'OTHER'>,
  (p: SVGProps<SVGSVGElement>) => React.ReactElement
> = {
  YOUTUBE: YoutubeIcon,
  INSTAGRAM: InstagramIcon,
  FACEBOOK: FacebookIcon,
  SPOTIFY: SpotifyIcon,
  WHATSAPP: WhatsappIcon,
}

export function SocialPlatformIcon({
  platform,
  className,
}: {
  platform: SocialPlatform
  className?: string
}) {
  if (platform === 'OTHER') return <Globe className={className} aria-hidden="true" />
  const Icon = ICONS[platform]
  return <Icon className={className} />
}
