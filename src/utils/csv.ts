function escapeCell(value: unknown): string {
  if (value === null || value === undefined) return ''
  const text = String(value)
  // Evita que Excel interprete la celda como fórmula (CSV injection).
  const safe = /^[=+\-@]/.test(text) && Number.isNaN(Number(text)) ? `'${text}` : text
  return /[",\n\r;]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe
}

export function toCsv<T extends Record<string, unknown>>(
  rows: T[],
  columns: readonly { key: keyof T; label: string }[]
): string {
  const header = columns.map((c) => escapeCell(c.label)).join(',')
  const body = rows.map((row) => columns.map((c) => escapeCell(row[c.key])).join(','))
  return [header, ...body].join('\r\n')
}

/** Descarga un CSV con BOM para que Excel respete las tildes. */
export function downloadCsv(filename: string, csv: string) {
  const blob = new Blob(['﻿', csv], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}
