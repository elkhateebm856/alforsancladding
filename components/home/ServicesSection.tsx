import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft } from 'lucide-react'
import { services } from '@/data/services'

export function ServicesSection() {
  const featuredServices = services.slice(0, 6)

  return (
    <section id="services" className="bg-white py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            خدماتنا المتميزة
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            نقدم مجموعة شاملة من الخدمات المتخصصة في الواجهات الزجاجية والكلادينج
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {featuredServices.map((service) => (
            <Link
              key={service.id}
              href={`/services/${service.slug}`}
              className="group bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={service.image}
                  alt={service.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {service.name}
                </h3>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                  {service.shortDescription}
                </p>

                {/* Features */}
                <ul className="space-y-2 mb-4">
                  {service.features.slice(0, 2).map((feature, idx) => (
                    <li key={idx} className="text-sm text-muted-foreground flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <div className="flex items-center gap-2 text-primary font-semibold group-hover:gap-3 transition-all">
                  اعرف المزيد
                  <ArrowLeft size={18} />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors"
          >
            عرض جميع الخدمات
            <ArrowLeft size={20} />
          </Link>
        </div>
      </div>
    </section>
  )
}
