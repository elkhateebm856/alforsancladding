import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft } from 'lucide-react'
import { services } from '@/data/services'

export function ServicesSection() {
  return (
    <section id="services" className="section-glass relative py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center md:mb-12">
          <p className="section-eyebrow">حلول متكاملة</p>
          <h2 className="section-title mb-3">خدماتنا المتميزة</h2>
          <p className="section-lead">
            من الكلادينج والواجهات الزجاجية إلى الزجاج الذكي المتغير، نقدم حلولًا متكاملة لمشروعك
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {services.slice(0, 6).map((service) => (
            <Link
              key={service.id}
              href={`/services/${service.slug}`}
              className="glass-panel group overflow-hidden rounded-2xl transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_-22px_rgba(15,23,42,0.35)]"
            >
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={service.image}
                  alt={service.name}
                  fill
                  sizes="(max-width: 640px) 82vw, 330px"
                  loading="lazy"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-slate-950/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <h3 className="text-lg font-bold text-white drop-shadow-sm">
                    {service.name}
                  </h3>
                </div>
              </div>
              <div className="p-5">
                <p className="mb-4 line-clamp-2 min-h-12 text-sm leading-6 text-slate-600">
                  {service.shortDescription}
                </p>
                <ul className="mb-4 space-y-2">
                  {service.features.slice(0, 2).map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-slate-600">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <span className="inline-flex items-center gap-2 font-bold text-[#8f7016] transition-all group-hover:gap-3">
                  اعرف المزيد
                  <ArrowLeft size={18} aria-hidden="true" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link href="/services" className="btn-primary min-h-12 px-7">
            عرض جميع الخدمات
            <ArrowLeft size={20} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  )
}
