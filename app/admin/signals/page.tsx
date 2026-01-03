// app/admin/signals/page.tsx
import Link from 'next/link'
import { querySignals } from '@/lib/queries/signal'
import { requireAuth } from '@/lib/utils/auth'
import { Button } from '@/components/admin/ui/Button'
import { Badge } from '@/components/admin/ui/Badge'
import Icon from '@/components/Icon'

export const dynamic = 'force-dynamic'

export default async function SignalsListPage() {
    const user = await requireAuth()
    const { signals } = await querySignals(
        {
            limit: 100,
            offset: 0,
            sort_order: 'desc',
        },
        user.user_id
    )

    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'ACTIVE': return 'success'
            case 'PENDING': return 'warning'
            case 'ARCHIVED': return 'default'
            default: return 'default'
        }
    }

    return (
        <div className="max-w-7xl mx-auto py-8 px-6">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Signals</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Manage your signal documentation
                    </p>
                </div>
                <Link href="/admin/signals/new">
                    <Button>
                        <Icon name="Plus" size={16} className="mr-2" />
                        Create Signal
                    </Button>
                </Link>
            </div>

            <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Title
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Author
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Visibility
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Created
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {signals.length === 0 ? (
                        <tr>
                            <td colSpan={7} className="px-6 py-12 text-center">
                                <div className="text-gray-500">
                                    <p className="text-sm">No signals found.</p>
                                    <Link href="/admin/signals/new" className="mt-2 inline-block">
                                        <Button size="sm" variant="primary">
                                            Create your first signal
                                        </Button>
                                    </Link>
                                </div>
                            </td>
                        </tr>
                    ) : (
                        signals.map((signal) => (
                            <tr key={signal.signal_id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">
                                        {signal.signal_title}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-xs font-mono text-gray-600">
                                            {signal.signal_type}
                                        </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {signal.signal_author}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <Badge variant={getStatusVariant(signal.signal_status)}>
                                        {signal.signal_status}
                                    </Badge>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-xs text-gray-500">
                                            {signal.signal_visibility}
                                        </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                                    {new Date(signal.stamp_created).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <Link
                                        href={`/admin/signals/${signal.signal_id}`}
                                        className="text-teal-600 hover:text-teal-700 font-medium"
                                    >
                                        Edit
                                    </Link>
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
