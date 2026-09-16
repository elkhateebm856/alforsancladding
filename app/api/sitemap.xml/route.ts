import { services } from '@/data/services'
import { blogPosts } from '@/alforsancladding-main/data/blog'

const BASE_URL = 'https://www.alforsancladding.com'

export async function GET() {
  const currentDate = new Date().toISOString()

  const staticPages = [
    {
      url: '/',
      changefreq: 'weekly',
      priority: '1.0',
    },
    {
      url: '/about',
      changefreq: 'monthly',
      priority: '0.9',
    },
    {
      url: '/services',
      changefreq: 'weekly',
      priority: '0.9',
    },
    {
      url: '/portfolio',
      changefreq: 'weekly',
      priority: '0.8',
    },
    {
      url: '/blog',
      changefreq: 'daily',
      priority: '0.9',
    },
    {
      url: '/contact',
      changefreq: 'monthly',
      priority: '0.8',
    },
  ]

  const servicePages = services.map((service) => ({
    url: `/services/${service.slug}`,
    changefreq: 'monthly',
    priority: '0.8',
  }))

  const blogPages = blogPosts.map((post) => ({
    url: `/blog/${post.slug}`,
    changefreq: 'weekly',
    priority: '0.7',
  }))

  const allPages = [
    ...staticPages,
    ...servicePages,
    ...blogPages,
  ]

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
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

  return new Response(sitemap, {
    status: 200,

    headers: {
      'Content-Type': 'application/xml; charset=utf-8',

      'Cache-Control':
        'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}