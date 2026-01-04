// app/admin/signals/page.tsx
import Link from 'next/link'
import { querySignals } from '@/lib/queries/signal'
import { requireAuth } from '@/lib/utils/auth'
import { Button } from '@/components/admin/ui/Button'
import { Badge } from '@/components/admin/ui/Badge'
import Icon from '@/components/Icon'

export const dynamic = 'force-dynamic'

interface SearchParams {
    page?: string
}

export default async function SignalsListPage({
                                                  searchParams,
                                              }: {
    searchParams: Promise<SearchParams>
}) {
    const params = await searchParams
    const user = await requireAuth()

    const page = parseInt(params.page || '1')
    const perPage = 50
    const offset = (page - 1) * perPage

    const { signals, total } = await querySignals(
        {
            limit: perPage,
            offset: offset,
            sort_order: 'desc',
        },
        user.user_id
    )

    const totalPages = Math.ceil((total || 0) / perPage)

    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'ACTIVE': return 'success'
            case 'PENDING': return 'warning'
            case 'ARCHIVED': return 'default'
            default: return 'default'
        }
    }

    return (
        <div className="max-w-7xl mx-auto py-4 md:py-8 px-4 md:px-6">
            <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Signals</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Manage your signal documentation
                    </p>
                </div>
                <Link href="/admin/signals/new">
                    <Button className="w-full md:w-auto">
                        <Icon name="Plus" size={16} className="mr-2" />
                        Create Signal
                    </Button>
                </Link>
            </div>

            {/* Mobile: Card view */}
            <div className="md:hidden space-y-4">
                {signals.length === 0 ? (
                    <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                        <p className="text-sm text-gray-500">No signals found.</p>
                        <Link href="/admin/signals/new" className="mt-4 inline-block">
                            <Button size="sm" variant="primary">
                                Create your first signal
                            </Button>
                        </Link>
                    </div>
                ) : (
                    signals.map((signal) => (
                        <div key={signal.signal_id} className="bg-white rounded-lg border border-gray-200 p-4">
                            <div className="flex items-start justify-between mb-2">
                                <h3 className="font-medium text-gray-900 text-sm flex-1">
                                    {signal.signal_title}
                                </h3>
                                <Badge variant={getStatusVariant(signal.signal_status)} className="ml-2">
                                    {signal.signal_status}
                                </Badge>
                            </div>
                            <div className="space-y-1 text-xs text-gray-500 mb-3">
                                <div className="flex justify-between">
                                    <span>Type:</span>
                                    <span className="font-mono">{signal.signal_type}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Author:</span>
                                    <span>{signal.signal_author}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Visibility:</span>
                                    <span>{signal.signal_visibility}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Created:</span>
                                    <span className="font-mono">
                                        {new Date(signal.stamp_created).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                            <Link
                                href={`/admin/signals/${signal.signal_id}`}
                                className="text-teal-600 hover:text-teal-700 font-medium text-sm"
                            >
                                Edit →
                            </Link>
                        </div>
                    ))
                )}
            </div>

            {/* Desktop: Table view */}
            <div className="hidden md:block bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
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
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-gray-900 max-w-md truncate">
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

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="mt-6 flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                        Page {page} of {totalPages}
                    </div>
                    <div className="flex gap-2">
                        {page > 1 && (
                            <Link href={`/admin/signals?page=${page - 1}`}>
                                <Button variant="outline" size="sm">
                                    <Icon name="ChevronLeft" size={16} className="mr-1" />
                                    Previous
                                </Button>
                            </Link>
                        )}
                        {page < totalPages && (
                            <Link href={`/admin/signals?page=${page + 1}`}>
                                <Button variant="outline" size="sm">
                                    Next
                                    <Icon name="ChevronRight" size={16} className="ml-1" />
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
