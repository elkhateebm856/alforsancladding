import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Tajawal } from 'next/font/google'
import './globals.css'

const tajawal = Tajawal({
  subsets: ['arabic', 'latin'],
  weight: ['200', '300', '400', '500', '700', '800', '900'],
})

export const metadata: Metadata = {
  metadataBase: new URL('https://www.alforsancladding.com'),

  title: {
    default:
      'الفرسان | واجهات كلادينج وواجهات زجاجية وكيرتن وول بالمنصورة والقاهرة',
    template: '%s | الفرسان',
  },

  description:
    'شركة الفرسان متخصصة في تصميم وتنفيذ وتركيب واجهات الكلادينج، الواجهات الزجاجية، الكيرتن وول، أبواب وشبابيك الألمنيوم، أبواب وشبابيك PVC، وجميع أنواع المطابخ في المنصورة وجميع مدن الدقهلية والقاهرة بأعلى جودة وأسعار تنافسية.',

  keywords: [
    'واجهات كلادينج',
    'كلادينج',
    'كلادينج المنصورة',
    'واجهات زجاجية',
    'واجهات زجاجية المنصورة',
    'واجهات زجاجية القاهرة',
    'شركة واجهات زجاجية',
    'شركة كلادينج',
    'تركيب كلادينج',
    'تركيب واجهات زجاجية',
    'كيرتن وول',
    'Curtain Wall',
    'واجهات كيرتن وول',
    'واجهات كلادينج للمحلات',
    'واجهات كلادينج للمولات',
    'واجهات كلادينج للمستشفيات',
    'واجهات كلادينج للفيلات',
    'واجهات عمائر سكنية',
    'واجهات المباني الإدارية',
    'أبواب ألمنيوم',
    'شبابيك ألمنيوم',
    'أبواب وشبابيك PVC',
    'مطابخ ألمنيوم',
    'مطابخ HPL',
    'مطابخ مودرن',
    'مطابخ حسب المقاس',
    'المنصورة',
    'الدقهلية',
    'طلخا',
    'ميت غمر',
    'أجا',
    'السنبلاوين',
    'بلقاس',
    'دكرنس',
    'شربين',
    'نبروه',
    'المنزلة',
    'تمي الأمديد',
    'بني عبيد',
    'جمصة',
    'المطرية',
    'القاهرة',
    'القاهرة الجديدة',
    'مدينة نصر',
    'التجمع الخامس',
    'مصر الجديدة',
    'الشيخ زايد',
    '6 أكتوبر',
  ],

  authors: [
    {
      name: 'شركة الفرسان',
      url: 'https://www.alforsancladding.com',
    },
  ],

  creator: 'شركة الفرسان',

  publisher: 'شركة الفرسان',

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-video-preview': -1,
      'max-snippet': -1,
    },
  },

  alternates: {
    canonical: 'https://www.alforsancladding.com',
  },

  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },

  openGraph: {
    title:
      'الفرسان | واجهات كلادينج وواجهات زجاجية وكيرتن وول بالمنصورة',

    description:
      'شركة الفرسان متخصصة في تنفيذ واجهات الكلادينج والواجهات الزجاجية والكيرتن وول وأبواب وشبابيك الألمنيوم وPVC وجميع أنواع المطابخ.',

    url: 'https://www.alforsancladding.com',

    siteName: 'الفرسان',

    locale: 'ar_EG',

    type: 'website',

    images: [
      {
        url: 'https://www.alforsancladding.com/logo.png',
        width: 1200,
        height: 630,
        alt: 'الفرسان',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',

    title: 'الفرسان',

    description:
      'شركة متخصصة في واجهات الكلادينج والواجهات الزجاجية والكيرتن وول.',

    images: [
      'https://www.alforsancladding.com/logo.png',
    ],
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
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://www.alforsancladding.com/#organization',
        name: 'الفرسان',
        url: 'https://www.alforsancladding.com',
        logo: 'https://www.alforsancladding.com/logo.png',
        image: 'https://www.alforsancladding.com/logo.png',
        telephone: '+201094656501',
        email: 'info@alforsancladding.com',

        sameAs: [
          'https://facebook.com/alfarsan',
          'https://instagram.com/alfarsan',
          'https://linkedin.com/company/alfarsan',
        ],
      },

      {
        '@type': 'LocalBusiness',
        '@id': 'https://www.alforsancladding.com/#localbusiness',

        name: 'الفرسان',

        url: 'https://www.alforsancladding.com',

        image: 'https://www.alforsancladding.com/logo.png',

        telephone: '+201094656501',

        email: 'info@alforsancladding.com',

        address: {
          '@type': 'PostalAddress',

          streetAddress: 'طريق السنبلاوين',

          addressLocality: 'المنصورة',

          addressRegion: 'الدقهلية',

          postalCode: '35511',

          addressCountry: 'EG',
        },

        geo: {
          '@type': 'GeoCoordinates',

          latitude: '31.0409',

          longitude: '31.3785',
        },

        areaServed: [
          'المنصورة',
          'طلخا',
          'ميت غمر',
          'أجا',
          'السنبلاوين',
          'بلقاس',
          'دكرنس',
          'شربين',
          'نبروه',
          'تمي الأمديد',
          'بني عبيد',
          'المنزلة',
          'المطرية',
          'جمصة',

          'القاهرة',
          'القاهرة الجديدة',
          'مدينة نصر',
          'التجمع الخامس',
          'مصر الجديدة',
          'المعادي',
          'الشيخ زايد',
          '6 أكتوبر',
        ],

        openingHours: 'Sa-Th 09:00-20:00',

        priceRange: '$$',
      },

      {
        '@type': 'WebSite',

        '@id': 'https://www.alforsancladding.com/#website',

        url: 'https://www.alforsancladding.com',

        name: 'الفرسان',

        inLanguage: 'ar',

        publisher: {
          '@id':
            'https://www.alforsancladding.com/#organization',
        },
      },
            {
        '@type': 'WebPage',
        '@id': 'https://www.alforsancladding.com/#webpage',
        url: 'https://www.alforsancladding.com',
        name: 'الفرسان للواجهات الزجاجية والكلادينج',
        isPartOf: {
          '@id': 'https://www.alforsancladding.com/#website',
        },
        about: {
          '@id': 'https://www.alforsancladding.com/#organization',
        },
        inLanguage: 'ar',
      },

      {
        '@type': 'SearchAction',
        target: 'https://www.alforsancladding.com/search?q={search_term_string}',
        'query-input': 'required name=search_term_string',
      },

      {
        '@type': 'Service',
        serviceType:
          'تركيب واجهات كلادينج، واجهات زجاجية، كيرتن وول، أبواب ألمنيوم، شبابيك ألمنيوم، أبواب وشبابيك PVC، جميع أنواع المطابخ',

        provider: {
          '@id': 'https://www.alforsancladding.com/#organization',
        },

        areaServed: [
          'المنصورة',
          'الدقهلية',
          'طلخا',
          'ميت غمر',
          'أجا',
          'السنبلاوين',
          'بلقاس',
          'دكرنس',
          'شربين',
          'نبروه',
          'تمي الأمديد',
          'المنزلة',
          'جمصة',
          'المطرية',
          'القاهرة',
          'مدينة نصر',
          'القاهرة الجديدة',
          'التجمع الخامس',
          '6 أكتوبر',
          'الشيخ زايد',
        ],

        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'خدمات الفرسان',
          itemListElement: [
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'تركيب واجهات كلادينج',
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'واجهات كلادينج للمحلات',
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'واجهات كلادينج للمولات التجارية',
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'واجهات كلادينج للمباني الإدارية',
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'واجهات كلادينج للفيلات',
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'واجهات كلادينج للمستشفيات',
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'واجهات عمائر سكنية',
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'واجهات كيرتن وول',
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'أبواب ألمنيوم',
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'شبابيك ألمنيوم',
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'جميع أنواع المطابخ',
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'أبواب وشبابيك PVC',
              },
            },
          ],
        },
      },
    ],
  }

  return (
    <html lang="ar" dir="rtl" className={tajawal.className}>
      <body className="antialiased bg-background text-foreground">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema),
          }}
        />

        {children}

        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}