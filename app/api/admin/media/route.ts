import { readdir } from 'node:fs/promises'
import path from 'node:path'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

const imageExtensions = new Set(['.avif', '.gif', '.jpeg', '.jpg', '.png', '.webp'])

async function findPublicImages(directory: string, publicRoot: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true })
  const images: string[] = []

  for (const entry of entries) {
    const absolutePath = path.join(directory, entry.name)
    if (entry.isDirectory()) {
      images.push(...(await findPublicImages(absolutePath, publicRoot)))
    } else if (entry.isFile() && imageExtensions.has(path.extname(entry.name).toLowerCase())) {
      const relativePath = path.relative(publicRoot, absolutePath)
      images.push(`/${relativePath.split(path.sep).map(encodeURIComponent).join('/')}`)
    }
  }

  return images
}

export async function GET() {
  try {
    const publicRoot = path.join(process.cwd(), 'public')
    const images = await findPublicImages(publicRoot, publicRoot)
    images.sort((left, right) => left.localeCompare(right))
    return NextResponse.json({ images })
  } catch (error) {
    console.error('Admin image library listing failed:', error)
    return NextResponse.json({ error: 'تعذر تحميل الصور الموجودة.' }, { status: 500 })
  }
}
