import type { Service } from '@/types/service'
import type { SocialLink } from '@/types/social'

/** Catálogo inicial. Los precios incluyen IVA del 19 %. */
export const seedServices: Service[] = [
  {
    id: 'svc-biohipnosis',
    name: 'Biohipnosis Sistémica',
    description:
      'Es una metodología que fusiona componentes de las constelaciones familiares, la biodescodificación y la hipnosis, acompaño a quienes sienten el llamado a sanar su historia y reconectarse con su poder interior. Mi mayor satisfacción es ver cómo, cuando una persona sana, su entorno también florece. ¿Qué incluye? Entrevista inicial (duración 30 minutos) para revisar el formulario enviado al momento de agendar la consulta, que incluye preguntas minuciosas y dirigidas sobre los conflictos de la vida y temas de contexto que contribuyen a poder preparar mejor la consulta y maximizar el tiempo de esta. Consulta de Biohypnosis Sistémica (duración 2 horas). Sesión de seguimiento (duración 1 hora y 30 minutos).',
    priceCop: 370000,
    priceUsd: 100,
    durationMinutes: 240,
    modality: 'VIRTUAL',
    type: 'INDIVIDUAL',
    status: 'ACTIVE',
  },
  {
    id: 'svc-sesion-individual',
    name: 'Sesión individual de acompañamiento',
    description:
      'Conversaciones conscientes: Un porcentaje muy grande del proceso de sanación corresponde al poder expresar todo lo que sentimos que nos está afectando. Los humanos son seres conversacionales. Las conversaciones privadas y públicas son fundamentales para construirnos. Siempre tenemos una historia que contar, permíteme escucharla para poderte guiar en tu proceso de sanación. ¿Qué incluye? Sesión individual (duración 2 horas).',
    priceCop: 220000,
    priceUsd: 80,
    durationMinutes: 120,
    modality: 'VIRTUAL',
    type: 'INDIVIDUAL',
    status: 'ACTIVE',
  },
]

/** Canales externos del negocio (gestionables desde el panel admin). */
export const seedSocialLinks: SocialLink[] = [
  {
    id: 'soc-youtube',
    platform: 'YOUTUBE',
    name: 'EmprenSer Podcast',
    description: 'Conversaciones sobre bienestar, propósito y transformación personal.',
    url: 'https://www.youtube.com/@EmprenSerPodcast',
    active: true,
    order: 1,
  },
  {
    id: 'soc-instagram',
    platform: 'INSTAGRAM',
    name: '@josef.elorza',
    description: 'Reflexiones diarias, frases y novedades de talleres y sesiones.',
    url: 'https://www.instagram.com/josef.elorza',
    active: true,
    order: 2,
  },
  {
    id: 'soc-whatsapp',
    platform: 'WHATSAPP',
    name: 'WhatsApp',
    description: 'Escríbeme para resolver dudas antes de agendar tu sesión.',
    url: 'https://wa.me/573154627900',
    active: true,
    order: 3,
  },
]
