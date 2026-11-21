import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ChevronLeft, Calendar, User } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ContactButtons } from '@/components/common/ContactButtons'
import { ArticleShareActions } from '@/components/common/ArticleShareActions'
import { PublicReviewForm } from '@/components/common/PublicReviewForm'
import { RelativePublicationTime } from '@/components/common/RelativePublicationTime'
import { ScrollReveal } from '@/components/common/ScrollReveal'
import {
  getPublishedArticle,
  getPublishedArticles,
  sanitizeArticleContent,
} from '@/lib/content-store'
import { SITE_NAME } from '@/lib/constants'
import { slugifyArabicTitle } from '@/lib/slug'

interface BlogPageProps {
  params: Promise<{ slug: string }>
}

export const dynamic = 'force-dynamic'

export async function generateMetadata(
  { params }: BlogPageProps
): Promise<Metadata> {
  const { slug } = await params
  const post = await getPublishedArticle(slug)

  if (!post) {
    return {
      title: 'مقالة غير موجودة',
    }
  }

  const canonicalSlug = slugifyArabicTitle(post.title) || post.slug
  const canonicalUrl = `https://www.alforsancladding.com/blog/${canonicalSlug}`
  const imageUrl = new URL(
    post.image,
    'https://www.alforsancladding.com',
  ).toString()
  const title = post.seoTitle || post.title

  return {
    title,
    description: post.seoDescription || post.excerpt,
    keywords: post.keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description: post.seoDescription || post.excerpt,
      url: canonicalUrl,
      type: 'article',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | ${SITE_NAME}`,
      description: post.seoDescription || post.excerpt,
      images: [imageUrl],
    },
  }
}

export default async function BlogPostPage({ params }: BlogPageProps) {
  const { slug } = await params
  const post = await getPublishedArticle(slug)

  if (!post) {
    return (
      <>
        <Header />
        <div className="flex min-h-[65vh] items-center justify-center bg-[#f7f5ef] px-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-xl">
            <h1 className="mb-4 text-3xl font-bold text-slate-900">مقالة غير موجودة</h1>
            <Link href="/blog" className="font-bold text-[#8f7016] hover:underline">
              تصفح المدونة
            </Link>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  const canonicalSlug = slugifyArabicTitle(post.title) || post.slug
  if (decodeURIComponent(slug) !== canonicalSlug) {
    redirect(`/blog/${encodeURIComponent(canonicalSlug)}`)
  }

  const relatedPosts = (await getPublishedArticles())
    .filter((p) => p.slug !== post.slug)
    .slice(0, 3)

  return (
    <>
      <Header />
      <main className="bg-background">
        <section className="relative overflow-hidden border-b border-primary/20 bg-[#f7f5ef] py-10 md:py-16">
          <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
          <ScrollReveal className="relative mx-auto grid max-w-7xl items-center gap-8 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 lg:px-8">
            <div className="text-right">
              <Link
                href="/blog"
                className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-white/80 px-4 py-2 text-sm font-bold text-[#8f7016] transition-colors hover:bg-white"
              >
                <ChevronLeft size={16} aria-hidden="true" />
                مدونة الفرسان
              </Link>
              <h1 className="mb-5 text-balance text-3xl font-extrabold leading-tight text-slate-900 sm:text-4xl lg:text-5xl">
                {post.title}
              </h1>
              <p className="mb-7 max-w-2xl text-base leading-8 text-slate-600 md:text-lg">
                {post.excerpt}
              </p>
              <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
                <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 ${post.authorAccentClass ?? 'bg-amber-100 text-amber-700'}`}>
                  <User size={15} aria-hidden="true" />
                  {post.author}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/75 px-3 py-1.5">
                  <Calendar size={15} aria-hidden="true" />
                  <time dateTime={post.date}>
                    {new Date(post.date).toLocaleDateString('ar-EG', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>
                </span>
                <RelativePublicationTime
                  value={post.publishedAt ?? post.date}
                  prefix="نُشر "
                  className="rounded-full border border-slate-200 bg-white/75 px-3 py-1.5"
                />
              </div>
            </div>

            <div className="relative mx-auto aspect-[16/11] w-full max-w-2xl overflow-hidden rounded-3xl border-4 border-white shadow-[0_24px_60px_rgba(31,41,55,0.2)]">
              <Image
                src={post.image}
                alt={post.imageAlt || post.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/25 via-transparent to-white/5" />
            </div>
          </ScrollReveal>
        </section>

        {/* Breadcrumb */}
        <div className="border-b border-slate-100 bg-white py-4">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <nav aria-label="مسار التنقل" className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
              <Link href="/" className="transition-colors hover:text-[#8f7016]">
                الرئيسية
              </Link>
              <ChevronLeft size={16} aria-hidden="true" />
              <Link href="/blog" className="transition-colors hover:text-[#8f7016]">
                المدونة
              </Link>
              <ChevronLeft size={16} aria-hidden="true" />
              <span className="max-w-full truncate font-semibold text-slate-800">{post.title}</span>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <section className="bg-[#f7f5ef] py-12 md:py-16">
          <ScrollReveal className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            {/* Article Content */}
            <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_16px_44px_rgba(31,41,55,0.07)] sm:p-8 md:p-12">
              <div
                className="max-w-none space-y-4 break-words text-base leading-9 text-slate-700 sm:text-lg [&_h1]:mb-4 [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-slate-900 [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:border-r-4 [&_h2]:border-primary [&_h2]:pr-4 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-slate-900 [&_h3]:mt-7 [&_h3]:mb-3 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-slate-900 [&_p]:mb-5 [&_strong]:font-bold [&_strong]:text-slate-900 [&_a]:font-semibold [&_a]:text-[#8f7016] [&_a]:underline [&_ul]:my-5 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pr-6 [&_ol]:my-5 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pr-6 [&_img]:my-7 [&_img]:rounded-2xl [&_img]:shadow-lg"
                dangerouslySetInnerHTML={{
                  __html: sanitizeArticleContent(post.content),
                }}
              />
            </article>

            <div className="mt-6 rounded-2xl border border-slate-200 bg-white px-5 py-4">
              <ArticleShareActions title={post.title} />
            </div>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <div className="mt-14 border-t border-primary/20 pt-10">
                <h2 className="mb-7 text-2xl font-bold text-slate-900">
                  مقالات ذات صلة
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedPosts.map((relatedPost) => (
                    <ScrollReveal key={relatedPost.slug}>
                    <Link
                      href={`/blog/${relatedPost.slug}`}
                      className="group block h-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                    >
                      <div className="relative aspect-[16/10] overflow-hidden">
                        <Image
                          src={relatedPost.image}
                          alt={relatedPost.imageAlt || relatedPost.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="mb-2 line-clamp-2 font-bold text-slate-900 transition-colors group-hover:text-[#8f7016]">
                          {relatedPost.title}
                        </h3>
                        <p className="line-clamp-2 text-sm leading-6 text-slate-600">
                          {relatedPost.excerpt}
                        </p>
                      </div>
                    </Link>
                    </ScrollReveal>
                  ))}
                </div>
              </div>
            )}

            {/* Back to Blog */}
            <div className="mt-12 text-center">
              <Link
                href="/blog"
                className="inline-flex min-h-12 items-center gap-2 rounded-full bg-primary px-6 py-3 font-bold text-white shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 hover:bg-primary/90"
              >
                <ChevronLeft size={20} />
                العودة إلى المدونة
              </Link>
            </div>
          </ScrollReveal>
        </section>
        <PublicReviewForm />
      </main>
      <Footer />
      <ContactButtons />
    </>
  )
}
