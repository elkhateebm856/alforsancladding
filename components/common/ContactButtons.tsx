'use client'

import Image from 'next/image'
import { Phone } from 'lucide-react'
import { CONTACT_PHONE, SOCIAL_LINKS } from '@/lib/constants'

export function ContactButtons() {
  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-4 z-30">
      {/* WhatsApp Button */}
      <a
        href={SOCIAL_LINKS.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-all transform hover:scale-110"
        aria-label="WhatsApp"
        title="تواصل عبر واتساب"
      >
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/whatsapp-logo-8BlB1bIAhVHSHl3FcWdBTRgXT4HWEn.png"
          alt="WhatsApp"
          width={40}
          height={40}
        />
      </a>

      {/* Phone Button */}
      <a
        href={`tel:${CONTACT_PHONE}`}
        className="w-16 h-16 bg-primary rounded-full shadow-lg flex items-center justify-center hover:bg-primary/90 transition-all transform hover:scale-110 hover:shadow-xl text-white"
        aria-label="اتصال"
        title="اتصل بنا مباشرة"
      >
        <Phone size={28} />
      </a>
    </div>
  )
}
