import type { Payment } from '@/types/payment'
import { es } from '@/i18n/es'
import { formatDateTime } from '@/utils/timezone'

function money(amount: number, currency: 'COP' | 'USD') {
  return new Intl.NumberFormat(currency === 'COP' ? 'es-CO' : 'en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: currency === 'COP' ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

/** Genera y descarga el comprobante de pago en PDF (con IVA del 19 % desglosado). */
export async function downloadReceiptPdf(payment: Payment, timezone: string) {
  const { jsPDF } = await import('jspdf')
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const navy: [number, number, number] = [21, 59, 101]
  const teal: [number, number, number] = [63, 191, 183]

  doc.setFillColor(...navy)
  doc.rect(0, 0, 210, 34, 'F')
  doc.setFillColor(...teal)
  doc.rect(0, 34, 210, 2, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(20)
  doc.text('José Fernando Elorza', 16, 17)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.text('Biohipnoterapeuta sistémico', 16, 24)
  doc.setFontSize(11)
  doc.text('COMPROBANTE DE PAGO', 194, 17, { align: 'right' })
  doc.setFontSize(9)
  doc.text(`N.º ${payment.reference}`, 194, 24, { align: 'right' })

  doc.setTextColor(30, 41, 59)
  let y = 54
  const row = (label: string, value: string) => {
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)
    doc.setTextColor(100, 116, 139)
    doc.text(label.toUpperCase(), 16, y)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(11)
    doc.setTextColor(30, 41, 59)
    doc.text(value, 70, y)
    y += 10
  }
  row('Cliente', payment.userName)
  row('Servicio', payment.serviceName)
  row('Fecha de pago', payment.paidAt ? formatDateTime(payment.paidAt, timezone) : '—')
  row('Pasarela', es.gateway[payment.gateway])
  row('Estado', es.paymentStatus[payment.status])

  y += 6
  doc.setDrawColor(226, 232, 240)
  doc.line(16, y, 194, y)
  y += 10
  const amountRow = (label: string, value: string, bold = false) => {
    doc.setFont('helvetica', bold ? 'bold' : 'normal')
    doc.setFontSize(bold ? 13 : 11)
    doc.text(label, 16, y)
    doc.text(value, 194, y, { align: 'right' })
    y += bold ? 11 : 9
  }
  amountRow('Subtotal (base gravable)', money(payment.baseAmount, payment.currency))
  amountRow('IVA 19 %', money(payment.ivaAmount, payment.currency))
  doc.line(16, y - 4, 194, y - 4)
  amountRow(`Total pagado (${payment.currency})`, money(payment.amount, payment.currency), true)

  if (payment.status === 'REFUNDED') {
    y += 4
    doc.setTextColor(185, 28, 28)
    doc.setFontSize(10)
    doc.text(
      `Pago reembolsado${payment.refundedAt ? ` el ${formatDateTime(payment.refundedAt, timezone)}` : ''}.`,
      16,
      y
    )
  }

  doc.setTextColor(100, 116, 139)
  doc.setFontSize(8)
  doc.text('Los precios incluyen IVA del 19 %. Documento generado electrónicamente.', 105, 280, {
    align: 'center',
  })
  doc.save(`comprobante-${payment.reference}.pdf`)
}
