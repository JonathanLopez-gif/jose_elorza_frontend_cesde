export const APP_ROUTES = {
  home: '/',
  login: '/login',
  register: '/registro',
  recover: '/recuperar',
  resetPassword: '/restablecer',
  terms: '/terminos',
  /** Página de referencia del sistema de diseño (componentes base). */
  components: '/componentes',
  privacy: '/privacidad',
  services: '/servicios',
  serviceDetail: (id: string) => `/servicios/${id}`,
  booking: '/agendar',
  bookingDetail: (id: string) => `/agendar/${id}`,
  payment: {
    /** Página de la pasarela simulada (solo desarrollo). En producción el checkout es externo. */
    simulator: '/pago/checkout-simulado',
    result: '/pago/resultado',
    pay: (appointmentId: string) => `/pagar/${appointmentId}`,
  },
  account: {
    root: '/mi-cuenta',
    appointments: '/mi-cuenta/citas',
    payments: '/mi-cuenta/pagos',
    profile: '/mi-cuenta/perfil',
  },
  admin: {
    root: '/admin',
    users: '/admin/usuarios',
    services: '/admin/servicios',
    agenda: '/admin/agenda',
    payments: '/admin/pagos',
    reports: '/admin/reportes',
    socialLinks: '/admin/redes-sociales',
    googleCalendar: '/admin/google-calendar',
  },
} as const
