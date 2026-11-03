function asDate(value: unknown): Date | null {
  let date: Date | null = null

  if (value instanceof Date) {
    date = value
  } else if (typeof value === 'string' || typeof value === 'number') {
    date = new Date(value)
  } else if (
    value &&
    typeof value === 'object' &&
    'toDate' in value &&
    typeof value.toDate === 'function'
  ) {
    const converted = (value as { toDate: () => unknown }).toDate()
    if (converted instanceof Date) date = converted
  }

  return date && !Number.isNaN(date.getTime()) ? date : null
}

export function toDateTimeString(value: unknown): string | null {
  return asDate(value)?.toISOString() ?? null
}

export function formatRelativeTime(value: unknown): string | null {
  const date = asDate(value)
  if (!date) return null

  const elapsedMinutes = Math.floor(Math.max(0, Date.now() - date.getTime()) / 60_000)
  if (elapsedMinutes === 0) return 'منذ أقل من دقيقة'

  const formatter = new Intl.RelativeTimeFormat('ar-EG', { numeric: 'auto' })
  if (elapsedMinutes < 60) return formatter.format(-elapsedMinutes, 'minute')

  const elapsedHours = Math.floor(elapsedMinutes / 60)
  if (elapsedHours < 24) return formatter.format(-elapsedHours, 'hour')

  const elapsedDays = Math.floor(elapsedHours / 24)
  if (elapsedDays < 7) return formatter.format(-elapsedDays, 'day')
  if (elapsedDays < 30) {
    return formatter.format(-Math.floor(elapsedDays / 7), 'week')
  }

  const now = new Date()
  let elapsedMonths =
    (now.getFullYear() - date.getFullYear()) * 12 +
    now.getMonth() -
    date.getMonth()
  if (now.getDate() < date.getDate()) elapsedMonths -= 1
  if (elapsedMonths < 1) return formatter.format(-elapsedDays, 'day')
  if (elapsedMonths < 12) return formatter.format(-elapsedMonths, 'month')

  return formatter.format(-Math.floor(elapsedMonths / 12), 'year')
}
