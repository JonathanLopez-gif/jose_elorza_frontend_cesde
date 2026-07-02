const env = {
    appName: import.meta.env.VITE_APP_NAME,

    apiUrl: import.meta.env.VITE_API_URL,

    wompiPublicKey: import.meta.env.VITE_WOMPI_PUBLIC_KEY,

    global66PublicKey: import.meta.env.VITE_GLOBAL66_PUBLIC_KEY,
} as const

export { env }