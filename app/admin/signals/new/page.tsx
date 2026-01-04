// app/admin/signals/new/page.tsx
import {SignalForm} from "@/components/admin/forms/SignalForm";
import {getUserRealms} from '@/lib/queries/realm'
import {isPostgres} from '@/lib/types/common'
import {requireAuth} from '@/lib/utils/auth'

export default async function NewSignalPage() {
    const user = await requireAuth()
    const realmData = await getUserRealms({ userId: user.user_id })

    return (
        <div className="max-w-5xl mx-auto py-8 px-6">
            <SignalForm
                mode="create"
                realms={realmData.realms}
                isPostgres={!!isPostgres}
            />
        </div>
    )
}
