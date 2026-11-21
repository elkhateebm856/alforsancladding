'use client'

import { Phone } from 'lucide-react'
import { CONTACT_PHONE, SOCIAL_LINKS } from '@/lib/constants'

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M19.05 4.91A9.82 9.82 0 0 0 12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01zm-7.01 15.24c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.26 8.26 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.83c.02 4.54-3.68 8.23-8.22 8.23zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.13-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.07-.11-.25-.16-.5-.28z" />
    </svg>
  )
}

export function ContactButtons() {
  return (
    <div className="fixed bottom-[max(3.75rem,calc(env(safe-area-inset-bottom)+3.25rem))] right-[max(0.875rem,env(safe-area-inset-right))] z-30 flex flex-col items-center gap-2.5 sm:bottom-6 sm:right-6 sm:gap-3">
      <a
        href={SOCIAL_LINKS.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        className="grid size-12 shrink-0 place-items-center rounded-full bg-[#25D366] text-white shadow-[0_10px_28px_-8px_rgba(37,211,102,0.55)] ring-1 ring-white/35 transition hover:scale-105 hover:bg-[#1ebe57] active:scale-95 sm:size-14"
        aria-label="تواصل عبر واتساب"
        title="تواصل عبر واتساب"
      >
        <WhatsAppIcon className="size-[1.35rem] sm:size-7" />
      </a>

      <a
        href={`tel:${CONTACT_PHONE}`}
        className="grid size-12 shrink-0 place-items-center rounded-full bg-primary text-white shadow-[0_10px_28px_-8px_rgba(201,162,39,0.55)] ring-1 ring-white/40 transition hover:scale-105 hover:bg-primary/90 active:scale-95 sm:size-14"
        aria-label="اتصل بنا"
        title="اتصل بنا مباشرة"
      >
        <Phone className="size-5 sm:size-6" strokeWidth={2.25} />
      </a>
    </div>
  )
}
