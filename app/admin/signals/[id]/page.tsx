// app/admin/signals/[id]/page.tsx
import { SignalForm } from '@/components/admin/forms/SignalForm'
import { getSignalById } from '@/lib/queries/signal'
import { requireAuth } from '@/lib/utils/auth'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function EditSignalPage({
                                                 params
                                             }: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const user = await requireAuth()
    const signal = await getSignalById(id, user.role)

    if (!signal) {
        notFound()
    }

    return (
        <div className="max-w-5xl mx-auto py-8 px-6">
            <SignalForm mode="edit" defaultValues={signal} />
        </div>
    )
}
