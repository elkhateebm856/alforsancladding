import { services } from '@/data/services'
import { blogPosts } from '@/data/blog'
import { videos } from '@/data/videos'

const BASE_URL = 'https://www.alforsancladding.com'

export const staticPages = [
  { url: '/', changefreq: 'weekly', priority: '1.0' },
  { url: '/about', changefreq: 'monthly', priority: '0.9' },
  { url: '/services', changefreq: 'weekly', priority: '0.9' },
  { url: '/portfolio', changefreq: 'weekly', priority: '0.8' },
  { url: '/blog', changefreq: 'daily', priority: '0.9' },
  { url: '/contact', changefreq: 'monthly', priority: '0.8' },
]

export function getSitemapUrls() {
  const servicePages = services.map((service) => ({
    url: `/services/${service.slug}`,
    changefreq: 'monthly' as const,
    priority: '0.8',
  }))

  const blogPages = blogPosts.map((post) => ({
    url: `/blog/${post.slug}`,
    changefreq: 'weekly' as const,
    priority: '0.7',
  }))

  const videoPages = videos.map((video) => ({
    url: `/portfolio#video-${video.id}`,
    changefreq: 'monthly' as const,
    priority: '0.6',
  }))

  return [
    ...staticPages.map((page) => ({ ...page, url: page.url })),
    ...servicePages,
    ...blogPages,
    ...videoPages,
  ]
}

export function buildSitemapXml() {
  const currentDate = new Date().toISOString()
  const urls = getSitemapUrls()

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (page) => `
  <url>
    <loc>${BASE_URL}${page.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join('')}
</urlset>`
}
