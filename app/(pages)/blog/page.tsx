import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Calendar, User, ArrowLeft } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ContactButtons } from '@/components/common/ContactButtons'
import { PublicReviewForm } from '@/components/common/PublicReviewForm'
import { Hero } from '@/components/common/Hero'
import { RelativePublicationTime } from '@/components/common/RelativePublicationTime'
import { getPublishedArticles } from '@/lib/content-store'
import { SITE_NAME } from '@/lib/constants'

export const revalidate = 300

export const metadata: Metadata = {
  title: `المدونة | ${SITE_NAME}`,
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
        {/* Hero */}
        <Hero
          title="المدونة"
          subtitle="اقرأ أحدث المقالات والنصائح من خبرائنا"
          backgroundImage="/hero1.jpg"
        />

        {/* Blog Posts */}
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {sortedBlogPosts.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center shadow-sm">
                <h2 className="text-2xl font-bold text-foreground mb-3">
                  لا توجد مقالات حالياً
                </h2>
                <p className="text-muted-foreground text-lg leading-8">
                  سنضيف مقالات جديدة ومفيدة عن الواجهات الزجاجية والكلادينج قريبًا.
                </p>
              </div>
            ) : (
              <>
                {/* Featured Post */}
                {sortedBlogPosts.length > 0 && (
                  <div className="mb-16">
                    <h2 className="text-2xl font-bold text-foreground mb-8">
                      آخر المقالات
                    </h2>
                    <div className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Featured Image */}
                        <div className="lg:col-span-1 relative h-72 lg:h-full">
                          <Image
                            src={sortedBlogPosts[0].image}
                            alt={sortedBlogPosts[0].title}
                            fill
                            className="object-cover"
                          />
                        </div>

                        {/* Featured Content */}
                        <div className="lg:col-span-2 p-8 flex flex-col justify-between">
                          <div>
                            <h3 className="text-2xl font-bold text-foreground mb-3">
                              {sortedBlogPosts[0].title}
                            </h3>
                            <p className="text-muted-foreground mb-6 line-clamp-2">
                              {sortedBlogPosts[0].excerpt}
                            </p>
                          </div>

                          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                            <div className="flex items-center gap-2">
                              <Calendar size={16} />
                              {new Date(sortedBlogPosts[0].date).toLocaleDateString(
                                'ar-SA'
                              )}
                            </div>
                            <RelativePublicationTime
                              value={
                                sortedBlogPosts[0].publishedAt ??
                                sortedBlogPosts[0].date
                              }
                              prefix="نُشر "
                            />
                            <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 ${sortedBlogPosts[0].authorAccentClass ?? 'bg-amber-100 text-amber-700'}`}>
                              <User size={16} />
                              {sortedBlogPosts[0].author}
                            </div>
                          </div>

                          <Link
                            href={`/blog/${sortedBlogPosts[0].slug}`}
                            className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
                          >
                            اقرأ المزيد
                            <ArrowLeft size={18} />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Other Posts */}
                {sortedBlogPosts.length > 1 && (
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-8">
                      مقالات أخرى
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {sortedBlogPosts.slice(1).map((post) => (
                        <Link
                          key={post.slug}
                          href={`/blog/${post.slug}`}
                          className="group bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300"
                        >
                          {/* Image */}
                          <div className="relative h-48 overflow-hidden">
                            <Image
                              src={post.image}
                              alt={post.title}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                          </div>

                          {/* Content */}
                          <div className="p-6">
                            <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                              {post.title}
                            </h3>
                            <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                              {post.excerpt}
                            </p>

                            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Calendar size={14} />
                                {new Date(post.date).toLocaleDateString('ar-SA')}
                              </div>
                              <RelativePublicationTime
                                value={post.publishedAt ?? post.date}
                                prefix="نُشر "
                              />
                              <div className={`inline-flex items-center gap-1 rounded-full px-2 py-1 ${post.authorAccentClass ?? 'bg-amber-100 text-amber-700'}`}>
                                <User size={14} />
                                {post.author}
                              </div>
                            </div>
                          </div>
                        </Link>
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
