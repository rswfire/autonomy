// app/admin/settings/page.tsx
import { requireAuth } from '@/lib/utils/auth'
import { Card } from '@/components/admin/ui/Card'

export const dynamic = 'force-dynamic'

export default async function SettingsPage() {
    const user = await requireAuth()

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
                <p className="mt-2 text-gray-600">
                    Manage your account and system preferences
                </p>
            </div>

            <Card title="Account Information">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <p className="mt-1 text-gray-900">{user.email}</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">User ID</label>
                        <p className="mt-1 text-gray-900 font-mono text-sm">{user.user_id}</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Role</label>
                        <p className="mt-1 text-gray-900">{user.role}</p>
                    </div>
                </div>
            </Card>

            <Card title="System Information">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Platform Version</label>
                        <p className="mt-1 text-gray-900">v0.1.0</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Database</label>
                        <p className="mt-1 text-gray-900">
                            {process.env.DATABASE_URL?.startsWith('postgres') ? 'PostgreSQL' : 'MySQL'}
                        </p>
                    </div>
                </div>
            </Card>

            <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <p className="text-sm text-blue-700">
                            Additional settings will be added in future updates.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
