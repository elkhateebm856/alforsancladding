import 'server-only'
import type { DocumentData, QueryDocumentSnapshot } from 'firebase-admin/firestore'
import { blogPosts as legacyBlogPosts } from '@/data/blog'
import { testimonials as legacyTestimonials } from '@/data/testimonials'
import { adminDb, isFirebaseAdminConfigured } from '@/lib/firebase/admin'
import { sanitizeArticleHtml } from '@/lib/content-sanitize'
import {
  getPublicDocument,
  getPublicDocuments,
  getPublicDocumentsAny,
} from '@/lib/firebase/public-server'

export type ArticleStatus = 'draft' | 'published' | 'deleted'
export type TestimonialStatus =
  | 'pending'
  | 'approved'
  | 'hidden'
  | 'rejected'
  | 'deleted'

export interface ArticleRecord {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  image: string
  imageAlt?: string
  date: string
  author: string
  authorAccentClass?: string
  category?: string
  tags?: string[]
  seoTitle?: string
  seoDescription?: string
  keywords?: string[]
  status: ArticleStatus
  source?: 'legacy' | 'firestore'
  [key: string]: unknown
}

export interface ContentPageRecord {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  seoTitle?: string
  seoDescription?: string
  keywords?: string[]
  status: 'draft' | 'published' | 'deleted'
  date?: string
  updatedAt?: unknown
  [key: string]: unknown
}

export interface TestimonialRecord {
  id: string
  name: string
  title?: string
  position: string
  company: string
  text: string
  rating: number
  sourcePath?: string
  image?: string
  status: TestimonialStatus
  [key: string]: unknown
}

function toPlainRecord<T extends Record<string, unknown>>(
  snapshot: QueryDocumentSnapshot<DocumentData>,
): T {
  const data = snapshot.data()
  const toIsoString = (value: unknown) => {
    if (
      value &&
      typeof value === 'object' &&
      'toDate' in value &&
      typeof value.toDate === 'function'
    ) {
      return (value.toDate as () => Date)().toISOString()
    }
    return value
  }

  return {
    ...data,
    id: String(data.id ?? snapshot.id),
    createdAt: toIsoString(data.createdAt),
    updatedAt: toIsoString(data.updatedAt),
  } as unknown as T
}

function legacyArticles(): ArticleRecord[] {
  return legacyBlogPosts.map((post) => ({
    ...post,
    id: String(post.id),
    status: 'published',
    source: 'legacy',
  }))
}

export async function getAdminArticles(): Promise<ArticleRecord[]> {
  const legacy = legacyArticles()
  if (!isFirebaseAdminConfigured()) return legacy

  const snapshot = await adminDb().collection('articles').get()
  const legacyBySlug = new Map(legacy.map((article) => [article.slug, article]))
  const firestoreArticles: ArticleRecord[] = snapshot.docs.map((doc) => {
    const record = toPlainRecord<ArticleRecord>(doc)
    const source = legacyBySlug.get(String(record.slug || doc.id))
    const merged = {
      ...(source || {}),
      ...Object.fromEntries(
        Object.entries(record).filter(([, value]) => value !== undefined),
      ),
    } as Partial<ArticleRecord>
    return {
      ...merged,
      id: record.id || doc.id,
      slug: record.slug || doc.id,
      title: record.title || source?.title || '',
      excerpt: record.excerpt || source?.excerpt || '',
      content: record.content || source?.content || '',
      image: record.image || source?.image || '',
      date: record.date || source?.date || '',
      author: record.author || source?.author || '',
      status: record.status || 'published',
      source: 'firestore' as const,
    }
  })
  const bySlug = new Map(firestoreArticles.map((article) => [article.slug, article]))

  for (const article of legacy) {
    if (!bySlug.has(article.slug)) bySlug.set(article.slug, article)
  }

  return [...bySlug.values()]
    .filter((article) => article.status !== 'deleted')
    .sort((first, second) => second.date.localeCompare(first.date))
}

export async function getPublishedArticles(): Promise<ArticleRecord[]> {
  let articles: ArticleRecord[]
  if (isFirebaseAdminConfigured()) {
    articles = await getAdminArticles()
  } else {
    try {
      const [remote, states] = await Promise.all([
        getPublicDocuments<ArticleRecord>('articles', 'published'),
        getPublicDocumentsAny<{ id: string; kind: string; status: string }>('contentVisibility'),
      ])
      const legacyBySlug = new Map(legacyArticles().map((article) => [article.slug, article]))
      const merged = remote.map((article) => ({
        ...legacyBySlug.get(article.slug || article.id),
        ...article,
        source: 'firestore' as const,
      }))
      const remoteSlugs = new Set(merged.map((article) => article.slug))
      const visibility = new Map(
        states.filter((state) => state.kind === 'article').map((state) => [state.id, state.status]),
      )
      articles = [
        ...merged,
        ...legacyArticles().filter((article) =>
          !remoteSlugs.has(article.slug) &&
          (!visibility.has(article.slug) || visibility.get(article.slug) === 'published'),
        ),
      ]
    } catch (error) {
      console.error('Public Firestore article read failed; using local source:', error)
      articles = legacyArticles()
    }
  }
  return articles
    .filter((article) => article.status === 'published')
    .sort((first, second) => second.date.localeCompare(first.date))
}

export async function getPublishedArticle(slug: string) {
  if (isFirebaseAdminConfigured()) {
    const snapshot = await adminDb().collection('articles').doc(slug).get()
    if (snapshot.exists) {
      const legacy = legacyBlogPosts.find((post) => post.slug === slug)
      const data = snapshot.data() || {}
      const article = {
        ...(legacy || {}),
        ...data,
        id: snapshot.id,
        slug: data.slug || snapshot.id,
        status: data.status || 'published',
      } as ArticleRecord
      return article.status === 'published' ? article : null
    }
  } else {
    try {
      const state = await getPublicDocument<{ status: string }>(
        'contentVisibility',
        `article-${slug}`,
      )
      if (state && state.status !== 'published') return null
      const remoteArticles = await getPublicDocuments<ArticleRecord>('articles', 'published')
      const remote = remoteArticles.find((article) => article.slug === slug || article.id === slug) || null
      if (remote) {
        const legacy = legacyBlogPosts.find((post) => post.slug === slug)
        const article = {
          ...(legacy || {}),
          ...remote,
          id: remote.id || slug,
          slug: remote.slug || slug,
          status: remote.status || 'published',
        } as ArticleRecord
        return article.status === 'published' ? article : null
      }
    } catch (error) {
      console.error('Public Firestore article read failed; using local source:', error)
    }
  }

  const legacy = legacyBlogPosts.find((post) => post.slug === slug)
  return legacy
    ? ({ ...legacy, id: String(legacy.id), status: 'published' } as ArticleRecord)
    : null
}

export async function getPublishedPages(): Promise<ContentPageRecord[]> {
  if (isFirebaseAdminConfigured()) {
    const snapshot = await adminDb()
      .collection('pages')
      .where('status', '==', 'published')
      .get()
    return snapshot.docs.map((document) => ({
      ...toPlainRecord<ContentPageRecord>(document),
      slug: String(document.get('slug') || document.id),
    }))
  }

  try {
    return await getPublicDocuments<ContentPageRecord>('pages', 'published')
  } catch (error) {
    console.error('Public Firestore page read failed:', error)
    return []
  }
}

export async function getPublishedPage(slug: string) {
  if (isFirebaseAdminConfigured()) {
    const snapshot = await adminDb().collection('pages').doc(slug).get()
    if (!snapshot.exists || snapshot.get('status') !== 'published') return null
    return {
      ...snapshot.data(),
      id: snapshot.id,
      slug: String(snapshot.get('slug') || snapshot.id),
    } as ContentPageRecord
  }

  try {
    const page = await getPublicDocument<ContentPageRecord>('pages', slug)
    return page?.status === 'published' ? page : null
  } catch (error) {
    console.error(`Public Firestore page read failed for "${slug}":`, error)
    return null
  }
}

export async function getAdminTestimonials(): Promise<TestimonialRecord[]> {
  const legacy: TestimonialRecord[] = legacyTestimonials.map((testimonial) => ({
    ...testimonial,
    id: String(testimonial.id),
    status: 'approved',
    source: 'legacy',
  }))
  if (!isFirebaseAdminConfigured()) return legacy

  const snapshot = await adminDb().collection('testimonials').get()
  const legacyById = new Map(legacy.map((record) => [record.id, record]))
  const records: TestimonialRecord[] = snapshot.docs.map((doc) => {
    const record = toPlainRecord<TestimonialRecord>(doc)
    const source = legacyById.get(record.id || doc.id)
    const merged = {
      ...(source || {}),
      ...Object.fromEntries(
        Object.entries(record).filter(([, value]) => value !== undefined),
      ),
    } as Partial<TestimonialRecord>
    return {
      ...merged,
      id: record.id || doc.id,
      name: record.name || source?.name || '',
      position: record.position || source?.position || '',
      company: record.company || source?.company || '',
      text: record.text || source?.text || '',
      rating: record.rating || source?.rating || 5,
      status: record.status || (source ? 'approved' : 'pending'),
    }
  })
  const byId = new Map(records.map((record) => [record.id, record]))
  for (const record of legacy) {
    if (!byId.has(record.id)) byId.set(record.id, record)
  }
  return [...byId.values()].filter((testimonial) => testimonial.status !== 'deleted')
}

export async function getApprovedTestimonials(): Promise<TestimonialRecord[]> {
  let testimonials: TestimonialRecord[]
  if (isFirebaseAdminConfigured()) {
    testimonials = await getAdminTestimonials()
  } else {
    try {
      const [remote, states] = await Promise.all([
        getPublicDocuments<TestimonialRecord>('testimonials', 'approved'),
        getPublicDocumentsAny<{ id: string; kind: string; status: string }>('contentVisibility'),
      ])
      const legacy = legacyTestimonials.map((item) => ({
        ...item,
        id: String(item.id),
        status: 'approved' as const,
      }))
      const merged = remote.map((record) => ({
        ...legacy.find((item) => item.id === record.id),
        ...record,
        status: 'approved' as const,
      }))
      const ids = new Set(merged.map((item) => item.id))
      const visibility = new Map(
        states.filter((state) => state.kind === 'testimonial').map((state) => [state.id, state.status]),
      )
      testimonials = [
        ...merged,
        ...legacy.filter((item) =>
          !ids.has(item.id) &&
          (!visibility.has(item.id) || visibility.get(item.id) === 'approved'),
        ),
      ]
    } catch (error) {
      console.error('Public Firestore testimonial read failed; using local source:', error)
      testimonials = legacyTestimonials.map((item) => ({
        ...item,
        id: String(item.id),
        status: 'approved',
      }))
    }
  }
  return testimonials.filter((testimonial) => testimonial.status === 'approved')
}

export function sanitizeArticleContent(content: string) {
  return sanitizeArticleHtml(content)
}
