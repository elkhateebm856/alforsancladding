export function formatRelativeTime(value: unknown): string | null {
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
    date = (value as { toDate: () => Date }).toDate()
  }

  if (!date || Number.isNaN(date.getTime())) return null

  const elapsedMinutes = Math.floor(Math.max(0, Date.now() - date.getTime()) / 60_000)
  if (elapsedMinutes === 0) return 'منذ أقل من دقيقة'

  const formatter = new Intl.RelativeTimeFormat('ar-EG', { numeric: 'auto' })
  if (elapsedMinutes < 60) return formatter.format(-elapsedMinutes, 'minute')

  const elapsedHours = Math.floor(elapsedMinutes / 60)
  if (elapsedHours < 24) return formatter.format(-elapsedHours, 'hour')

  const elapsedDays = Math.floor(elapsedHours / 24)
  return formatter.format(-elapsedDays, 'day')
}
