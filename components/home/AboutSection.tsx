import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export function AboutSection() {
  return (
    <section className="section-soft py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center md:mb-14">
          <p className="section-eyebrow">من نحن</p>
          <h2 className="section-title">الفرسان للواجهات الزجاجية والكلادينج</h2>
        </div>

        <div className="mb-14 grid grid-cols-1 items-center gap-10 md:mb-16 md:grid-cols-2 md:gap-12">
          <div className="relative h-80 overflow-hidden rounded-[1.75rem] shadow-[0_24px_50px_-28px_rgba(15,23,42,0.45)] ring-1 ring-slate-200/80 md:h-[450px]">
            <Image
              src="/واجهات كلادينج للمباني الإدارية.png"
              alt="مبنى إداري مكتمل بتشطيب واجهات زجاجية وكلادينج وإضاءة معمارية"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-transform duration-700 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/35 via-transparent to-transparent" />
          </div>

          <div className="text-right">
            <p className="mb-5 text-base leading-8 text-slate-600 md:text-lg md:leading-9">
              شركة الفرسان متخصصة في تصميم وتنفيذ الواجهات الزجاجية والكلادينج للمباني السكنية والتجارية والإدارية. نلتزم بأعلى معايير الجودة والدقة في كل مشروع، ونستخدم أفضل الخامات وأحدث تقنيات التنفيذ لضمان تحقيق رؤيتك بكل احترافية.
            </p>
            <p className="mb-8 text-base leading-8 text-slate-600 md:text-lg md:leading-9">
              فريقنا ذو خبرة عميقة في هذا المجال، ملتزمون بتقديم حلول مبتكرة تجمع بين الجمال والوظيفة والاستدامة. نؤمن بأن كل مشروع فريد، لذا نقدم خدمات مخصصة تلبي احتياجاتك بدقة.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/about" className="btn-primary">
                تعرف على الفرسان
                <ArrowLeft size={16} aria-hidden="true" />
              </Link>
              <Link href="/services" className="btn-secondary">
                خدماتنا
                <ArrowLeft size={16} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>

        <div className="surface-card mx-auto max-w-3xl rounded-[1.75rem] px-6 py-10 text-center md:px-10">
          <p className="mb-3 text-sm font-bold text-[#8f7016]">مؤسس الفرسان</p>
          <h3 className="mb-3 text-2xl font-bold text-slate-900 md:text-3xl">م. محروس الصياد</h3>
          <p className="mx-auto max-w-2xl leading-8 text-slate-600">
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
