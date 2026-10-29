import { NextRequest, NextResponse } from 'next/server'
import { adminAuth } from '@/lib/firebase/auth-server'
import { ADMIN_SESSION_COOKIE, isAdminEmail } from '@/lib/firebase/admin-auth'
import { isFirebaseAdminConfigured } from '@/lib/firebase/admin'

const SESSION_MAX_AGE_MS = 5 * 24 * 60 * 60 * 1000

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { idToken?: unknown }
    if (typeof body.idToken !== 'string' || !body.idToken) {
      return NextResponse.json({ error: 'رمز تسجيل الدخول مطلوب.' }, { status: 400 })
    }

    if (!isFirebaseAdminConfigured()) {
      return NextResponse.json(
        { error: 'إعداد Firebase Admin غير مكتمل على الخادم.' },
        { status: 503 },
      )
    }

    const decodedToken = await adminAuth().verifyIdToken(body.idToken, true)
    if (decodedToken.email_verified !== true) {
      return NextResponse.json(
        { error: 'تحقق من عنوان البريد الإلكتروني قبل دخول لوحة الإدارة.' },
        { status: 403 },
      )
    }
    if (!isAdminEmail(decodedToken.email)) {
      return NextResponse.json(
        { error: 'هذا الحساب غير مصرح له بدخول لوحة الإدارة.' },
        { status: 403 },
      )
    }

    const sessionCookie = await adminAuth().createSessionCookie(body.idToken, {
      expiresIn: SESSION_MAX_AGE_MS,
    })
    const response = NextResponse.json({ ok: true })
    response.cookies.set(ADMIN_SESSION_COOKIE, sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: SESSION_MAX_AGE_MS / 1000,
    })
    return response
  } catch (error) {
    console.error('Admin session creation failed:', error)
    return NextResponse.json(
      { error: 'تعذر تسجيل الدخول. تحقق من بيانات الحساب وحاول مجددًا.' },
      { status: 401 },
    )
  }
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true })
  response.cookies.delete(ADMIN_SESSION_COOKIE)
  return response
}
