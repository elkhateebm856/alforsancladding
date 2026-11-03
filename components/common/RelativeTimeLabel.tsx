'use client'

import { useEffect, useState } from 'react'
import { formatRelativeTime } from '@/lib/date-format'

interface RelativeTimeLabelProps {
  dateTime: string
  initialText: string
  prefix?: string
  suffix?: string
  className?: string
}

export function RelativeTimeLabel({
  dateTime,
  initialText,
  prefix = '',
  suffix = '',
  className,
}: RelativeTimeLabelProps) {
  const [text, setText] = useState(initialText)

  useEffect(() => {
    const update = () => {
      setText(formatRelativeTime(dateTime) || initialText)
    }

    update()
    const interval = window.setInterval(update, 60_000)
    document.addEventListener('visibilitychange', update)

    return () => {
      window.clearInterval(interval)
      document.removeEventListener('visibilitychange', update)
    }
  }, [dateTime, initialText])

  return (
    <time dateTime={dateTime} aria-label={`نُشر ${text}`} className={className}>
      {prefix}{text}{suffix}
    </time>
  )
}
