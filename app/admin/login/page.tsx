'use client'

import { FormEvent, useEffect, useRef, useState } from 'react'
import {
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from 'firebase/auth'
import { getFirebaseAuth } from '@/lib/firebase/client'
import { ADMIN_FIREBASE_EMAIL, ADMIN_FIREBASE_UID } from '@/lib/constants'

const loginCooldownStorageKey = 'admin-login-cooldown-until'
const loginCooldownDurationMs = 5 * 60 * 1000

function getFirebaseAuthErrorCode(loginError: unknown) {
  return loginError instanceof Error && 'code' in loginError
    ? String((loginError as { code?: string }).code || '').toLowerCase()
    : ''
}

function getFirebaseAuthMessage(loginError: unknown) {
  const code = getFirebaseAuthErrorCode(loginError)
  const message =
    loginError instanceof Error ? loginError.message : 'تعذر تسجيل الدخول. تحقق من بيانات الحساب وحاول مجددًا.'

  if (code) {
    console.error('[Admin login]', code, message)
  }

  if (code === 'auth/invalid-credential') {
    return 'بيانات الدخول غير صحيحة. تأكد من البريد وكلمة المرور، أو أعد تعيين كلمة المرور ثم حاول مرة أخرى.'
  }
  if (code === 'auth/user-not-found') {
    return 'هذا الحساب غير موجود في Firebase. تأكد من عنوان البريد الإلكتروني.'
  }
  if (code === 'auth/wrong-password') {
    return 'كلمة المرور غير صحيحة. الرجاء التحقق منها أو إعادة تعيينها.'
  }
  if (code === 'auth/invalid-api-key') {
    return 'إعدادات Firebase غير صحيحة: مفتاح API غير صالح. راجع متغيرات المشروع في Firebase.'
  }
  if (code === 'auth/too-many-requests') {
    return 'أوقف Firebase تسجيل الدخول مؤقتًا بسبب كثرة المحاولات. أوقفنا الإرسال من هذه الصفحة لمدة خمس دقائق، وقد يستمر حظر Firebase مدة أطول.'
  }
  if (code === 'auth/email-not-verified' || code === 'auth/require-recent-login') {
    return 'تحتاج إلى تأكيد البريد الإلكتروني أولًا، ثم سجل الدخول مرة أخرى.'
  }
  if (code === 'auth/invalid-email') {
    return 'عنوان البريد الإلكتروني غير صحيح. تحقق من صياغته.'
  }

  return message.includes('email') || message.includes('verified')
    ? 'تحتاج إلى تأكيد البريد الإلكتروني قبل دخول لوحة الإدارة.'
    : 'تعذر تسجيل الدخول. تحقق من بيانات الحساب وحاول مجددًا.'
}

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [busy, setBusy] = useState(false)
  const [cooldownSeconds, setCooldownSeconds] = useState(0)
  const loginInProgress = useRef(false)
  const cooldownUntil = useRef(0)

  useEffect(() => {
    function syncCooldown() {
      try {
        const storedUntil = Number(window.localStorage.getItem(loginCooldownStorageKey))
        const remainingSeconds = Math.max(0, Math.ceil((storedUntil - Date.now()) / 1000))
        cooldownUntil.current = remainingSeconds > 0 ? storedUntil : 0
        setCooldownSeconds(remainingSeconds)
        if (remainingSeconds === 0) window.localStorage.removeItem(loginCooldownStorageKey)
      } catch {
        cooldownUntil.current = 0
        setCooldownSeconds(0)
      }
    }

    syncCooldown()
    window.addEventListener('storage', syncCooldown)
    return () => window.removeEventListener('storage', syncCooldown)
  }, [])

  useEffect(() => {
    if (cooldownSeconds === 0) return

    const timer = window.setTimeout(() => {
      const remainingSeconds = Math.max(0, Math.ceil((cooldownUntil.current - Date.now()) / 1000))
      setCooldownSeconds(remainingSeconds)
      if (remainingSeconds === 0) {
        try {
          window.localStorage.removeItem(loginCooldownStorageKey)
        } catch {
          cooldownUntil.current = 0
        }
      }
    }, 1000)

    return () => window.clearTimeout(timer)
  }, [cooldownSeconds])

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const remainingSeconds = Math.max(0, Math.ceil((cooldownUntil.current - Date.now()) / 1000))
    if (loginInProgress.current || remainingSeconds > 0) {
      setCooldownSeconds(remainingSeconds)
      return
    }

    loginInProgress.current = true
    setError('')
    setInfo('')
    setBusy(true)

    try {
      const credential = await signInWithEmailAndPassword(getFirebaseAuth(), email.trim(), password)
      await credential.user.reload()
      if (
        credential.user.uid !== ADMIN_FIREBASE_UID ||
        credential.user.email?.toLowerCase() !== ADMIN_FIREBASE_EMAIL
      ) {
        await getFirebaseAuth().signOut()
        throw new Error('هذا الحساب غير مصرح له بدخول لوحة الإدارة.')
      }

      window.location.assign('/admin')
    } catch (loginError) {
      setError(getFirebaseAuthMessage(loginError))
      if (getFirebaseAuthErrorCode(loginError) === 'auth/too-many-requests') {
        const blockedUntil = Date.now() + loginCooldownDurationMs
        cooldownUntil.current = blockedUntil
        setCooldownSeconds(Math.ceil(loginCooldownDurationMs / 1000))
        try {
          window.localStorage.setItem(loginCooldownStorageKey, String(blockedUntil))
        } catch {
          cooldownUntil.current = blockedUntil
        }
      }
    } finally {
      loginInProgress.current = false
      setBusy(false)
    }
  }

  async function resetPassword() {
    const normalizedEmail = email.trim()
    if (!normalizedEmail) {
      setError('أدخل البريد الإلكتروني أولاً.')
      return
    }
    if (normalizedEmail.toLowerCase() !== ADMIN_FIREBASE_EMAIL) {
      setError('هذا الحساب غير مصرح له بدخول لوحة الإدارة.')
      return
    }

    try {
      setError('')
      setInfo('')
      await sendPasswordResetEmail(getFirebaseAuth(), normalizedEmail)
      setInfo('تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني. افتح الرابط، ثم سجل الدخول بكلمة المرور الجديدة.')
    } catch (resetError) {
      setError(getFirebaseAuthMessage(resetError))
    }
  }

  return (
    <main dir="rtl" className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <form
        onSubmit={submit}
        className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-900/5"
      >
        <p className="mb-2 text-sm font-bold text-primary">الفرسان</p>
        <h1 className="mb-2 text-3xl font-bold text-slate-900">دخول الإدارة</h1>
        <p className="mb-8 text-sm leading-6 text-slate-500">
          سجّل الدخول بحساب Firebase المصرّح له بإدارة محتوى الموقع.
        </p>

        <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="email">
          البريد الإلكتروني
        </label>
        <input
          id="email"
          type="email"
          autoComplete="username"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="mb-5 w-full rounded-xl border border-slate-300 px-4 py-3 text-left outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
          dir="ltr"
        />

        <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="password">
          كلمة المرور
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="mb-5 w-full rounded-xl border border-slate-300 px-4 py-3 text-left outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
          dir="ltr"
        />

        {error && (
          <p role="alert" className="mb-5 rounded-xl bg-red-50 p-3 text-sm leading-6 text-red-700">
            {error}
          </p>
        )}

        {info && (
          <p className="mb-5 rounded-xl bg-emerald-50 p-3 text-sm leading-6 text-emerald-700">
            {info}
          </p>
        )}

        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={() => void resetPassword()}
            className="text-sm font-semibold text-primary underline-offset-4 hover:underline"
          >
            نسيت كلمة المرور؟
          </button>
        </div>

        <button
          type="submit"
          disabled={busy || cooldownSeconds > 0}
          className="w-full rounded-xl bg-primary px-4 py-3 font-bold text-white transition hover:bg-primary/90 disabled:cursor-wait disabled:opacity-60"
        >
          {busy
            ? 'جارٍ التحقق...'
            : cooldownSeconds > 0
              ? `محاولات الدخول متوقفة (${cooldownSeconds} ثانية)`
              : 'تسجيل الدخول'}
        </button>
      </form>
    </main>
  )
}
