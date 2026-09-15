import Link from 'next/link'
import Image from 'next/image'
import {
  MapPin,
  Phone,
  Mail,
  Share2,
  Heart,
  Share,
  MessageCircle,
} from 'lucide-react'
import {
  CONTACT_ADDRESS,
  CONTACT_EMAIL,
  CONTACT_PHONE,
  NAVIGATION_ITEMS,
  SOCIAL_LINKS,
  SITE_NAME,
} from '@/lib/constants'
import { services } from '@/data/services'

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
          <div className="flex gap-6">
            <a
              href={SOCIAL_LINKS.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:scale-110 transition-transform"
              aria-label="Facebook"
              title="فيسبوك"
            >
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/download-qGwSvW3vVqCILjjZbx19KueaYRznkx.png"
                alt="Facebook"
                width={40}
                height={40}
              />
            </a>
            <a
              href={SOCIAL_LINKS.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:scale-110 transition-transform"
              aria-label="Instagram"
              title="انستجرام"
            >
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/download1-UdJTD5sRMQ2MlZOQxlnkTRlQwMg1tH.jpg"
                alt="Instagram"
                width={40}
                height={40}
                className="rounded-lg"
              />
            </a>
            <a
              href="https://www.tiktok.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:scale-110 transition-transform"
              aria-label="TikTok"
              title="تيك توك"
            >
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%D8%B4%D8%B9%D8%A7%D8%B1%20%D8%AA%D9%8A%D9%83%20%D8%AA%D9%88%D9%83-iAgcYngzgdTx5CrC8bPe35vEPW3OZL.png"
                alt="TikTok"
                width={40}
                height={40}
              />
            </a>
            <a
              href={SOCIAL_LINKS.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:scale-110 transition-transform"
              aria-label="WhatsApp"
              title="واتساب"
            >
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/whatsapp-logo-8BlB1bIAhVHSHl3FcWdBTRgXT4HWEn.png"
                alt="WhatsApp"
                width={40}
                height={40}
              />
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 pt-8 text-center text-gray-400 text-sm">
  <p>
    جميع الحقوق محفوظة © {new Date().getFullYear()} {SITE_NAME}.
    <br />
    تم التصميم والإهداء بواسطة{' '}
    <a
      href="https://wa.me/201062672771"
      target="_blank"
      rel="noopener noreferrer"
      className="text-primary hover:underline font-bold"
    >
      المهندس محمد الخطيب
    </a>
  </p>
</div>
      </div>
    </footer>
  )
}
