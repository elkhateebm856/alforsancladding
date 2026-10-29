'use client'

import { getFirebaseAuth } from '@/lib/firebase/client'
import { ADMIN_FIREBASE_EMAIL, ADMIN_FIREBASE_UID } from '@/lib/constants'

const acceptedImageTypes = new Set(['image/jpeg', 'image/png', 'image/webp'])
const maxSourceBytes = 15 * 1024 * 1024
const maxStoredBytes = 700_000
const maxImageDimension = 2048

interface EncodedImage {
  bytes: Uint8Array
  width: number
  height: number
}

export interface UploadedFirestoreImage {
  id: string
  url: string
  width: number
  height: number
  bytes: number
}

async function encodeImage(file: File): Promise<EncodedImage> {
  const bitmap = await createImageBitmap(file)
  try {
    let scale = Math.min(1, maxImageDimension / Math.max(bitmap.width, bitmap.height))
    let quality = 0.82

    for (let attempt = 0; attempt < 10; attempt += 1) {
      const width = Math.max(1, Math.round(bitmap.width * scale))
      const height = Math.max(1, Math.round(bitmap.height * scale))
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const context = canvas.getContext('2d')
      if (!context) throw new Error('تعذر تجهيز الصورة في المتصفح.')
      context.drawImage(bitmap, 0, 0, width, height)

      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (result) => result ? resolve(result) : reject(new Error('تعذر ضغط الصورة.')),
          'image/webp',
          quality,
        )
      })

      if (blob.size <= maxStoredBytes) {
        return { bytes: new Uint8Array(await blob.arrayBuffer()), width, height }
      }

      if (quality > 0.58) quality -= 0.08
      else scale *= 0.85
    }
  } finally {
    bitmap.close()
  }

  throw new Error('الصورة أكبر من الحد المجاني بعد الضغط. اختر صورة أصغر أو قلل دقتها.')
}

function toBase64(bytes: Uint8Array) {
  let binary = ''
  const chunkSize = 0x8000
  for (let offset = 0; offset < bytes.length; offset += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + chunkSize))
  }
  return btoa(binary)
}

export async function uploadFirestoreImage(
  file: File,
  onProgress: (progress: number) => void,
): Promise<UploadedFirestoreImage> {
  if (!acceptedImageTypes.has(file.type)) {
    throw new Error('اختر صورة بصيغة JPG أو JPEG أو PNG أو WebP.')
  }
  if (file.size === 0 || file.size > maxSourceBytes) {
    throw new Error('يجب ألا يتجاوز حجم الصورة الأصلية 15 ميجابايت.')
  }

  const user = getFirebaseAuth().currentUser
  if (
    !user ||
    user.uid !== ADMIN_FIREBASE_UID ||
    user.email?.toLowerCase() !== ADMIN_FIREBASE_EMAIL
  ) {
    throw new Error('سجّل الدخول بحساب الإدارة المصرّح له أولًا.')
  }

  onProgress(0)
  const image = await encodeImage(file)
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'alforsancladding'
  if (!apiKey || projectId !== 'alforsancladding') {
    throw new Error('إعداد Firebase Client غير مكتمل.')
  }

  const id = crypto.randomUUID()
  const idToken = await user.getIdToken()
  const fields = {
    bytes: { bytesValue: toBase64(image.bytes) },
    contentType: { stringValue: 'image/webp' },
    originalName: { stringValue: file.name.slice(0, 180) },
    ownerUid: { stringValue: user.uid },
    width: { integerValue: String(image.width) },
    height: { integerValue: String(image.height) },
  }
  const endpoint = new URL(
    `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents:commit`,
  )
  endpoint.searchParams.set('key', apiKey)

  await new Promise<void>((resolve, reject) => {
    const request = new XMLHttpRequest()
    request.open('POST', endpoint.toString())
    request.setRequestHeader('Authorization', `Bearer ${idToken}`)
    request.setRequestHeader('Content-Type', 'application/json')
    request.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        onProgress(Math.min(99, Math.round((event.loaded / event.total) * 100)))
      }
    }
    request.onerror = () => reject(new Error('تعذر الاتصال بـFirestore أثناء رفع الصورة.'))
    request.onload = () => {
      if (request.status >= 200 && request.status < 300) {
        onProgress(100)
        resolve()
        return
      }
      reject(new Error(
        request.status === 403
          ? 'رفضت قواعد Firestore رفع الصورة. تأكد من نشر قاعدة mediaAssets المقيّدة بالمدير.'
          : 'فشل حفظ الصورة في Firestore. لم يُحفظ رابطها في المقال.',
      ))
    }
    request.send(JSON.stringify({
      writes: [{
        update: {
          name: `projects/${projectId}/databases/(default)/documents/mediaAssets/${id}`,
          fields,
        },
        updateTransforms: [{ fieldPath: 'createdAt', setToServerValue: 'REQUEST_TIME' }],
        currentDocument: { exists: false },
      }],
    }))
  })

  return {
    id,
    url: `/api/media/${id}`,
    width: image.width,
    height: image.height,
    bytes: image.bytes.byteLength,
  }
}