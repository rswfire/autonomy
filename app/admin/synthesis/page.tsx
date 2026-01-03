// app/admin/synthesis/page.tsx
import Link from 'next/link'
import { requireAuth } from '@/lib/utils/auth'
import { querySynthesis } from '@/lib/queries/synthesis'
import { Button } from '@/components/admin/ui/Button'
import { Badge } from '@/components/admin/ui/Badge'
import Icon from '@/components/Icon'

export const dynamic = 'force-dynamic'

export default async function SynthesisListPage() {
    const user = await requireAuth()
    const { synthesis } = await querySynthesis({
        limit: 100,
        offset: 0,
        sort_order: 'desc',
    }, user.user_id)

    return (
        <div className="max-w-7xl mx-auto py-8 px-6">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Synthesis</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Manage AI-generated insights
                    </p>
                </div>
                <Link href="/admin/synthesis/new">
                    <Button>
                        <Icon name="Plus" size={16} className="mr-2" />
                        Create Synthesis
                    </Button>
                </Link>
            </div>

            <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Subtype
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Target
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Source
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Depth
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
                    {synthesis.length === 0 ? (
                        <tr>
                            <td colSpan={7} className="px-6 py-12 text-center">
                                <div className="text-gray-500">
                                    <p className="text-sm">No synthesis found.</p>
                                    <Link href="/admin/synthesis/new" className="mt-2 inline-block">
                                        <Button size="sm" variant="primary">
                                            Create your first synthesis
                                        </Button>
                                    </Link>
                                </div>
                            </td>
                        </tr>
                    ) : (
                        synthesis.map((item) => (
                            <tr key={item.synthesis_id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-xs font-mono text-gray-600">
                      {item.synthesis_type}
                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <Badge variant="info">{item.synthesis_subtype}</Badge>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {item.polymorphic_type}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {item.synthesis_source || '-'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {item.synthesis_depth}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                                    {new Date(item.stamp_created).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <Link
                                        href={`/admin/synthesis/${item.synthesis_id}`}
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
