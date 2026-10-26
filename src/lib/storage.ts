/** Preferencias locales no sensibles. El token de acceso NO se guarda aquí. */
const COOKIE_CONSENT_KEY = 'cookie_consent'

export type CookieConsent = 'all' | 'necessary'

export const storage = {
  getCookieConsent(): CookieConsent | null {
    try {
      const v = localStorage.getItem(COOKIE_CONSENT_KEY)
      return v === 'all' || v === 'necessary' ? v : null
    } catch {
      return null
    }
  },
  setCookieConsent(value: CookieConsent) {
    try {
      localStorage.setItem(COOKIE_CONSENT_KEY, value)
    } catch {
      /* modo privado: se pregunta de nuevo la próxima vez */
    }
  },
}
