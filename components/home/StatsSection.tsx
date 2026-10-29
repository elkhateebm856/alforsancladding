'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { Landmark, FileCheck, Users, Zap } from 'lucide-react'

const stats = [
  {
    id: 1,
    icon: Landmark,
    value: 20,
    suffix: '+',
    label: 'سنة من الخبرة',
    color: 'text-amber-300',
    iconBackground: 'bg-amber-400/10',
    borderColor: 'border-t-amber-400',
  },
  {
    id: 2,
    icon: FileCheck,
    value: 850,
    suffix: '+',
    label: 'مشروع تم تنفيذه',
    color: 'text-amber-300',
    iconBackground: 'bg-amber-400/10',
    borderColor: 'border-t-amber-400',
  },
  {
    id: 3,
    icon: Users,
    value: 600,
    suffix: '+',
    label: 'عميل سعيد',
    color: 'text-amber-300',
    iconBackground: 'bg-amber-400/10',
    borderColor: 'border-t-amber-400',
  },
  {
    id: 4,
    icon: Zap,
    value: 25,
    suffix: '+',
    label: 'مهندس وفني متخصص',
    color: 'text-amber-300',
    iconBackground: 'bg-amber-400/10',
    borderColor: 'border-t-amber-400',
  },
]

function AnimatedCounter({ from = 0, to = 100, duration = 2.5, suffix = '' }) {
  const nodeRef = useRef(null)
  const [displayValue, setDisplayValue] = useState(from)
  const isInView = useInView(nodeRef, { once: true, margin: '-100px' })

  useEffect(() => {
    if (!isInView) return

    const increment = (to - from) / (duration * 60)
    let currentValue = from

    const interval = setInterval(() => {
      currentValue += increment
      if (currentValue >= to) {
        setDisplayValue(to)
        clearInterval(interval)
      } else {
        setDisplayValue(Math.floor(currentValue))
      }
    }, 1000 / 60)

    return () => clearInterval(interval)
  }, [isInView, from, to, duration, suffix])

  return (
    <span ref={nodeRef} className="text-5xl md:text-6xl font-bold">
      {displayValue}
      {suffix}
    </span>
  )
}

export function StatsSection() {
  const containerRef = useRef(null)

  return (
    <section id="stats" ref={containerRef} className="bg-slate-950 py-16 text-white md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            إحصائيات الفرسان
          </h2>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            أرقام تعكس تفاني فريقنا والإنجازات التي حققناها
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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
                className="group"
              >
                <div className={`bg-white/5 border border-white/10 border-t-4 ${stat.borderColor} rounded-lg p-8 text-center transition-all duration-300 hover:bg-white/10 hover:shadow-xl`}>
                  <motion.div
                    initial={{ scale: 1 }}
                    whileHover={{ scale: 1.1 }}
                    className={`inline-flex items-center justify-center w-16 h-16 ${stat.iconBackground} rounded-full mb-6 transition-transform`}
                  >
                    <Icon className={`${stat.color} w-8 h-8`} />
                  </motion.div>

                  <div className="mb-4">
                    <div className={`${stat.color} text-center`}>
                      <AnimatedCounter
                        from={0}
                        to={stat.value}
                        suffix={stat.suffix}
                        duration={2.5}
                      />
                    </div>
                  </div>

                  <p className="text-white/90 font-semibold text-lg">
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
