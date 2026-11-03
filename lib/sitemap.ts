import { services } from '@/data/services'
import { blogPosts } from '@/data/blog'
import { SITE_URL } from '@/lib/constants'

interface SitemapArticle {
  slug: string
  date?: string
  updatedAt?: unknown
}

interface SitemapContentPage {
  slug: string
  date?: string
  updatedAt?: unknown
}

interface SitemapPage {
  url: string
  changefreq: string
  priority: string
  lastmod?: string
}

const legacyArticles: SitemapArticle[] = blogPosts

function isFirestoreTimestamp(value: unknown): value is { toDate: () => Date } {
  return Boolean(
    value &&
    typeof value === 'object' &&
    'toDate' in value &&
    typeof value.toDate === 'function',
  )
}

function getLastmod(record: { date?: string; updatedAt?: unknown }) {
  const timestamp = isFirestoreTimestamp(record.updatedAt)
    ? record.updatedAt.toDate()
    : typeof record.updatedAt === 'string' || record.updatedAt instanceof Date
      ? record.updatedAt
      : record.date
  const parsedDate = timestamp ? new Date(timestamp) : null
  return parsedDate && !Number.isNaN(parsedDate.getTime())
    ? parsedDate.toISOString()
    : undefined
}

export const staticPages = [
  { url: '/', changefreq: 'weekly', priority: '1.0' },
  { url: '/about', changefreq: 'monthly', priority: '0.9' },
  { url: '/services', changefreq: 'weekly', priority: '0.9' },
  { url: '/portfolio', changefreq: 'weekly', priority: '0.8' },
  { url: '/blog', changefreq: 'daily', priority: '0.9' },
  { url: '/reviews', changefreq: 'monthly', priority: '0.6' },
  { url: '/contact', changefreq: 'monthly', priority: '0.8' },
]

export function getSitemapUrls(
  articles: SitemapArticle[] = legacyArticles,
  contentPages: SitemapContentPage[] = [],
): SitemapPage[] {
  const servicePages = services.map((service) => ({
    url: `/services/${service.slug}`,
    changefreq: 'monthly' as const,
    priority: '0.8',
  }))

  const blogPages = articles
    .filter((post) => Boolean(post.slug))
    .map((post) => {
      const lastmod = getLastmod(post)
      return {
        url: `/blog/${post.slug}`,
        changefreq: 'weekly' as const,
        priority: '0.7',
        ...(lastmod ? { lastmod } : {}),
      }
    })

  const customPages = contentPages
    .filter((page) => Boolean(page.slug))
    .map((page) => {
      const lastmod = getLastmod(page)
      return {
        url: `/${page.slug}`,
        changefreq: 'monthly' as const,
        priority: '0.7',
        ...(lastmod ? { lastmod } : {}),
      }
    })

  const pages = [
    ...staticPages.map((page) => ({ ...page, url: page.url })),
    ...servicePages,
    ...blogPages,
    ...customPages,
  ]

  const seen = new Set<string>()
  return pages.filter((page) => {
    const url = new URL(page.url, SITE_URL).toString()
    if (seen.has(url)) return false
    seen.add(url)
    return true
  })
}

function escapeXml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}

export function buildSitemapXml(
  articles: SitemapArticle[] = legacyArticles,
  contentPages: SitemapContentPage[] = [],
) {
  const urls = getSitemapUrls(articles, contentPages)

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (page) => `
  <url>
    <loc>${escapeXml(new URL(page.url, SITE_URL).toString())}</loc>
    ${page.lastmod ? `<lastmod>${escapeXml(page.lastmod)}</lastmod>` : ''}
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join('')}
</urlset>`
}
