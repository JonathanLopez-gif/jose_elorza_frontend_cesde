export const API_ENDPOINTS = {
    auth: {
        login: "/auth/login",
        register: "/auth/register",
        me: "/auth/me",
        logout: "/auth/logout",
        refresh: "/auth/refresh",
    },

    services: {
        list: "/services",
        detail: (id: string) => `/services/${id}`,
    },

    appointments: {
        list: "/appointments",
        create: "/appointments",
        detail: (id: string) => `/appointments/${id}`,
    },

    payments: {
        create: "/payments",
        verify: (id: string) => `/payments/${id}/verify`,
    },

    admin: {
        dashboard: "/admin/dashboard",
    },
} as const;