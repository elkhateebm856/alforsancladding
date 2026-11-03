import { buildSitemapXml } from '@/lib/sitemap'
import { getPublishedArticlesForSitemap, getPublishedPages } from '@/lib/content-store'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const [articles, pages] = await Promise.all([
      getPublishedArticlesForSitemap(),
      getPublishedPages(),
    ])
    return new Response(buildSitemapXml(articles, pages), {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'no-store, max-age=0',
      },
    })
  } catch (error) {
    console.error('Sitemap generation failed:', error)
    return new Response('Sitemap temporarily unavailable.', {
      status: 503,
      headers: { 'Cache-Control': 'no-store, max-age=0' },
    })
  }
}
