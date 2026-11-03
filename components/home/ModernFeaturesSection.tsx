'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Building2, Layers3, ShieldCheck, SunMoon } from 'lucide-react'

const features = [
  {
    title: 'الزجاج الذكي',
    description:
      'حلول زجاجية متغيرة الشفافية تمنحك تحكمًا أفضل في الخصوصية ومظهرًا عصريًا.',
    icon: SunMoon,
  },
  {
    title: 'أنظمة كيرتن وول',
    description:
      'واجهات زجاجية وألمنيوم بخطوط أنيقة تناسب المباني الإدارية والتجارية.',
    icon: Building2,
  },
  {
    title: 'تشطيبات كلادينج متنوعة',
    description:
      'ألوان وخامات متعددة تساعد على إبراز هوية المبنى وتمنحه طابعًا مميزًا.',
    icon: Layers3,
  },
  {
    title: 'تنفيذ بمعايير دقيقة',
    description:
      'اهتمام بالتفاصيل وجودة التركيب لضمان واجهة متناسقة وعملية.',
    icon: ShieldCheck,
  },
]

export function ModernFeaturesSection() {
  return (
    <section className="bg-[#f7f5ef] py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-10 max-w-3xl text-center md:mb-12"
        >
          <span className="mb-3 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-bold text-[#8f7016]">
            حلول عصرية للمباني الحديثة
          </span>
          <h2 className="mb-4 text-3xl font-bold text-slate-900 md:text-4xl">
            تقنيات ومميزات ترفع قيمة واجهتك
          </h2>
          <p className="text-base leading-8 text-slate-600 md:text-lg">
            نجمع بين الزجاج الذكي وأنظمة الواجهات الحديثة وجودة التنفيذ لنقدم
            حلولًا تناسب احتياجات مشروعك.
          </p>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ title, description, icon: Icon }, index) => (
            <motion.article
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_10px_28px_rgba(31,41,55,0.07)] transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_16px_34px_rgba(31,41,55,0.12)]"
            >
              <span className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-[#8f7016]">
                <Icon size={24} aria-hidden="true" />
              </span>
              <h3 className="mb-2 text-lg font-bold text-slate-900">{title}</h3>
              <p className="text-sm leading-7 text-slate-600">{description}</p>
            </motion.article>
          ))}
        </div>

        <div className="mt-9 text-center">
          <Link
            href="/services"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 font-bold text-white transition hover:-translate-y-0.5 hover:bg-primary/90"
          >
            استكشف خدماتنا
            <ArrowLeft size={18} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  )
}
