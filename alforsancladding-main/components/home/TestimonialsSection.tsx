'use client'

import { Star } from 'lucide-react'
import { testimonials } from '@/data/testimonials'

export function TestimonialsSection() {
  return (
    <section className="py-16 md:py-24 bg-background">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-card border border-border rounded-xl p-6 hover:shadow-xl hover:border-primary/30 transition-all duration-300"
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
              <p className="text-muted-foreground leading-7 mb-6">
                "{testimonial.text}"
              </p>

              {/* Divider */}
              <div className="w-12 h-1 bg-primary rounded-full mb-4"></div>

              {/* Author */}
              <div>
                <h4 className="font-bold text-lg text-foreground">
                  {testimonial.name}
                </h4>

                <p className="text-sm text-muted-foreground mt-1">
                  {testimonial.position}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}