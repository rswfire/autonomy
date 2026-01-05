// app/admin/realms/[id]/page.tsx
import { requireAuth } from '@/lib/utils/auth'
import { getRealmById } from '@/lib/queries/realm'
import { RealmForm } from '@/components/admin/forms/RealmForm'
import { notFound } from 'next/navigation'

export default async function EditRealmPage({ params }: { params: Promise<{ id: string }> }) {
    const user = await requireAuth()
    const { id } = await params
    const realm = await getRealmById(id)

    if (!realm) {
        notFound()
    }

    const serializedRealm = {
        ...realm,
        stamp_created: realm.stamp_created?.toISOString(),
        stamp_updated: realm.stamp_updated?.toISOString(),
        realm_settings: realm.realm_settings ? JSON.stringify(realm.realm_settings, null, 2) : '',
    }

    return (
        <div className="max-w-4xl mx-auto py-4 md:py-8 px-4 md:px-6">
            <RealmForm mode="edit" userId={user.user_id} defaultValues={serializedRealm} />
        </div>
    )
}
