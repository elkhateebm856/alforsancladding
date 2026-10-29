'use client'

import Link from 'next/link'
import Image from 'next/image'
import { FormEvent, useEffect, useRef, useState } from 'react'
import { doc, getDoc, serverTimestamp, writeBatch } from 'firebase/firestore'
import { ArrowRight, ImagePlus, Save } from 'lucide-react'
import { getFirebaseDb } from '@/lib/firebase/client'
import { uploadFirestoreImage } from '@/lib/firebase/firestore-media'

interface ArticleDraft {
  id?: string
  slug: string
  title: string
  excerpt: string
  content: string
  image: string
  imageAlt: string
  date: string
  author: string
  category: string
  tags: string
  seoTitle: string
  seoDescription: string
  keywords: string
  status: 'draft' | 'published'
}

const emptyArticle: ArticleDraft = {
  slug: '',
  title: '',
  excerpt: '',
  content: '',
  image: '',
  imageAlt: '',
  date: new Date().toISOString().slice(0, 10),
  author: 'فريق الفرسان',
  category: '',
  tags: '',
  seoTitle: '',
  seoDescription: '',
  keywords: '',
  status: 'draft',
}

const fieldClass =
  'w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10'
const acceptedImageTypes = new Set(['image/jpeg', 'image/png', 'image/webp'])

function escapeAttribute(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

function getImageLabel(image: string) {
  try {
    return decodeURIComponent(image.slice(1))
  } catch {
    return image.slice(1)
  }
}

function getImageAlt(image: string) {
  const filename = image.split('/').pop() || image
  return getImageLabel(filename).replace(/\.[^.]+$/, '')
}

export function ArticleEditor({
  slug,
  initialArticle,
}: {
  slug?: string
  initialArticle?: Record<string, unknown> | null
}) {
  const [article, setArticle] = useState<ArticleDraft>(emptyArticle)
  const [loading, setLoading] = useState(Boolean(slug))
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadPreview, setUploadPreview] = useState('')
  const [existingImages, setExistingImages] = useState<string[]>([])
  const [loadingExistingImages, setLoadingExistingImages] = useState(true)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)
  const contentRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (!uploadPreview.startsWith('blob:')) return
    return () => URL.revokeObjectURL(uploadPreview)
  }, [uploadPreview])

  useEffect(() => {
    if (!slug) return
    let active = true
    getDoc(doc(getFirebaseDb(), 'articles', slug))
      .then((snapshot) => {
        if (!active) return
        const data = snapshot.exists()
          ? { ...initialArticle, ...snapshot.data() }
          : initialArticle
        if (!data) throw new Error('المقال غير موجود.')
        setArticle({
          slug: String(data.slug || slug),
          title: String(data.title || ''),
          excerpt: String(data.excerpt || ''),
          content: String(data.content || ''),
          image: String(data.image || ''),
          imageAlt: String(data.imageAlt || data.title || ''),
          date: String(data.date || new Date().toISOString().slice(0, 10)),
          author: String(data.author || 'فريق الفرسان'),
          category: String(data.category || ''),
          tags: Array.isArray(data.tags) ? data.tags.join(', ') : '',
          seoTitle: String(data.seoTitle || ''),
          seoDescription: String(data.seoDescription || ''),
          keywords: Array.isArray(data.keywords) ? data.keywords.join(', ') : '',
          status: data.status === 'published' ? 'published' : 'draft',
        })
      })
      .catch((loadError: unknown) => {
        if (active) {
          setError(loadError instanceof Error ? loadError.message : 'تعذر تحميل المقال.')
        }
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => { active = false }
  }, [slug, initialArticle])

  useEffect(() => {
    let active = true
    fetch('/api/admin/media')
      .then(async (response) => {
        const result = (await response.json()) as { images?: string[]; error?: string }
        if (!response.ok) throw new Error(result.error || 'تعذر تحميل الصور الموجودة.')
        if (active) setExistingImages(result.images || [])
      })
      .catch((loadError: unknown) => {
        if (active) {
          setError(loadError instanceof Error ? loadError.message : 'تعذر تحميل الصور الموجودة.')
        }
      })
      .finally(() => {
        if (active) setLoadingExistingImages(false)
      })
    return () => { active = false }
  }, [])

  function update<K extends keyof ArticleDraft>(field: K, value: ArticleDraft[K]) {
    setArticle((current) => ({ ...current, [field]: value }))
    setSaved(false)
  }

  function insertAtCursor(markup: string) {
    const textarea = contentRef.current
    if (!textarea) {
      update('content', `${article.content}\n${markup}`)
      return
    }
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const content = `${article.content.slice(0, start)}${markup}${article.content.slice(end)}`
    update('content', content)
    requestAnimationFrame(() => {
      textarea.focus()
      textarea.setSelectionRange(start + markup.length, start + markup.length)
    })
  }

  async function uploadImage(file: File, insertIntoContent: boolean): Promise<boolean> {
    setError('')
    if (!acceptedImageTypes.has(file.type)) {
      setError('اختر صورة بصيغة JPG أو JPEG أو PNG أو WebP.')
      return false
    }
    if (file.size === 0 || file.size > 15 * 1024 * 1024) {
      setError('يجب ألا يتجاوز حجم الصورة الأصلية 15 ميجابايت.')
      return false
    }

    const alt = insertIntoContent
      ? window.prompt('اكتب وصفًا بديلًا للصورة (alt):', file.name)
      : file.name.replace(/\.[^.]+$/, '')
    if (alt === null) {
      return false
    }

    setUploadPreview(URL.createObjectURL(file))
    setUploading(true)
    setUploadProgress(0)
    try {
      const uploaded = await uploadFirestoreImage(file, setUploadProgress)
      setUploadPreview(uploaded.url)
      if (insertIntoContent) {
        insertAtCursor(
          `<img src="${escapeAttribute(uploaded.url)}" alt="${escapeAttribute(alt)}" width="${uploaded.width}" height="${uploaded.height}" loading="lazy" />`,
        )
      } else {
        update('image', uploaded.url)
        update('imageAlt', alt)
      }
      return true
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'تعذر رفع الصورة إلى Firestore.')
      return false
    } finally {
      setUploading(false)
    }
  }

  async function uploadImages(files: File[], insertIntoContent: boolean) {
    for (const file of files) {
      if (!(await uploadImage(file, insertIntoContent))) break
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    setError('')
    setSaved(false)
    const payload = {
      ...article,
      tags: article.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
      keywords: article.keywords.split(',').map((word) => word.trim()).filter(Boolean),
    }

    try {
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(payload.slug)) {
        throw new Error('استخدم رابطًا مختصرًا باللغة الإنجليزية وأرقامًا وشرطات فقط.')
      }
      if (new TextEncoder().encode(JSON.stringify(payload)).length > 900_000) {
        throw new Error('حجم المقال يتجاوز الحد المسموح به في Firestore.')
      }
      const articleRef = doc(getFirebaseDb(), 'articles', payload.slug)
      const existing = await getDoc(articleRef)
      if (!slug && existing.exists()) {
        throw new Error('يوجد مقال بهذا الرابط بالفعل. افتحه للتعديل بدل إنشاء نسخة.')
      }
      const batch = writeBatch(getFirebaseDb())
      batch.set(articleRef, {
        ...payload,
        id: payload.slug,
        slug: payload.slug,
        createdAt: existing.data()?.createdAt || serverTimestamp(),
        updatedAt: serverTimestamp(),
      }, { merge: true })
      batch.set(doc(getFirebaseDb(), 'contentVisibility', `article-${payload.slug}`), {
        kind: 'article',
        id: payload.slug,
        status: payload.status,
        updatedAt: serverTimestamp(),
      })
      await batch.commit()
      setSaved(true)
      if (!slug) window.location.assign(`/admin/articles/${encodeURIComponent(article.slug)}`)
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'تعذر حفظ المقال.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <p className="p-12 text-center text-slate-500">جارٍ تحميل المقال...</p>
  }

  return (
    <main dir="rtl" className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-5 sm:px-6">
          <div>
            <Link href="/admin" className="mb-1 inline-flex items-center gap-2 text-sm font-semibold text-primary">
              <ArrowRight size={16} /> لوحة الإدارة
            </Link>
            <h1 className="text-2xl font-extrabold text-slate-900">{slug ? 'تعديل المقال' : 'إضافة مقال جديد'}</h1>
          </div>
          {slug && <Link href={`/blog/${slug}`} target="_blank" className="text-sm font-semibold text-slate-600 underline">معاينة المقال</Link>}
        </div>
      </header>

      <form onSubmit={submit} className="mx-auto max-w-5xl space-y-5 px-4 py-8 sm:px-6">
        {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</p>}
        {saved && <p role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">تم حفظ المقال بنجاح.</p>}

        <section className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 md:grid-cols-2">
          <label className="space-y-2 text-sm font-semibold text-slate-700">
            عنوان المقال
            <input required value={article.title} onChange={(event) => update('title', event.target.value)} className={fieldClass} />
          </label>
          <label className="space-y-2 text-sm font-semibold text-slate-700">
            الرابط المختصر
            <input required readOnly={Boolean(slug)} dir="ltr" value={article.slug} onChange={(event) => update('slug', event.target.value)} placeholder="article-slug" className={`${fieldClass} text-left`} />
          </label>
          <label className="space-y-2 text-sm font-semibold text-slate-700 md:col-span-2">
            الوصف المختصر
            <textarea required rows={2} value={article.excerpt} onChange={(event) => update('excerpt', event.target.value)} className={fieldClass} />
          </label>
          <label className="space-y-2 text-sm font-semibold text-slate-700">
            التصنيف
            <input value={article.category} onChange={(event) => update('category', event.target.value)} className={fieldClass} />
          </label>
          <label className="space-y-2 text-sm font-semibold text-slate-700">
            الوسوم (افصل بينها بفاصلة)
            <input value={article.tags} onChange={(event) => update('tags', event.target.value)} className={fieldClass} />
          </label>
          <label className="space-y-2 text-sm font-semibold text-slate-700">
            الكاتب
            <input value={article.author} onChange={(event) => update('author', event.target.value)} className={fieldClass} />
          </label>
          <label className="space-y-2 text-sm font-semibold text-slate-700">
            تاريخ النشر
            <input type="date" value={article.date.slice(0, 10)} onChange={(event) => update('date', event.target.value)} className={fieldClass} />
          </label>
          <label className="space-y-2 text-sm font-semibold text-slate-700">
            الحالة
            <select value={article.status} onChange={(event) => update('status', event.target.value as ArticleDraft['status'])} className={fieldClass}>
              <option value="draft">مسودة</option>
              <option value="published">منشور</option>
            </select>
          </label>
          <label className="space-y-2 text-sm font-semibold text-slate-700">
            رابط الصورة الرئيسية
            <input dir="ltr" value={article.image} onChange={(event) => update('image', event.target.value)} className={`${fieldClass} text-left`} />
          </label>
          <label className="space-y-2 text-sm font-semibold text-slate-700">
            اختيار صورة موجودة من الموقع
            <select
              value={existingImages.includes(article.image) ? article.image : ''}
              onChange={(event) => {
                if (!event.target.value) return
                update('image', event.target.value)
                update('imageAlt', getImageAlt(event.target.value))
              }}
              className={fieldClass}
            >
              <option value="">
                {loadingExistingImages ? 'جارٍ تحميل الصور...' : 'اختر صورة من مكتبة الموقع'}
              </option>
              {existingImages.map((image) => (
                <option key={image} value={image}>{getImageLabel(image)}</option>
              ))}
            </select>
          </label>
          <label className="space-y-2 text-sm font-semibold text-slate-700">
            النص البديل للصورة
            <input value={article.imageAlt} onChange={(event) => update('imageAlt', event.target.value)} className={fieldClass} />
          </label>
          <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-primary/40 bg-primary/5 p-3 text-sm font-bold text-primary hover:bg-primary/10 md:col-span-2">
            <ImagePlus size={18} /> رفع صورة رئيسية إلى Firestore
            <input type="file" accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp" className="sr-only" disabled={uploading} onChange={(event) => {
              const files = Array.from(event.target.files || [])
              if (files.length) void uploadImages(files, false)
              event.currentTarget.value = ''
            }} />
          </label>
          {uploadPreview && <Image src={uploadPreview} alt="معاينة الصورة المختارة" width={768} height={448} unoptimized className="max-h-56 w-auto rounded-xl border object-contain md:col-span-2" />}
          {uploading && (
            <div className="space-y-2 text-sm text-slate-600 md:col-span-2">
              <p>{uploadProgress === 0 ? 'جارٍ ضغط الصورة وتجهيزها...' : `جارٍ رفع الصورة إلى Firestore: ${uploadProgress}%`}</p>
              <progress aria-label="تقدم رفع الصورة" value={uploadProgress} max={100} className="h-2 w-full" />
            </div>
          )}
          {article.image && <Image src={article.image} alt={article.imageAlt} width={768} height={448} unoptimized className="max-h-56 w-auto rounded-xl border object-contain md:col-span-2" />}
        </section>

        <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5">
          <div>
            <h2 className="mb-1 text-lg font-bold text-slate-900">محتوى المقال</h2>
            <p className="text-sm text-slate-500">يُحفظ HTML القديم كما هو مع تعقيم الوسوم الخطرة. استخدم الأدوات لإضافة تنسيق دون إتلاف الصور الموجودة.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              ['عنوان فرعي', '<h2>عنوان فرعي</h2>\n'],
              ['فقرة', '<p>اكتب الفقرة هنا.</p>\n'],
              ['قائمة', '<ul>\n<li>عنصر</li>\n</ul>\n'],
            ].map(([label, markup]) => (
              <button key={label} type="button" onClick={() => insertAtCursor(markup)} className="rounded-lg border px-3 py-2 text-sm font-semibold hover:bg-slate-50">{label}</button>
            ))}
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold hover:bg-slate-50">
              <ImagePlus size={16} /> رفع وإدراج صورة
              <input type="file" multiple accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp" className="sr-only" disabled={uploading} onChange={(event) => {
                const files = Array.from(event.target.files || [])
                if (files.length) void uploadImages(files, true)
                event.currentTarget.value = ''
              }} />
            </label>
            <label className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold">
              <ImagePlus size={16} /> إدراج صورة موجودة
              <select
                defaultValue=""
                aria-label="اختيار صورة موجودة لإدراجها في المحتوى"
                onChange={(event) => {
                  const image = event.currentTarget.value
                  if (!image) return
                  const alt = getImageAlt(image)
                  insertAtCursor(`<img src="${escapeAttribute(image)}" alt="${escapeAttribute(alt)}" loading="lazy" />`)
                  event.currentTarget.value = ''
                }}
                className="max-w-48 bg-transparent"
              >
                <option value="">{loadingExistingImages ? 'جارٍ التحميل...' : 'اختر صورة...'}</option>
                {existingImages.map((image) => (
                  <option key={image} value={image}>{getImageLabel(image)}</option>
                ))}
              </select>
            </label>
          </div>
          <textarea
            ref={contentRef}
            required
            rows={24}
            dir="ltr"
            value={article.content}
            onChange={(event) => update('content', event.target.value)}
            className={`${fieldClass} font-mono text-sm leading-6`}
            spellCheck={false}
          />
          {uploading && <p className="text-sm text-slate-600">جارٍ رفع الصورة: {uploadProgress}%</p>}
          <details className="rounded-xl border border-slate-200 p-4">
            <summary className="cursor-pointer font-semibold">معاينة آمنة للمحتوى</summary>
            <iframe
              title="معاينة المقال"
              sandbox=""
              srcDoc={`<!doctype html><html dir="rtl"><meta charset="utf-8"><body style="font-family:Arial,sans-serif;line-height:1.9;padding:16px">${article.content}</body></html>`}
              className="mt-4 h-96 w-full rounded-lg border bg-white"
            />
          </details>
        </section>

        <section className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 md:grid-cols-2">
          <h2 className="text-lg font-bold text-slate-900 md:col-span-2">إعدادات SEO</h2>
          <label className="space-y-2 text-sm font-semibold text-slate-700">
            عنوان SEO
            <input value={article.seoTitle} onChange={(event) => update('seoTitle', event.target.value)} className={fieldClass} />
          </label>
          <label className="space-y-2 text-sm font-semibold text-slate-700">
            الكلمات المفتاحية
            <input value={article.keywords} onChange={(event) => update('keywords', event.target.value)} className={fieldClass} />
          </label>
          <label className="space-y-2 text-sm font-semibold text-slate-700 md:col-span-2">
            وصف SEO
            <textarea rows={2} value={article.seoDescription} onChange={(event) => update('seoDescription', event.target.value)} className={fieldClass} />
          </label>
        </section>

        <div className="sticky bottom-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-xl backdrop-blur">
          <Link href="/admin" className="rounded-xl border px-5 py-3 text-sm font-semibold">إلغاء والعودة</Link>
          <button type="submit" disabled={saving || uploading} className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-bold text-white disabled:cursor-wait disabled:opacity-50">
            <Save size={18} /> {saving ? 'جارٍ الحفظ...' : 'حفظ المقال'}
          </button>
        </div>
      </form>
    </main>
  )
}
