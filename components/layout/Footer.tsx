import Link from 'next/link'
import Image from 'next/image'
import {
  MapPin,
  Phone,
  Mail,
  ExternalLink,
  MessageCircle,
  Music2,
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

export function Footer() {
  return (
    <footer className="bg-secondary text-white">
      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-bold mb-4">عن {SITE_NAME}</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              شركة متخصصة في تركيب الواجهات الزجاجية والكلادينج بأعلى مستويات الجودة
              والاحترافية. نقدم حلولاً مبتكرة لمشاريعك.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">روابط سريعة</h3>
            <ul className="space-y-2">
              {NAVIGATION_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-gray-300 hover:text-primary transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Top Services */}
          <div>
            <h3 className="text-lg font-bold mb-4">أشهر الخدمات</h3>
            <ul className="space-y-2">
              {services.slice(0, 5).map((service) => (
                <li key={service.id}>
                  <Link
                    href={`/services/${service.slug}`}
                    className="text-gray-300 hover:text-primary transition-colors text-sm"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-4">تواصل معنا</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Phone size={18} className="mt-1 flex-shrink-0 text-primary" />
                <a
                  href={`tel:${CONTACT_PHONE}`}
                  className="text-gray-300 hover:text-primary transition-colors text-sm"
                >
                  {CONTACT_PHONE}
                </a>
              </div>
              <div className="flex items-start gap-3">
                <Mail size={18} className="mt-1 flex-shrink-0 text-primary" />
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="text-gray-300 hover:text-primary transition-colors text-sm"
                >
                  {CONTACT_EMAIL}
                </a>
              </div>
              <div className="flex items-start gap-3">
                <MapPin size={18} className="mt-1 flex-shrink-0 text-primary" />
                <p className="text-gray-300 text-sm">{CONTACT_ADDRESS}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="border-t border-gray-700 pt-8 pb-8">
          <h3 className="text-lg font-bold mb-4">تابعنا</h3>
          <div className="flex flex-wrap gap-3">
            <a
              href={SOCIAL_LINKS.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-primary/50 bg-primary/10 text-[#e4c15a] shadow-[0_0_16px_rgba(201,162,39,0.12)] transition-all hover:-translate-y-0.5 hover:border-primary hover:bg-primary hover:text-slate-950 hover:shadow-[0_0_22px_rgba(201,162,39,0.3)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
              aria-label="Facebook"
              title="فيسبوك"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
                <path d="M13.5 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.5 1.6-1.5h1.7V3.9c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3V10H7.3v3h2.8v8h3.4Z" />
              </svg>
            </a>
            <a
              href={SOCIAL_LINKS.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-primary/50 bg-primary/10 text-[#e4c15a] shadow-[0_0_16px_rgba(201,162,39,0.12)] transition-all hover:-translate-y-0.5 hover:border-primary hover:bg-primary hover:text-slate-950 hover:shadow-[0_0_22px_rgba(201,162,39,0.3)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
              aria-label="Instagram"
              title="انستجرام"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.6" cy="6.7" r="1" fill="currentColor" stroke="none" />
              </svg>
            </a>
            <a
              href="https://www.tiktok.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-primary/50 bg-primary/10 text-[#e4c15a] shadow-[0_0_16px_rgba(201,162,39,0.12)] transition-all hover:-translate-y-0.5 hover:border-primary hover:bg-primary hover:text-slate-950 hover:shadow-[0_0_22px_rgba(201,162,39,0.3)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
              aria-label="TikTok"
              title="تيك توك"
            >
              <Music2 size={20} aria-hidden="true" />
            </a>
            <a
              href={SOCIAL_LINKS.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-primary/50 bg-primary/10 text-[#e4c15a] shadow-[0_0_16px_rgba(201,162,39,0.12)] transition-all hover:-translate-y-0.5 hover:border-primary hover:bg-primary hover:text-slate-950 hover:shadow-[0_0_22px_rgba(201,162,39,0.3)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
              aria-label="WhatsApp"
              title="واتساب"
            >
              <MessageCircle size={20} aria-hidden="true" />
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 pt-8 text-center text-sm text-gray-400">
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
