import { NextRequest, NextResponse } from 'next/server'
import { FieldValue } from 'firebase-admin/firestore'
import { revalidatePath } from 'next/cache'
import { getAdminSession } from '@/lib/firebase/admin-auth'
import { adminDb, isFirebaseAdminConfigured } from '@/lib/firebase/admin'
import { getAdminArticles, sanitizeArticleContent } from '@/lib/content-store'

export const runtime = 'nodejs'

interface RouteContext {
  params: Promise<{ slug: string }>
}

function isValidSlug(slug: string) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)
}

export async function GET(_request: NextRequest, context: RouteContext) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: 'غير مصرح.' }, { status: 401 })
  }
  try {
    const { slug } = await context.params
    const article = (await getAdminArticles()).find((item) => item.slug === slug)
    return article
      ? NextResponse.json({ article })
      : NextResponse.json({ error: 'المقال غير موجود.' }, { status: 404 })
  } catch (error) {
    console.error('Admin article retrieval failed:', error)
    return NextResponse.json({ error: 'تعذر تحميل المقال.' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: 'غير مصرح.' }, { status: 401 })
  }
  if (!isFirebaseAdminConfigured()) {
    return NextResponse.json({ error: 'Firebase Admin غير مضبوط.' }, { status: 503 })
  }

  try {
    const { slug } = await context.params
    if (!isValidSlug(slug)) {
      return NextResponse.json({ error: 'الرابط المختصر غير صالح.' }, { status: 400 })
    }
    const body = (await request.json()) as Record<string, unknown>
    if (body.slug !== slug) {
      return NextResponse.json(
        { error: 'تغيير الرابط المختصر غير مدعوم للحفاظ على الروابط الحالية.' },
        { status: 400 },
      )
    }
    if (
      typeof body.title !== 'string' ||
      typeof body.content !== 'string' ||
      typeof body.image !== 'string' ||
      !['draft', 'published'].includes(String(body.status))
    ) {
      return NextResponse.json({ error: 'بيانات المقال غير مكتملة.' }, { status: 400 })
    }

    const docRef = adminDb().collection('articles').doc(slug)
    const existing = await docRef.get()
    const legacy = (await getAdminArticles()).find((item) => item.slug === slug)
    if (!existing.exists && !legacy) {
      return NextResponse.json({ error: 'المقال غير موجود.' }, { status: 404 })
    }

    const currentData = existing.data() || legacy || {}
    const updated = {
      ...currentData,
      ...body,
      id: slug,
      slug,
      content: sanitizeArticleContent(body.content),
      publishedAt: body.status === 'published'
        ? currentData.status === 'published'
          ? currentData.publishedAt || null
          : FieldValue.serverTimestamp()
        : null,
      createdAt: currentData.createdAt || FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    }
    if (Buffer.byteLength(JSON.stringify({ ...updated, createdAt: '', updatedAt: '' }), 'utf8') > 900_000) {
      return NextResponse.json({ error: 'حجم المقال يتجاوز الحد المسموح.' }, { status: 413 })
    }
    await docRef.set(updated, { merge: true })
    const saved = await docRef.get()
    if (!saved.exists || saved.get('slug') !== slug) {
      throw new Error('Article update verification failed.')
    }
    revalidatePath('/blog')
    revalidatePath(`/blog/${slug}`)
    revalidatePath('/sitemap.xml')
    revalidatePath('/api/sitemap.xml')
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Admin article update failed:', error)
    return NextResponse.json({ error: 'تعذر تحديث المقال في Firebase.' }, { status: 500 })
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: 'غير مصرح.' }, { status: 401 })
  }
  if (!isFirebaseAdminConfigured()) {
    return NextResponse.json({ error: 'Firebase Admin غير مضبوط.' }, { status: 503 })
  }

  try {
    const { slug } = await context.params
    const docRef = adminDb().collection('articles').doc(slug)
    const existing = await docRef.get()
    const legacy = (await getAdminArticles()).find((item) => item.slug === slug)
    if (!existing.exists && !legacy) {
      return NextResponse.json({ error: 'المقال غير موجود.' }, { status: 404 })
    }
    await docRef.set(
      {
        ...(existing.data() || legacy),
        id: slug,
        slug,
        status: 'deleted',
        deletedAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true },
    )
    revalidatePath('/blog')
    revalidatePath(`/blog/${slug}`)
    revalidatePath('/sitemap.xml')
    revalidatePath('/api/sitemap.xml')
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Admin article deletion failed:', error)
    return NextResponse.json({ error: 'تعذر حذف المقال من العرض.' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: 'غير مصرح.' }, { status: 401 })
  }
  if (!isFirebaseAdminConfigured()) {
    return NextResponse.json({ error: 'Firebase Admin غير مضبوط.' }, { status: 503 })
  }

  try {
    const { slug } = await context.params
    const body = (await request.json()) as { status?: unknown }
    if (!['draft', 'published'].includes(String(body.status))) {
      return NextResponse.json({ error: 'حالة المقال غير صالحة.' }, { status: 400 })
    }

    const docRef = adminDb().collection('articles').doc(slug)
    const existing = await docRef.get()
    const legacy = (await getAdminArticles()).find((item) => item.slug === slug)
    if (!existing.exists && !legacy) {
      return NextResponse.json({ error: 'المقال غير موجود.' }, { status: 404 })
    }

    await docRef.set(
      {
        ...(existing.data() || legacy),
        id: slug,
        slug,
        status: body.status,
        publishedAt: body.status === 'published'
          ? existing.get('status') === 'published'
            ? existing.get('publishedAt') || null
            : FieldValue.serverTimestamp()
          : null,
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true },
    )
    revalidatePath('/blog')
    revalidatePath(`/blog/${slug}`)
    revalidatePath('/sitemap.xml')
    revalidatePath('/api/sitemap.xml')
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Admin article status update failed:', error)
    return NextResponse.json({ error: 'تعذر تحديث حالة المقال.' }, { status: 500 })
  }
}
