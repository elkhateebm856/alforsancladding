'use client'

import { FormEvent, useState } from 'react'
import { usePathname } from 'next/navigation'
import { Star } from 'lucide-react'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { getFirebaseDb } from '@/lib/firebase/client'

function reviewErrorMessage(error: unknown) {
  const code =
    error && typeof error === 'object' && 'code' in error
      ? String(error.code)
      : ''

  if (code === 'permission-denied') {
    return 'لم يُحفظ التقييم بسبب صلاحيات Firestore. يلزم تفعيل قواعد التقييمات الجديدة.'
  }
  if (code === 'unavailable' || code === 'network-request-failed') {
    return 'تعذر الاتصال بقاعدة البيانات. تحقق من اتصال الإنترنت ثم أعد المحاولة.'
  }
  return 'تعذر حفظ التقييم. بقيت بياناتك في النموذج، يرجى المحاولة مرة أخرى.'
}

export function PublicReviewForm() {
  const pathname = usePathname()
  const [rating, setRating] = useState(5)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (busy) return

    const form = event.currentTarget
    const values = Object.fromEntries(new FormData(form).entries())
    setBusy(true)
    setError('')

    try {
      const name = String(values.name || '').trim()
      const text = String(values.text || '').trim()
      if (name.length < 2 || name.length > 80 || text.length < 10 || text.length > 1200) {
        throw new Error('أدخل اسمًا من حرفين إلى 80 حرفًا ونصًا من 10 إلى 1200 حرف.')
      }

      await addDoc(collection(getFirebaseDb(), 'testimonials'), {
        name,
        rating,
        text,
        sourcePath: pathname,
        status: 'pending',
        createdAt: serverTimestamp(),
      })

      form.reset()
      setRating(5)
      setSent(true)
    } catch (submitError) {
      setError(
        submitError instanceof Error && !('code' in submitError)
          ? submitError.message
          : reviewErrorMessage(submitError),
      )
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="border-t border-primary/40 bg-muted/40 py-14 md:py-18" aria-labelledby="public-review-title">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mb-7 text-center">
          <p className="mb-2 text-sm font-bold text-primary">رأيك يهمنا</p>
          <h2 id="public-review-title" className="text-2xl font-extrabold text-foreground md:text-3xl">
            شاركنا تقييمك
          </h2>
        </div>

        {sent && (
          <p role="status" className="mb-5 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-center text-sm font-semibold leading-7 text-emerald-800">
            شكرًا لمشاركتنا رأيك. أُرسل تقييمك للمراجعة، ولن يظهر للعامة إلا بعد الموافقة عليه.
          </p>
        )}

        <form onSubmit={submit} className="grid min-w-0 max-w-full gap-5 rounded-lg border border-border bg-card p-5 shadow-sm sm:p-7">
          <div className="grid gap-2">
            <label htmlFor="review-name" className="text-sm font-bold text-foreground">اسم العميل</label>
            <input
              id="review-name"
              name="name"
              required
              minLength={2}
              maxLength={80}
              autoComplete="name"
              className="min-h-12 w-full min-w-0 max-w-full rounded-md border border-border bg-background px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <fieldset className="grid gap-2">
            <legend className="text-sm font-bold text-foreground">التقييم بالنجوم</legend>
            <div className="flex justify-end gap-2" role="radiogroup" aria-label="اختر عدد النجوم">
              {[1, 2, 3, 4, 5].map((value) => (
                <label key={value} className="group relative grid size-11 cursor-pointer place-items-center rounded-md focus-within:ring-2 focus-within:ring-primary">
                  <input
                    type="radio"
                    name="rating"
                    value={value}
                    checked={rating === value}
                    onChange={() => setRating(value)}
                    className="sr-only"
                    aria-label={`${value} ${value === 1 ? 'نجمة' : 'نجوم'}`}
                  />
                  <Star size={25} className={value <= rating ? 'fill-primary text-primary' : 'text-muted-foreground/50'} aria-hidden="true" />
                </label>
              ))}
            </div>
          </fieldset>

          <div className="grid gap-2">
            <label htmlFor="review-text" className="text-sm font-bold text-foreground">نص التقييم</label>
            <textarea
              id="review-text"
              name="text"
              required
              minLength={10}
              maxLength={1200}
              rows={5}
              className="w-full min-w-0 max-w-full resize-y rounded-md border border-border bg-background px-4 py-3 leading-7 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 [overflow-wrap:anywhere]"
            />
          </div>

          {error && <p role="alert" className="text-sm font-semibold text-red-700">{error}</p>}

          <button
            type="submit"
            disabled={busy}
            className="min-h-12 rounded-md bg-primary px-6 py-3 font-bold text-white transition-colors hover:bg-primary/90 disabled:cursor-wait disabled:opacity-60"
          >
            {busy ? 'جارٍ إرسال التقييم...' : 'إرسال التقييم'}
          </button>
        </form>
      </div>
    </section>
  )
}