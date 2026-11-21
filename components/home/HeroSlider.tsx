'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowUpLeft } from 'lucide-react'

const slides = [
  { src: '/facade-front.png', alt: 'واجهة أمامية بكلادينج وكيرتن وول' },
  { src: '/facade-right.png', alt: 'واجهة جانبية بتشطيب معدني وإضاءة' },
  { src: '/facade-back.png', alt: 'واجهة خلفية زجاجية معاصرة' },
  { src: '/facade-left.png', alt: 'واجهة شمالية بأنظمة ألمنيوم وزجاج' },
]

export function HeroSlider() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % slides.length)
    }, 5200)
    return () => window.clearInterval(id)
  }, [])

  return (
    <section className="relative isolate min-h-[calc(100svh-3.5rem)] overflow-hidden bg-[#0b121c] text-white md:min-h-[min(92svh,900px)]">
      <div className="absolute inset-0">
        <AnimatePresence mode="sync" initial={false}>
          <motion.div
            key={slides[index].src}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image
              src={slides[index].src}
              alt={slides[index].alt}
              fill
              priority={index === 0}
              sizes="100vw"
              className="object-cover object-center"
            />
          </motion.div>
        </AnimatePresence>

        <div className="absolute inset-0 bg-gradient-to-t from-[#070b12] via-[#070b12]/55 to-[#070b12]/25" />
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-[#070b12]/55" />
        <div className="pointer-events-none absolute -left-24 top-1/4 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[calc(100svh-3.5rem)] w-full max-w-7xl flex-col items-center justify-end px-4 pb-8 pt-6 text-center sm:px-6 md:min-h-[min(92svh,900px)] md:justify-center md:pb-20 md:pt-16 lg:px-8">
        <motion.div
          className="mx-auto max-w-3xl"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="mb-3 text-sm font-semibold tracking-[0.22em] text-primary md:mb-4 md:text-base">
            الفرسان
          </p>

          <h1 className="text-balance text-[2rem] font-extrabold leading-[1.15] tracking-tight sm:text-4xl md:text-5xl lg:text-[3.35rem]">
            واجهات تصنع
            <span className="mt-1 block bg-gradient-to-l from-[#c9a227] via-[#dfc056] to-[#8f7016] bg-clip-text text-transparent">
              انطباعًا يدوم
            </span>
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-white/80 sm:text-base md:mt-5 md:text-lg md:leading-8">
            تصميم وتنفيذ واجهات زجاجية وكلادينج وكيرتن وول بمعايير دقيقة تليق بمشروعك.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 md:mt-8">
            <Link
              href="/services"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-bold text-white shadow-[0_14px_34px_-12px_rgba(201,162,39,0.65)] transition hover:-translate-y-0.5 hover:bg-primary/90 md:min-h-12 md:px-7 md:text-base"
            >
              اكتشف خدماتنا
              <ArrowLeft className="size-4 md:size-[18px]" aria-hidden="true" />
            </Link>
            <a
              href="tel:+201094656501"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/25 bg-white/10 px-6 text-sm font-bold text-white backdrop-blur-md transition hover:border-white/40 hover:bg-white/15 md:min-h-12 md:px-7 md:text-base"
            >
              تواصل معنا
              <ArrowUpLeft className="size-4 md:size-[18px]" aria-hidden="true" />
            </a>
          </div>
        </motion.div>

        <div className="mt-7 flex items-center justify-center gap-2 md:mt-10" aria-hidden="true">
          {slides.map((slide, i) => (
            <button
              key={slide.src}
              type="button"
              onClick={() => setIndex(i)}
              className={`h-1 rounded-full transition-all duration-500 ${
                i === index ? 'w-8 bg-primary' : 'w-3 bg-white/35 hover:bg-white/55'
              }`}
              aria-label={`عرض الشريحة ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
