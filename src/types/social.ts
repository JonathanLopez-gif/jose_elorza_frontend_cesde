export type SocialPlatform = 'YOUTUBE' | 'INSTAGRAM' | 'FACEBOOK' | 'SPOTIFY' | 'WHATSAPP' | 'OTHER'

/** Canal externo del negocio (tabla `social_links`). */
export interface SocialLink {
  id: string
  platform: SocialPlatform
  name: string
  description: string
  url: string
  active: boolean
  /** Posición en la que se muestra (1 = primero). */
  order: number
}

export type SocialLinkInput = Omit<SocialLink, 'id' | 'order'>
