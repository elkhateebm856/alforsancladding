'use client'

import { getApps, initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

export function getFirebaseAuth() {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY
  const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID
  const projectId =
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'alforsancladding'

  if (projectId !== 'alforsancladding') {
    throw new Error('Firebase client must connect to project alforsancladding.')
  }
  if (!apiKey || !appId) {
    throw new Error(
      'Firebase client is not configured. Set NEXT_PUBLIC_FIREBASE_API_KEY and NEXT_PUBLIC_FIREBASE_APP_ID.',
    )
  }

  const appName = 'alforsan-client'
  const existingApp = getApps().find((candidate) => candidate.name === appName)
  const app =
    existingApp ||
    initializeApp({
          apiKey,
          appId,
          authDomain:
            process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ||
            'alforsancladding.firebaseapp.com',
          projectId,
          storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
          messagingSenderId:
            process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        }, appName)

  if (app.options.projectId !== 'alforsancladding') {
    throw new Error('Firebase client app is initialized for an unexpected project.')
  }
  return getAuth(app)
}

export function getFirebaseDb() {
  return getFirestore(getFirebaseAuth().app)
}
