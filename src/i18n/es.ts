/**
 * Textos compartidos de la interfaz.
 * El proyecto arranca solo en español, pero todo texto reutilizable vive aquí
 * para poder añadir otro idioma sin tocar los componentes.
 */
export const es = {
  appointmentStatus: {
    PENDING_PAYMENT: 'Pago pendiente',
    CONFIRMED: 'Confirmada',
    CANCELLED: 'Cancelada',
    COMPLETED: 'Completada',
    NO_SHOW: 'No asistió',
    RESCHEDULED: 'Reagendada',
  },
  paymentStatus: {
    PENDING: 'Pendiente',
    APPROVED: 'Aprobado',
    DECLINED: 'Rechazado',
    REFUNDED: 'Reembolsado',
  },
  gateway: {
    WOMPI: 'Wompi',
    GLOBAL66: 'Global66',
  },
  modality: { VIRTUAL: 'Virtual', PRESENCIAL: 'Presencial', HIBRIDA: 'Híbrida' },
  serviceType: { INDIVIDUAL: 'Individual', GRUPAL: 'Grupal' },
  serviceStatus: { ACTIVE: 'Activo', INACTIVE: 'Inactivo' },
  socialPlatform: {
    YOUTUBE: 'YouTube',
    INSTAGRAM: 'Instagram',
    FACEBOOK: 'Facebook',
    SPOTIFY: 'Spotify',
    WHATSAPP: 'WhatsApp',
    OTHER: 'Otro',
  },
  role: { USER: 'Usuario', ADMIN: 'Administrador' },
  errors: {
    generic: 'Ocurrió un error inesperado. Inténtalo de nuevo.',
    network: 'No pudimos conectar con el servidor. Revisa tu conexión.',
    slotUnavailable: 'Ese horario acaba de ser ocupado. Elige otro.',
    invalidCredentials: 'Correo o contraseña incorrectos.',
  },
} as const

export type Dictionary = typeof es
