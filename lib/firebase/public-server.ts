import 'server-only'
import { getApps, initializeApp } from 'firebase/app'
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  where,
} from 'firebase/firestore'

export function isPublicFirebaseConfigured() {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'alforsancladding'
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY
  const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID
  return Boolean(projectId === 'alforsancladding' && apiKey && appId)
}

function publicDb() {
  if (!isPublicFirebaseConfigured()) {
    return null
  }

  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'alforsancladding'
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY as string
  const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID as string
  const name = 'alforsan-public-server'
  const existing = getApps().find((app) => app.name === name)
  const app =
    existing ||
    initializeApp(
      {
        apiKey,
        appId,
        projectId,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      },
      name,
    )
  return getFirestore(app)
}

export async function getPublicDocuments<T>(collectionName: string, status: string) {
  const db = publicDb()
  if (!db) return [] as T[]

  const snapshot = await getDocs(
    query(collection(db, collectionName), where('status', '==', status)),
  )
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }) as T)
}

export async function getPublicDocumentsAny<T>(collectionName: string) {
  const db = publicDb()
  if (!db) return [] as T[]

  const snapshot = await getDocs(collection(db, collectionName))
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }) as T)
}

export async function getPublicDocument<T>(collectionName: string, id: string) {
  const db = publicDb()
  if (!db) return null

  const snapshot = await getDoc(doc(db, collectionName, id))
  return snapshot.exists()
    ? ({ id: snapshot.id, ...snapshot.data() } as T)
    : null
}
