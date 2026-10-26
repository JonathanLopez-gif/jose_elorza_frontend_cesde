export const API_ENDPOINTS = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
  },
  users: {
    me: '/users/me',
  },
  services: {
    list: '/services',
    all: '/services/all',
    detail: (id: string) => `/services/${id}`,
  },
  appointments: {
    availability: '/appointments/availability',
    monthAvailability: '/appointments/availability/month',
    create: '/appointments',
    mine: '/appointments/my-appointments',
    detail: (id: string) => `/appointments/${id}`,
    cancel: (id: string) => `/appointments/${id}/cancel`,
    reschedule: (id: string) => `/appointments/${id}/reschedule`,
  },
  payments: {
    create: '/payments',
    mine: '/payments/my-payments',
    detail: (id: string) => `/payments/${id}`,
  },
  socialLinks: {
    list: '/social-links',
  },
  admin: {
    dashboard: '/admin/dashboard',
    users: '/admin/users',
    userStatus: (id: string) => `/admin/users/${id}/status`,
    appointments: '/admin/appointments',
    appointment: (id: string) => `/admin/appointments/${id}`,
    payments: '/admin/payments',
    refund: (id: string) => `/admin/payments/${id}/refund`,
    socialLinks: {
      list: '/admin/social-links',
      order: '/admin/social-links/order',
      detail: (id: string) => `/admin/social-links/${id}`,
    },
    googleCalendar: {
      status: '/admin/google-calendar/status',
      authUrl: '/admin/google-calendar/auth-url',
      callback: '/admin/google-calendar/callback',
      disconnect: '/admin/google-calendar/disconnect',
    },
  },
} as const
