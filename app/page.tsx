import type { Metadata } from 'next'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ContactButtons } from '@/components/common/ContactButtons'
import { PublicReviewForm } from '@/components/common/PublicReviewForm'
import { Map } from '@/components/common/Map'
import { ScrollReveal } from '@/components/common/ScrollReveal'

import { HeroSlider } from '@/components/home/HeroSlider'
import { AboutSection } from '@/components/home/AboutSection'
import { StatsSection } from '@/components/home/StatsSection'
import { ModernFeaturesSection } from '@/components/home/ModernFeaturesSection'
import { ServicesSection } from '@/components/home/ServicesSection'
import { TeamSection } from '@/components/home/TeamSection'
import { PortfolioSection } from '@/components/home/PortfolioSection'
import { WhyChooseUs } from '@/components/home/WhyChooseUs'
import { TestimonialsSection } from '@/components/home/TestimonialsSection'
import { LatestArticlesSection } from '@/components/home/LatestArticlesSection'

import {
  SITE_NAME,
} from '@/lib/constants'

const SITE_URL = 'https://www.alforsancladding.com'

const PHONE_NUMBER = '01094656501'

const PHONE_LINK = 'tel:+201094656501'

const WHATSAPP_LINK = 'https://wa.me/201094656501'

export const metadata: Metadata = {
  title: 'واجهات زجاجية وكلادينج احترافي بالمنصورة',

  description:
    'شركة الفرسان متخصصة في تنفيذ واجهات الكلادينج والزجاج والكيرتن وول والزجاج الذكي المتغير وأعمال الألمنيوم والمطابخ في المنصورة والدقهلية والقاهرة.',

  keywords: [
    'الفرسان',
    'واجهات زجاجية',
    'الزجاج الذكي',
    'Smart Glass',
    'زجاج ذكي متغير الشفافية',
    'واجهات زجاجية بالمنصورة',
    'كلادينج',
    'كلادينج المنصورة',
    'تركيب واجهات كلادينج',
    'شركة كلادينج بالمنصورة',
    'واجهات كلادينج للمحلات',
    'واجهات كلادينج للفيلات',
    'واجهات كيرتن وول',
    'كيرتن وول المنصورة',
    'أبواب ألمنيوم',
    'شبابيك ألمنيوم',
    'أبواب وشبابيك PVC',
    'مطابخ ألمنيوم',
    'المنصورة',
    'الدقهلية',
    'القاهرة',
  ],

  alternates: {
    canonical: SITE_URL,
  },

  openGraph: {
    type: 'website',
    locale: 'ar_EG',
    url: SITE_URL,
    siteName: SITE_NAME,

    title:
      'الفرسان للواجهات الزجاجية والكلادينج بالمنصورة',

    description:
      'تنفيذ وتركيب واجهات الكلادينج والزجاج والكيرتن وول والزجاج الذكي وأعمال الألمنيوم والمطابخ بأعلى جودة.',

    images: [
      {
        url: `${SITE_URL}/logo.png`,
        width: 1200,
        height: 630,
        alt:
          'الفرسان للواجهات الزجاجية والكلادينج بالمنصورة',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',

    title:
      'الفرسان للواجهات الزجاجية والكلادينج',

    description:
      'واجهات كلادينج وواجهات زجاجية وكيرتن وول بالمنصورة والدقهلية والقاهرة.',

    images: [
      `${SITE_URL}/logo.png`,
    ],
  },
}

export default function Home() {
  return (
    <>
      <Header />

      <main className="bg-transparent">

        {/* Hero Slider */}
        <ScrollReveal>
          <HeroSlider />
        </ScrollReveal>

        {/* Stats Section */}
        <ScrollReveal>
          <StatsSection />
        </ScrollReveal>

        {/* Modern Features */}
        <ScrollReveal>
          <ModernFeaturesSection />
        </ScrollReveal>

        {/* About Section */}
        <ScrollReveal>
          <AboutSection />
        </ScrollReveal>

        {/* Services Section */}
        <ScrollReveal>
          <ServicesSection />
        </ScrollReveal>

        {/* Team Section */}
        <ScrollReveal>
          <TeamSection />
        </ScrollReveal>

        {/* Portfolio Showcase */}
        <ScrollReveal>
          <PortfolioSection />
        </ScrollReveal>

        {/* Why Choose Us */}
        <ScrollReveal>
          <WhyChooseUs />
        </ScrollReveal>

        {/* Testimonials */}
        <ScrollReveal>
          <TestimonialsSection />
        </ScrollReveal>

        {/* CTA Section */}
        <ScrollReveal>
          <section className="relative overflow-hidden bg-[#101820] py-16 text-white md:py-24">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(201,162,39,0.22),transparent_55%)]" />
            <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
              <p className="mb-3 text-sm font-bold tracking-[0.2em] text-primary">الفرسان</p>
              <h2 className="mb-4 text-3xl font-bold md:text-4xl">مستعد للبدء؟</h2>
              <p className="mx-auto mb-8 max-w-2xl text-lg text-white/80">
                تواصل معنا اليوم واحصل على عرض سعر خاص لمشروعك
              </p>

              <div className="flex flex-col justify-center gap-3 sm:flex-row sm:gap-4">
                <a
                  href={PHONE_LINK}
                  className="inline-flex min-h-12 items-center justify-center rounded-full bg-primary px-8 font-bold text-white shadow-[0_14px_34px_-12px_rgba(201,162,39,0.55)] transition hover:-translate-y-0.5 hover:bg-primary/90"
                  aria-label={`اتصل بالفرسان على الرقم ${PHONE_NUMBER}`}
                >
                  اتصل بنا
                </a>

                <a
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/25 bg-white/10 px-8 font-bold text-white backdrop-blur-md transition hover:border-white/40 hover:bg-white/15"
                  aria-label="تواصل مع الفرسان عبر واتساب"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                    className="size-5 shrink-0"
                  >
                    <path d="M19.05 4.91A9.82 9.82 0 0 0 12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01zm-7.01 15.24c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.26 8.26 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.83c.02 4.54-3.68 8.23-8.22 8.23zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.13-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.07-.11-.25-.16-.5-.28z" />
                  </svg>
                  تواصل عبر واتساب
                </a>
              </div>
            </div>
          </section>
        </ScrollReveal>

        <PublicReviewForm />

        {/* Latest Articles */}
        <ScrollReveal className="border-b border-primary/40">
          <LatestArticlesSection />
        </ScrollReveal>

        {/* Map */}
        <ScrollReveal>
          <Map />
        </ScrollReveal>

      </main>

      <ScrollReveal>
        <Footer />
      </ScrollReveal>

      <ContactButtons />
    </>
  )
}