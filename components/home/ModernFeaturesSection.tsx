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
    <section className="section-glass relative py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-10 max-w-3xl text-center md:mb-12"
        >
          <p className="section-eyebrow">تقنيات الواجهات الحديثة</p>
          <h2 className="section-title mb-3">مميزات ترفع قيمة واجهتك</h2>
          <p className="section-lead">
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
              className="glass-panel rounded-2xl p-6 transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_45px_-22px_rgba(15,23,42,0.35)]"
            >
              <span className="mb-5 inline-flex size-12 items-center justify-center rounded-2xl bg-primary/12 text-[#8f7016] ring-1 ring-primary/15">
                <Icon size={22} aria-hidden="true" />
              </span>
              <h3 className="mb-2 text-lg font-bold text-slate-900">{title}</h3>
              <p className="text-sm leading-7 text-slate-600">{description}</p>
            </motion.article>
          ))}
        </div>

        <div className="mt-9 text-center">
          <Link href="/services" className="btn-primary">
            استكشف خدماتنا
            <ArrowLeft size={18} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  )
}
