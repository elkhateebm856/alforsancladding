'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FormEvent, useEffect, useRef, useState } from 'react'
import { doc, getDoc, getDocs, collection, serverTimestamp, writeBatch } from 'firebase/firestore'
import { ArrowRight, Save } from 'lucide-react'
import { getFirebaseDb } from '@/lib/firebase/client'

interface PageDraft {
  slug: string
  title: string
  excerpt: string
  content: string
  seoTitle: string
  seoDescription: string
  keywords: string
  status: 'draft' | 'published'
}

const emptyPage: PageDraft = {
  slug: '',
  title: '',
  excerpt: '',
  content: '',
  seoTitle: '',
  seoDescription: '',
  keywords: '',
  status: 'draft',
}

const fieldClass =
  'w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10'
const reservedSlugs = new Set([
  'about',
  'admin',
  'api',
  'blog',
  'contact',
  'portfolio',
  'reviews',
  'services',
  'sitemap',
])

export function PageEditor({ slug }: { slug?: string }) {
  const router = useRouter()
  const [page, setPage] = useState<PageDraft>(emptyPage)
  const [loading, setLoading] = useState(Boolean(slug))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)
  const contentRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (!slug) return
    let active = true
    getDoc(doc(getFirebaseDb(), 'pages', slug))
      .then((snapshot) => {
        if (!active) return
        if (!snapshot.exists() || snapshot.data().status === 'deleted') {
          throw new Error('الصفحة غير موجودة.')
        }
        const data = snapshot.data()
        setPage({
          slug: String(data.slug || slug),
          title: String(data.title || ''),
          excerpt: String(data.excerpt || ''),
          content: String(data.content || ''),
          seoTitle: String(data.seoTitle || ''),
          seoDescription: String(data.seoDescription || ''),
          keywords: Array.isArray(data.keywords) ? data.keywords.join(', ') : '',
          status: data.status === 'published' ? 'published' : 'draft',
        })
      })
      .catch((loadError: unknown) => {
        if (active) setError(loadError instanceof Error ? loadError.message : 'تعذر تحميل الصفحة.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => { active = false }
  }, [slug])

  function update<K extends keyof PageDraft>(field: K, value: PageDraft[K]) {
    setPage((current) => ({ ...current, [field]: value }))
    setSaved(false)
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    setError('')
    setSaved(false)
    const payload = {
      ...page,
      slug: page.slug.trim(),
      title: page.title.trim(),
      excerpt: page.excerpt.trim(),
      keywords: page.keywords.split(',').map((keyword) => keyword.trim()).filter(Boolean),
    }

    try {
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(payload.slug)) {
        throw new Error('استخدم رابطًا مختصرًا باللغة الإنجليزية وأرقامًا وشرطات فقط.')
      }
      if (reservedSlugs.has(payload.slug)) {
        throw new Error('هذا الرابط مستخدم لصفحة أساسية في الموقع. اختر رابطًا آخر.')
      }
      if (new TextEncoder().encode(JSON.stringify(payload)).length > 900_000) {
        throw new Error('حجم الصفحة يتجاوز الحد المسموح به في Firestore.')
      }

      const db = getFirebaseDb()
      const pageRef = doc(db, 'pages', payload.slug)
      const [existing, allPages] = await Promise.all([
        getDoc(pageRef),
        getDocs(collection(db, 'pages')),
      ])
      const slugIsUsed = allPages.docs.some((document) =>
        document.id === payload.slug &&
        document.id !== slug &&
        document.data().status !== 'deleted',
      )
      if (slugIsUsed || (payload.slug !== slug && existing.exists() && existing.data().status !== 'deleted')) {
        throw new Error('يوجد صفحة بهذا الرابط بالفعل. اختر رابطًا آخر.')
      }

      const previousPageRef = slug ? doc(db, 'pages', slug) : null
      const previousPage = previousPageRef && payload.slug !== slug
        ? await getDoc(previousPageRef)
        : null
      const batch = writeBatch(db)
      batch.set(pageRef, {
        ...payload,
        id: payload.slug,
        slug: payload.slug,
        createdAt: existing.data()?.createdAt || previousPage?.data()?.createdAt || serverTimestamp(),
        updatedAt: serverTimestamp(),
      }, { merge: true })
      if (previousPageRef && payload.slug !== slug) {
        batch.set(previousPageRef, {
          id: slug,
          slug,
          status: 'deleted',
          updatedAt: serverTimestamp(),
        }, { merge: true })
      }
      await batch.commit()
      setSaved(true)
      if (!slug || payload.slug !== slug) {
        router.replace(`/admin/pages/${encodeURIComponent(payload.slug)}`)
      }
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'تعذر حفظ الصفحة.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <p className="p-12 text-center text-slate-500">جارٍ تحميل الصفحة...</p>
  }

  return (
    <main dir="rtl" className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-5 sm:px-6">
          <div>
            <Link href="/admin" className="mb-1 inline-flex items-center gap-2 text-sm font-semibold text-primary">
              <ArrowRight size={16} /> لوحة الإدارة
            </Link>
            <h1 className="text-2xl font-extrabold text-slate-900">{slug ? 'تعديل الصفحة' : 'إضافة صفحة جديدة'}</h1>
          </div>
          {slug && <Link href={`/${slug}`} target="_blank" className="text-sm font-semibold text-slate-600 underline">معاينة الصفحة</Link>}
        </div>
      </header>

      <form onSubmit={submit} className="mx-auto max-w-5xl space-y-5 px-4 py-8 sm:px-6">
        {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</p>}
        {saved && <p role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">تم حفظ الصفحة بنجاح.</p>}

        <section className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 md:grid-cols-2">
          <h2 className="text-lg font-bold text-slate-900 md:col-span-2">البيانات الأساسية</h2>
          <label className="space-y-2 text-sm font-semibold text-slate-700">
            عنوان الصفحة
            <input required value={page.title} onChange={(event) => update('title', event.target.value)} className={fieldClass} />
          </label>
          <label className="space-y-2 text-sm font-semibold text-slate-700">
            الرابط المختصر
            <input required dir="ltr" value={page.slug} onChange={(event) => update('slug', event.target.value)} placeholder="page-slug" className={`${fieldClass} text-left`} />
          </label>
          <label className="space-y-2 text-sm font-semibold text-slate-700 md:col-span-2">
            وصف مختصر
            <textarea required rows={2} value={page.excerpt} onChange={(event) => update('excerpt', event.target.value)} className={fieldClass} />
          </label>
        </section>

        <section className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 md:grid-cols-2">
          <h2 className="text-lg font-bold text-slate-900 md:col-span-2">إعدادات SEO</h2>
          <label className="space-y-2 text-sm font-semibold text-slate-700">
            عنوان SEO
            <input value={page.seoTitle} onChange={(event) => update('seoTitle', event.target.value)} className={fieldClass} />
          </label>
          <label className="space-y-2 text-sm font-semibold text-slate-700">
            الكلمات المفتاحية (افصل بينها بفاصلة)
            <input value={page.keywords} onChange={(event) => update('keywords', event.target.value)} className={fieldClass} />
          </label>
          <label className="space-y-2 text-sm font-semibold text-slate-700 md:col-span-2">
            وصف SEO
            <textarea rows={2} value={page.seoDescription} onChange={(event) => update('seoDescription', event.target.value)} className={fieldClass} />
          </label>
        </section>

        <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900">محتوى الصفحة</h2>
            <p className="text-sm text-slate-500">أدخل المحتوى بصيغة HTML. ستُعقّم الوسوم الخطرة قبل عرض الصفحة.</p>
          </div>
          <textarea
            ref={contentRef}
            required
            rows={24}
            dir="ltr"
            wrap="off"
            value={page.content}
            onChange={(event) => update('content', event.target.value)}
            className={`${fieldClass} font-mono text-sm leading-6`}
            spellCheck={false}
          />
          <details className="rounded-xl border border-slate-200 p-4">
            <summary className="cursor-pointer font-semibold">معاينة HTML</summary>
            <iframe
              title="معاينة الصفحة"
              sandbox=""
              srcDoc={`<!doctype html><html dir="rtl"><meta charset="utf-8"><body style="font-family:Arial,sans-serif;line-height:1.9;padding:16px">${page.content}</body></html>`}
              className="mt-4 h-96 w-full rounded-lg border bg-white"
            />
          </details>
        </section>

        <div className="sticky bottom-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-xl backdrop-blur">
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/admin" className="rounded-xl border px-5 py-3 text-sm font-semibold">إلغاء والعودة</Link>
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              الحالة قبل الحفظ
              <select value={page.status} onChange={(event) => update('status', event.target.value as PageDraft['status'])} className="rounded-xl border border-slate-200 bg-white px-3 py-3 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10">
                <option value="draft">مسودة</option>
                <option value="published">منشور</option>
              </select>
            </label>
          </div>
          <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-bold text-white disabled:cursor-wait disabled:opacity-50">
            <Save size={18} /> {saving ? 'جارٍ الحفظ...' : page.status === 'published' ? 'نشر الصفحة' : 'حفظ كمسودة'}
          </button>
        </div>
      </form>
    </main>
  )
}
