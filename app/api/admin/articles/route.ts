import { NextRequest, NextResponse } from 'next/server'
import { FieldValue } from 'firebase-admin/firestore'
import { getAdminSession } from '@/lib/firebase/admin-auth'
import { adminDb, isFirebaseAdminConfigured } from '@/lib/firebase/admin'
import { getAdminArticles, sanitizeArticleContent } from '@/lib/content-store'

export const runtime = 'nodejs'

function isValidSlug(slug: string) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)
}

export async function GET(request: NextRequest) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: 'غير مصرح.' }, { status: 401 })
  }
  if (!isFirebaseAdminConfigured()) {
    return NextResponse.json(
      { error: 'Firebase Admin غير مضبوط. أضف إعدادات الخادم إلى البيئة.' },
      { status: 503 },
    )
  }

  try {
    const search = request.nextUrl.searchParams.get('q')?.trim().toLowerCase() || ''
    const status = request.nextUrl.searchParams.get('status') || 'all'
    const category = request.nextUrl.searchParams.get('category') || 'all'
    const page = Math.max(1, Number(request.nextUrl.searchParams.get('page')) || 1)
    const pageSize = 20
    const allArticles = await getAdminArticles()
    const filtered = allArticles.filter((article) => {
      const matchesSearch =
        !search ||
        [article.title, article.slug, article.excerpt]
          .some((value) => String(value || '').toLowerCase().includes(search))
      const matchesStatus = status === 'all' || article.status === status
      const matchesCategory =
        category === 'all' || String(article.category || '') === category
      return matchesSearch && matchesStatus && matchesCategory
    })
    return NextResponse.json({
      articles: filtered.slice((page - 1) * pageSize, page * pageSize).map((article) => {
        const { content, ...preview } = article
        void content
        return preview
      }),
      total: filtered.length,
      page,
      pageSize,
      categories: [...new Set(allArticles.map((article) => article.category).filter(Boolean))],
    })
  } catch (error) {
    console.error('Admin article listing failed:', error)
    return NextResponse.json(
      { error: 'تعذر تحميل المقالات من Firebase.' },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: 'غير مصرح.' }, { status: 401 })
  }
  if (!isFirebaseAdminConfigured()) {
    return NextResponse.json({ error: 'Firebase Admin غير مضبوط.' }, { status: 503 })
  }

  try {
    const body = (await request.json()) as Record<string, unknown>
    const slug = typeof body.slug === 'string' ? body.slug.trim() : ''
    const title = typeof body.title === 'string' ? body.title.trim() : ''
    const content = typeof body.content === 'string' ? body.content : ''
    const image = typeof body.image === 'string' ? body.image.trim() : ''
    if (!isValidSlug(slug) || !title || !content || !image) {
      return NextResponse.json(
        { error: 'أدخل عنوانًا ورابطًا مختصرًا صحيحًا ومحتوى وصورة رئيسية.' },
        { status: 400 },
      )
    }
    if (!['draft', 'published'].includes(String(body.status))) {
      return NextResponse.json({ error: 'حالة المقال غير صالحة.' }, { status: 400 })
    }

    const docRef = adminDb().collection('articles').doc(slug)
    const existing = await docRef.get()
    const slugAlreadyUsed =
      existing.exists ||
      (await getAdminArticles()).some((article) => article.slug === slug)
    if (slugAlreadyUsed) {
      return NextResponse.json(
        { error: 'يوجد مقال بهذا الرابط بالفعل. افتحه للتعديل بدل إنشاء نسخة.' },
        { status: 409 },
      )
    }

    const record = {
      ...body,
      id: slug,
      slug,
      title,
      content: sanitizeArticleContent(content),
      image,
      excerpt: typeof body.excerpt === 'string' ? body.excerpt.trim() : '',
      status: body.status,
      date:
        typeof body.date === 'string' && body.date
          ? body.date
          : new Date().toISOString().slice(0, 10),
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    }
    if (Buffer.byteLength(JSON.stringify(record), 'utf8') > 900_000) {
      return NextResponse.json(
        { error: 'حجم المقال كبير جدًا للتخزين كمستند Firestore واحد.' },
        { status: 413 },
      )
    }

    await docRef.create(record)
    const saved = await docRef.get()
    if (!saved.exists || saved.get('slug') !== slug) {
      throw new Error('Article write verification failed.')
    }
    return NextResponse.json({ article: { ...record, createdAt: null, updatedAt: null } }, { status: 201 })
  } catch (error) {
    console.error('Admin article creation failed:', error)
    return NextResponse.json(
      { error: 'تعذر حفظ المقال في Firebase.' },
      { status: 500 },
    )
  }
}
