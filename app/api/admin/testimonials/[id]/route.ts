import { NextRequest, NextResponse } from 'next/server'
import { FieldValue } from 'firebase-admin/firestore'
import { revalidatePath } from 'next/cache'
import { getAdminSession } from '@/lib/firebase/admin-auth'
import { adminDb, isFirebaseAdminConfigured } from '@/lib/firebase/admin'
import { getAdminTestimonials } from '@/lib/content-store'

export const runtime = 'nodejs'

interface RouteContext {
  params: Promise<{ id: string }>
}

const allowedStatuses = new Set(['pending', 'approved', 'hidden', 'rejected'])

export async function PUT(request: NextRequest, context: RouteContext) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: 'غير مصرح.' }, { status: 401 })
  }
  if (!isFirebaseAdminConfigured()) {
    return NextResponse.json({ error: 'Firebase Admin غير مضبوط.' }, { status: 503 })
  }

  try {
    const { id } = await context.params
    const body = (await request.json()) as Record<string, unknown>
    const docRef = adminDb().collection('testimonials').doc(id)
    const existing = await docRef.get()
    const legacy = (await getAdminTestimonials()).find((item) => item.id === id)
    if (!existing.exists && !legacy) {
      return NextResponse.json({ error: 'التقييم غير موجود.' }, { status: 404 })
    }

    const status =
      typeof body.status === 'string' && allowedStatuses.has(body.status)
        ? body.status
        : existing.get('status') || legacy?.status || 'pending'
    const fields = ['name', 'title', 'position', 'company', 'text', 'image', 'rating'] as const
    const changes: Record<string, unknown> = {}
    for (const field of fields) {
      if (body[field] !== undefined) changes[field] = body[field]
    }
    if (
      changes.rating !== undefined &&
      (!Number.isInteger(Number(changes.rating)) ||
        Number(changes.rating) < 1 ||
        Number(changes.rating) > 5)
    ) {
      return NextResponse.json({ error: 'التقييم يجب أن يكون من 1 إلى 5.' }, { status: 400 })
    }

    await docRef.set(
      {
        ...(existing.data() || legacy),
        ...changes,
        id,
        status,
        createdAt: existing.get('createdAt') || FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true },
    )
    const saved = await docRef.get()
    if (!saved.exists) throw new Error('Testimonial update verification failed.')
    revalidatePath('/')
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Admin testimonial update failed:', error)
    return NextResponse.json({ error: 'تعذر تحديث التقييم.' }, { status: 500 })
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
    const { id } = await context.params
    const docRef = adminDb().collection('testimonials').doc(id)
    const existing = await docRef.get()
    const legacy = (await getAdminTestimonials()).find((item) => item.id === id)
    if (!existing.exists && !legacy) {
      return NextResponse.json({ error: 'التقييم غير موجود.' }, { status: 404 })
    }
    await docRef.set(
      {
        ...(existing.data() || legacy),
        id,
        status: 'deleted',
        deletedAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true },
    )
    revalidatePath('/')
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Admin testimonial deletion failed:', error)
    return NextResponse.json({ error: 'تعذر حذف التقييم.' }, { status: 500 })
  }
}
