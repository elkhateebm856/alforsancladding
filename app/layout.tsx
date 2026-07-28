import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Tajawal } from 'next/font/google'
import './globals.css'

const tajawal = Tajawal({
  subsets: ['arabic', 'latin'],
  weight: ['200', '300', '400', '500', '700', '800', '900'],
})

export const metadata: Metadata = {
  metadataBase: new URL('https://your-domain.com'),

  title: {
    default: 'الفرسان للواجهات الزجاجية والكلادينج بالمنصورة والقاهرة',
    template: '%s | الفرسان للواجهات الزجاجية والكلادينج',
  },

  description:
    'شركة الفرسان متخصصة في تصميم وتنفيذ وتركيب الواجهات الزجاجية والكلادينج للمباني السكنية والتجارية والإدارية بالمنصورة والقاهرة، بأعلى معايير الجودة والاحترافية.',

  keywords: [
    'واجهات زجاجية',
    'كلادينج',
    'واجهات كلادينج',
    'واجهات زجاجية بالمنصورة',
    'واجهات زجاجية بالقاهرة',
    'كلادينج المنصورة',
    'كلادينج القاهرة',
    'شركة واجهات زجاجية',
    'الفرسان',
  ],

  authors: [
    {
      name: 'شركة الفرسان',
    },
  ],

  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },

  openGraph: {
    title: 'الفرسان للواجهات الزجاجية والكلادينج بالمنصورة والقاهرة',
    description:
      'شركة متخصصة في تصميم وتنفيذ الواجهات الزجاجية والكلادينج بأعلى معايير الجودة.',
    images: ['/logo.png'],
    locale: 'ar_EG',
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'الفرسان للواجهات الزجاجية والكلادينج',
    description:
      'شركة متخصصة في تصميم وتنفيذ الواجهات الزجاجية والكلادينج.',
    images: ['/logo.png'],
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#C9A227',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" dir="rtl" className={tajawal.className}>
      <body className="antialiased bg-background text-foreground">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}