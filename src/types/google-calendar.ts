export type GoogleCalendarStatus = 'CONNECTED' | 'DISCONNECTED' | 'EXPIRED' | 'ERROR'

export interface GoogleCalendarIntegration {
  status: GoogleCalendarStatus
  email?: string | null
  connectedAt?: string | null
  expiresAt?: string | null
  message?: string | null
}

export interface GoogleCalendarAuthUrl {
  url: string
}
