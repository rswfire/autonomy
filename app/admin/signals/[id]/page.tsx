// app/admin/signals/[id]/page.tsx
import { isPostgres } from '@/lib/types/common'
import { SignalForm } from '@/components/admin/forms/SignalForm'
import { getSignalById } from '@/lib/queries/signal'
import { getUserRealms } from '@/lib/queries/realm'
import { requireAuth } from '@/lib/utils/auth'
import { notFound } from 'next/navigation'

export default async function EditSignalPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params
    const user = await requireAuth()

    // Fetch both signal and realms
    const signal = await getSignalById(resolvedParams.id, user.user_id)
    const realmData = await getUserRealms({ userId: user.user_id })

    if (!signal) {
        notFound()
    }

    const signalForClient = {
        ...signal,
        stamp_created: signal.stamp_created?.toISOString(),
        stamp_updated: signal.stamp_updated?.toISOString(),
        stamp_imported: signal.stamp_imported?.toISOString(),
        signal_temperature: signal.signal_temperature ? Number(signal.signal_temperature) : null,
        signal_density: signal.signal_density ? Number(signal.signal_density) : null,
    }

    return (
        <div className="max-w-5xl mx-auto py-8 px-6">
            <SignalForm
                mode="edit"
                defaultValues={signalForClient}
                realms={realmData.realms}
                isPostgres={!!isPostgres}
                signalId={signal.signal_id}
            />
        </div>
    )
}
