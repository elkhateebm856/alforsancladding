import { blogPosts } from '@/data/blog'
import { testimonials as legacyTestimonials } from '@/data/testimonials'
import { AdminDashboard } from '@/components/admin/AdminDashboard'
import { AdminAccessGate } from '@/components/admin/AdminAccessGate'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const articles = blogPosts.map((article) => ({
    id: String(article.id),
    slug: article.slug,
    title: article.title,
    excerpt: article.excerpt,
    image: article.image,
    date: article.date,
    category: '',
    status: 'published',
    source: 'legacy',
  }))
  const testimonials = legacyTestimonials.map((item) => ({
    ...item,
    id: String(item.id),
    status: 'approved',
    source: 'legacy',
  }))
  return (
    <AdminAccessGate>
      <AdminDashboard
        email="alforsancladding@gmail.com"
        legacyArticles={articles}
        legacyTestimonials={testimonials}
      />
    </AdminAccessGate>
  )
}
