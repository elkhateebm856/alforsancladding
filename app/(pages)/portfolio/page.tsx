import type { Metadata } from 'next'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ContactButtons } from '@/components/common/ContactButtons'
import { PublicReviewForm } from '@/components/common/PublicReviewForm'
import { PortfolioPageClient } from '@/components/portfolio/PortfolioPageClient'
import { SITE_NAME } from '@/lib/constants'

export const metadata: Metadata = {
  title: `أعمالنا | ${SITE_NAME}`,
  description: 'استعرض مجموعة من مشاريع الفرسان في الواجهات الزجاجية والكلادينج',
  alternates: {
    canonical: 'https://www.alforsancladding.com/portfolio',
  },
  openGraph: {
    title: `أعمالنا | ${SITE_NAME}`,
    description: 'استعرض مجموعة من مشاريع الفرسان في الواجهات الزجاجية والكلادينج',
    url: 'https://www.alforsancladding.com/portfolio',
    type: 'website',
    images: [
      {
        url: 'https://www.alforsancladding.com/hero.jpg',
        width: 1200,
        height: 630,
        alt: 'أعمالنا في شركة الفرسان',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `أعمالنا | ${SITE_NAME}`,
    description: 'استعرض مجموعة من مشاريع الفرسان في الواجهات الزجاجية والكلادينج',
    images: ['https://www.alforsancladding.com/hero.jpg'],
  },
}

export default function PortfolioPage() {
  return (
    <>
      <Header />
      <main className="bg-background">
        <PortfolioPageClient />
        <PublicReviewForm />
      </main>
      <Footer />
      <ContactButtons />
    </>
  )
}
