'use client'

import { onAuthStateChanged, signOut, type User } from 'firebase/auth'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { getFirebaseAuth } from '@/lib/firebase/client'
import { ADMIN_FIREBASE_EMAIL, ADMIN_FIREBASE_UID } from '@/lib/constants'

export function AdminAccessGate({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [checking, setChecking] = useState(true)
  const active = useRef(true)

  useEffect(() => {
    active.current = true
    const unsubscribe = onAuthStateChanged(getFirebaseAuth(), async (currentUser) => {
      try {
        if (!currentUser) {
          window.location.replace('/admin/login')
          return
        }

        await currentUser.reload()
        if (!active.current) return
        if (
          currentUser.uid !== ADMIN_FIREBASE_UID ||
          currentUser.email?.toLowerCase() !== ADMIN_FIREBASE_EMAIL
        ) {
          await signOut(getFirebaseAuth())
          window.location.replace('/admin/login')
          return
        }
        setUser(currentUser)
        setChecking(false)
      } catch {
        if (active.current) {
          await signOut(getFirebaseAuth())
          window.location.replace('/admin/login')
        }
      }
    })
    return () => {
      active.current = false
      unsubscribe()
    }
  }, [])

  if (checking || !user) {
    return (
      <main dir="rtl" className="p-12 text-center text-slate-500">
        جارٍ التحقق من صلاحية الإدارة...
      </main>
    )
  }
  return children
}
