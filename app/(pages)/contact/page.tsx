import { Metadata } from 'next'
import { Phone, Mail, MapPin, Clock } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ContactButtons } from '@/components/common/ContactButtons'
import { PublicReviewForm } from '@/components/common/PublicReviewForm'
import { ContactForm } from '@/components/contact/ContactForm'
import { Hero } from '@/components/common/Hero'
import {
  CONTACT_PHONE,
  CONTACT_EMAIL,
  CONTACT_ADDRESS,
  SITE_NAME,
} from '@/lib/constants'
import { services } from '@/data/services'

export const metadata: Metadata = {
  title: `تواصل معنا | ${SITE_NAME}`,
  description: 'اتصل بنا أو أرسل لنا رسالة. نحن هنا لخدمتك وتحقيق احتياجاتك',
  alternates: {
    canonical: 'https://www.alforsancladding.com/contact',
  },
  openGraph: {
    title: `تواصل معنا | ${SITE_NAME}`,
    description: 'اتصل بنا أو أرسل لنا رسالة. نحن هنا لخدمتك وتحقيق احتياجاتك',
    url: 'https://www.alforsancladding.com/contact',
    type: 'website',
    images: [
      {
        url: 'https://www.alforsancladding.com/logo.png',
        width: 1200,
        height: 630,
        alt: 'تواصل مع شركة الفرسان',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `تواصل معنا | ${SITE_NAME}`,
    description: 'اتصل بنا أو أرسل لنا رسالة. نحن هنا لخدمتك وتحقيق احتياجاتك',
    images: ['https://www.alforsancladding.com/logo.png'],
  },
}

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="bg-background">
        {/* Hero */}
        <Hero
          title="تواصل معنا"
          subtitle="نحن هنا لسماع احتياجاتك وتقديم الحلول المناسبة"
          backgroundImage="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200"
        />

        {/* Contact Content */}
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
              {/* Phone */}
              <div className="bg-card border border-border rounded-lg p-8 text-center hover:shadow-lg transition-shadow">
                <div className="mb-4 inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-lg">
                  <Phone className="text-primary" size={32} />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  الهاتف
                </h3>
                <p className="text-muted-foreground mb-4">اتصل بنا مباشرة</p>
                <a
                  href={`tel:${CONTACT_PHONE}`}
                  className="text-primary font-bold hover:underline"
                >
                  {CONTACT_PHONE}
                </a>
              </div>

              {/* Email */}
              <div className="bg-card border border-border rounded-lg p-8 text-center hover:shadow-lg transition-shadow">
                <div className="mb-4 inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-lg">
                  <Mail className="text-primary" size={32} />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  البريد الإلكتروني
                </h3>
                <p className="text-muted-foreground mb-4">أرسل لنا بريداً</p>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="text-primary font-bold hover:underline break-all"
                >
                  {CONTACT_EMAIL}
                </a>
              </div>

              {/* Location */}
              <div className="bg-card border border-border rounded-lg p-8 text-center hover:shadow-lg transition-shadow">
                <div className="mb-4 inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-lg">
                  <MapPin className="text-primary" size={32} />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  العنوان
                </h3>
                <p className="text-muted-foreground mb-4">زرنا في مقرنا</p>
                <p className="text-foreground font-semibold">{CONTACT_ADDRESS}</p>
              </div>
            </div>

            {/* Hours */}
            <div className="bg-muted rounded-lg p-8 mb-16">
              <div className="flex items-start gap-4">
                <Clock className="text-primary flex-shrink-0 mt-1" size={28} />
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-4">
                    ساعات العمل
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-foreground font-semibold">الأيام الأحد - الخميس</p>
                      <p className="text-muted-foreground">من 08:00 صباحاً إلى 06:00 مساءً</p>
                    </div>
                    <div>
                      <p className="text-foreground font-semibold">الجمعة والسبت</p>
                      <p className="text-muted-foreground">مغلق في الإجازات الأسبوعية</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form Section */}
            <div className="bg-card border border-border rounded-lg p-8">
              <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
                اتصل بنا عبر النموذج
              </h2>
              <ContactForm services={services} />
            </div>

            {/* Map Section */}
            <div className="mt-16">
              <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
                موقعنا في المنصورة
              </h2>
              <div className="bg-muted rounded-lg overflow-hidden h-96">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3416.0765707050103!2d31.372!3d31.034!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z31LCsDM0JzEyLjIiTiAzMcKwMjInMjAuNCJF!5e0!3m2!1sar!2seg!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                />
              </div>
              <p className="text-center text-muted-foreground mt-4">
                المنصورة - محافظة الدقهلية - جمهورية مصر العربية
              </p>
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
