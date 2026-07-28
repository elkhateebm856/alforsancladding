import { Metadata } from 'next'
import Image from 'next/image'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ContactButtons } from '@/components/common/ContactButtons'
import { Map } from '@/components/common/Map'
import { HeroSlider } from '@/components/home/HeroSlider'
import { AboutSection } from '@/components/home/AboutSection'
import { StatsSection } from '@/components/home/StatsSection'
import { ServicesSection } from '@/components/home/ServicesSection'
import { TeamSection } from '@/components/home/TeamSection'
import { WhyChooseUs } from '@/components/home/WhyChooseUs'
import { TestimonialsSection } from '@/components/home/TestimonialsSection'
import { SITE_NAME, SITE_DESCRIPTION } from '@/lib/constants'

export const metadata: Metadata = {
  title: `${SITE_NAME} | واجهات زجاجية وكلادينج احترافي`,
  description: SITE_DESCRIPTION,
  keywords: ['واجهات زجاجية', 'كلادينج', 'عازل حراري', 'تركيب واجهات'],
}

export default function Home() {
  return (
    <>
      <Header />
      <main className="bg-background">
        {/* Hero Slider */}
        <HeroSlider />

        {/* About Section */}
        <AboutSection />

        {/* Stats Section */}
        <StatsSection />

        {/* Services Section */}
        <ServicesSection />

        {/* Team Section */}
        <TeamSection />

        {/* Why Choose Us */}
        <WhyChooseUs />

        {/* Testimonials */}
        <TestimonialsSection />

        {/* Map */}
        <Map />

        {/* CTA Section */}
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
                href="/contact"
                className="px-8 py-3 bg-white text-primary rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                اتصل بنا
              </a>
              <a
                href="https://wa.me/201000000000"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
              >
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/whatsapp-logo-8BlB1bIAhVHSHl3FcWdBTRgXT4HWEn.png"
                  alt="WhatsApp"
                  width={20}
                  height={20}
                  className="invert"
                />
                واتساب
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <ContactButtons />
    </>
  )
}
