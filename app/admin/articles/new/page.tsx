import { ArticleEditor } from '@/components/admin/ArticleEditor'
import { AdminAccessGate } from '@/components/admin/AdminAccessGate'

export const dynamic = 'force-dynamic'

export default function NewArticlePage() {
  return <AdminAccessGate><ArticleEditor /></AdminAccessGate>
}
