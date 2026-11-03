import { PageEditor } from '@/components/admin/PageEditor'
import { AdminAccessGate } from '@/components/admin/AdminAccessGate'

export const dynamic = 'force-dynamic'

export default function NewPage() {
  return <AdminAccessGate><PageEditor /></AdminAccessGate>
}
