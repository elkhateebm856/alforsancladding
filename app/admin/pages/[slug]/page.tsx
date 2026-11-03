import { PageEditor } from '@/components/admin/PageEditor'
import { AdminAccessGate } from '@/components/admin/AdminAccessGate'

export const dynamic = 'force-dynamic'

export default async function EditPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  return <AdminAccessGate><PageEditor slug={slug} /></AdminAccessGate>
}
