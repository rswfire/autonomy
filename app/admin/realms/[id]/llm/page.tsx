// app/admin/realms/[id]/llm/page.tsx

import { requireAuth } from '@/lib/utils/auth'
import { getRealmById } from '@/lib/queries/realm'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { LlmSettingsManager } from '@/components/admin/LlmSettingsManager'

export default async function RealmLlmPage({ params }: { params: Promise<{ id: string }> }) {
    const user = await requireAuth()
    const { id } = await params

    const realm = await getRealmById(id)

    if (!realm || realm.user_id !== user.user_id) {
        notFound()
    }

    const settings = realm.realm_settings as any || {}
    const llmSettings = {
        accounts: settings.llm?.accounts || [],
        default_account_id: settings.llm?.default_account_id || null,
        auto_analyze: settings.llm?.auto_analyze || false,
    }

    return (
        <div className="max-w-6xl mx-auto py-8 px-4">
            {/* Navigation Tabs */}
            <div className="mb-6 flex gap-2 border-b border-gray-200">
                <Link
                    href={`/admin/realms/${id}`}
                    className="px-4 py-2 border-b-2 border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
                >
                    Settings
                </Link>
                <Link
                    href={`/admin/realms/${id}/llm`}
                    className="px-4 py-2 border-b-2 border-teal-600 text-teal-600 font-medium"
                >
                    LLM Configuration
                </Link>
                <Link
                    href={`/admin/realms/${id}/sanctum`}
                    className="px-4 py-2 border-b-2 border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
                >
                    Sanctum
                </Link>
            </div>

            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    LLM Configuration
                </h1>
                <p className="text-gray-600">
                    Configure AI analysis and synthesis for {realm.realm_name}
                </p>
            </div>

            <LlmSettingsManager
                realmId={realm.realm_id}
                settings={llmSettings}
            />
        </div>
    )
}
