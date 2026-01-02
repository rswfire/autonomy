// app/admin/signals/new/page.tsx
import { SignalForm } from '@/components/admin/forms/SignalForm'

export const dynamic = 'force-dynamic'

export default function CreateSignalPage() {
    return (
        <div className="max-w-5xl mx-auto py-8 px-6">
            <SignalForm mode="create" />
        </div>
    )
}
