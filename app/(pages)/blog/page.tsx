import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Calendar, User, Clock, ArrowLeft } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ContactButtons } from '@/components/common/ContactButtons'
import { Hero } from '@/components/common/Hero'
import { blogPosts } from '@/data/blog'
import { SITE_NAME } from '@/lib/constants'

export const metadata: Metadata = {
  title: `المدونة | ${SITE_NAME}`,
  description: 'اقرأ أحدث المقالات والنصائح عن الواجهات الزجاجية والكلادينج',
}

export default function BlogPage() {
  return (
    <>
      <Header />
      <main className="bg-background">
        {/* Hero */}
        <Hero
          title="المدونة"
          subtitle="اقرأ أحدث المقالات والنصائح من خبرائنا"
          backgroundImage="https://images.unsplash.com/photo-1487215078519-a680043e092e?w=1200"
        />

        {/* Blog Posts */}
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Featured Post */}
            {blogPosts.length > 0 && (
              <div className="mb-16">
                <h2 className="text-2xl font-bold text-foreground mb-8">
                  آخر المقالات
                </h2>
                <div className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Featured Image */}
                    <div className="lg:col-span-1 relative h-72 lg:h-full">
                      <Image
                        src={blogPosts[0].image}
                        alt={blogPosts[0].title}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Featured Content */}
                    <div className="lg:col-span-2 p-8 flex flex-col justify-between">
                      <div>
                        <div className="mb-4 inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                          {blogPosts[0].category}
                        </div>
                        <h3 className="text-2xl font-bold text-foreground mb-3">
                          {blogPosts[0].title}
                        </h3>
                        <p className="text-muted-foreground mb-6 line-clamp-2">
                          {blogPosts[0].excerpt}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-2">
                          <Calendar size={16} />
                          {new Date(blogPosts[0].date).toLocaleDateString(
                            'ar-SA'
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <User size={16} />
                          {blogPosts[0].author}
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock size={16} />
                          {blogPosts[0].readingTime} دقائق
                        </div>
                      </div>

                      <Link
                        href={`/blog/${blogPosts[0].slug}`}
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
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-8">
                مقالات أخرى
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogPosts.slice(1).map((post) => (
                  <Link
                    key={post.id}
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
                      <div className="mb-2 inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                        {post.category}
                      </div>
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
                        <div className="flex items-center gap-1">
                          <Clock size={14} />
                          {post.readingTime} دقائق
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <ContactButtons />
    </>
  )
}
