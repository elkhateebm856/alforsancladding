import { ArrowLeft, Star } from 'lucide-react'
import Link from 'next/link'
import { getApprovedTestimonials } from '@/lib/content-store'

export async function TestimonialsSection() {
  const testimonials = await getApprovedTestimonials()

  return (
    <section id="testimonials" className="section-light py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <p className="section-eyebrow">آراء العملاء</p>
          <h2 className="section-title mb-4">آراء عملائنا</h2>
          <p className="section-lead">
            نفخر بثقة عملائنا، وهذه بعض آرائهم حول جودة خدماتنا واحترافية فريق العمل.
          </p>
        </div>

        {testimonials.length === 0 ? (
          <p className="surface-card rounded-2xl border-dashed p-8 text-center text-slate-500">
            نعمل دائمًا على تقديم أفضل خدمة لعملائنا.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="surface-card min-w-0 max-w-full overflow-hidden rounded-2xl p-6 transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_45px_-24px_rgba(15,23,42,0.28)]"
              >
                <div className="mb-4 flex gap-1">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} size={18} className="fill-primary text-primary" />
                  ))}
                </div>

                {testimonial.title && (
                  <h3 className="mb-2 min-w-0 max-w-full break-words font-bold text-slate-900 [overflow-wrap:anywhere]">
                    {testimonial.title}
                  </h3>
                )}
                <p className="mb-6 min-w-0 max-w-full break-words leading-7 text-slate-600 [overflow-wrap:anywhere]">
                  &ldquo;{testimonial.text}&rdquo;
                </p>

                <div className="mb-4 h-1 w-12 rounded-full bg-primary" />

                <div>
                  <h4 className="min-w-0 max-w-full break-words text-lg font-bold text-slate-900 [overflow-wrap:anywhere]">
                    {testimonial.name}
                  </h4>
                  <p className="mt-1 text-sm text-slate-500">{testimonial.position}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link href="#public-review-title" className="btn-secondary">
            شاركنا رأيك
            <ArrowLeft size={16} aria-hidden="true" />
          </Link>
          <Link href="/reviews" className="btn-primary">
            كل التقييمات
            <ArrowLeft size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  )
}
