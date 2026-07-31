'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const slides = [
  {
    id: 1,
    title: 'الفرسان للواجهات الزجاجية والكلادينج',
    subtitle:
      'متخصصون في تنفيذ وتركيب الواجهات الزجاجية والكلادينج بأعلى معايير الجودة والدقة.',
    image: '/hero3.png',
  },
  {
    id: 2,
    title: 'واجهات زجاجية عصرية',
    subtitle:
      'تنفيذ Curtain Wall وStructural Glazing وSpider Glass بأحدث التقنيات والتصميمات الحديثة.',
    image: '/2b8b48e5-4d5e-4af7-9132-e33fb6e046a2.png',
  },
  {
    id: 3,
    title: 'واجهات كلادينج احترافية',
    subtitle:
      'تنفيذ جميع أنواع واجهات الكلادينج للمحلات والمولات والفيلات والمباني التجارية بأفضل الخامات.',
    image: '/4a9de293-e977-465e-af76-ccf72e1d4f4b.png',
  },
]

export function HeroSlider() {
  const [current, setCurrent] = useState(0)
  const [autoPlay, setAutoPlay] = useState(true)

  useEffect(() => {
    if (!autoPlay) return

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [autoPlay])

  const goToPrevious = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length)
    setAutoPlay(false)
  }

  const goToNext = () => {
    setCurrent((prev) => (prev + 1) % slides.length)
    setAutoPlay(false)
  }

  return (
    <section className="relative h-96 md:h-[500px] w-full overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-700 ${
            index === current
              ? 'opacity-100 z-20 pointer-events-auto'
              : 'opacity-0 z-0 pointer-events-none'
          }`}
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            priority={index === current}
            className="object-cover"
          />

          <div className="absolute inset-0 bg-black/50" />

          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center text-center px-4">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {slide.title}
            </h2>

            <p className="text-lg md:text-xl text-gray-100 mb-8 max-w-2xl">
              {slide.subtitle}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="tel:+201094656501"
                className="rounded-lg bg-primary px-8 py-3 text-white font-semibold transition hover:bg-primary/90"
              >
                اتصل الآن
              </a>

              <a
                href="https://wa.me/201094656501"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border-2 border-white px-8 py-3 text-white font-semibold transition hover:bg-white hover:text-primary"
              >
                تواصل عبر واتساب
              </a>
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={goToPrevious}
        className="absolute right-4 top-1/2 z-40 -translate-y-1/2 rounded-full bg-white/30 p-2 text-white transition hover:bg-white/50"
        aria-label="السابق"
      >
        <ChevronRight size={24} />
      </button>

      <button
        onClick={goToNext}
        className="absolute left-4 top-1/2 z-40 -translate-y-1/2 rounded-full bg-white/30 p-2 text-white transition hover:bg-white/50"
        aria-label="التالي"
      >
        <ChevronLeft size={24} />
      </button>

      <div className="absolute bottom-6 left-1/2 z-40 flex -translate-x-1/2 gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrent(index)
              setAutoPlay(false)
            }}
            className={`transition-all ${
              index === current
                ? 'h-2 w-8 rounded-full bg-primary'
                : 'h-2 w-2 rounded-full bg-white/60 hover:bg-white'
            }`}
            aria-label={`اذهب إلى الشريحة ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}