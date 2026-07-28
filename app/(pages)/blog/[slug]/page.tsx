import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, Calendar, User, Clock } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ContactButtons } from '@/components/common/ContactButtons'
import { Hero } from '@/components/common/Hero'
import { blogPosts } from '@/data/blog'
import { SITE_NAME } from '@/lib/constants'

interface BlogPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata(
  { params }: BlogPageProps
): Promise<Metadata> {
  const { slug } = await params
  const post = blogPosts.find((p) => p.slug === slug)

  if (!post) {
    return {
      title: 'مقالة غير موجودة',
    }
  }

  return {
    title: `${post.title} | ${SITE_NAME}`,
    description: post.excerpt,
  }
}

export default async function BlogPostPage({ params }: BlogPageProps) {
  const { slug } = await params
  const post = blogPosts.find((p) => p.slug === slug)

  if (!post) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">مقالة غير موجودة</h1>
            <Link href="/blog" className="text-primary hover:underline">
              العودة إلى المدونة
            </Link>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  const relatedPosts = blogPosts
    .filter((p) => p.category === post.category && p.id !== post.id)
    .slice(0, 3)

  return (
    <>
      <Header />
      <main className="bg-background">
        {/* Hero */}
        <Hero
          title={post.title}
          subtitle={post.excerpt}
          backgroundImage={post.image}
        />

        {/* Breadcrumb */}
        <div className="bg-muted py-4">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-primary">
                الرئيسية
              </Link>
              <ChevronLeft size={16} />
              <Link href="/blog" className="hover:text-primary">
                المدونة
              </Link>
              <ChevronLeft size={16} />
              <span className="text-foreground">{post.title}</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            {/* Article Header */}
            <div className="mb-8">
              <div className="mb-4 inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                {post.category}
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
                <div className="flex items-center gap-2">
                  <User size={16} />
                  <span>{post.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  <time dateTime={post.date}>
                    {new Date(post.date).toLocaleDateString('ar-SA', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} />
                  <span>{post.readingTime} دقائق قراءة</span>
                </div>
              </div>
            </div>

            {/* Featured Image */}
            <div className="relative w-full h-96 mb-12 rounded-lg overflow-hidden">
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover"
              />
            </div>

            {/* Article Content */}
            <article className="prose prose-lg max-w-none">
              <div className="text-lg text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {post.content}
              </div>
            </article>

            {/* Tags/Category */}
            <div className="mt-12 pt-8 border-t border-border">
              <h3 className="font-semibold text-foreground mb-4">الفئة:</h3>
              <Link
                href={`/blog?category=${post.category}`}
                className="inline-block px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors shadow-md"
              >
                {post.category}
              </Link>
            </div>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <div className="mt-16 pt-8 border-t border-border">
                <h2 className="text-2xl font-bold text-foreground mb-8">
                  مقالات ذات صلة
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedPosts.map((relatedPost) => (
                    <Link
                      key={relatedPost.id}
                      href={`/blog/${relatedPost.slug}`}
                      className="group bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-all"
                    >
                      <div className="relative h-40 overflow-hidden">
                        <Image
                          src={relatedPost.image}
                          alt={relatedPost.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                          {relatedPost.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {relatedPost.excerpt}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Back to Blog */}
            <div className="mt-12 text-center">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors"
              >
                <ChevronLeft size={20} />
                العودة إلى المدونة
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <ContactButtons />
    </>
  )
}
