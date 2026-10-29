import { NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const maxImageBytes = 700_000
const imageIdPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

interface RouteContext {
  params: Promise<{ id: string }>
}

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params
  if (!imageIdPattern.test(id)) {
    return new NextResponse(null, { status: 404 })
  }

  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'alforsancladding'
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY
  if (projectId !== 'alforsancladding' || !apiKey) {
    return new NextResponse(null, { status: 404 })
  }

  const documentUrl = new URL(
    `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/mediaAssets/${id}`,
  )
  documentUrl.searchParams.set('key', apiKey)

  try {
    const response = await fetch(documentUrl, { cache: 'no-store' })
    if (!response.ok) return new NextResponse(null, { status: 404 })

    const document = (await response.json()) as {
      fields?: {
        bytes?: { bytesValue?: string }
        contentType?: { stringValue?: string }
      }
    }
    const bytesValue = document.fields?.bytes?.bytesValue
    if (document.fields?.contentType?.stringValue !== 'image/webp' || !bytesValue) {
      return new NextResponse(null, { status: 404 })
    }

    const imageBytes = Buffer.from(bytesValue, 'base64')
    if (imageBytes.length === 0 || imageBytes.length > maxImageBytes) {
      return new NextResponse(null, { status: 404 })
    }

    return new NextResponse(imageBytes, {
      headers: {
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Content-Length': String(imageBytes.length),
        'Content-Type': 'image/webp',
        'X-Content-Type-Options': 'nosniff',
      },
    })
  } catch {
    return new NextResponse(null, { status: 503 })
  }
}