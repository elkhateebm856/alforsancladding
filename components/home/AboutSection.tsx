import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export function AboutSection() {
  return (
    <section className="bg-amber-50/60 py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-12 text-center text-balance">
          من نحن
        </h2>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
          {/* Image */}
          <div className="relative h-96 overflow-hidden rounded-lg shadow-lg ring-1 ring-primary/20 md:h-[450px]">
            <Image
              src="/من نحن.png"
              alt="واجهات زجاجية احترافية"
              fill
              className="object-cover"
            />
          </div>

          {/* Text Content */}
          <div>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              شركة الفرسان متخصصة في تصميم وتنفيذ الواجهات الزجاجية والكلادينج للمباني السكنية والتجارية والإدارية. نلتزم بأعلى معايير الجودة والدقة في كل مشروع، ونستخدم أفضل الخامات وأحدث تقنيات التنفيذ لضمان تحقيق رؤيتك بكل احترافية.
            </p>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              فريقنا ذو خبرة عميقة في هذا المجال، ملتزمون بتقديم حلول مبتكرة تجمع بين الجمال والوظيفة والاستدامة. نؤمن بأن كل مشروع فريد، لذا نقدم خدمات مخصصة تلبي احتياجاتك بدقة.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/about"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-primary px-5 py-3 font-bold text-white transition-colors hover:bg-primary/90"
              >
                تعرف على الفرسان
                <ArrowLeft size={16} aria-hidden="true" />
              </Link>
              <Link
                href="/services"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-primary/30 bg-white px-5 py-3 font-bold text-primary transition-colors hover:bg-primary/10"
              >
                خدماتنا
                <ArrowLeft size={16} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>

        {/* Founder Section */}
        <div className="text-center border-t border-border pt-12">
  <p className="text-muted-foreground text-lg mb-6">
    مؤسس الفرسان
  </p>

  <h3 className="text-3xl md:text-4xl font-bold text-primary mb-2">
    م. محروس الصياد
  </h3>

  <p className="text-muted-foreground max-w-3xl mx-auto leading-8">
    مهندس متخصص بخبرة تتجاوز 20 عامًا في مجال الواجهات الزجاجية والكلادينج،
    تلقى التدريب والتأهيل المهني داخل إحدى الشركات الإماراتية المتخصصة، مما
    أكسبه خبرة عملية في أحدث أنظمة التنفيذ ومعايير الجودة العالمية. ويقود
    اليوم فريقًا متكاملًا من المهندسين والفنيين المحترفين لتنفيذ المشاريع
    بأعلى مستويات الجودة والدقة والابتكار.
  </p>
</div>
      </div>
    </section>
  )
}
