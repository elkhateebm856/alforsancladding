import type { Metadata } from 'next'
import Image from 'next/image'

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

      <main className="bg-background">

        {/* Hero Slider */}
        <ScrollReveal className="border-b border-primary/40">
          <HeroSlider />
        </ScrollReveal>

        {/* Stats Section */}
        <ScrollReveal className="border-b border-primary/40">
          <StatsSection />
        </ScrollReveal>

        {/* Modern Features */}
        <ScrollReveal className="border-b border-primary/40">
          <ModernFeaturesSection />
        </ScrollReveal>

        {/* About Section */}
        <ScrollReveal className="border-b border-primary/40">
          <AboutSection />
        </ScrollReveal>

        {/* Services Section */}
        <ScrollReveal className="border-b border-primary/40">
          <ServicesSection />
        </ScrollReveal>

        {/* Team Section */}
        <ScrollReveal className="border-b border-primary/40">
          <TeamSection />
        </ScrollReveal>

        {/* Portfolio Showcase */}
        <ScrollReveal className="border-b border-primary/40">
          <PortfolioSection />
        </ScrollReveal>

        {/* Why Choose Us */}
        <ScrollReveal className="border-b border-primary/40">
          <WhyChooseUs />
        </ScrollReveal>

        {/* Testimonials */}
        <ScrollReveal className="border-b border-primary/40">
          <TestimonialsSection />
        </ScrollReveal>

        {/* CTA Section */}
        <ScrollReveal>
          <section className="py-16 md:py-24 bg-primary text-white">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                مستعد للبدء؟
              </h2>

              <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
                تواصل معنا اليوم واحصل على عرض سعر خاص لمشروعك
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href={PHONE_LINK}
                  className="px-8 py-3 bg-white text-primary rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                  aria-label={`اتصل بالفرسان على الرقم ${PHONE_NUMBER}`}
                >
                  اتصل الآن: {PHONE_NUMBER}
                </a>

                <a
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
                  aria-label="تواصل مع الفرسان عبر واتساب"
                >
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/whatsapp-logo-8BlB1bIAhVHSHl3FcWdBTRgXT4HWEn.png"
                    alt="واتساب الفرسان"
                    width={20}
                    height={20}
                    className="invert"
                  />
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