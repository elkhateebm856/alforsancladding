import { blogPosts } from '@/data/blog'
import { ArticleEditor } from '@/components/admin/ArticleEditor'
import { AdminAccessGate } from '@/components/admin/AdminAccessGate'

export const dynamic = 'force-dynamic'

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const initialArticle = blogPosts.find((article) => article.slug === slug) || null
  return (
    <AdminAccessGate>
      <ArticleEditor slug={slug} initialArticle={initialArticle} />
    </AdminAccessGate>
  )
}
