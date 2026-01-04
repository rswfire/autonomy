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

    // Convert Decimal to number for client component
    const signalForClient = {
        ...signal,
        signal_temperature: signal.signal_temperature ? Number(signal.signal_temperature) : 0.0,
    }

    return (
        <div className="max-w-5xl mx-auto py-8 px-6">
            <SignalForm
                mode="edit"
                defaultValues={signalForClient}
                realms={realmData.realms}
                isPostgres={!!isPostgres}
            />
        </div>
    )
}
