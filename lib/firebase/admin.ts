import 'server-only'
import { existsSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'
import { applicationDefault, cert, getApps, initializeApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { getStorage } from 'firebase-admin/storage'

function hasApplicationDefaultCredentials() {
  const credentialPaths = [
    process.env.GOOGLE_APPLICATION_CREDENTIALS,
    process.env.APPDATA
      ? join(process.env.APPDATA, 'gcloud', 'application_default_credentials.json')
      : null,
    join(homedir(), '.config', 'gcloud', 'application_default_credentials.json'),
  ]

  return credentialPaths.some((credentialPath) => credentialPath && existsSync(credentialPath))
}

export function getAdminApp() {
  const existingApp = getApps().find((app) => app.name === 'alforsan-admin')
  const projectId = process.env.FIREBASE_PROJECT_ID || 'alforsancladding'
  if (projectId !== 'alforsancladding') {
    throw new Error('Firebase project must be alforsancladding.')
  }
  if (existingApp) {
    if (existingApp.options.projectId !== projectId) {
      throw new Error('Firebase Admin app is initialized for an unexpected project.')
    }
    return existingApp
  }

  const storageBucket = process.env.FIREBASE_STORAGE_BUCKET
  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')

  const serviceAccount = serviceAccountJson
    ? (JSON.parse(serviceAccountJson) as { project_id?: string })
    : null
  if (serviceAccount && serviceAccount.project_id !== projectId) {
    throw new Error('Firebase service-account project_id must be alforsancladding.')
  }

  const credential = serviceAccountJson
    ? cert(JSON.parse(serviceAccountJson))
    : clientEmail && privateKey
      ? cert({ projectId, clientEmail, privateKey })
      : hasApplicationDefaultCredentials()
        ? applicationDefault()
        : null

  if (!credential) {
    throw new Error(
      'Firebase Admin is not configured. Set up Google Application Default Credentials or configure FIREBASE_SERVICE_ACCOUNT_JSON or FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY.',
    )
  }

  return initializeApp(
    {
      credential,
      projectId,
      ...(storageBucket ? { storageBucket } : {}),
    },
    'alforsan-admin',
  )
}

export function isFirebaseAdminConfigured() {
  return Boolean(
    process.env.FIREBASE_SERVICE_ACCOUNT_JSON ||
      (process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) ||
      hasApplicationDefaultCredentials(),
  )
}

export function adminDb() {
  return getFirestore(getAdminApp())
}

export function adminStorage() {
  return getStorage(getAdminApp())
}
