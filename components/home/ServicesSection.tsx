import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft } from 'lucide-react'
import { services } from '@/data/services'

export function ServicesSection() {
  return (
    <section id="services" className="bg-[#f7f5ef] py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-9 text-center">
          <p className="mb-2 text-sm font-bold text-[#8f7016]">حلول متكاملة</p>
          <h2 className="mb-4 text-3xl font-bold text-slate-900 md:text-4xl">
            خدماتنا المتميزة
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-slate-600">
            من الكلادينج والواجهات الزجاجية إلى الزجاج الذكي المتغير، نقدم حلولًا متكاملة لمشروعك
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.slice(0, 6).map((service) => (
            <Link
              key={service.id}
              href={`/services/${service.slug}`}
              className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_10px_28px_rgba(31,41,55,0.07)] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative h-48 overflow-hidden bg-slate-100">
                <Image
                  src={service.image}
                  alt={service.name}
                  fill
                  sizes="(max-width: 640px) 82vw, 330px"
                  loading="lazy"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-transparent to-transparent" />
              </div>
              <div className="p-5">
                <h3 className="mb-2 text-lg font-bold text-slate-900 transition-colors group-hover:text-[#8f7016]">
                  {service.name}
                </h3>
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

        <div className="text-center">
          <Link
            href="/services"
            className="mt-5 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-7 py-3 font-bold text-white shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 hover:bg-primary/90"
          >
            عرض جميع الخدمات
            <ArrowLeft size={20} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  )
}
