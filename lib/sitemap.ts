import { services } from '@/data/services'
import { blogPosts } from '@/data/blog'
import { SITE_URL } from '@/lib/constants'

interface SitemapArticle {
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

export const staticPages = [
  { url: '/', changefreq: 'weekly', priority: '1.0' },
  { url: '/about', changefreq: 'monthly', priority: '0.9' },
  { url: '/services', changefreq: 'weekly', priority: '0.9' },
  { url: '/portfolio', changefreq: 'weekly', priority: '0.8' },
  { url: '/blog', changefreq: 'daily', priority: '0.9' },
  { url: '/reviews', changefreq: 'monthly', priority: '0.6' },
  { url: '/contact', changefreq: 'monthly', priority: '0.8' },
]

export function getSitemapUrls(articles: SitemapArticle[] = legacyArticles): SitemapPage[] {
  const servicePages = services.map((service) => ({
    url: `/services/${service.slug}`,
    changefreq: 'monthly' as const,
    priority: '0.8',
  }))

  const blogPages = articles
    .filter((post) => Boolean(post.slug))
    .map((post) => {
      const timestamp =
        typeof post.updatedAt === 'string' || post.updatedAt instanceof Date
          ? post.updatedAt
          : post.date
      const parsedDate = timestamp ? new Date(timestamp) : null

      return {
        url: `/blog/${post.slug}`,
        changefreq: 'weekly' as const,
        priority: '0.7',
        ...(parsedDate && !Number.isNaN(parsedDate.getTime())
          ? { lastmod: parsedDate.toISOString() }
          : {}),
      }
    })

  const pages = [
    ...staticPages.map((page) => ({ ...page, url: page.url })),
    ...servicePages,
    ...blogPages,
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

export function buildSitemapXml(articles: SitemapArticle[] = legacyArticles) {
  const urls = getSitemapUrls(articles)

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
