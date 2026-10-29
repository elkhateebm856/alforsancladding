import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, CheckCircle, Phone } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ContactButtons } from '@/components/common/ContactButtons'
import { PublicReviewForm } from '@/components/common/PublicReviewForm'
import { Hero } from '@/components/common/Hero'
import { services } from '@/data/services'
import { SITE_NAME, SOCIAL_LINKS, CONTACT_PHONE } from '@/lib/constants'

interface ServicePageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return services.map((service) => ({
    slug: service.slug,
  }))
}

export async function generateMetadata(
  { params }: ServicePageProps
): Promise<Metadata> {
  const { slug } = await params
  const service = services.find((s) => s.slug === slug)

  if (!service) {
    return {
      title: 'خدمة غير موجودة',
    }
  }

  return {
    title: `${service.name} | ${SITE_NAME}`,
    description: service.shortDescription,
    alternates: {
      canonical: `https://www.alforsancladding.com/services/${service.slug}`,
    },
    openGraph: {
      title: `${service.name} | ${SITE_NAME}`,
      description: service.shortDescription,
      url: `https://www.alforsancladding.com/services/${service.slug}`,
      type: 'website',
      images: [
        {
          url: service.image.startsWith('http')
            ? service.image
            : `https://www.alforsancladding.com${service.image}`,
          width: 1200,
          height: 630,
          alt: service.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${service.name} | ${SITE_NAME}`,
      description: service.shortDescription,
      images: [
        service.image.startsWith('http')
          ? service.image
          : `https://www.alforsancladding.com${service.image}`,
      ],
    },
  }
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { slug } = await params
  const service = services.find((s) => s.slug === slug)

  if (!service) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">خدمة غير موجودة</h1>
            <Link href="/services" className="text-primary hover:underline">
              العودة إلى الخدمات
            </Link>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="bg-background">
        {/* Hero */}
        <Hero
          title={service.name}
          subtitle={service.shortDescription}
          backgroundImage={service.image}
        />

        {/* Breadcrumb */}
        <div className="bg-muted py-4">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-primary">
                الرئيسية
              </Link>
              <ChevronLeft size={16} />
              <Link href="/services" className="hover:text-primary">
                الخدمات
              </Link>
              <ChevronLeft size={16} />
              <span className="text-foreground">{service.name}</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2">
                {/* Description */}
                <div className="mb-12">
                  <h2 className="text-2xl font-bold text-foreground mb-4">
                    وصف الخدمة
                  </h2>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    {service.fullDescription}
                  </p>
                </div>

                {/* Gallery */}
                {service.gallery && service.gallery.length > 0 && (
                  <div className="mb-12">
                    <h2 className="text-2xl font-bold text-foreground mb-6">
                      معرض الصور
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {service.gallery.map((image, idx) => (
                        <div key={idx} className="rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                          <Image
                            src={image}
                            alt={`صورة ${service.name} - ${idx + 1}`}
                            width={400}
                            height={300}
                            className="w-full h-64 object-cover hover:scale-105 transition-transform"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Features */}
                {service.features.length > 0 && (
                  <div className="mb-12">
                    <h2 className="text-2xl font-bold text-foreground mb-6">
                      المميزات
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {service.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <CheckCircle
                            size={24}
                            className="text-primary flex-shrink-0 mt-1"
                          />
                          <span className="text-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Steps */}
                {service.steps.length > 0 && (
                  <div className="mb-12">
                    <h2 className="text-2xl font-bold text-foreground mb-6">
                      خطوات التنفيذ
                    </h2>
                    <div className="space-y-4">
                      {service.steps.map((step, idx) => (
                        <div key={idx} className="flex gap-4">
                          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white font-bold flex-shrink-0">
                            {idx + 1}
                          </div>
                          <div className="pt-1">
                            <p className="text-foreground font-medium">{step}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* FAQs */}
                {service.faqs.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-6">
                      أسئلة شائعة
                    </h2>
                    <div className="space-y-4">
                      {service.faqs.map((faq, idx) => (
                        <details
                          key={idx}
                          className="border border-border rounded-lg p-4 cursor-pointer group"
                        >
                          <summary className="font-semibold text-foreground flex items-center justify-between">
                            {faq.q}
                            <span className="text-primary group-open:rotate-180 transition-transform">
                              ▼
                            </span>
                          </summary>
                          <p className="mt-4 text-muted-foreground">{faq.a}</p>
                        </details>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div>
                {/* CTA Card */}
                <div className="bg-primary text-white rounded-lg p-8 sticky top-24 mb-6">
                  <h3 className="text-xl font-bold mb-4">مستعد للبدء؟</h3>
                  <p className="text-white/90 mb-6 text-sm">
                    تواصل معنا اليوم واحصل على عرض سعر خاص لمشروعك
                  </p>
                  <div className="space-y-3">
                    <a
                      href={`tel:${CONTACT_PHONE}`}
                      className="flex items-center gap-2 justify-center w-full px-4 py-3 bg-white text-primary rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                    >
                      <Phone size={20} />
                      اتصل بنا
                    </a>
                    <a
                      href={SOCIAL_LINKS.whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 justify-center w-full px-4 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition-colors"
                    >
                      <Image
                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/whatsapp-logo-8BlB1bIAhVHSHl3FcWdBTRgXT4HWEn.png"
                        alt="WhatsApp"
                        width={20}
                        height={20}
                      />
                      واتساب
                    </a>
                  </div>
                </div>

                {/* Related Services */}
                {service.relatedServices.length > 0 && (
                  <div className="bg-card border border-border rounded-lg p-6">
                    <h3 className="font-bold text-foreground mb-4">
                      خدمات ذات صلة
                    </h3>
                    <ul className="space-y-3">
                      {service.relatedServices
                        .map((id) => services.find((s) => s.id === id))
                        .filter(Boolean)
                        .map((relatedService) => (
                          <li key={relatedService?.id}>
                            <Link
                              href={`/services/${relatedService?.slug}`}
                              className="text-primary hover:underline text-sm"
                            >
                              {relatedService?.name}
                            </Link>
                          </li>
                        ))}
                    </ul>
                  </div>
                )}
              </div>
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
