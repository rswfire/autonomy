// app/admin/realms/page.tsx
import { requireAuth } from '@/lib/utils/auth'
import { getUserRealms } from '@/lib/queries/realm'
import Link from 'next/link'
import { Button } from '@/components/admin/ui/Button'
import Icon from '@/components/Icon'

export default async function RealmsPage() {
    const user = await requireAuth()
    const { realms, total } = await getUserRealms({ userId: user.user_id })

    return (
        <div className="max-w-7xl mx-auto py-4 md:py-8 px-4 md:px-6">
            <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Realms</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Manage your sovereign territories ({total} total)
                    </p>
                </div>
                <Link href="/admin/realms/new">
                    <Button className="w-full md:w-auto">
                        <Icon name="Plus" size={16} className="mr-2" />
                        Create Realm
                    </Button>
                </Link>
            </div>

            <div className="grid gap-6">
                {realms.map((realm) => (
                    // app/admin/realms/page.tsx - Add Sanctum button to realm card

                    <div key={realm.realm_id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex justify-between items-start">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        {realm.realm_name}
                                    </h3>
                                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-teal-100 text-teal-800">
                    {realm.realm_type}
                </span>
                                    {realm.flag_registry && (
                                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                        Public Registry
                    </span>
                                    )}
                                </div>

                                <div className="space-y-1 text-sm">
                                    <p className="font-mono text-teal-600">
                                        {realm.realm_slug}.autonomyrealms.com
                                    </p>
                                    {realm.realm_description && (
                                        <p className="text-gray-600">{realm.realm_description}</p>
                                    )}
                                    <p className="text-gray-500">
                                        ID: <span className="font-mono text-xs">{realm.realm_id}</span>
                                    </p>
                                    <p className="text-gray-500">
                                        Created: {new Date(realm.stamp_created).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <Link href={`/admin/realms/${realm.realm_id}/sanctum`}>
                                    <Button variant="ghost" size="sm">
                                        <Icon name="Sprout" size={16} className="mr-2" />
                                        Sanctum
                                    </Button>
                                </Link>
                                <Link href={`/admin/realms/${realm.realm_id}`}>
                                    <Button variant="ghost" size="sm">
                                        <Icon name="Edit" size={16} className="mr-2" />
                                        Edit
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}

                {realms.length === 0 && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                        <p className="text-gray-500 mb-4">No realms found</p>
                        <Link href="/admin/realms/new">
                            <Button>
                                <Icon name="Plus" size={16} className="mr-2" />
                                Create Your First Realm
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}
