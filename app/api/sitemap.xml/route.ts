import { services } from '@/data/services'
import { blogPosts } from '@/data/blog'

export async function GET() {
  const baseUrl = 'https://alfarsan.com'

  const staticPages = [
    {
      url: '',
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

  const allPages = [...staticPages, ...servicePages, ...blogPages]

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allPages
    .map((page) => {
      return `
  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
    })
    .join('')}
</urlset>`

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=3600',
    },
  })
}
