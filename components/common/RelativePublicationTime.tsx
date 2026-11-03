import { formatRelativeTime, toDateTimeString } from '@/lib/date-format'
import { RelativeTimeLabel } from '@/components/common/RelativeTimeLabel'

interface RelativePublicationTimeProps {
  value: unknown
  prefix?: string
  suffix?: string
  className?: string
}

export function RelativePublicationTime({
  value,
  prefix,
  suffix,
  className,
}: RelativePublicationTimeProps) {
  const dateTime = toDateTimeString(value)
  const initialText = formatRelativeTime(value)
  if (!dateTime || !initialText) return null

  return (
    <RelativeTimeLabel
      dateTime={dateTime}
      initialText={initialText}
      prefix={prefix}
      suffix={suffix}
      className={className}
    />
  )
}
