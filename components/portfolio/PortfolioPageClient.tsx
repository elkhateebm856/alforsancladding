'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import { Hero } from '@/components/common/Hero'
import { Play, Search, X } from 'lucide-react'
import { motion } from 'framer-motion'
import { portfolioItems } from '@/data/portfolio'

const categories = [
  'الكل',
  'واجهات زجاجية',
  'كلادينج',
  'كيرتن وول',
  'أبواب وشبابيك',
  'أبواب أوتوماتيك',
  'مطابخ',
  'فيديوهات',
]

export function PortfolioPageClient() {
  const [category, setCategory] = useState('الكل')
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null)

  const filteredItems = useMemo(() => {
    if (category === 'الكل') return portfolioItems
    return portfolioItems.filter((item) => item.category === category)
  }, [category])

  return (
    <>
      <Hero
        title="أعمالنا"
        subtitle="استعرض مجموعة من مشاريع الفرسان في الواجهات الزجاجية والكلادينج"
        backgroundImage="/hero.jpg"
      />

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex flex-wrap justify-center gap-3 mb-14">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-6 py-3 rounded-full transition font-semibold ${
                  category === cat
                    ? 'bg-primary text-white'
                    : 'bg-card border border-border hover:border-primary'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="group bg-card rounded-xl overflow-hidden border border-border shadow-sm hover:shadow-xl transition-all duration-300"
              >
                {item.type === 'image' ? (
                  <div
                    className="relative h-72 cursor-pointer overflow-hidden"
                    onClick={() => setSelectedImage(item.src)}
                  >
                    <Image
                      src={item.src}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Search className="w-10 h-10 text-white" />
                    </div>
                  </div>
                ) : (
                  <div className="relative h-72 cursor-pointer overflow-hidden" onClick={() => setSelectedVideo(item.src)}>
                    <Image
                      src={item.poster || '/hero.jpg'}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="rounded-full bg-white/80 p-4 shadow-lg">
                        <Play className="w-8 h-8 text-primary" />
                      </div>
                    </div>
                  </div>
                )}

                <div className="p-6">
                  <div className="text-sm text-primary font-semibold mb-2">{item.category}</div>
                  <h3 className="text-xl font-bold text-foreground mb-3">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={() => setSelectedImage(null)}>
          <div className="relative max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
            <button
              className="absolute -top-4 -right-4 z-10 rounded-full bg-white/90 p-2 text-black shadow-lg"
              onClick={() => setSelectedImage(null)}
            >
              <X className="h-5 w-5" />
            </button>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image src={selectedImage} alt="معاينة الصورة" fill className="object-contain" />
            </div>
          </div>
        </div>
      )}

      {selectedVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={() => setSelectedVideo(null)}>
          <div className="relative w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <button
              className="absolute -top-4 -right-4 z-10 rounded-full bg-white/90 p-2 text-black shadow-lg"
              onClick={() => setSelectedVideo(null)}
            >
              <X className="h-5 w-5" />
            </button>
            <video controls className="w-full rounded-2xl" src={selectedVideo} />
          </div>
        </div>
      )}
    </>
  )
}
