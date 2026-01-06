// components/admin/SanctumManager.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Icon from '@/components/Icon'

interface SanctumSettings {
    enabled: boolean
    display_name: string
    stripe: {
        account_id: string | null
        onboarding_complete: boolean
        charges_enabled: boolean
        payouts_enabled: boolean
    }
    tiers: Array<{
        id: string
        name: string
        price: number
        interval: 'month' | 'year'
        description: string
    }>
}

interface SanctumManagerProps {
    realmId: string
    settings: SanctumSettings
    stats: Array<{ sanctum_tier: string | null; _count: number }>
}

export default function SanctumManager({ realmId, settings, stats }: SanctumManagerProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [showTierForm, setShowTierForm] = useState(false)

    const handleConnectStripe = async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/stripe/connect/onboard', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ realm_id: realmId }),
            })

            const data = await res.json()
            if (data.url) {
                window.location.href = data.url
            }
        } catch (error) {
            console.error('Failed to connect Stripe:', error)
            alert('Failed to connect Stripe account')
        } finally {
            setLoading(false)
        }
    }

    const stripeConnected = settings.stripe.account_id && settings.stripe.onboarding_complete

    return (
        <div className="space-y-8">
            {/* Stripe Connection Status */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Stripe Connection</h2>

                {!stripeConnected ? (
                    <div className="space-y-4">
                        <p className="text-gray-600">
                            Connect your Stripe account to start accepting payments for Sanctum subscriptions.
                        </p>
                        <button
                            onClick={handleConnectStripe}
                            disabled={loading}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50"
                        >
                            {loading ? (
                                <>
                                    <Icon name="Loader2" className="animate-spin" size={16} />
                                    Connecting...
                                </>
                            ) : (
                                <>
                                    <Icon name="CreditCard" size={16} />
                                    Connect Stripe
                                </>
                            )}
                        </button>
                    </div>
                ) : (
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-green-600">
                            <Icon name="CheckCircle" size={20} />
                            <span className="font-medium">Stripe Connected</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-gray-600">Charges Enabled:</span>
                                <span className={`ml-2 font-medium ${settings.stripe.charges_enabled ? 'text-green-600' : 'text-gray-400'}`}>
                                    {settings.stripe.charges_enabled ? 'Yes' : 'No'}
                                </span>
                            </div>
                            <div>
                                <span className="text-gray-600">Payouts Enabled:</span>
                                <span className={`ml-2 font-medium ${settings.stripe.payouts_enabled ? 'text-green-600' : 'text-gray-400'}`}>
                                    {settings.stripe.payouts_enabled ? 'Yes' : 'No'}
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Sanctum Settings */}
            {stripeConnected && (
                <>
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Sanctum Settings</h2>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <label className="text-sm font-medium text-gray-900">Enable Sanctum</label>
                                    <p className="text-sm text-gray-600">Allow users to subscribe to premium content</p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={settings.enabled}
                                    onChange={(e) => {
                                        // TODO: API call to update settings
                                    }}
                                    className="w-5 h-5"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-900 mb-2">
                                    Display Name
                                </label>
                                <input
                                    type="text"
                                    value={settings.display_name}
                                    onChange={(e) => {
                                        // TODO: API call to update settings
                                    }}
                                    placeholder="Sanctum"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Custom name for your subscription area (shown to users)
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Subscription Tiers */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-gray-900">Subscription Tiers</h2>
                            <button
                                onClick={() => setShowTierForm(true)}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
                            >
                                <Icon name="Plus" size={16} />
                                Add Tier
                            </button>
                        </div>

                        {settings.tiers.length === 0 ? (
                            <p className="text-gray-500 text-center py-8">
                                No tiers created yet. Add your first tier to start accepting subscriptions.
                            </p>
                        ) : (
                            <div className="space-y-4">
                                {settings.tiers.map((tier) => {
                                    const tierStats = stats.find(s => s.sanctum_tier === tier.id)
                                    const subscriberCount = tierStats?._count || 0

                                    return (
                                        <div key={tier.id} className="border border-gray-200 rounded-lg p-4">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-gray-900">{tier.name}</h3>
                                                    <p className="text-sm text-gray-600 mt-1">{tier.description}</p>
                                                    <div className="flex items-center gap-4 mt-3 text-sm">
                                                        <span className="font-medium text-gray-900">
                                                            {tier.price === 0 ? 'Free' : `$${(tier.price / 100).toFixed(2)}/${tier.interval}`}
                                                        </span>
                                                        <span className="text-gray-500">
                                                            {subscriberCount} subscriber{subscriberCount !== 1 ? 's' : ''}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        className="p-2 text-gray-400 hover:text-gray-600"
                                                        title="Edit tier"
                                                    >
                                                        <Icon name="Edit" size={16} />
                                                    </button>
                                                    <button
                                                        className="p-2 text-gray-400 hover:text-red-600"
                                                        title="Delete tier"
                                                    >
                                                        <Icon name="Trash2" size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                </>
            )}

            {/* Tier Creation Form Modal */}
            {showTierForm && (
                <TierFormModal
                    realmId={realmId}
                    onClose={() => setShowTierForm(false)}
                    onSuccess={() => {
                        setShowTierForm(false)
                        router.refresh()
                    }}
                />
            )}
        </div>
    )
}

function TierFormModal({ realmId, onClose, onSuccess }: {
    realmId: string
    onClose: () => void
    onSuccess: () => void
}) {
    const [formData, setFormData] = useState({
        name: '',
        price: '0',
        interval: 'month' as 'month' | 'year',
        description: '',
    })
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            // TODO: API call to create tier
            console.log('Creating tier:', formData)
            onSuccess()
        } catch (error) {
            console.error('Failed to create tier:', error)
            alert('Failed to create tier')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Create Subscription Tier</h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-1">
                            Tier Name
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Supporter"
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-1">
                            Price (USD)
                        </label>
                        <div className="flex items-center gap-2">
                            <span className="text-gray-500">$</span>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                required
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                            />
                            <select
                                value={formData.interval}
                                onChange={(e) => setFormData({ ...formData, interval: e.target.value as 'month' | 'year' })}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                            >
                                <option value="month">/ month</option>
                                <option value="year">/ year</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-1">
                            Description
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Access to exclusive content..."
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50"
                        >
                            {loading ? 'Creating...' : 'Create Tier'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
