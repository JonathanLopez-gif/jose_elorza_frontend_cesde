export type PaymentGateway = 'WOMPI' | 'GLOBAL66'
export type PaymentStatus = 'PENDING' | 'APPROVED' | 'DECLINED' | 'REFUNDED'
export type PaymentCurrency = 'COP' | 'USD'

export interface Payment {
  id: string
  reference: string
  appointmentId: string
  userId: string
  userName: string
  serviceName: string
  gateway: PaymentGateway
  currency: PaymentCurrency
  status: PaymentStatus
  /** Monto total cobrado (IVA incluido) en la moneda del pago. */
  amount: number
  baseAmount: number
  ivaAmount: number
  createdAt: string
  paidAt?: string | null
  refundedAt?: string | null
  refundNote?: string | null
  /** Monto que se debe devolver por una cancelación (informativo, la devolución es manual). */
  refundDue?: number | null
}

export interface CreatePaymentPayload {
  appointmentId: string
  gateway: PaymentGateway
}

export interface CreatePaymentResult {
  payment: Payment
  /** URL del checkout externo de la pasarela. */
  checkoutUrl: string
}

export interface PaymentFilters {
  status?: PaymentStatus | ''
  gateway?: PaymentGateway | ''
  from?: string
  to?: string
  search?: string
}
