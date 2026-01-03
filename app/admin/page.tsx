// app/admin/page.tsx
import Link from 'next/link'
import { requireAuth } from '@/lib/utils/auth'
import { querySignals } from '@/lib/queries/signal'
import { queryClusters } from '@/lib/queries/cluster'
import { querySynthesis } from '@/lib/queries/synthesis'
import { listUsers } from '@/lib/queries/user'
import Icon from '@/components/Icon'

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
    const user = await requireAuth()

    // Get counts
    const [signalsData, clustersData, synthesisData, usersData] = await Promise.all([
        querySignals({ limit: 1, offset: 0, sort_order: 'desc' }, user.user_id),
        queryClusters({ limit: 1, offset: 0, sort_order: 'desc' }),
        querySynthesis({ limit: 1, offset: 0, sort_order: 'desc' }),
        listUsers({ limit: 1, offset: 0 }),
    ])

    const stats = [
        {
            name: 'Signals',
            count: signalsData.total,
            href: '/admin/signals',
            icon: 'SquareActivity' as const,
            color: 'bg-blue-500',
            description: 'Atomic data observations',
        },
        {
            name: 'Clusters',
            count: clustersData.total,
            href: '/admin/clusters',
            icon: 'SquareCode' as const,
            color: 'bg-purple-500',
            description: 'Grouped signal collections',
        },
        {
            name: 'Synthesis',
            count: synthesisData.total,
            href: '/admin/synthesis',
            icon: 'SquareAsterisk' as const,
            color: 'bg-teal-500',
            description: 'AI-generated insights',
        },
        {
            name: 'Users',
            count: usersData.length,
            href: '/admin/users',
            icon: 'SquareUserRound' as const,
            color: 'bg-orange-500',
            description: 'System user accounts',
        },
    ]

    return (
        <div className="max-w-7xl mx-auto py-8 px-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="mt-2 text-gray-600">
                    Welcome back, {user.email}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat) => (
                    <Link
                        key={stat.name}
                        href={stat.href}
                        className="group relative bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={`${stat.color} p-3 rounded-lg`}>
                                <Icon name={stat.icon} size={24} className="text-white" />
                            </div>
                            <span className="text-3xl font-bold text-gray-900">{stat.count}</span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-teal-600 transition-colors">
                            {stat.name}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">{stat.description}</p>
                    </Link>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Quick Actions */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                    <div className="space-y-3">
                        <Link
                            href="/admin/signals/new"
                            className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                        >
                            <div className="flex items-center">
                                <Icon name="Plus" size={20} className="text-gray-400 group-hover:text-teal-600" />
                                <span className="ml-3 text-sm font-medium text-gray-700 group-hover:text-gray-900">
                  Create Signal
                </span>
                            </div>
                            <Icon name="ChevronRight" size={16} className="text-gray-400" />
                        </Link>

                        <Link
                            href="/admin/clusters/new"
                            className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                        >
                            <div className="flex items-center">
                                <Icon name="Plus" size={20} className="text-gray-400 group-hover:text-teal-600" />
                                <span className="ml-3 text-sm font-medium text-gray-700 group-hover:text-gray-900">
                  Create Cluster
                </span>
                            </div>
                            <Icon name="ChevronRight" size={16} className="text-gray-400" />
                        </Link>

                        <Link
                            href="/admin/synthesis/new"
                            className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                        >
                            <div className="flex items-center">
                                <Icon name="Plus" size={20} className="text-gray-400 group-hover:text-teal-600" />
                                <span className="ml-3 text-sm font-medium text-gray-700 group-hover:text-gray-900">
                  Create Synthesis
                </span>
                            </div>
                            <Icon name="ChevronRight" size={16} className="text-gray-400" />
                        </Link>

                        <Link
                            href="/admin/users/new"
                            className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                        >
                            <div className="flex items-center">
                                <Icon name="Plus" size={20} className="text-gray-400 group-hover:text-teal-600" />
                                <span className="ml-3 text-sm font-medium text-gray-700 group-hover:text-gray-900">
                  Create User
                </span>
                            </div>
                            <Icon name="ChevronRight" size={16} className="text-gray-400" />
                        </Link>
                    </div>
                </div>

                {/* System Info */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">System Information</h2>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between py-2 border-b border-gray-100">
                            <span className="text-sm text-gray-600">Role</span>
                            <span className="text-sm font-medium text-gray-900">{user.user_id}</span>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b border-gray-100">
                            <span className="text-sm text-gray-600">Database</span>
                            <span className="text-sm font-medium text-gray-900">
                {process.env.DATABASE_URL?.startsWith('postgres') ? 'PostgreSQL' : 'MySQL'}
              </span>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b border-gray-100">
                            <span className="text-sm text-gray-600">Total Records</span>
                            <span className="text-sm font-medium text-gray-900">
                {signalsData.total + clustersData.total + synthesisData.total}
              </span>
                        </div>
                        <div className="flex items-center justify-between py-2">
                            <span className="text-sm text-gray-600">Version</span>
                            <span className="text-sm font-medium text-gray-900">v0.1.0</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
