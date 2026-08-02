import { Metadata } from 'next'
import Image from 'next/image'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ContactButtons } from '@/components/common/ContactButtons'
import { StatsSection } from '@/components/home/StatsSection'
import { Hero } from '@/components/common/Hero'
import { SITE_NAME } from '@/lib/constants'

export const metadata: Metadata = {
  title: `من نحن | ${SITE_NAME}`,
  description:
    'تعرف على شركة الفرسان وخبرتنا في تنفيذ الواجهات الزجاجية والكلادينج في مصر والإمارات',
  alternates: {
    canonical: 'https://www.alforsancladding.com/about',
  },
  openGraph: {
    title: `من نحن | ${SITE_NAME}`,
    description:
      'تعرف على شركة الفرسان وخبرتنا في تنفيذ الواجهات الزجاجية والكلادينج في مصر والإمارات',
    url: 'https://www.alforsancladding.com/about',
    type: 'website',
    images: [
      {
        url: 'https://www.alforsancladding.com/logo.png',
        width: 1200,
        height: 630,
        alt: 'شركة الفرسان للواجهات الزجاجية والكلادينج',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `من نحن | ${SITE_NAME}`,
    description:
      'تعرف على شركة الفرسان وخبرتنا في تنفيذ الواجهات الزجاجية والكلادينج في مصر والإمارات',
    images: ['https://www.alforsancladding.com/logo.png'],
  },
}

export default function AboutPage() {
  return (
    <>
      <Header />

      <main className="bg-background">
        {/* Hero */}
        <Hero
          title="من نحن"
          subtitle="خبرة هندسية متميزة في تنفيذ الواجهات الزجاجية والكلادينج"
          backgroundImage="/من نحن.png"
        />

        {/* About Content */}
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

            {/* Our Story */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                  قصتنا
                </h2>

                <p className="text-lg text-muted-foreground leading-8 mb-5">
                  تأسست شركة <strong className="text-primary">الفرسان</strong>
                  برؤية واضحة تهدف إلى تقديم حلول احترافية في مجال الواجهات
                  الزجاجية والكلادينج، مع الالتزام بأعلى معايير الجودة والدقة في
                  جميع مراحل التنفيذ.
                </p>

                <p className="text-lg text-muted-foreground leading-8 mb-5">
                  يقود الشركة المهندس <strong>محروس الصياد</strong>، الذي يمتلك
                  خبرة عملية تتجاوز <strong>15 عامًا</strong>، وقد تلقى التدريب
                  والتأهيل المهني داخل إحدى الشركات الإماراتية المتخصصة في
                  الواجهات الزجاجية والكلادينج، مما أكسبه خبرة واسعة في أحدث
                  أنظمة التنفيذ والمعايير الهندسية العالمية.
                </p>

                <p className="text-lg text-muted-foreground leading-8">
                  اليوم تواصل شركة الفرسان تنفيذ مشاريعها بفريق من المهندسين
                  والفنيين المحترفين، مع الحرص على تقديم حلول تجمع بين الجودة
                  العالية والتصميم العصري والالتزام الكامل بالمواعيد.
                </p>
              </div>

              <div className="relative h-96">
                <Image
                  src="/من نحن.png"
                  alt="شركة الفرسان"
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            </div>

            {/* Vision & Mission */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">

              <div className="bg-card border border-border rounded-lg p-8 text-center">
                <div className="mb-4 text-4xl text-primary">🎯</div>

                <h3 className="text-2xl font-bold text-foreground mb-3">
                  رؤيتنا
                </h3>

                <p className="text-muted-foreground leading-7">
                  أن نكون من الشركات الرائدة في مجال الواجهات الزجاجية
                  والكلادينج من خلال تقديم حلول هندسية مبتكرة وفق أعلى معايير
                  الجودة.
                </p>
              </div>

              <div className="bg-card border border-border rounded-lg p-8 text-center">
                <div className="mb-4 text-4xl text-primary">💼</div>

                <h3 className="text-2xl font-bold text-foreground mb-3">
                  رسالتنا
                </h3>

                <p className="text-muted-foreground leading-7">
                  تنفيذ مشاريع احترافية باستخدام أفضل الخامات وأحدث تقنيات
                  التنفيذ مع الالتزام الكامل بالجودة والمواعيد ورضا العملاء.
                </p>
              </div>

              <div className="bg-card border border-border rounded-lg p-8 text-center">
                <div className="mb-4 text-4xl text-primary">⭐</div>

                <h3 className="text-2xl font-bold text-foreground mb-3">
                  قيمنا
                </h3>

                <p className="text-muted-foreground leading-7">
                  الجودة، الأمان، الاحترافية، الابتكار، المصداقية، والالتزام هي
                  المبادئ التي تقوم عليها جميع أعمال شركة الفرسان.
                </p>
              </div>

            </div>

            {/* Why Choose Us */}
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-10 text-center">
                لماذا تختار الفرسان؟
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                <div className="flex gap-4">
                  <div className="text-3xl text-primary flex-shrink-0">✓</div>

                  <div>
                    <h3 className="font-bold text-foreground mb-2">
                      تدريب وخبرة إماراتية
                    </h3>

                    <p className="text-muted-foreground">
                      يقود الشركة مهندس تلقى التدريب داخل شركة إماراتية متخصصة،
                      مع تطبيق أحدث أساليب التنفيذ في جميع المشاريع.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="text-3xl text-primary flex-shrink-0">✓</div>

                  <div>
                    <h3 className="font-bold text-foreground mb-2">
                      جودة تنفيذ استثنائية
                    </h3>

                    <p className="text-muted-foreground">
                      استخدام أفضل الخامات وأنظمة الواجهات الزجاجية والكلادينج
                      لضمان الجودة والمتانة.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="text-3xl text-primary flex-shrink-0">✓</div>

                  <div>
                    <h3 className="font-bold text-foreground mb-2">
                      الالتزام بالمواعيد
                    </h3>

                    <p className="text-muted-foreground">
                      تنفيذ وتسليم المشاريع وفق الجدول الزمني المتفق عليه مع
                      المحافظة على أعلى جودة.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="text-3xl text-primary flex-shrink-0">✓</div>

                  <div>
                    <h3 className="font-bold text-foreground mb-2">
                      فريق هندسي محترف
                    </h3>

                    <p className="text-muted-foreground">
                      فريق من المهندسين والفنيين ذوي الخبرة لتنفيذ المشاريع
                      السكنية والتجارية والإدارية بأعلى معايير الاحترافية.
                    </p>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </section>

        {/* Stats */}
        <StatsSection />
      </main>

      <Footer />
      <ContactButtons />
    </>
  )
}