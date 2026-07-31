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
                  الكلادينج، الكيرتن وول، أبواب وشبابيك الألمنيوم،
                  الأبواب الأوتوماتيك، والمطابخ بأعلى جودة وأحدث التقنيات.
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