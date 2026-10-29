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
      initial={prefersReducedMotion ? false : { opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: motionDuration, ease: 'easeOut' }}
      className="sticky top-0 z-40 w-full border-b border-primary/15 bg-white/95 shadow-[0_6px_20px_rgba(15,23,42,0.08)] backdrop-blur-md"
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-[76px] items-center justify-between gap-3 sm:h-20">
          {/* Logo */}
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
            <Link
              href="/"
              aria-label="الفرسان للواجهات الزجاجية والكلادينج، الصفحة الرئيسية"
              className="flex items-center"
            >
              <div className="relative h-16 w-16 shrink-0 sm:h-[4.5rem] sm:w-[4.5rem]">
                <Image
                  src="/images/logo.png"
                  alt=""
                  fill
                  className="object-contain"
                />
              </div>
            </Link>

            <div
              aria-label="20 عامًا من الخبرة"
              title="20 عامًا من الخبرة"
              className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50 px-2 py-1.5 text-amber-900 shadow-sm sm:gap-2 sm:px-3"
            >
              <Award size={17} aria-hidden="true" />
              <span className="flex flex-col leading-tight">
                <span className="text-xs font-extrabold sm:text-sm">20 سنة</span>
                <span className="hidden text-[10px] text-amber-800 sm:block">خبرة</span>
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-1 rounded-full bg-slate-50 p-1 ring-1 ring-slate-200/70 lg:flex">
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

          {/* CTA Buttons */}
          <div className="hidden items-center gap-4 lg:flex">
            <a
              href={CONTACT_TEL}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 font-bold text-white shadow-md shadow-primary/20 transition-all hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-lg"
            >
              <Phone size={17} aria-hidden="true" />
              اتصل بنا
            </a>
          </div>

          {/* Mobile Actions */}
          <div className="flex shrink-0 items-center gap-2 lg:hidden">
            <a
              href={CONTACT_TEL}
              aria-label="اتصل بالفرسان"
              className="grid size-11 place-items-center rounded-full bg-primary text-white shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <Phone size={19} aria-hidden="true" />
            </a>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="grid size-11 place-items-center rounded-full border border-border bg-white text-foreground shadow-sm transition-colors hover:bg-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              aria-label={isMenuOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-navigation"
            >
              {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
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
              className="overflow-hidden border-t border-border bg-white/95 lg:hidden"
            >
              <div className="py-4">
                <nav className="space-y-2">
                  {NAVIGATION_ITEMS.map((item) => {
                    const isActive =
                      pathname === item.href ||
                      (item.href !== '/' && pathname.startsWith(`${item.href}/`))

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        aria-current={isActive ? 'page' : undefined}
                        className={`block rounded-xl px-4 py-3 font-medium transition-colors ${
                          isActive
                            ? 'bg-primary/10 text-primary'
                            : 'text-foreground hover:bg-muted'
                        }`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    )
                  })}
                  <a
                    href={CONTACT_TEL}
                    className="mt-3 flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-3 text-center font-bold text-white shadow-sm transition-colors hover:bg-primary/90"
                  >
                    <Phone size={17} aria-hidden="true" />
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
