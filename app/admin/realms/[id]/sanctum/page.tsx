// app/admin/realms/[id]/sanctum/page.tsx

import { requireAuth } from '@/lib/utils/auth'
import { prisma } from '@/lib/db'
import Link from "next/link";
import { notFound, redirect } from 'next/navigation'
import SanctumManager from '@/components/admin/SanctumManager'

// app/admin/realms/[id]/sanctum/page.tsx

export default async function RealmSanctumPage({ params }: { params: Promise<{ id: string }> }) {
    const user = await requireAuth()
    const { id } = await params

    const realm = await prisma.realm.findFirst({
        where: {
            realm_id: id,
            user_id: user.user_id,
        },
    })

    if (!realm) {
        notFound()
    }

    const settings = realm.realm_settings as any || {}
    const sanctumSettings = {
        enabled: settings.sanctum?.enabled || false,
        display_name: settings.sanctum?.display_name || 'Sanctum',
        stripe: {
            account_id: settings.sanctum?.stripe?.account_id || null,
            onboarding_complete: settings.sanctum?.stripe?.onboarding_complete || false,
            charges_enabled: settings.sanctum?.stripe?.charges_enabled || false,
            payouts_enabled: settings.sanctum?.stripe?.payouts_enabled || false,
        },
        tiers: settings.sanctum?.tiers || [],
    }

    // Get subscription stats - handle empty result
    const subscriptionStats = await prisma.realmUser.groupBy({
        by: ['sanctum_tier'],
        where: {
            realm_id: id,
            user_role: 'SANCTUM',
            stripe_subscription_status: 'active',
        },
        _count: true,
    }).catch(() => []) || []

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
                    className="px-4 py-2 border-b-2 border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
                >
                    LLM Configuration
                </Link>
                <Link
                    href={`/admin/realms/${id}/sanctum`}
                    className="px-4 py-2 border-b-2 border-teal-600 text-teal-600 font-medium"
                >
                    Sanctum
                </Link>
            </div>

            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Sanctum Management
                </h1>
                <p className="text-gray-600">
                    Configure subscription tiers and monetization for {realm.realm_name}
                </p>
            </div>

            <SanctumManager
                realmId={realm.realm_id}
                settings={sanctumSettings}
                stats={subscriptionStats}
            />
        </div>
    )
}
