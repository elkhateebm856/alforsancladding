import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { SITE_NAME, SITE_URL } from '@/lib/constants'
import { getPublishedPage, sanitizeArticleContent } from '@/lib/content-store'

export const dynamic = 'force-dynamic'

interface ContentPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({
  params,
}: ContentPageProps): Promise<Metadata> {
  const { slug } = await params
  const page = await getPublishedPage(slug)
  if (!page) return { title: 'الصفحة غير موجودة' }

  const title = page.seoTitle || page.title
  const description = page.seoDescription || page.excerpt
  const canonicalUrl = `${SITE_URL}/${page.slug}`

  return {
    title: `${title} | ${SITE_NAME}`,
    description,
    keywords: page.keywords,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url: canonicalUrl,
      type: 'website',
    },
  }
}

export default async function ContentPage({ params }: ContentPageProps) {
  const { slug } = await params
  const page = await getPublishedPage(slug)
  if (!page) notFound()

  return (
    <>
      <Header />
      <main dir="rtl" className="min-h-screen bg-background">
        <section className="bg-slate-900 px-4 py-16 text-white sm:py-20">
          <div className="mx-auto max-w-5xl">
            <h1 className="text-3xl font-extrabold sm:text-5xl">{page.title}</h1>
            {page.excerpt && <p className="mt-4 max-w-3xl text-lg leading-8 text-white/80">{page.excerpt}</p>}
          </div>
        </section>
        <article className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
          <div
            className="space-y-4 text-lg leading-8 text-foreground [&_a]:text-primary [&_a]:underline [&_h1]:mb-4 [&_h1]:text-3xl [&_h1]:font-bold [&_h2]:mb-3 [&_h2]:mt-8 [&_h2]:text-2xl [&_h2]:font-bold [&_img]:my-6 [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-xl [&_li]:ms-6 [&_li]:list-disc [&_p]:mb-4 [&_strong]:font-bold"
            dangerouslySetInnerHTML={{ __html: sanitizeArticleContent(page.content) }}
          />
        </article>
      </main>
      <Footer />
    </>
  )
}
