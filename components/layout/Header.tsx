'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Award, Menu, Phone, X } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { CONTACT_TEL, NAVIGATION_ITEMS } from '@/lib/constants'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const prefersReducedMotion = useReducedMotion()
  const motionDuration = prefersReducedMotion ? 0 : 0.3
  const pathname = usePathname()

  return (
    <motion.header
      // Keep SSR/client markup identical — animate only after mount via animate prop.
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: motionDuration, ease: 'easeOut' }}
      className="sticky top-0 z-40 w-full border-b border-slate-200/70 bg-white/80 shadow-[0_8px_28px_rgba(15,23,42,0.06)] backdrop-blur-xl supports-[backdrop-filter]:bg-white/70"
    >
      <nav className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between gap-2 sm:h-[76px] sm:gap-3">
          {/* Logo + badge */}
          <div className="flex min-w-0 shrink items-center gap-1.5 sm:gap-3">
            <Link
              href="/"
              aria-label="الفرسان للواجهات الزجاجية والكلادينج، الصفحة الرئيسية"
              className="flex shrink-0 items-center"
            >
              <div className="relative h-11 w-11 shrink-0 sm:h-16 sm:w-16 lg:h-[4.5rem] lg:w-[4.5rem]">
                <Image
                  src="/images/logo.png"
                  alt=""
                  fill
                  sizes="(max-width: 640px) 44px, 72px"
                  className="object-contain"
                  priority
                />
              </div>
            </Link>

            <div
              aria-label="20 عامًا من الخبرة"
              title="20 عامًا من الخبرة"
              className="glass-chip inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-1 text-[#8f7016] sm:gap-1.5 sm:px-3 sm:py-1.5"
            >
              <Award className="size-3.5 sm:size-4" aria-hidden="true" />
              <span className="flex flex-col leading-none">
                <span className="text-[11px] font-extrabold sm:text-sm">20 سنة</span>
                <span className="mt-0.5 hidden text-[10px] font-medium text-amber-800 sm:block">
                  خبرة
                </span>
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="glass-panel hidden items-center gap-1 rounded-full p-1 lg:flex">
            {NAVIGATION_ITEMS.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== '/' && pathname.startsWith(`${item.href}/`))

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={`whitespace-nowrap rounded-full px-2.5 py-2 text-sm font-semibold transition-all lg:px-3 ${
                    isActive
                      ? 'bg-white text-primary shadow-sm ring-1 ring-slate-200/70'
                      : 'text-slate-600 hover:bg-white/80 hover:text-primary'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
          </div>

          {/* Desktop CTA */}
          <div className="hidden items-center gap-4 lg:flex">
            <a
              href={CONTACT_TEL}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-primary/20 transition-all hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-lg"
            >
              <Phone className="size-4" aria-hidden="true" />
              اتصل بنا
            </a>
          </div>

          {/* Mobile Actions */}
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2 lg:hidden">
            <a
              href={CONTACT_TEL}
              aria-label="اتصل بالفرسان"
              className="grid size-10 place-items-center rounded-full bg-primary text-white shadow-[0_8px_20px_-8px_rgba(201,162,39,0.55)] transition-colors hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:size-11"
            >
              <Phone className="size-4 sm:size-5" aria-hidden="true" />
            </a>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="glass-btn grid size-10 place-items-center rounded-full text-foreground transition-colors hover:bg-white/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:size-11"
              aria-label={isMenuOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-navigation"
            >
              {isMenuOpen ? (
                <X className="size-5" aria-hidden="true" />
              ) : (
                <Menu className="size-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence initial={false}>
          {isMenuOpen && (
            <motion.div
              id="mobile-navigation"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: motionDuration, ease: 'easeInOut' }}
              className="overflow-hidden border-t border-white/40 bg-white/70 backdrop-blur-xl lg:hidden"
            >
              <div className="py-3">
                <nav className="space-y-1">
                  {NAVIGATION_ITEMS.map((item) => {
                    const isActive =
                      pathname === item.href ||
                      (item.href !== '/' && pathname.startsWith(`${item.href}/`))

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        aria-current={isActive ? 'page' : undefined}
                        className={`block rounded-xl px-3.5 py-2.5 text-[15px] font-semibold transition-colors ${
                          isActive
                            ? 'bg-primary/10 text-primary'
                            : 'text-slate-800 hover:bg-muted'
                        }`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    )
                  })}
                  <a
                    href={CONTACT_TEL}
                    className="mt-2 flex min-h-11 items-center justify-center gap-2 rounded-full bg-primary px-4 py-2.5 text-center text-sm font-bold text-white shadow-sm transition-colors hover:bg-primary/90"
                  >
                    <Phone className="size-4" aria-hidden="true" />
                    اتصل بنا
                  </a>
                </nav>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  )
}
