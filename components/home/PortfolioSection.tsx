'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { portfolioItems } from '@/data/portfolio'

export function PortfolioSection() {
  return (
    <section id="projects" className="section-soft py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-10 text-center"
        >
          <p className="section-eyebrow">أعمالنا</p>
          <h2 className="section-title">معرض لأبرز مشروعاتنا</h2>
        </motion.div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {portfolioItems.slice(0, 6).map((item) => (
            <Link
              key={item.id}
              href="/portfolio"
              aria-label={`عرض المشروع: ${item.title}`}
              className="surface-card group block overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_45px_-22px_rgba(15,23,42,0.3)]"
            >
              <div className="relative h-56 overflow-hidden bg-slate-100">
                <Image
                  src={item.type === 'video' ? item.poster || '/hero.jpg' : item.src}
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 84vw, 360px"
                  loading="lazy"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <span className="inline-flex rounded-full border border-white/40 bg-slate-950/65 px-3 py-1 text-xs font-bold text-white backdrop-blur">
                    {item.category}
                  </span>
                  {item.type === 'video' && (
                    <span className="mr-2 inline-flex rounded-full border border-white/40 bg-slate-950/65 px-3 py-1 text-xs font-bold text-white backdrop-blur">
                      فيديو
                    </span>
                  )}
                </div>
              </div>

              <div className="p-5">
                <h3 className="mb-2 text-lg font-bold text-slate-900">
                  {item.title}
                </h3>
                <p className="leading-7 text-slate-600">
                  {item.description}
                </p>
                <span className="mt-4 inline-flex items-center gap-2 font-bold text-[#8f7016] transition-all group-hover:gap-3">
                  شاهد تفاصيل الأعمال
                  <ArrowLeft size={16} aria-hidden="true" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link href="/portfolio" className="btn-secondary">
            استعرض جميع الأعمال
            <ArrowLeft size={17} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  )
}
