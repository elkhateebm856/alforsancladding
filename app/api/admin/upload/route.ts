import { randomUUID } from 'node:crypto'
import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/firebase/admin-auth'
import { adminStorage, isFirebaseAdminConfigured } from '@/lib/firebase/admin'

export const runtime = 'nodejs'
export const maxDuration = 60

const maxFileSize = 10 * 1024 * 1024
const allowedTypes = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'])

export async function POST(request: NextRequest) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: 'غير مصرح.' }, { status: 401 })
  }
  if (process.env.NEXT_PUBLIC_ADMIN_IMAGE_UPLOADS_ENABLED !== 'true') {
    return NextResponse.json(
      { error: 'رفع الصور متوقف حتى يوافق مالك المشروع على تفعيل Firebase Storage.' },
      { status: 503 },
    )
  }
  if (!isFirebaseAdminConfigured()) {
    return NextResponse.json({ error: 'Firebase Admin غير مضبوط.' }, { status: 503 })
  }
  const bucketName =
    process.env.FIREBASE_STORAGE_BUCKET ||
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
  if (!bucketName) {
    return NextResponse.json(
      { error: 'اسم Firebase Storage bucket غير مضبوط.' },
      { status: 503 },
    )
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file')
    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'اختر ملف صورة صالحًا.' }, { status: 400 })
    }
    if (!allowedTypes.has(file.type)) {
      return NextResponse.json(
        { error: 'الأنواع المسموحة: JPG وPNG وWEBP وGIF وAVIF.' },
        { status: 415 },
      )
    }
    if (file.size === 0 || file.size > maxFileSize) {
      return NextResponse.json({ error: 'حجم الصورة يجب ألا يتجاوز 10 ميجابايت.' }, { status: 413 })
    }

    const extension = file.type.split('/')[1].replace('jpeg', 'jpg')
    const storagePath = `admin-uploads/${Date.now()}-${randomUUID()}.${extension}`
    const token = randomUUID()
    const bucket = adminStorage().bucket(bucketName)
    await bucket.file(storagePath).save(Buffer.from(await file.arrayBuffer()), {
      resumable: false,
      metadata: {
        contentType: file.type,
        cacheControl: 'public, max-age=31536000, immutable',
        metadata: { firebaseStorageDownloadTokens: token },
      },
    })
    const url = `https://firebasestorage.googleapis.com/v0/b/${encodeURIComponent(bucketName)}/o/${encodeURIComponent(storagePath)}?alt=media&token=${token}`
    return NextResponse.json({ url, path: storagePath }, { status: 201 })
  } catch (error) {
    console.error('Admin image upload failed:', error)
    return NextResponse.json({ error: 'فشل رفع الصورة إلى Firebase Storage.' }, { status: 500 })
  }
}
