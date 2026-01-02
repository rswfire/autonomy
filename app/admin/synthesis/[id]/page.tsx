// app/admin/synthesis/[id]/page.tsx
import { SynthesisForm } from '@/components/admin/forms/SynthesisForm'
import { getSynthesisById } from '@/lib/queries/synthesis'
import { requireAuth } from '@/lib/utils/auth'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function EditSynthesisPage({
                                                    params
                                                }: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const user = await requireAuth()
    const synthesis = await getSynthesisById(id)

    if (!synthesis) {
        notFound()
    }

    return (
        <div className="max-w-5xl mx-auto py-8 px-6">
            <SynthesisForm mode="edit" defaultValues={synthesis} />
        </div>
    )
}
