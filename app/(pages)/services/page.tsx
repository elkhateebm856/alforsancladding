import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ContactButtons } from '@/components/common/ContactButtons'
import { PublicReviewForm } from '@/components/common/PublicReviewForm'
import { Hero } from '@/components/common/Hero'
import { services } from '@/data/services'
import { SITE_NAME } from '@/lib/constants'

export const metadata: Metadata = {
  title: `الخدمات | ${SITE_NAME}`,
  description: 'تصفح جميع خدماتنا المتخصصة في الواجهات الزجاجية والكلادينج',
  keywords: ['خدمات', 'واجهات', 'كلادينج', 'زجاج'],
  alternates: {
    canonical: 'https://www.alforsancladding.com/services',
  },
  openGraph: {
    title: `الخدمات | ${SITE_NAME}`,
    description: 'تصفح جميع خدماتنا المتخصصة في الواجهات الزجاجية والكلادينج',
    url: 'https://www.alforsancladding.com/services',
    type: 'website',
    images: [
      {
        url: 'https://www.alforsancladding.com/logo.png',
        width: 1200,
        height: 630,
        alt: 'خدمات شركة الفرسان للواجهات الزجاجية والكلادينج',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `الخدمات | ${SITE_NAME}`,
    description: 'تصفح جميع خدماتنا المتخصصة في الواجهات الزجاجية والكلادينج',
    images: ['https://www.alforsancladding.com/logo.png'],
  },
}

export default function ServicesPage() {
  return (
    <>
      <Header />
      <main className="bg-background">
        {/* Hero */}
        <Hero
          title="جميع خدماتنا"
          subtitle="تصفح كل ما نقدمه من حلول متخصصة"
          backgroundImage="/تركيب كلادينج بالمنصورة1.png"
        />

        {/* Services Grid */}
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
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
                    <div className="mb-2 inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                      {service.category}
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {service.name}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {service.shortDescription}
                    </p>

                    {/* Features */}
                    <ul className="space-y-2 mb-4">
                      {service.features.slice(0, 2).map((feature, idx) => (
                        <li
                          key={idx}
                          className="text-sm text-muted-foreground flex items-center gap-2"
                        >
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
          </div>
        </section>
        <PublicReviewForm />
      </main>
      <Footer />
      <ContactButtons />
    </>
  )
}
