/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_APP_NAME: string
  readonly VITE_ENABLE_MSW?: string
  readonly VITE_WOMPI_PUBLIC_KEY?: string
  readonly VITE_GLOBAL66_PUBLIC_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
