import { buildSitemapXml } from '@/lib/sitemap'
import { getPublishedArticles } from '@/lib/content-store'

export const dynamic = 'force-dynamic'

export async function GET() {
  const articles = await getPublishedArticles()
  return new Response(buildSitemapXml(articles), {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=86400',
    },
  })
}
