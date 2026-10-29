import 'server-only'
import { getAuth } from 'firebase-admin/auth'
import { getAdminApp } from '@/lib/firebase/admin'

export function adminAuth() {
  return getAuth(getAdminApp())
}
