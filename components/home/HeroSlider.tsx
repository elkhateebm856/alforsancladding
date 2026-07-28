'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const slides = [
  {
    id: 1,
    title: 'الفرسان للواجهات الزجاجية والكلادينج',
    subtitle: 'متخصصون في تنفيذ وتركيب الواجهات الزجاجية والكلادينج بأعلى معايير الجودة والدقة.',
    image: '/hero3.png',
    cta: 'اعرف أكثر',
    link: '/services',
  },
  {
    id: 2,
    title: 'واجهات زجاجية عصرية',
    subtitle: 'تنفيذ Curtain Wall وStructural Glazing وSpider Glass بأحدث التقنيات والتصميمات الحديثة.',
    image: '/2b8b48e5-4d5e-4af7-9132-e33fb6e046a2.png',
    cta: 'تصفح الخدمات',
    link: '/services',
  },
  {
    id: 3,
    title: 'واجهات كلادينج احترافية',
    subtitle: 'تنفيذ جميع أنواع واجهات الكلادينج للمحلات والمولات والفيلات والمباني التجارية بأفضل الخامات.',
    image: '/4a9de293-e977-465e-af76-ccf72e1d4f4b.png',
    cta: 'تواصل معنا',
    link: '/contact',
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
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === current ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            className="object-cover"
            priority={index === current}
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/40" />

          {/* Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 text-balance">
              {slide.title}
            </h2>
            <p className="text-lg md:text-xl text-gray-100 mb-6 max-w-2xl">
              {slide.subtitle}
            </p>
            <Link
              href={slide.link}
              className="px-8 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              {slide.cta}
            </Link>
          </div>
        </div>
      ))}

      {/* Navigation Buttons */}
      <button
        onClick={goToPrevious}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/30 hover:bg-white/50 text-white rounded-full p-2 transition-colors md:right-6"
        aria-label="السابق"
      >
        <ChevronRight size={24} />
      </button>

      <button
        onClick={goToNext}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/30 hover:bg-white/50 text-white rounded-full p-2 transition-colors md:left-6"
        aria-label="التالي"
      >
        <ChevronLeft size={24} />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrent(index)
              setAutoPlay(false)
            }}
            className={`h-2 rounded-full transition-all ${
              index === current
                ? 'bg-primary w-8'
                : 'bg-white/50 w-2 hover:bg-white/75'
            }`}
            aria-label={`اذهب إلى الشريحة ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
