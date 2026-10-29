'use client'

import { useState } from 'react'
import { Check, Copy, Share2 } from 'lucide-react'

export function ArticleShareActions({ title }: { title: string }) {
  const [message, setMessage] = useState('')
  const [copied, setCopied] = useState(false)

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setMessage('تم نسخ رابط المقال.')
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setMessage('تعذر نسخ الرابط. انسخه من شريط العنوان.')
    }
  }

  async function shareArticle() {
    if (!navigator.share) {
      await copyLink()
      return
    }

    try {
      await navigator.share({ title, url: window.location.href })
      setMessage('تمت مشاركة المقال.')
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        setMessage('تعذرت مشاركة المقال حاليًا.')
      }
    }
  }

  return (
    <div className="mt-10 flex flex-wrap items-center gap-3 border-t border-border pt-6">
      <span className="me-1 text-sm font-bold text-foreground">شارك المقال</span>
      <button
        type="button"
        onClick={() => void shareArticle()}
        className="inline-flex min-h-10 items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-primary/90"
      >
        <Share2 size={16} aria-hidden="true" />
        مشاركة
      </button>
      <button
        type="button"
        onClick={() => void copyLink()}
        className="inline-flex min-h-10 items-center gap-2 rounded-md border border-border bg-white px-4 py-2 text-sm font-bold text-foreground transition-colors hover:border-primary/40 hover:text-primary"
      >
        {copied ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
        {copied ? 'تم النسخ' : 'نسخ الرابط'}
      </button>
      {message && <span role="status" className="basis-full text-sm text-muted-foreground">{message}</span>}
    </div>
  )
}