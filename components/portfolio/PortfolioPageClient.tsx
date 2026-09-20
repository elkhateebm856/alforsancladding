'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import { Hero } from '@/components/common/Hero'
import { Play, Search, X } from 'lucide-react'
import { motion } from 'framer-motion'

const portfolioItems = [
  {
    id: 1,
    type: 'image',
    category: 'واجهات زجاجية',
    title: 'واجهة زجاجية لمبنى إداري',
    description: 'تنفيذ واجهة زجاجية حديثة باستخدام أفضل الخامات.',
    src: '/glass1.jpg',
  },
  {
    id: 2,
    type: 'image',
    category: 'كلادينج',
    title: 'واجهة كلادينج لمول تجاري',
    description: 'ألواح كلادينج مقاومة للعوامل الجوية.',
    src: '/cladding1.jpg',
  },
  {
    id: 3,
    type: 'image',
    category: 'كيرتن وول',
    title: 'واجهة كيرتن وول',
    description: 'تنفيذ واجهات Curtain Wall للمباني الإدارية.',
    src: '/curtain1.jpg',
  },
  {
    id: 4,
    type: 'image',
    category: 'أبواب وشبابيك',
    title: 'أبواب وشبابيك ألمنيوم',
    description: 'تصميم وتركيب أبواب وشبابيك ألمنيوم.',
    src: '/windows1.jpg',
  },
  {
    id: 5,
    type: 'image',
    category: 'أبواب أوتوماتيك',
    title: 'باب أوتوماتيك',
    description: 'تركيب أبواب أوتوماتيك للمباني التجارية.',
    src: '/door1.jpg',
  },
  {
    id: 6,
    type: 'image',
    category: 'مطابخ',
    title: 'مطبخ ألمنيوم مودرن',
    description: 'تنفيذ مطبخ ألمنيوم بتصميم عصري.',
    src: '/kitchen1.jpg',
  },
  {
    id: 7,
    type: 'image',
    category: 'كلادينج',
    title: 'واجهة كلادينج لفيلا',
    description: 'تنفيذ واجهة كلادينج حديثة للفلل.',
    src: '/cladding2.jpg',
  },
  {
    id: 8,
    type: 'image',
    category: 'واجهات زجاجية',
    title: 'واجهة زجاجية لمعرض سيارات',
    description: 'واجهة زجاجية بتصميم عصري وإضاءة مميزة.',
    src: '/glass2.jpg',
  },
  {
    id: 9,
    type: 'image',
    category: 'كيرتن وول',
    title: 'كيرتن وول لمبنى تجاري',
    description: 'تنفيذ واجهات كيرتن وول بأعلى جودة.',
    src: '/curtain2.jpg',
  },
  {
    id: 10,
    type: 'image',
    category: 'أبواب وشبابيك',
    title: 'شبابيك ألمنيوم',
    description: 'شبابيك ألمنيوم بعزل حراري وصوتي.',
    src: '/windows2.jpg',
  },
  {
    id: 11,
    type: 'image',
    category: 'أبواب أوتوماتيك',
    title: 'باب زجاج أوتوماتيك',
    description: 'باب أوتوماتيك للمولات والشركات.',
    src: '/door2.jpg',
  },
  {
    id: 12,
    type: 'image',
    category: 'مطابخ',
    title: 'مطبخ HPL',
    description: 'مطبخ HPL بتصميم عصري وجودة عالية.',
    src: '/kitchen2.jpg',
  },
  {
    id: 13,
    type: 'image',
    category: 'كلادينج',
    title: 'واجهة كلادينج لشركة',
    description: 'تنفيذ واجهة كلادينج حديثة للشركات.',
    src: '/cladding3.jpg',
  },
  {
    id: 14,
    type: 'image',
    category: 'واجهات زجاجية',
    title: 'واجهة زجاجية لبرج إداري',
    description: 'تنفيذ واجهات زجاجية للمباني الإدارية.',
    src: '/glass3.jpg',
  },
  {
    id: 15,
    type: 'image',
    category: 'كيرتن وول',
    title: 'كيرتن وول لبرج تجاري',
    description: 'واجهة كيرتن وول بتصميم حديث.',
    src: '/curtain3.jpg',
  },
  {
    id: 16,
    type: 'image',
    category: 'أبواب وشبابيك',
    title: 'أبواب ألمنيوم',
    description: 'تصنيع وتركيب أبواب ألمنيوم عصرية.',
    src: '/doors1.jpg',
  },
  {
    id: 17,
    type: 'image',
    category: 'مطابخ',
    title: 'مطبخ صاج',
    description: 'تنفيذ مطبخ صاج فاخر بأحدث التصاميم.',
    src: '/kitchen3.jpg',
  },
  {
    id: 18,
    type: 'image',
    category: 'كلادينج',
    title: 'واجهة كلادينج لعمارة سكنية',
    description: 'تنفيذ واجهة كلادينج للعمائر السكنية.',
    src: '/cladding4.jpg',
  },
  {
    id: 19,
    type: 'image',
    category: 'واجهات زجاجية',
    title: 'واجهة زجاجية لفيلا',
    description: 'تصميم وتنفيذ واجهة زجاجية عصرية.',
    src: '/glass4.jpg',
  },
  {
    id: 20,
    type: 'video',
    category: 'فيديوهات',
    title: 'واجهة كلادينج بعد التشطيب',
    description: 'استعراض الواجهة بعد الانتهاء من تنفيذ وتشطيب الكلادينج.',
    src: '/video3.mp4',
    poster: '/cladding-finished1.jpg',
  },
  {
    id: 21,
    type: 'video',
    category: 'فيديوهات',
    title: 'تشطيب نهائي لواجهة كلادينج',
    description: 'فيديو يوضح الشكل النهائي لواجهة الكلادينج بعد اكتمال المشروع.',
    src: '/video4.mp4',
    poster: '/cladding-finished2.jpg',
  },
]

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
