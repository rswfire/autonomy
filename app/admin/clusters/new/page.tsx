// app/admin/clusters/new/page.tsx
import { ClusterForm } from '@/components/admin/forms/ClusterForm'

export const dynamic = 'force-dynamic'

export default function CreateClusterPage() {
    return (
        <div className="max-w-5xl mx-auto py-8 px-6">
            <ClusterForm mode="create" />
        </div>
    )
}
