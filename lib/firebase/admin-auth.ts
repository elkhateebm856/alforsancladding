import 'server-only'
import { cookies } from 'next/headers'
import { adminAuth } from '@/lib/firebase/auth-server'

export const ADMIN_SESSION_COOKIE = 'alforsan-admin-session'

export function isAdminEmail(email?: string | null) {
  if (!email) return false
  const allowedEmails = (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean)

  return allowedEmails.includes(email.toLowerCase())
}

export async function getAdminSession() {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get(ADMIN_SESSION_COOKIE)?.value
  if (!sessionCookie) return null

  try {
    const claims = await adminAuth().verifySessionCookie(sessionCookie, true)
    if (claims.email_verified !== true || !isAdminEmail(claims.email)) return null
    return claims
  } catch {
    return null
  }
}
