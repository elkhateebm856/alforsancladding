import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Calendar, User, ArrowLeft, BookOpen } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ContactButtons } from '@/components/common/ContactButtons'
import { PublicReviewForm } from '@/components/common/PublicReviewForm'
import { ScrollReveal } from '@/components/common/ScrollReveal'
import { RelativePublicationTime } from '@/components/common/RelativePublicationTime'
import { getPublishedArticles } from '@/lib/content-store'
import { SITE_NAME } from '@/lib/constants'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'المدونة',
  description: 'اقرأ أحدث المقالات والنصائح عن الواجهات الزجاجية والكلادينج',
  alternates: {
    canonical: 'https://www.alforsancladding.com/blog',
  },
  openGraph: {
    title: `المدونة | ${SITE_NAME}`,
    description: 'اقرأ أحدث المقالات والنصائح عن الواجهات الزجاجية والكلادينج',
    url: 'https://www.alforsancladding.com/blog',
    type: 'website',
    images: [
      {
        url: 'https://www.alforsancladding.com/logo.png',
        width: 1200,
        height: 630,
        alt: 'المدونة الخاصة بشركة الفرسان',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `المدونة | ${SITE_NAME}`,
    description: 'اقرأ أحدث المقالات والنصائح عن الواجهات الزجاجية والكلادينج',
    images: ['https://www.alforsancladding.com/logo.png'],
  },
}

export default async function BlogPage() {
  const posts = await getPublishedArticles()
  const sortedBlogPosts = posts
    .filter((post) => post.slug.trim() && post.title.trim() && post.image.trim())
    .map((post, index) => ({ post, index }))
    .sort((firstPost, secondPost) => {
      const featuredPostSlug = 'experts-cladding-facades-egypt'

      if (firstPost.post.slug === featuredPostSlug) return -1
      if (secondPost.post.slug === featuredPostSlug) return 1

      const dateDifference =
        new Date(secondPost.post.date).getTime() -
        new Date(firstPost.post.date).getTime()

      return dateDifference !== 0
        ? dateDifference
        : secondPost.index - firstPost.index
    })
    .map(({ post }) => post)
  return (
    <>
      <Header />
      <main className="bg-background">
        <section className="relative overflow-hidden border-b border-primary/20 bg-[#f7f5ef] py-14 md:py-20">
          <div className="pointer-events-none absolute -right-28 -top-32 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-40 -left-20 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
          <ScrollReveal className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-white/80 px-4 py-2 text-sm font-bold text-[#8f7016] shadow-sm">
              <BookOpen size={17} aria-hidden="true" />
              معرفة تساعدك على الاختيار
            </span>
            <h1 className="mb-4 text-4xl font-extrabold text-slate-900 md:text-5xl">
              مدونة <span className="text-primary">الفرسان</span>
            </h1>
            <p className="mx-auto max-w-2xl text-base leading-8 text-slate-600 md:text-lg">
              مقالات ونصائح عملية عن الواجهات الزجاجية والكلادينج والزجاج الذكي،
              من خبرة فريقنا في تنفيذ المشاريع.
            </p>
          </ScrollReveal>
        </section>

        {/* Blog Posts */}
        <section className="bg-white py-14 md:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {sortedBlogPosts.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-[#f7f5ef] p-10 text-center shadow-sm">
                <h2 className="mb-3 text-2xl font-bold text-slate-900">
                  لا توجد مقالات حالياً
                </h2>
                <p className="text-lg leading-8 text-slate-600">
                  سنضيف مقالات جديدة ومفيدة عن الواجهات الزجاجية والكلادينج قريبًا.
                </p>
              </div>
            ) : (
              <>
                {/* Featured Post */}
                {sortedBlogPosts.length > 0 && (
                  <ScrollReveal className="mb-16">
                    <h2 className="mb-7 text-2xl font-bold text-slate-900 md:text-3xl">
                      آخر المقالات
                    </h2>
                    <div className="group overflow-hidden rounded-3xl border border-slate-200 bg-[#f7f5ef] shadow-[0_16px_44px_rgba(31,41,55,0.10)] transition-shadow duration-300 hover:shadow-[0_22px_55px_rgba(31,41,55,0.16)]">
                      <div className="grid grid-cols-1 lg:grid-cols-2">
                        {/* Featured Image */}
                        <Link
                          href={`/blog/${sortedBlogPosts[0].slug}`}
                          aria-label={`اقرأ مقال: ${sortedBlogPosts[0].title}`}
                          className="relative block min-h-64 overflow-hidden bg-slate-200 lg:min-h-[390px]"
                        >
                          <Image
                            src={sortedBlogPosts[0].image}
                            alt={sortedBlogPosts[0].imageAlt || sortedBlogPosts[0].title}
                            fill
                            sizes="(max-width: 1024px) 100vw, 50vw"
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                          <span className="absolute right-5 top-5 rounded-full border border-white/30 bg-slate-950/65 px-4 py-2 text-xs font-bold text-white backdrop-blur">
                            المقال الأحدث
                          </span>
                        </Link>

                        {/* Featured Content */}
                        <div className="flex flex-col justify-center p-6 sm:p-9 lg:p-12">
                          <div>
                            <h3 className="mb-4 text-2xl font-extrabold leading-tight text-slate-900 sm:text-3xl">
                              {sortedBlogPosts[0].title}
                            </h3>
                            <p className="mb-7 line-clamp-3 text-base leading-8 text-slate-600">
                              {sortedBlogPosts[0].excerpt}
                            </p>
                          </div>

                          <div className="mb-6 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                            <div className="flex items-center gap-2">
                              <Calendar size={16} aria-hidden="true" />
                              {new Date(sortedBlogPosts[0].date).toLocaleDateString(
                                'ar-EG',
                                { year: 'numeric', month: 'long', day: 'numeric' },
                              )}
                            </div>
                            <RelativePublicationTime
                              value={
                                sortedBlogPosts[0].publishedAt ??
                                sortedBlogPosts[0].date
                              }
                              prefix="نُشر "
                            />
                            <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 ${sortedBlogPosts[0].authorAccentClass ?? 'bg-amber-100 text-amber-700'}`}>
                              <User size={16} aria-hidden="true" />
                              {sortedBlogPosts[0].author}
                            </div>
                          </div>

                          <Link
                            href={`/blog/${sortedBlogPosts[0].slug}`}
                            className="inline-flex min-h-11 w-fit items-center gap-2 rounded-full bg-primary px-5 py-2.5 font-bold text-white transition-all hover:-translate-y-0.5 hover:gap-3 hover:bg-primary/90"
                          >
                            اقرأ المزيد
                            <ArrowLeft size={18} aria-hidden="true" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </ScrollReveal>
                )}

                {/* Other Posts */}
                {sortedBlogPosts.length > 1 && (
                  <div>
                    <h2 className="mb-7 text-2xl font-bold text-slate-900 md:text-3xl">
                      مقالات أخرى
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {sortedBlogPosts.slice(1).map((post) => (
                        <ScrollReveal key={post.slug}>
                        <Link
                          href={`/blog/${post.slug}`}
                          className="group block h-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_12px_30px_rgba(31,41,55,0.07)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(31,41,55,0.14)]"
                        >
                          {/* Image */}
                          <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                            <Image
                              src={post.image}
                              alt={post.imageAlt || post.title}
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                              className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                          </div>

                          {/* Content */}
                          <div className="p-5 sm:p-6">
                            <h3 className="mb-3 line-clamp-2 text-lg font-bold leading-7 text-slate-900 transition-colors group-hover:text-[#8f7016]">
                              {post.title}
                            </h3>
                            <p className="mb-5 line-clamp-3 text-sm leading-7 text-slate-600">
                              {post.excerpt}
                            </p>

                            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                              <div className="flex items-center gap-1">
                                <Calendar size={14} aria-hidden="true" />
                                {new Date(post.date).toLocaleDateString('ar-EG')}
                              </div>
                              <RelativePublicationTime
                                value={post.publishedAt ?? post.date}
                                prefix="نُشر "
                              />
                              <div className={`inline-flex items-center gap-1 rounded-full px-2 py-1 ${post.authorAccentClass ?? 'bg-amber-100 text-amber-700'}`}>
                                <User size={14} aria-hidden="true" />
                                {post.author}
                              </div>
                            </div>
                            <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#8f7016] transition-all group-hover:gap-3">
                              اقرأ المقال
                              <ArrowLeft size={15} aria-hidden="true" />
                            </span>
                          </div>
                        </Link>
                        </ScrollReveal>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
        <PublicReviewForm />
      </main>
      <Footer />
      <ContactButtons />
    </>
  )
}
