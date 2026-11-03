import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, CalendarDays } from 'lucide-react'
import { RelativePublicationTime } from '@/components/common/RelativePublicationTime'
import { ScrollReveal } from '@/components/common/ScrollReveal'
import { getPublishedArticles } from '@/lib/content-store'

export async function LatestArticlesSection() {
  const articles = (await getPublishedArticles())
    .filter((article) => article.slug.trim() && article.title.trim() && article.image.trim())
    .sort((first, second) => Date.parse(second.date) - Date.parse(first.date))
    .slice(0, 3)

  return (
    <section id="latest-articles" className="bg-[#f7f5ef] py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="mb-9 text-center">
            <p className="mb-2 text-sm font-bold text-[#8f7016]">من المدونة</p>
            <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">
              مقالات ونصائح حديثة
            </h2>
            <p className="mx-auto mt-3 max-w-2xl leading-7 text-slate-600">
              محتوى عملي يساعدك على اختيار حلول الواجهات المناسبة لمشروعك.
            </p>
        </ScrollReveal>

        {articles.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => {
              const date = new Date(article.date)
              const formattedDate = Number.isNaN(date.getTime())
                ? null
                : date.toLocaleDateString('ar-EG', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })
              return (
                <ScrollReveal key={article.slug} className="h-full">
                <article className="group min-w-0 h-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_12px_30px_rgba(31,41,55,0.07)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(31,41,55,0.14)]">
                  <Link
                    href={`/blog/${article.slug}`}
                    aria-label={`اقرأ مقال: ${article.title}`}
                    className="relative block aspect-[16/10] overflow-hidden bg-slate-100"
                  >
                    <Image
                      src={article.image}
                      alt={article.imageAlt || article.title}
                      fill
                      sizes="(max-width: 640px) 84vw, 360px"
                      loading="lazy"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <span className="absolute bottom-3 right-3 rounded-full border border-white/30 bg-slate-950/65 px-3 py-1 text-xs font-bold text-white backdrop-blur">
                      نصائح ومعلومات
                    </span>
                  </Link>
                  <div className="p-5 sm:p-6">
                    {formattedDate && (
                      <time
                        dateTime={date.toISOString()}
                        className="mb-3 inline-flex items-center gap-2 text-xs text-slate-500"
                      >
                        <CalendarDays size={14} aria-hidden="true" />
                        {formattedDate}
                      </time>
                    )}
                    <RelativePublicationTime
                      value={article.publishedAt ?? article.date}
                      prefix="نُشر "
                      className="mb-3 inline-block text-xs text-slate-500"
                    />
                    <h3 className="mb-2 text-lg font-bold leading-7 text-slate-900 [overflow-wrap:anywhere]">
                      <Link
                        href={`/blog/${article.slug}`}
                        className="transition-colors hover:text-primary"
                      >
                        {article.title}
                      </Link>
                    </h3>
                    <p className="line-clamp-3 break-words text-sm leading-7 text-slate-600 [overflow-wrap:anywhere]">
                      {article.excerpt}
                    </p>
                    <Link
                      href={`/blog/${article.slug}`}
                      className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#8f7016] transition-all hover:gap-3"
                    >
                      اقرأ المقال
                      <ArrowLeft size={15} aria-hidden="true" />
                    </Link>
                  </div>
                </article>
                </ScrollReveal>
              )
            })}
          </div>
        ) : (
          <p className="rounded-lg border border-dashed border-border p-8 text-center text-muted-foreground">
            ستظهر المقالات المنشورة هنا.
          </p>
        )}
        {articles.length > 0 && (
          <div className="mt-5 text-center">
            <Link
              href="/blog"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-7 py-3 font-bold text-white shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 hover:bg-primary/90"
            >
              تصفح المدونة وكل المقالات
              <ArrowLeft size={17} aria-hidden="true" />
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}