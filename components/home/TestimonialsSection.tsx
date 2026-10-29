import { ArrowLeft, Star } from 'lucide-react'
import Link from 'next/link'
import { getApprovedTestimonials } from '@/lib/content-store'

export async function TestimonialsSection() {
  const testimonials = await getApprovedTestimonials()

  return (
    <section id="testimonials" className="bg-amber-50/50 py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            آراء عملائنا
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            نفخر بثقة عملائنا، وهذه بعض آرائهم حول جودة خدماتنا واحترافية فريق العمل.
          </p>
        </div>

        {/* Testimonials Grid */}
        {testimonials.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border bg-card p-8 text-center text-muted-foreground">
            نعمل دائمًا على تقديم أفضل خدمة لعملائنا.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="min-w-0 max-w-full overflow-hidden bg-card border border-border rounded-xl p-6 hover:shadow-xl hover:border-primary/30 transition-all duration-300"
            >
              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className="fill-primary text-primary"
                  />
                ))}
              </div>

              {/* Testimonial */}
              {testimonial.title && (
                <h3 className="mb-2 min-w-0 max-w-full break-words font-bold text-foreground [overflow-wrap:anywhere]">{testimonial.title}</h3>
              )}
              <p className="mb-6 min-w-0 max-w-full break-words text-muted-foreground leading-7 [overflow-wrap:anywhere]">
                &ldquo;{testimonial.text}&rdquo;
              </p>

              {/* Divider */}
              <div className="w-12 h-1 bg-primary rounded-full mb-4"></div>

              {/* Author */}
              <div>
                <h4 className="min-w-0 max-w-full break-words font-bold text-lg text-foreground [overflow-wrap:anywhere]">
                  {testimonial.name}
                </h4>

                <p className="text-sm text-muted-foreground mt-1">
                  {testimonial.position}
                </p>
              </div>
            </div>
            ))}
          </div>
        )}

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link
            href="#public-review-title"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-amber-700/30 bg-white px-5 py-3 font-bold text-amber-900 transition-colors hover:bg-amber-100"
          >
            شاركنا رأيك
            <ArrowLeft size={16} aria-hidden="true" />
          </Link>
          <Link
            href="/reviews"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-primary px-5 py-3 font-bold text-white transition-colors hover:bg-primary/90"
          >
            كل التقييمات
            <ArrowLeft size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  )
}