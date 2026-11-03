import Link from 'next/link'
import { ArrowLeft, ArrowUpLeft, Check } from 'lucide-react'
import { FacadeShowcase } from '@/components/home/FacadeShowcase'

export function HeroSlider() {
  return (
    <section className="relative overflow-hidden bg-[#f7f5ef]">
      <div className="pointer-events-none absolute -right-32 -top-40 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-8 px-4 py-10 sm:px-6 md:min-h-[620px] md:grid-cols-2 md:gap-x-10 md:gap-y-4 md:py-20 lg:px-8">
        <div className="relative z-10 text-right md:col-start-1 md:row-start-1">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-white/80 px-4 py-2 text-sm font-semibold text-primary shadow-sm">
            <span className="h-2 w-2 rounded-full bg-primary" />
            خبرة هندسية وجودة تُرى في كل تفصيلة
          </div>

          <h1 className="mb-6 text-balance text-4xl font-extrabold leading-tight text-slate-900 sm:text-5xl lg:text-6xl">
            واجهات تصنع
            <span className="block text-primary">انطباعًا يدوم</span>
          </h1>

        </div>

        <div className="relative mx-auto w-full max-w-[560px] md:col-start-2 md:row-span-2 md:row-start-1">
          <div className="absolute -inset-4 rounded-[2rem] bg-primary/15 blur-2xl" />
          <div className="relative rounded-[1.75rem] border border-primary/30 bg-white p-3 shadow-2xl shadow-slate-900/20">
            <FacadeShowcase />
          </div>
        </div>

        <div className="relative z-10 text-right md:col-start-1 md:row-start-2">
          <p className="mb-6 max-w-xl text-lg leading-9 text-slate-600 sm:text-xl">
            في الفرسان نصمم وننفذ الواجهات الزجاجية والكلادينج والكيرتن وول،
            ونقدم الزجاج الذكي الذي يغيّر درجة شفافيته لخصوصية وراحة أكبر.
          </p>

          <div className="mb-7 flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-slate-700 sm:text-base">
            <span className="inline-flex items-center gap-2">
              <Check size={18} className="text-primary" aria-hidden="true" />
              تصميم وتنفيذ متكامل
            </span>
            <span className="inline-flex items-center gap-2">
              <Check size={18} className="text-primary" aria-hidden="true" />
              حلول للمباني والمحلات
            </span>
            <span className="inline-flex items-center gap-2">
              <Check size={18} className="text-primary" aria-hidden="true" />
              عرض متكامل للنهار والليل والزجاج الذكي
            </span>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/services"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-7 py-3 font-bold text-white shadow-lg shadow-primary/20 transition hover:-translate-y-0.5 hover:bg-primary/90"
            >
              اكتشف خدماتنا
              <ArrowLeft size={18} aria-hidden="true" />
            </Link>
            <a
              href="tel:+201094656501"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-7 py-3 font-bold text-slate-800 transition hover:border-primary hover:text-primary"
            >
              تواصل معنا
              <ArrowUpLeft size={18} aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
