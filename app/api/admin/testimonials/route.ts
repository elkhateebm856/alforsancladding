import { NextRequest, NextResponse } from 'next/server'
import { FieldValue } from 'firebase-admin/firestore'
import { getAdminSession } from '@/lib/firebase/admin-auth'
import { adminDb, isFirebaseAdminConfigured } from '@/lib/firebase/admin'
import { getAdminTestimonials } from '@/lib/content-store'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: 'غير مصرح.' }, { status: 401 })
  }
  if (!isFirebaseAdminConfigured()) {
    return NextResponse.json({ error: 'Firebase Admin غير مضبوط.' }, { status: 503 })
  }

  try {
    const search = request.nextUrl.searchParams.get('q')?.trim().toLowerCase() || ''
    const status = request.nextUrl.searchParams.get('status') || 'all'
    const testimonials = (await getAdminTestimonials()).filter((testimonial) => {
      const matchesSearch =
        !search ||
        [testimonial.name, testimonial.position, testimonial.company, testimonial.text]
          .some((value) => String(value || '').toLowerCase().includes(search))
      return matchesSearch && (status === 'all' || testimonial.status === status)
    })
    return NextResponse.json({ testimonials })
  } catch (error) {
    console.error('Admin testimonial listing failed:', error)
    return NextResponse.json({ error: 'تعذر تحميل التقييمات.' }, { status: 500 })
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
    const name = typeof body.name === 'string' ? body.name.trim() : ''
    const text = typeof body.text === 'string' ? body.text.trim() : ''
    const rating = Number(body.rating)
    if (!name || !text || !Number.isInteger(rating) || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'أدخل الاسم والنص وتقييمًا من نجمة إلى خمس نجوم.' },
        { status: 400 },
      )
    }

    const docRef = adminDb().collection('testimonials').doc()
    const record = {
      id: docRef.id,
      name,
      title: typeof body.title === 'string' ? body.title.trim().slice(0, 100) : '',
      text,
      rating,
      position: typeof body.position === 'string' ? body.position.trim() : '',
      company: typeof body.company === 'string' ? body.company.trim() : '',
      image: typeof body.image === 'string' ? body.image.trim() : '',
      status: body.status === 'approved' ? 'approved' : 'pending',
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    }
    await docRef.create(record)
    const saved = await docRef.get()
    if (!saved.exists || saved.get('text') !== text) {
      throw new Error('Testimonial write verification failed.')
    }
    return NextResponse.json({ id: docRef.id }, { status: 201 })
  } catch (error) {
    console.error('Admin testimonial creation failed:', error)
    return NextResponse.json({ error: 'تعذر حفظ التقييم.' }, { status: 500 })
  }
}
