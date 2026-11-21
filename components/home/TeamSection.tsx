'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import Image from 'next/image'

const team = [
  {
    name: 'م. محروس الصياد',
    role: 'مؤسس الشركة',
    image:
      '/محروس الصياد.png',
    bio: 'خبرة أكثر من 20 عامًا في تنفيذ الواجهات الزجاجية والكلادينج وإدارة المشاريع.',
  },
  {
    name: 'م. السيد نفعي',
    role: 'مهندس رئيسي',
    image:
      '/السيد نفعي.png',
    bio: 'متخصص في تصميم وتنفيذ الواجهات الزجاجية والكلادينج بأعلى معايير الجودة مع متابعة دقيقة لكل تفاصيل التنفيذ.',
  },
]

export function TeamSection() {
  return (
    <section className="section-light py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12 text-center md:mb-16"
        >
          <p className="section-eyebrow">فريق العمل</p>
          <h2 className="section-title mb-4">فريقنا المحترف</h2>
          <p className="section-lead">
            فريق هندسي متخصص يمتلك الخبرة والكفاءة لتنفيذ جميع مشاريع الواجهات الزجاجية والكلادينج بأعلى مستويات الجودة.
          </p>
        </motion.div>

        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
          {team.map((member, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              viewport={{ once: true }}
              className="surface-card group overflow-hidden rounded-[1.5rem] text-center"
            >
              <div className="relative overflow-hidden">
                <Image
                  src={member.image}
                  alt={member.name}
                  width={500}
                  height={500}
                  className="h-80 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent p-6 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <p className="text-sm leading-7 text-white">{member.bio}</p>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-2xl font-bold text-slate-900">{member.name}</h3>
                <p className="mt-2 font-semibold text-[#8f7016]">{member.role}</p>
                <div className="mx-auto mt-4 h-1 w-14 rounded-full bg-primary" />
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link href="/contact" className="btn-secondary">
            تواصل مع فريقنا
            <ArrowLeft size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  )
}