import { adminHandlers } from './handlers/admin'
import { appointmentHandlers } from './handlers/appointments'
import { authHandlers } from './handlers/auth'
import { paymentHandlers } from './handlers/payments'
import { serviceHandlers } from './handlers/services'
import { socialHandlers } from './handlers/social'

export const handlers = [
  ...authHandlers,
  ...serviceHandlers,
  ...appointmentHandlers,
  ...paymentHandlers,
  ...adminHandlers,
  ...socialHandlers,
]
