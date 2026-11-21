'use client'

import { motion } from 'framer-motion'
import { Landmark, FileCheck, Users, Zap } from 'lucide-react'

const stats = [
  {
    id: 1,
    icon: Landmark,
    value: 20,
    suffix: '+',
    label: 'سنة من الخبرة',
  },
  {
    id: 2,
    icon: FileCheck,
    value: 1000,
    suffix: '+',
    label: 'مشروع تم تنفيذه',
  },
  {
    id: 3,
    icon: Users,
    value: 750,
    suffix: '+',
    label: 'عميل سعيد',
  },
  {
    id: 4,
    icon: Zap,
    value: 25,
    suffix: '+',
    label: 'مهندس وفني متخصص',
  },
]

export function StatsSection() {
  return (
    <section id="stats" className="section-glass relative overflow-hidden py-14 md:py-18">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.55 }}
          className="relative mb-10 text-center md:mb-12"
        >
          <p className="section-eyebrow">أرقام تُرى في الواجهة</p>
          <h2 className="section-title mb-3">إحصائيات الفرسان</h2>
          <p className="section-lead">خبرة ومشاريع تنعكس على جودة كل واجهة ننفذها</p>
        </motion.div>

        <div className="relative grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="glass-panel group rounded-2xl p-5 text-center transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_50px_-24px_rgba(15,23,42,0.35)] sm:p-7"
              >
                <div className="mb-4 inline-flex size-12 items-center justify-center rounded-2xl bg-primary/12 text-[#8f7016] ring-1 ring-primary/15 sm:mb-5 sm:size-14">
                  <Icon className="size-6 sm:size-7" aria-hidden="true" />
                </div>
                <div className="mb-2 bg-gradient-to-l from-[#c9a227] to-[#8f7016] bg-clip-text text-4xl font-black leading-none text-transparent sm:text-5xl md:text-6xl">
                  {stat.value.toLocaleString('en-US')}
                  {stat.suffix}
                </div>
                <p className="text-sm font-semibold text-slate-700 sm:text-base">
                  {stat.label}
                </p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
