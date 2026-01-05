// app/admin/realms/new/page.tsx
import { requireAuth } from '@/lib/utils/auth'
import { RealmForm } from '@/components/admin/forms/RealmForm'

export default async function NewRealmPage() {
    const user = await requireAuth()

    return (
        <div className="max-w-4xl mx-auto py-4 md:py-8 px-4 md:px-6">
            <RealmForm mode="create" userId={user.user_id} />
        </div>
    )
}
