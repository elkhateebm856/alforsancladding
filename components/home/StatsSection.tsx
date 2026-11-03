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
    color: 'text-[#8f7016]',
    iconBackground: 'bg-primary/10',
    borderColor: 'border-t-primary',
  },
  {
    id: 2,
    icon: FileCheck,
    value: 1000,
    suffix: '+',
    label: 'مشروع تم تنفيذه',
    color: 'text-[#8f7016]',
    iconBackground: 'bg-primary/10',
    borderColor: 'border-t-primary',
  },
  {
    id: 3,
    icon: Users,
    value: 750,
    suffix: '+',
    label: 'عميل سعيد',
    color: 'text-[#8f7016]',
    iconBackground: 'bg-primary/10',
    borderColor: 'border-t-primary',
  },
  {
    id: 4,
    icon: Zap,
    value: 25,
    suffix: '+',
    label: 'مهندس وفني متخصص',
    color: 'text-[#8f7016]',
    iconBackground: 'bg-primary/10',
    borderColor: 'border-t-primary',
  },
]

export function StatsSection() {
  return (
    <section
      id="stats"
      className="relative overflow-hidden bg-[#f7f5ef] py-14 text-slate-900 md:py-18"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_-20%,_rgba(201,162,39,0.12),_transparent_62%)]" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="relative mb-10 text-center md:mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            إحصائيات الفرسان
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            أرقام تعكس تفاني فريقنا والإنجازات التي حققناها
          </p>
        </motion.div>

        <div className="relative grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.15,
                }}
                className="group [perspective:1000px]"
              >
                <div
                  className={`h-full rounded-2xl border border-slate-200 border-t-4 ${stat.borderColor} bg-white p-5 text-center shadow-[0_12px_30px_rgba(31,41,55,0.10)] transition-transform duration-300 [transform:rotateX(4deg)] group-hover:[transform:rotateX(0deg)_translateY(-5px)] group-hover:shadow-[0_20px_40px_rgba(31,41,55,0.16)] sm:p-7`}
                >
                  <motion.div
                    whileHover={{ scale: 1.08, rotateY: 12 }}
                    className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl ${stat.iconBackground} shadow-inner sm:mb-5 sm:h-14 sm:w-14`}
                  >
                    <Icon className={`${stat.color} h-6 w-6 sm:h-7 sm:w-7`} />
                  </motion.div>

                  <div
                    className={`${stat.color} mb-3 text-center text-4xl font-black leading-none [text-shadow:0_2px_0_rgba(255,255,255,0.9),0_4px_0_rgba(120,75,10,0.2),0_8px_14px_rgba(31,41,55,0.16)] sm:mb-4 sm:text-5xl md:text-6xl`}
                  >
                    {stat.value.toLocaleString('en-US')}
                    {stat.suffix}
                  </div>

                  <p className="text-sm font-semibold text-slate-700 sm:text-base md:text-lg">
                    {stat.label}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
