'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'

const showcaseItems = [
  {
    title: 'واجهة زجاجية حديثة لمبنى إداري',
    category: 'واجهات زجاجية',
    image: '/glass1.jpg',
    href: '/portfolio',
  },
  {
    title: 'تنفيذ كلادينج لمول تجاري',
    category: 'كلادينج',
    image: '/cladding1.jpg',
    href: '/portfolio',
  },
  {
    title: 'واجهة كيرتن وول مميزة',
    category: 'كيرتن وول',
    image: '/curtain1.jpg',
    href: '/portfolio',
  },
]

export function PortfolioSection() {
  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-10"
        >
          <div>
            <p className="text-primary font-semibold mb-2">أعمالنا</p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              معرض لأبرز مشروعاتنا
            </h2>
          </div>

          <Link
            href="/portfolio"
            className="inline-flex items-center justify-center rounded-lg border border-primary px-5 py-3 text-primary font-semibold hover:bg-primary hover:text-white transition-colors"
          >
            استعرض جميع الأعمال
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {showcaseItems.map((item, index) => (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
            >
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <span className="inline-flex rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-primary">
                    {item.category}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-muted-foreground leading-7">
                  مشاريع تنفيذية تُظهر دقة التنفيذ وجودة الخامات في كل مرحلة.
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
