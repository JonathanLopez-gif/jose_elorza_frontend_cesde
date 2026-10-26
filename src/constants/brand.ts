export const BRAND = {
  name: 'José Fernando Elorza',

  profession: 'Biohipnoterapeuta Sistémico',

  tagline: 'Transforma tu vida desde el origen',

  description:
    'Acompañamiento para la transformación personal mediante Biohipnosis Sistémica, conversaciones conscientes, talleres y conferencias.',

  email: 'josefernandoelorza@gmail.com',

  // Número oficial según el Portafolio de Servicios y la Investigación de marca.
  phone: '+57 315 462 7900',
  phoneHref: 'tel:+573154627900',
  whatsapp: '+57 315 462 7900',
  whatsappUrl: 'https://wa.me/573154627900',

  instagramHandle: '@josef.elorza',
  instagramUrl: 'https://www.instagram.com/josef.elorza',

  copyright: 'Todos los derechos reservados.',
} as const

/**
 * Respaldo de redes cuando la API no responde. Los enlaces vigentes se gestionan desde
 * el panel admin (Redes sociales); las cadenas vacías se muestran como ícono inactivo.
 */
export const SOCIAL_LINKS = {
  facebook: '',
  spotify: '',
  whatsapp: BRAND.whatsappUrl,
  youtube: 'https://www.youtube.com/@EmprenSerPodcast',
} as const
