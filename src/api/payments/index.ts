import { apiClient } from '@/api/client'
import { API_ENDPOINTS } from '@/api/endpoints'
import { unwrap } from '@/api/helpers'
import type {
  CreatePaymentPayload,
  CreatePaymentResult,
  Payment,
  PaymentFilters,
} from '@/types/payment'

export async function createPayment(payload: CreatePaymentPayload): Promise<CreatePaymentResult> {
  const { data } = await apiClient.post(API_ENDPOINTS.payments.create, payload)
  return unwrap<CreatePaymentResult>(data)
}

export async function getPayment(id: string): Promise<Payment> {
  const { data } = await apiClient.get(API_ENDPOINTS.payments.detail(id))
  return unwrap<Payment>(data)
}

export async function getMyPayments(): Promise<Payment[]> {
  const { data } = await apiClient.get(API_ENDPOINTS.payments.mine)
  return unwrap<Payment[]>(data) ?? []
}

export async function getAdminPayments(filters?: PaymentFilters): Promise<Payment[]> {
  const { data } = await apiClient.get(API_ENDPOINTS.admin.payments, { params: filters })
  return unwrap<Payment[]>(data) ?? []
}

export async function refundPayment(id: string, note: string): Promise<Payment> {
  const { data } = await apiClient.patch(API_ENDPOINTS.admin.refund(id), { note })
  return unwrap<Payment>(data)
}

/** Solo desarrollo: la pasarela simulada informa el resultado del pago al servidor de pruebas. */
export async function simulateGatewayResult(
  paymentId: string,
  result: 'APPROVED' | 'DECLINED' | 'PENDING'
): Promise<Payment> {
  const { data } = await apiClient.post(`/__mock/gateway/${paymentId}`, { result })
  return unwrap<Payment>(data)
}
