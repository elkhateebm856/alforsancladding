'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ContactButtons } from '@/components/common/ContactButtons'
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
    src: '/portfolio/glass1.jpg',
  },
  {
    id: 2,
    type: 'image',
    category: 'كلادينج',
    title: 'واجهة كلادينج لمول تجاري',
    description: 'ألواح كلادينج مقاومة للعوامل الجوية.',
    src: '/portfolio/cladding1.jpg',
  },
  {
    id: 3,
    type: 'image',
    category: 'كيرتن وول',
    title: 'كيرتن وول',
    description: 'تنفيذ Curtain Wall للمباني الإدارية.',
    src: '/portfolio/curtain1.jpg',
  },
  {
    id: 4,
    type: 'image',
    category: 'سكاي لايت',
    title: 'سكاي لايت',
    description: 'تصميم وتنفيذ Sky Light.',
    src: '/portfolio/skylight1.jpg',
  },
  {
    id: 5,
    type: 'image',
    category: 'أبواب أوتوماتيك',
    title: 'باب أوتوماتيك',
    description: 'أبواب زجاجية أوتوماتيك.',
    src: '/portfolio/door1.jpg',
  },
  {
    id: 6,
    type: 'image',
    category: 'مطابخ',
    title: 'مطبخ كلادينج',
    description: 'تنفيذ مطابخ حديثة.',
    src: '/portfolio/kitchen1.jpg',
  },

  {
    id: 7,
    type: 'video',
    category: 'فيديوهات',
    title: 'تنفيذ واجهة كلادينج',
    description: 'فيديو أثناء التنفيذ.',
    src: '/videos/video1.mp4',
    poster: '/portfolio/cladding1.jpg',
  },

  {
    id: 8,
    type: 'video',
    category: 'فيديوهات',
    title: 'تركيب واجهات زجاجية',
    description: 'مراحل التنفيذ.',
    src: '/videos/video2.mp4',
    poster: '/portfolio/glass1.jpg',
  },
]

const categories = [
  'الكل',
  'واجهات زجاجية',
  'كلادينج',
  'كيرتن وول',
  'سكاي لايت',
  'أبواب أوتوماتيك',
  'مطابخ',
  'فيديوهات',
]

export default function PortfolioPage() {
  const [category, setCategory] = useState('الكل')

  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const [selectedVideo, setSelectedVideo] = useState<string | null>(null)

  const filteredItems = useMemo(() => {
    if (category === 'الكل') return portfolioItems

    return portfolioItems.filter(
      (item) => item.category === category
    )
  }, [category])

  return (
    <>
      <Header />

      <main className="bg-background">

        <Hero
          title="أعمالنا"
          subtitle="استعرض مجموعة من مشاريع الفرسان في الواجهات الزجاجية والكلادينج"
          backgroundImage="/portfolio/hero.jpg"
        />

        <section className="py-20">

          <div className="mx-auto max-w-7xl px-4">

            <div className="flex flex-wrap justify-center gap-3 mb-14">

              {categories.map((cat) => (

                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-6 py-3 rounded-full transition font-semibold

                  ${
                    category === cat
                      ? 'bg-primary text-white'
                      : 'bg-card border border-border hover:border-primary'
                  }`}
                >
                  {cat}
                </button>

              ))}

            </div>
                        {/* Portfolio Grid */}
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
                  transition={{
                    duration: 0.5,
                    delay: index * 0.08,
                  }}
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
                        className="object-cover group-hover:scale-110 transition duration-500"
                      />

                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/50 transition" />

                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                        <Search
                          className="text-white"
                          size={45}
                        />
                      </div>
                    </div>
                  ) : (
                    <div
                      className="relative h-72 cursor-pointer overflow-hidden"
                      onClick={() => setSelectedVideo(item.src)}
                    >
                      <Image
                        src={item.poster!}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-110 transition duration-500"
                      />

                      <div className="absolute inset-0 bg-black/40" />

                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center shadow-xl">
                          <Play
                            fill="white"
                            className="text-white ml-1"
                            size={38}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="p-6">

                    <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-4">
                      {item.category}
                    </span>

                    <h3 className="text-xl font-bold mb-3">
                      {item.title}
                    </h3>

                    <p className="text-muted-foreground">
                      {item.description}
                    </p>

                  </div>

                </motion.div>
              ))}
            </motion.div>
                        {/* Image Lightbox */}
            {selectedImage && (
              <div
                className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-6"
                onClick={() => setSelectedImage(null)}
              >
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-6 right-6 text-white hover:text-primary transition"
                >
                  <X size={36} />
                </button>

                <div
                  className="relative w-full max-w-6xl h-[85vh]"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Image
                    src={selectedImage}
                    alt="Project"
                    fill
                    className="object-contain rounded-xl"
                  />
                </div>
              </div>
            )}

            {/* Video Popup */}
            {selectedVideo && (
              <div
                className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-6"
                onClick={() => setSelectedVideo(null)}
              >
                <button
                  onClick={() => setSelectedVideo(null)}
                  className="absolute top-6 right-6 text-white hover:text-primary transition"
                >
                  <X size={36} />
                </button>

                <div
                  className="w-full max-w-5xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <video
                    controls
                    autoPlay
                    className="w-full rounded-xl shadow-2xl"
                  >
                    <source src={selectedVideo} type="video/mp4" />
                  </video>
                </div>
              </div>
            )}

            {/* CTA */}
            <section className="mt-24">
              <div className="rounded-3xl bg-primary text-white py-16 px-8 text-center">

                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  هل لديك مشروع جديد؟
                </h2>

                <p className="max-w-3xl mx-auto text-lg text-white/90 leading-8 mb-10">
                  فريق الفرسان جاهز لتنفيذ جميع أعمال الواجهات الزجاجية،
                  الكلادينج، الكيرتن وول، السكاي لايت، الأبواب الأوتوماتيك
                  والمطابخ بأعلى جودة وأحدث التقنيات.
                </p>

                <a
                  href="/contact"
                  className="inline-flex items-center justify-center bg-white text-primary px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition"
                >
                  اطلب عرض سعر الآن
                </a>

              </div>
            </section>

          </div>
        </section>

      </main>

      <Footer />
      <ContactButtons />

    </>
  )
}