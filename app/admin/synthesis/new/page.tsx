// app/admin/synthesis/new/page.tsx
import { SynthesisForm } from '@/components/admin/forms/SynthesisForm'

export const dynamic = 'force-dynamic'

export default function CreateSynthesisPage() {
    return (
        <div className="max-w-5xl mx-auto py-8 px-6">
            <SynthesisForm mode="create" />
        </div>
    )
}
