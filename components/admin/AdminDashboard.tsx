'use client'

import Link from 'next/link'
import Image from 'next/image'
import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react'
import { collection, doc, getDocs, serverTimestamp, setDoc, writeBatch } from 'firebase/firestore'
import { signOut } from 'firebase/auth'
import { getFirebaseAuth, getFirebaseDb } from '@/lib/firebase/client'
import { ArrowLeft, Check, FileText, LogOut, Plus, Search, Star, X } from 'lucide-react'

interface Article {
  id: string
  slug: string
  title: string
  excerpt: string
  image: string
  date: string
  category?: string
  status: string
  source?: string
}

interface Testimonial {
  id: string
  name: string
  title?: string
  position: string
  company: string
  text: string
  rating: number
  status: string
  source?: string
  sourcePath?: string
}

interface ContentPage {
  id: string
  slug: string
  title: string
  excerpt: string
  status: string
}

interface ArticleResponse {
  articles: Article[]
  total: number
  page: number
  pageSize: number
  categories: string[]
}

export function AdminDashboard({
  email,
  legacyArticles,
  legacyTestimonials,
}: {
  email: string
  legacyArticles: Article[]
  legacyTestimonials: Testimonial[]
}) {
  const [tab, setTab] = useState<'articles' | 'pages' | 'testimonials'>('articles')
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [category, setCategory] = useState('all')
  const [page, setPage] = useState(1)
  const [articleData, setArticleData] = useState<ArticleResponse | null>(null)
  const [pages, setPages] = useState<ContentPage[]>([])
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [newTestimonialOpen, setNewTestimonialOpen] = useState(false)
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null)

  const loadData = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      if (tab === 'articles') {
        const snapshot = await getDocs(collection(getFirebaseDb(), 'articles'))
        const records = new Map(legacyArticles.map((article) => [article.slug, article]))
        for (const item of snapshot.docs) {
          const record = item.data() as Article
          records.set(item.id, { ...records.get(item.id), ...record, id: item.id, slug: record.slug || item.id, source: 'firestore' })
        }
        const allArticles = [...records.values()].filter((article) => article.status !== 'deleted')
        const filtered = allArticles.filter((article) => {
          const matchesSearch = !search || [article.title, article.slug, article.excerpt]
            .some((value) => String(value || '').toLowerCase().includes(search.toLowerCase()))
          return matchesSearch &&
            (status === 'all' || article.status === status) &&
            (category === 'all' || String(article.category || '') === category)
        }).sort((a, b) => b.date.localeCompare(a.date))
        const pageSize = 20
        setArticleData({
          articles: filtered.slice((page - 1) * pageSize, page * pageSize),
          total: filtered.length,
          page,
          pageSize,
          categories: [...new Set(allArticles.map((article) => article.category).filter((value): value is string => Boolean(value)))],
        })
      } else if (tab === 'pages') {
        const snapshot = await getDocs(collection(getFirebaseDb(), 'pages'))
        const allPages = snapshot.docs
          .map((item) => {
            const record = item.data() as ContentPage
            return { ...record, id: item.id, slug: record.slug || item.id }
          })
          .filter((page) => page.status !== 'deleted')
        setPages(allPages.filter((page) =>
          (status === 'all' || page.status === status) &&
          (!search || [page.title, page.slug, page.excerpt]
            .some((value) => String(value || '').toLowerCase().includes(search.toLowerCase()))),
        ).sort((first, second) => first.title.localeCompare(second.title)))
      } else {
        const snapshot = await getDocs(collection(getFirebaseDb(), 'testimonials'))
        const records = new Map(legacyTestimonials.map((item) => [item.id, item]))
        for (const item of snapshot.docs) {
          const record = item.data() as Testimonial
          records.set(item.id, { ...records.get(item.id), ...record, id: item.id, source: 'firestore' })
        }
        setTestimonials([...records.values()].filter((item) => item.status !== 'deleted' &&
          (status === 'all' || item.status === status) &&
          (!search || [item.name, item.title, item.position, item.company, item.text, item.sourcePath]
            .some((value) => String(value || '').toLowerCase().includes(search.toLowerCase())))))
      }
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'تعذر تحميل البيانات.')
    } finally {
      setLoading(false)
    }
  }, [tab, search, status, category, page, legacyArticles, legacyTestimonials])

  useEffect(() => {
    const timer = window.setTimeout(() => void loadData(), 180)
    return () => window.clearTimeout(timer)
  }, [loadData])

  const categories = articleData?.categories || []
  const totalPages = useMemo(
    () => Math.max(1, Math.ceil((articleData?.total || 0) / (articleData?.pageSize || 20))),
    [articleData],
  )

  async function logout() {
    await signOut(getFirebaseAuth())
    window.location.assign('/admin/login')
  }

  async function updateArticleStatus(article: Article) {
    const nextStatus = article.status === 'published' ? 'draft' : 'published'
    try {
      const batch = writeBatch(getFirebaseDb())
      batch.set(doc(getFirebaseDb(), 'articles', article.slug), {
        id: article.slug,
        slug: article.slug,
        status: nextStatus,
        publishedAt: nextStatus === 'published' ? serverTimestamp() : null,
        updatedAt: serverTimestamp(),
      }, { merge: true })
      batch.set(doc(getFirebaseDb(), 'contentVisibility', `article-${article.slug}`), {
        kind: 'article', id: article.slug, status: nextStatus, updatedAt: serverTimestamp(),
      })
      await batch.commit()
      await loadData()
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : 'تعذر تحديث حالة المقال.')
    }
  }

  async function deleteArticle(article: Article) {
    if (!window.confirm(`هل تريد نقل مقال «${article.title}» إلى المحذوفات؟`)) return
    try {
      const batch = writeBatch(getFirebaseDb())
      batch.set(doc(getFirebaseDb(), 'articles', article.slug), {
        id: article.slug, slug: article.slug, status: 'deleted', updatedAt: serverTimestamp(),
      }, { merge: true })
      batch.set(doc(getFirebaseDb(), 'contentVisibility', `article-${article.slug}`), {
        kind: 'article', id: article.slug, status: 'deleted', updatedAt: serverTimestamp(),
      })
      await batch.commit()
      await loadData()
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'تعذر حذف المقال.')
    }
  }

  async function updateContentPageStatus(page: ContentPage) {
    const nextStatus = page.status === 'published' ? 'draft' : 'published'
    try {
      await setDoc(doc(getFirebaseDb(), 'pages', page.slug), {
        status: nextStatus,
        updatedAt: serverTimestamp(),
      }, { merge: true })
      await loadData()
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : 'تعذر تحديث حالة الصفحة.')
    }
  }

  async function deleteContentPage(page: ContentPage) {
    if (!window.confirm(`هل تريد نقل صفحة «${page.title}» إلى المحذوفات؟`)) return
    try {
      await setDoc(doc(getFirebaseDb(), 'pages', page.slug), {
        status: 'deleted',
        updatedAt: serverTimestamp(),
      }, { merge: true })
      await loadData()
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'تعذر حذف الصفحة.')
    }
  }

  async function setTestimonialStatus(testimonial: Testimonial, nextStatus: string) {
    try {
      const batch = writeBatch(getFirebaseDb())
      batch.set(doc(getFirebaseDb(), 'testimonials', testimonial.id), {
        ...testimonial, status: nextStatus, updatedAt: serverTimestamp(),
      }, { merge: true })
      if (testimonial.source === 'legacy') {
        batch.set(doc(getFirebaseDb(), 'contentVisibility', `testimonial-${testimonial.id}`), {
          kind: 'testimonial', id: testimonial.id, status: nextStatus, updatedAt: serverTimestamp(),
        })
      }
      await batch.commit()
      await loadData()
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : 'تعذر تحديث التقييم.')
    }
  }

  async function deleteTestimonial(testimonial: Testimonial) {
    if (!window.confirm(`هل تريد حذف تقييم ${testimonial.name}؟`)) return
    try {
      const batch = writeBatch(getFirebaseDb())
      batch.set(doc(getFirebaseDb(), 'testimonials', testimonial.id), {
        ...testimonial, status: 'deleted', updatedAt: serverTimestamp(),
      }, { merge: true })
      if (testimonial.source === 'legacy') {
        batch.set(doc(getFirebaseDb(), 'contentVisibility', `testimonial-${testimonial.id}`), {
          kind: 'testimonial', id: testimonial.id, status: 'deleted', updatedAt: serverTimestamp(),
        })
      }
      await batch.commit()
      await loadData()
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'تعذر حذف التقييم.')
    }
  }

  return (
    <main dir="rtl" className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-5 sm:px-6 lg:px-8">
          <div>
            <p className="text-sm font-bold text-primary">الفرسان</p>
            <h1 className="text-2xl font-extrabold text-slate-900">إدارة المحتوى</h1>
            <p className="mt-1 text-xs text-slate-500" dir="ltr">{email}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <ArrowLeft size={16} aria-hidden="true" /> العودة للموقع
            </Link>
            <button
              type="button"
              onClick={() => void logout()}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <LogOut size={16} /> تسجيل الخروج
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-2 rounded-2xl bg-slate-200/70 p-1">
            <button
              type="button"
              onClick={() => { setTab('articles'); setPage(1); setStatus('all') }}
              className={`rounded-xl px-4 py-2 text-sm font-bold ${tab === 'articles' ? 'bg-white text-primary shadow-sm' : 'text-slate-600'}`}
            >
              المقالات
            </button>
            <button
              type="button"
              onClick={() => { setTab('pages'); setPage(1); setStatus('all') }}
              className={`rounded-xl px-4 py-2 text-sm font-bold ${tab === 'pages' ? 'bg-white text-primary shadow-sm' : 'text-slate-600'}`}
            >
              الصفحات
            </button>
            <button
              type="button"
              onClick={() => { setTab('testimonials'); setPage(1); setStatus('pending') }}
              className={`rounded-xl px-4 py-2 text-sm font-bold ${tab === 'testimonials' ? 'bg-white text-primary shadow-sm' : 'text-slate-600'}`}
            >
              التقييمات
            </button>
          </div>
          {tab === 'articles' ? (
            <Link
              href="/admin/articles/new"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-primary/90"
            >
              <Plus size={18} /> مقال جديد
            </Link>
          ) : tab === 'pages' ? (
            <Link
              href="/admin/pages/new"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-primary/90"
            >
              <Plus size={18} /> صفحة جديدة
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => setNewTestimonialOpen((open) => !open)}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-primary/90"
            >
              <Plus size={18} /> إضافة تقييم
            </button>
          )}
        </div>

        {newTestimonialOpen && tab === 'testimonials' && (
          <NewTestimonialForm
            onCancel={() => setNewTestimonialOpen(false)}
            onSaved={async () => { setNewTestimonialOpen(false); await loadData() }}
          />
        )}
        {editingTestimonial && tab === 'testimonials' && (
          <EditTestimonialForm
            testimonial={editingTestimonial}
            onCancel={() => setEditingTestimonial(null)}
            onSaved={async () => { setEditingTestimonial(null); await loadData() }}
          />
        )}

        <div className="mb-6 grid gap-3 md:grid-cols-[1fr_auto_auto]">
          <label className="relative block">
            <Search size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(event) => { setSearch(event.target.value); setPage(1) }}
              placeholder={tab === 'testimonials' ? 'ابحث بالاسم أو نص التقييم...' : 'ابحث بالعنوان أو الرابط...'}
              className="w-full rounded-xl border border-slate-200 bg-white py-3 pe-11 ps-4 outline-none focus:border-primary"
            />
          </label>
          <select
            value={status}
            onChange={(event) => { setStatus(event.target.value); setPage(1) }}
            className="rounded-xl border border-slate-200 bg-white px-4 py-3"
          >
            <option value="all">كل الحالات</option>
            {tab !== 'testimonials' ? (
              <>
                <option value="published">منشور</option>
                <option value="draft">مسودة</option>
              </>
            ) : (
              <>
                <option value="approved">معتمد</option>
                <option value="pending">بانتظار الاعتماد</option>
                <option value="hidden">مخفي</option>
                <option value="rejected">مرفوض</option>
              </>
            )}
          </select>
          {tab === 'articles' && (
            <select
              value={category}
              onChange={(event) => { setCategory(event.target.value); setPage(1) }}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3"
            >
              <option value="all">كل التصنيفات</option>
              {categories.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          )}
        </div>

        {error && (
          <div role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            {error}
          </div>
        )}
        {loading ? (
          <p className="rounded-2xl bg-white p-10 text-center text-slate-500">جارٍ تحميل المحتوى...</p>
        ) : tab === 'articles' ? (
          <div className="space-y-3">
            {(articleData?.articles || []).map((article) => (
              <article key={article.slug} className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center">
                <div className="h-20 w-full shrink-0 overflow-hidden rounded-xl bg-slate-100 sm:w-32">
                  {article.image && <Image src={article.image} alt="" width={256} height={160} unoptimized className="h-full w-full object-cover" />}
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="truncate font-bold text-slate-900">{article.title}</h2>
                  <p className="mt-1 truncate text-sm text-slate-500" dir="ltr">/{article.slug}</p>
                  <div className="mt-2 flex flex-wrap gap-2 text-xs">
                    <span className={`rounded-full px-2.5 py-1 font-semibold ${article.status === 'published' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                      {article.status === 'published' ? 'منشور' : 'مسودة'}
                    </span>
                    {article.category && <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-600">{article.category}</span>}
                    {article.source === 'legacy' && <span className="rounded-full bg-blue-50 px-2.5 py-1 text-blue-700">ينتظر الترحيل إلى Firebase</span>}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link href={`/admin/articles/${encodeURIComponent(article.slug)}`} className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold hover:bg-slate-50">تعديل</Link>
                  <Link href={`/blog/${article.slug}`} target="_blank" className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold hover:bg-slate-50">معاينة</Link>
                  <button type="button" onClick={() => void updateArticleStatus(article)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold hover:bg-slate-50">{article.status === 'published' ? 'إلغاء النشر' : 'نشر'}</button>
                  <button type="button" onClick={() => void deleteArticle(article)} className="rounded-lg border border-red-100 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50">حذف</button>
                </div>
              </article>
            ))}
            {!articleData?.articles.length && <p className="rounded-2xl bg-white p-10 text-center text-slate-500">لا توجد مقالات مطابقة.</p>}
            <div className="flex items-center justify-between pt-2 text-sm text-slate-600">
              <span>عدد النتائج: {articleData?.total || 0}</span>
              <div className="flex gap-2">
                <button type="button" disabled={page <= 1} onClick={() => setPage((value) => value - 1)} className="rounded-lg border bg-white px-3 py-2 disabled:opacity-40">السابق</button>
                <span className="px-2 py-2">{page} / {totalPages}</span>
                <button type="button" disabled={page >= totalPages} onClick={() => setPage((value) => value + 1)} className="rounded-lg border bg-white px-3 py-2 disabled:opacity-40">التالي</button>
              </div>
            </div>
          </div>
        ) : tab === 'pages' ? (
          <div className="space-y-3">
            {pages.map((contentPage) => (
              <article key={contentPage.slug} className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center">
                <div className="min-w-0 flex-1">
                  <h2 className="truncate font-bold text-slate-900">{contentPage.title}</h2>
                  <p className="mt-1 truncate text-sm text-slate-500" dir="ltr">/{contentPage.slug}</p>
                  <p className="mt-2 line-clamp-2 text-sm text-slate-600">{contentPage.excerpt}</p>
                  <span className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${contentPage.status === 'published' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                    {contentPage.status === 'published' ? 'منشورة' : 'مسودة'}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link href={`/admin/pages/${encodeURIComponent(contentPage.slug)}`} className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold hover:bg-slate-50">تعديل</Link>
                  {contentPage.status === 'published' && <Link href={`/${contentPage.slug}`} target="_blank" className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold hover:bg-slate-50">معاينة</Link>}
                  <button type="button" onClick={() => void updateContentPageStatus(contentPage)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold hover:bg-slate-50">{contentPage.status === 'published' ? 'إلغاء النشر' : 'نشر'}</button>
                  <button type="button" onClick={() => void deleteContentPage(contentPage)} className="rounded-lg border border-red-100 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50">حذف</button>
                </div>
              </article>
            ))}
            {!pages.length && <p className="rounded-2xl bg-white p-10 text-center text-slate-500">لا توجد صفحات مطابقة.</p>}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {testimonials.map((testimonial) => (
              <article key={testimonial.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div>
                    <h2 className="font-bold text-slate-900">{testimonial.name}</h2>
                    {testimonial.title && <p className="mt-1 font-semibold text-slate-700">{testimonial.title}</p>}
                    <p className="text-sm text-slate-500">{testimonial.position} {testimonial.company && `- ${testimonial.company}`}</p>
                  </div>
                  <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">{testimonial.status}</span>
                </div>
                <div className="mb-3 flex text-primary" aria-label={`${testimonial.rating} من 5`}>
                  {Array.from({ length: testimonial.rating }).map((_, index) => <Star key={index} size={16} fill="currentColor" />)}
                </div>
                <p className="mb-5 leading-7 text-slate-600">{testimonial.text}</p>
                {testimonial.sourcePath && (
                  <p className="mb-4 text-xs text-slate-500" dir="ltr">المصدر: {testimonial.sourcePath}</p>
                )}
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={() => setEditingTestimonial(testimonial)} className="rounded-lg border px-3 py-2 text-sm font-semibold">تعديل</button>
                  <button type="button" onClick={() => void setTestimonialStatus(testimonial, 'approved')} className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700"><Check size={16} /> اعتماد</button>
                  <button type="button" onClick={() => void setTestimonialStatus(testimonial, 'hidden')} className="rounded-lg border px-3 py-2 text-sm font-semibold">إخفاء</button>
                  <button type="button" onClick={() => void setTestimonialStatus(testimonial, 'rejected')} className="rounded-lg border px-3 py-2 text-sm font-semibold text-slate-600">رفض</button>
                  <button type="button" onClick={() => void deleteTestimonial(testimonial)} className="inline-flex items-center gap-1 rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-700"><X size={16} /> حذف</button>
                </div>
              </article>
            ))}
            {!testimonials.length && <p className="rounded-2xl bg-white p-10 text-center text-slate-500 md:col-span-2">لا توجد تقييمات مطابقة.</p>}
          </div>
        )}

        <div className="mt-8 flex items-center gap-2 text-xs text-slate-500">
          <FileText size={15} />
          المقالات والصفحات المنشورة تُضاف تلقائيًا إلى خريطة الموقع.
        </div>
      </div>
    </main>
  )
}

function NewTestimonialForm({
  onCancel,
  onSaved,
}: {
  onCancel: () => void
  onSaved: () => Promise<void>
}) {
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setBusy(true)
    setError('')
    const data = new FormData(event.currentTarget)
    try {
      const values = Object.fromEntries(data.entries())
      const testimonialRef = doc(collection(getFirebaseDb(), 'testimonials'))
      await setDoc(testimonialRef, {
        ...values,
        id: testimonialRef.id,
        rating: Number(values.rating),
        status: values.status === 'approved' ? 'approved' : 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
      await onSaved()
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'تعذر حفظ التقييم.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={submit} className="mb-6 grid gap-3 rounded-2xl border border-slate-200 bg-white p-5 md:grid-cols-2">
      <input name="name" required placeholder="اسم العميل" className="rounded-xl border px-4 py-3" />
      <input name="title" maxLength={100} placeholder="عنوان التقييم (اختياري)" className="rounded-xl border px-4 py-3" />
      <input name="position" placeholder="الصفة أو الوظيفة" className="rounded-xl border px-4 py-3" />
      <input name="company" placeholder="الشركة" className="rounded-xl border px-4 py-3" />
      <select name="rating" defaultValue="5" className="rounded-xl border px-4 py-3">
        {[5, 4, 3, 2, 1].map((rating) => <option key={rating} value={rating}>{rating} نجوم</option>)}
      </select>
      <textarea name="text" required rows={3} placeholder="نص التقييم" className="rounded-xl border px-4 py-3 md:col-span-2" />
      <select name="status" defaultValue="pending" className="rounded-xl border px-4 py-3">
        <option value="pending">بانتظار الاعتماد</option>
        <option value="approved">معتمد</option>
      </select>
      {error && <p role="alert" className="text-sm text-red-700 md:col-span-2">{error}</p>}
      <div className="flex gap-2 md:col-span-2">
        <button disabled={busy} className="rounded-xl bg-primary px-5 py-3 font-bold text-white disabled:opacity-50">{busy ? 'جارٍ الحفظ...' : 'حفظ التقييم'}</button>
        <button type="button" onClick={onCancel} className="rounded-xl border px-5 py-3">إلغاء</button>
      </div>
    </form>
  )
}

function EditTestimonialForm({
  testimonial,
  onCancel,
  onSaved,
}: {
  testimonial: Testimonial
  onCancel: () => void
  onSaved: () => Promise<void>
}) {
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setBusy(true)
    setError('')
    const data = Object.fromEntries(new FormData(event.currentTarget).entries())
    try {
      await setDoc(doc(getFirebaseDb(), 'testimonials', testimonial.id), {
        ...data,
        id: testimonial.id,
        rating: Number(data.rating),
        updatedAt: serverTimestamp(),
      }, { merge: true })
      await onSaved()
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'تعذر تحديث التقييم.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={submit} className="mb-6 grid gap-3 rounded-2xl border border-primary/20 bg-white p-5 md:grid-cols-2">
      <h2 className="text-lg font-bold md:col-span-2">تعديل التقييم</h2>
      <input name="name" required defaultValue={testimonial.name} placeholder="اسم العميل" className="rounded-xl border px-4 py-3" />
      <input name="title" maxLength={100} defaultValue={testimonial.title || ''} placeholder="عنوان التقييم (اختياري)" className="rounded-xl border px-4 py-3" />
      <input name="position" defaultValue={testimonial.position} placeholder="الصفة أو الوظيفة" className="rounded-xl border px-4 py-3" />
      <input name="company" defaultValue={testimonial.company} placeholder="الشركة" className="rounded-xl border px-4 py-3" />
      <select name="rating" defaultValue={String(testimonial.rating)} className="rounded-xl border px-4 py-3">
        {[5, 4, 3, 2, 1].map((rating) => <option key={rating} value={rating}>{rating} نجوم</option>)}
      </select>
      <textarea name="text" required rows={3} defaultValue={testimonial.text} placeholder="نص التقييم" className="rounded-xl border px-4 py-3 md:col-span-2" />
      {error && <p role="alert" className="text-sm text-red-700 md:col-span-2">{error}</p>}
      <div className="flex gap-2 md:col-span-2">
        <button disabled={busy} className="rounded-xl bg-primary px-5 py-3 font-bold text-white disabled:opacity-50">{busy ? 'جارٍ الحفظ...' : 'حفظ التعديلات'}</button>
        <button type="button" onClick={onCancel} className="rounded-xl border px-5 py-3">إلغاء</button>
      </div>
    </form>
  )
}
