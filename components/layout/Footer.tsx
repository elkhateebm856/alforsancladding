import Link from 'next/link'
import Image from 'next/image'
import {
  MapPin,
  Phone,
  Mail,
  ExternalLink,
} from 'lucide-react'
import { Space_Grotesk } from 'next/font/google'
import {
  CONTACT_ADDRESS,
  CONTACT_EMAIL,
  CONTACT_PHONE,
  NAVIGATION_ITEMS,
  SOCIAL_LINKS,
  SITE_NAME,
} from '@/lib/constants'
import { services } from '@/data/services'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: '700',
})

const socialBtnClass =
  'inline-flex h-11 w-11 items-center justify-center rounded-full border border-primary/50 bg-primary/10 text-[#e4c15a] shadow-[0_0_16px_rgba(201,162,39,0.12)] transition-all hover:-translate-y-0.5 hover:border-primary hover:bg-primary hover:text-slate-950 hover:shadow-[0_0_22px_rgba(201,162,39,0.3)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary'

export function Footer() {
  return (
    <footer className="bg-[#101820] text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 grid grid-cols-2 gap-x-4 gap-y-8 text-center md:grid-cols-4 md:gap-8 md:text-start">
          {/* About */}
          <div className="col-span-2 mx-auto max-w-sm md:col-span-1 md:mx-0 md:max-w-none">
            <Link
              href="/"
              aria-label={`${SITE_NAME}، الصفحة الرئيسية`}
              className="mb-4 inline-flex items-center justify-center md:justify-start"
            >
              <Image
                src="/images/logo.png"
                alt={SITE_NAME}
                width={120}
                height={88}
                className="h-16 w-auto object-contain md:h-[4.5rem]"
              />
            </Link>
            <p className="text-sm leading-relaxed text-slate-300">
              شركة متخصصة في تركيب الواجهات الزجاجية والكلادينج بأعلى مستويات الجودة
              والاحترافية. نقدم حلولاً مبتكرة لمشاريعك.
            </p>
          </div>

          {/* Quick Links — يمين على الموبايل */}
          <div className="text-start">
            <h3 className="mb-3 text-base font-bold md:mb-4 md:text-lg">روابط سريعة</h3>
            <ul className="flex flex-col items-start gap-2">
              {NAVIGATION_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-slate-300 transition-colors hover:text-primary md:text-base"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Top Services — شمال على الموبايل */}
          <div className="text-start">
            <h3 className="mb-3 text-base font-bold md:mb-4 md:text-lg">أشهر الخدمات</h3>
            <ul className="flex flex-col items-start gap-2">
              {services.slice(0, 5).map((service) => (
                <li key={service.id}>
                  <Link
                    href={`/services/${service.slug}`}
                    className="text-sm text-slate-300 transition-colors hover:text-primary"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="mb-4 text-lg font-bold">تواصل معنا</h3>
            <div className="flex flex-col items-center gap-3 md:items-start">
              <a
                href={`tel:${CONTACT_PHONE}`}
                className="inline-flex items-center gap-2 text-sm text-slate-300 transition-colors hover:text-primary"
              >
                <Phone size={18} className="shrink-0 text-primary" />
                {CONTACT_PHONE}
              </a>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="inline-flex items-center gap-2 text-sm text-slate-300 transition-colors hover:text-primary"
              >
                <Mail size={18} className="shrink-0 text-primary" />
                {CONTACT_EMAIL}
              </a>
              <p className="inline-flex max-w-xs items-start justify-center gap-2 text-sm text-slate-300 md:justify-start">
                <MapPin size={18} className="mt-0.5 shrink-0 text-primary" />
                <span>{CONTACT_ADDRESS}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Social Links — الحسابات المتاحة للفرسان */}
        <div className="border-t border-white/10 pb-8 pt-8 text-center">
          <h3 className="mb-4 text-lg font-bold">تابعنا</h3>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href={SOCIAL_LINKS.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className={socialBtnClass}
              aria-label="Facebook"
              title="فيسبوك"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
                <path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.41 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.04V9.41c0-3.02 1.79-4.7 4.53-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.95.93-1.95 1.89v2.26h3.32l-.53 3.49h-2.79V24C19.62 23.1 24 18.1 24 12.07z" />
              </svg>
            </a>
            <a
              href={SOCIAL_LINKS.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className={socialBtnClass}
              aria-label="Instagram"
              title="انستجرام"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
                <path d="M12 2.16c3.2 0 3.58.01 4.85.07 3.25.15 4.77 1.69 4.92 4.92.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.15 3.23-1.66 4.77-4.92 4.92-1.27.06-1.64.07-4.85.07s-3.58-.01-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92-.06-1.27-.07-1.64-.07-4.85s.01-3.58.07-4.85C2.38 3.92 3.9 2.38 7.15 2.23 8.42 2.17 8.8 2.16 12 2.16zm0-2.16C8.74 0 8.33.01 7.05.07 2.7.27.27 2.69.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.2 4.36 2.62 6.78 6.98 6.98C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c4.35-.2 6.78-2.62 6.98-6.98.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95C23.73 2.7 21.31.27 16.95.07 15.67.01 15.26 0 12 0zm0 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm7.85-10.4a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0z" />
              </svg>
            </a>
            <a
              href={SOCIAL_LINKS.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className={socialBtnClass}
              aria-label="WhatsApp"
              title="واتساب"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
                <path d="M19.05 4.91A9.82 9.82 0 0 0 12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01zm-7.01 15.24c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.26 8.26 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.83c.02 4.54-3.68 8.23-8.22 8.23zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.13-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.07-.11-.25-.16-.5-.28z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/10 pt-8 text-center text-sm text-slate-400">
          <p>
            جميع الحقوق محفوظة{' '}
            <Link
              href="/admin"
              aria-label="صفحة الإدارة"
              title="صفحة الإدارة"
              className="transition-colors hover:text-primary"
            >
              ©
            </Link>{' '}
            2026 {SITE_NAME}.
          </p>
        </div>
        <div className="mt-3 flex justify-center">
          <a
            href="https://wa.me/201062672771?text=%D8%A3%D8%B1%D9%8A%D8%AF%20%D8%A7%D8%B3%D8%AA%D9%81%D8%B3%D8%A7%D8%B1"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="التواصل عبر واتساب مع Top1Markting"
            className="group inline-flex items-center gap-2.5 rounded-full bg-white py-2 ps-3 pe-4 shadow-[0_4px_18px_rgba(0,0,0,0.25)] ring-1 ring-black/5 transition-transform hover:-translate-y-0.5 touch-manipulation"
          >
            <Image
              src="/top1markting-mark.png"
              alt=""
              width={33}
              height={24}
              className="h-6 w-auto"
            />
            <span className="text-xs text-slate-500 sm:text-sm">تنفيذ</span>
            <span
              dir="ltr"
              className={`${spaceGrotesk.className} text-sm font-bold text-[#0a285f] sm:text-base`}
            >
              Top<span className="text-[#f5a623]">1</span>Markting
            </span>
            <ExternalLink className="h-4 w-4 text-slate-500 transition-colors group-hover:text-[#0a285f]" />
          </a>
        </div>
      </div>
    </footer>
  )
}
