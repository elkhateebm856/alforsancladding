import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, CalendarDays } from 'lucide-react'
import { getPublishedArticles } from '@/lib/content-store'
import { formatRelativeTime } from '@/lib/date-format'

export async function LatestArticlesSection() {
  const articles = (await getPublishedArticles())
    .filter((article) => article.slug.trim() && article.title.trim() && article.image.trim())
    .sort((first, second) => Date.parse(second.date) - Date.parse(first.date))
    .slice(0, 3)

  return (
    <section id="latest-articles" className="bg-white py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-bold text-primary">من المدونة</p>
            <h2 className="text-3xl font-bold text-foreground md:text-4xl">
              مقالات ونصائح حديثة
            </h2>
          </div>
          <Link
            href="/blog"
            className="inline-flex min-h-11 items-center gap-2 self-start rounded-md border border-primary/30 px-4 py-2.5 font-bold text-primary transition-colors hover:bg-primary/10 sm:self-auto"
          >
            كل المقالات
            <ArrowLeft size={17} aria-hidden="true" />
          </Link>
        </div>

        {articles.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-3">
            {articles.map((article) => {
              const date = new Date(article.date)
              const formattedDate = Number.isNaN(date.getTime())
                ? null
                : date.toLocaleDateString('ar-EG', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })
              const relativePublicationTime = formatRelativeTime(
                article.publishedAt ?? article.date,
              )

              return (
                <article
                  key={article.slug}
                  className="group min-w-0 overflow-hidden rounded-lg border border-border bg-card transition-shadow hover:shadow-lg"
                >
                  <Link
                    href={`/blog/${article.slug}`}
                    aria-label={`اقرأ مقال: ${article.title}`}
                    className="relative block aspect-[16/10] overflow-hidden bg-muted"
                  >
                    <Image
                      src={article.image}
                      alt={article.imageAlt || article.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </Link>
                  <div className="p-5">
                    {formattedDate && (
                      <time
                        dateTime={date.toISOString()}
                        className="mb-3 inline-flex items-center gap-2 text-xs text-muted-foreground"
                      >
                        <CalendarDays size={14} aria-hidden="true" />
                        {formattedDate}
                      </time>
                    )}
                    {relativePublicationTime && (
                      <span className="mb-3 inline-block text-xs text-muted-foreground">
                        نُشر {relativePublicationTime}
                      </span>
                    )}
                    <h3 className="mb-2 text-lg font-bold leading-7 text-foreground [overflow-wrap:anywhere]">
                      <Link
                        href={`/blog/${article.slug}`}
                        className="transition-colors hover:text-primary"
                      >
                        {article.title}
                      </Link>
                    </h3>
                    <p className="line-clamp-3 break-words text-sm leading-7 text-muted-foreground [overflow-wrap:anywhere]">
                      {article.excerpt}
                    </p>
                    <Link
                      href={`/blog/${article.slug}`}
                      className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-primary transition-colors hover:text-amber-800"
                    >
                      اقرأ المقال
                      <ArrowLeft size={15} aria-hidden="true" />
                    </Link>
                  </div>
                </article>
              )
            })}
          </div>
        ) : (
          <p className="rounded-lg border border-dashed border-border p-8 text-center text-muted-foreground">
            ستظهر المقالات المنشورة هنا.
          </p>
        )}
      </div>
    </section>
  )
}