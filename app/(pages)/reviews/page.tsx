import type { Metadata } from 'next'
import { Star } from 'lucide-react'
import { ContactButtons } from '@/components/common/ContactButtons'
import { PublicReviewForm } from '@/components/common/PublicReviewForm'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { getApprovedTestimonials } from '@/lib/content-store'
import { SITE_NAME } from '@/lib/constants'

export const revalidate = 300

const reviewsTitle = 'تقييمات العملاء | شركة الفرسان للواجهات الزجاجية والكلادينج'
const reviewsDescription =
  'اقرأ آراء وتقييمات عملاء شركة الفرسان عن خدمات الواجهات الزجاجية والكلادينج، وشاركنا تجربتك.'

export const metadata: Metadata = {
  title: {
    absolute: reviewsTitle,
  },
  description: reviewsDescription,
  alternates: {
    canonical: 'https://www.alforsancladding.com/reviews',
  },
  openGraph: {
    title: reviewsTitle,
    description: reviewsDescription,
    url: 'https://www.alforsancladding.com/reviews',
    siteName: SITE_NAME,
    type: 'website',
    locale: 'ar_EG',
    images: [
      {
        url: 'https://www.alforsancladding.com/logo.png',
        width: 1200,
        height: 630,
        alt: 'تقييمات عملاء شركة الفرسان',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: reviewsTitle,
    description: reviewsDescription,
    images: ['https://www.alforsancladding.com/logo.png'],
  },
}

export default async function ReviewsPage() {
  const testimonials = await getApprovedTestimonials()

  return (
    <>
      <Header />
      <main className="bg-background">
        <section className="border-b border-primary/40 bg-amber-50/60 py-14 md:py-20">
          <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
            <p className="mb-3 text-sm font-bold text-primary">تجارب حقيقية</p>
            <h1 className="text-3xl font-extrabold text-foreground md:text-5xl">
              آراء عملاء الفرسان
            </h1>
            <p className="mx-auto mt-4 max-w-2xl leading-8 text-muted-foreground">
              نعتز بثقة عملائنا وبكل تجربة يشاركونها معنا.
            </p>
            <p className="mt-5 text-sm font-semibold text-amber-900">
              {testimonials.length} تقييم معتمد
            </p>
          </div>
        </section>

        <section className="py-14 md:py-20" aria-label="التقييمات المعتمدة">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {testimonials.length > 0 ? (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {testimonials.map((testimonial) => (
                  <article
                    key={testimonial.id}
                    className="min-w-0 rounded-lg border border-border bg-card p-6 shadow-sm"
                  >
                    <div
                      role="img"
                      aria-label={`${testimonial.rating} من 5 نجوم`}
                      className="mb-4 flex gap-1 text-primary"
                    >
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={18}
                          className={star <= testimonial.rating ? 'fill-primary' : 'text-muted-foreground/30'}
                          aria-hidden="true"
                        />
                      ))}
                    </div>
                    {testimonial.title && (
                      <h2 className="mb-2 break-words font-bold text-foreground [overflow-wrap:anywhere]">
                        {testimonial.title}
                      </h2>
                    )}
                    <p className="mb-6 break-words leading-8 text-muted-foreground [overflow-wrap:anywhere]">
                      “{testimonial.text}”
                    </p>
                    <div className="border-t border-border pt-4">
                      <p className="break-words font-bold text-foreground [overflow-wrap:anywhere]">
                        {testimonial.name}
                      </p>
                      {testimonial.position && (
                        <p className="mt-1 text-sm text-muted-foreground">
                          {testimonial.position}
                        </p>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <p className="rounded-lg border border-dashed border-border p-8 text-center text-muted-foreground">
                لا توجد تقييمات معتمدة للعرض حاليًا.
              </p>
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