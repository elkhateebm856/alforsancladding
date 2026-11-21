import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Tajawal } from 'next/font/google'
import './globals.css'

const tajawal = Tajawal({
  subsets: ['arabic', 'latin'],
  weight: ['200', '300', '400', '500', '700', '800', '900'],
})

const SITE_URL = 'https://www.alforsancladding.com'

const SITE_NAME = 'الفرسان للواجهات الزجاجية والكلادينج'

const SITE_DESCRIPTION =
  'شركة الفرسان متخصصة في تصميم وتنفيذ وتركيب واجهات الكلادينج والواجهات الزجاجية والكيرتن وول وأبواب وشبابيك الألمنيوم وPVC وجميع أنواع المطابخ في المنصورة والدقهلية والقاهرة بأعلى جودة وأسعار تنافسية.'

const SHARE_IMAGE = `${SITE_URL}/logo.png`

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default:
      'الفرسان | واجهات كلادينج وواجهات زجاجية وكيرتن وول بالمنصورة والقاهرة',
    template: '%s | الفرسان',
  },

  description: SITE_DESCRIPTION,

  keywords: [
    'الفرسان',
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
      url: SITE_URL,
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
    canonical: SITE_URL,
  },

  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },

  openGraph: {
    type: 'website',

    locale: 'ar_EG',

    url: SITE_URL,

    siteName: SITE_NAME,

    title:
      'الفرسان | واجهات كلادينج وواجهات زجاجية وكيرتن وول بالمنصورة',

    description:
      'شركة الفرسان متخصصة في تنفيذ واجهات الكلادينج والواجهات الزجاجية والكيرتن وول وأبواب وشبابيك الألمنيوم وPVC وجميع أنواع المطابخ.',

    images: [
      {
        url: SHARE_IMAGE,
        width: 1200,
        height: 630,
        alt:
          'الفرسان للواجهات الزجاجية والكلادينج بالمنصورة والدقهلية والقاهرة',
        type: 'image/png',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',

    title:
      'الفرسان | واجهات كلادينج وواجهات زجاجية وكيرتن وول بالمنصورة',

    description:
      'شركة متخصصة في واجهات الكلادينج والواجهات الزجاجية والكيرتن وول وأعمال الألومنيوم.',

    images: [
      {
        url: SHARE_IMAGE,
        width: 1200,
        height: 630,
        alt: 'الفرسان للواجهات الزجاجية والكلادينج',
      },
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

        '@id': `${SITE_URL}/#organization`,

        name: 'شركة الفرسان',

        url: SITE_URL,

        logo: {
          '@type': 'ImageObject',

          url: SHARE_IMAGE,

          width: 1200,

          height: 630,
        },

        image: SHARE_IMAGE,

        telephone: '+201094656501',

        email: 'info@alforsancladding.com',

        sameAs: [
          'https://facebook.com/alfarsan',
          'https://instagram.com/alfarsan',
          'https://wa.me/201094656501',
        ],
      },

      {
        '@type': 'LocalBusiness',

        '@id': `${SITE_URL}/#localbusiness`,

        name:
          'شركة الفرسان للواجهات الزجاجية والكلادينج',

        url: SITE_URL,

        image: SHARE_IMAGE,

        logo: SHARE_IMAGE,

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

          latitude: 31.0409,

          longitude: 31.3785,
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

        '@id': `${SITE_URL}/#website`,

        url: SITE_URL,

        name: SITE_NAME,

        description: SITE_DESCRIPTION,

        inLanguage: 'ar',

        publisher: {
          '@id': `${SITE_URL}/#organization`,
        },
      },

      {
        '@type': 'WebPage',

        '@id': `${SITE_URL}/#webpage`,

        url: SITE_URL,

        name:
          'الفرسان للواجهات الزجاجية والكلادينج',

        description: SITE_DESCRIPTION,

        primaryImageOfPage: {
          '@type': 'ImageObject',

          url: SHARE_IMAGE,

          width: 1200,

          height: 630,
        },

        isPartOf: {
          '@id': `${SITE_URL}/#website`,
        },

        about: {
          '@id': `${SITE_URL}/#organization`,
        },

        inLanguage: 'ar',
      },

      {
        '@type': 'Service',

        serviceType:
          'تركيب واجهات كلادينج وواجهات زجاجية وكيرتن وول وأبواب وشبابيك ألمنيوم وأبواب وشبابيك PVC وجميع أنواع المطابخ',

        provider: {
          '@id': `${SITE_URL}/#organization`,
        },

        areaServed: [
          'المنصورة',
          'الدقهلية',
          'القاهرة',
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

                name:
                  'واجهات كلادينج للمحلات',
              },
            },

            {
              '@type': 'Offer',

              itemOffered: {
                '@type': 'Service',

                name:
                  'واجهات كلادينج للمولات التجارية',
              },
            },

            {
              '@type': 'Offer',

              itemOffered: {
                '@type': 'Service',

                name:
                  'واجهات كلادينج للمباني الإدارية',
              },
            },

            {
              '@type': 'Offer',

              itemOffered: {
                '@type': 'Service',

                name:
                  'واجهات كلادينج للفيلات',
              },
            },

            {
              '@type': 'Offer',

              itemOffered: {
                '@type': 'Service',

                name:
                  'واجهات كلادينج للمستشفيات',
              },
            },

            {
              '@type': 'Offer',

              itemOffered: {
                '@type': 'Service',

                name:
                  'واجهات عمائر سكنية',
              },
            },

            {
              '@type': 'Offer',

              itemOffered: {
                '@type': 'Service',

                name:
                  'واجهات كيرتن وول',
              },
            },

            {
              '@type': 'Offer',

              itemOffered: {
                '@type': 'Service',

                name:
                  'أبواب ألمنيوم',
              },
            },

            {
              '@type': 'Offer',

              itemOffered: {
                '@type': 'Service',

                name:
                  'شبابيك ألمنيوم',
              },
            },

            {
              '@type': 'Offer',

              itemOffered: {
                '@type': 'Service',

                name:
                  'جميع أنواع المطابخ',
              },
            },

            {
              '@type': 'Offer',

              itemOffered: {
                '@type': 'Service',

                name:
                  'أبواب وشبابيك PVC',
              },
            },
          ],
        },
      },
    ],
  }

  return (
    <html
      lang="ar"
      dir="rtl"
      className={`light ${tajawal.className}`}
      style={{ colorScheme: 'light' }}
    >
      <body className="bg-background text-foreground antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema),
          }}
        />

        {children}

        {process.env.NODE_ENV === 'production' && (
          <Analytics />
        )}
      </body>
    </html>
  )
}