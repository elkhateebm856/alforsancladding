import { buildSitemapXml } from '@/lib/sitemap'
import { getPublishedArticles, getPublishedPages } from '@/lib/content-store'

export const dynamic = 'force-dynamic'

export async function GET() {
  const [articles, pages] = await Promise.all([
    getPublishedArticles(),
    getPublishedPages(),
  ])
  return new Response(buildSitemapXml(articles, pages), {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=86400',
    },
  })
}
