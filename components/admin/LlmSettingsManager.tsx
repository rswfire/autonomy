// components/admin/LlmSettingsManager.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from './ui/Button'
import { Input } from './ui/Input'
import { Select } from './ui/Select'
import { Card } from './ui/Card'
import Icon from '@/components/Icon'
import { toast } from 'sonner'

interface LlmAccount {
    id: string
    name: string
    provider: 'claude' | 'openai' | 'local'
    api_key: string
    model: string
    enabled: boolean
}

interface LlmSettings {
    accounts: LlmAccount[]
    default_account_id: string | null
    auto_analyze: boolean
}

interface LlmSettingsManagerProps {
    realmId: string
    settings: LlmSettings
}

export function LlmSettingsManager({ realmId, settings }: LlmSettingsManagerProps) {
    const router = useRouter()
    const [formData, setFormData] = useState<LlmSettings>(settings)
    const [editingAccount, setEditingAccount] = useState<LlmAccount | null>(null)
    const [isAddingAccount, setIsAddingAccount] = useState(false)
    const [showApiKey, setShowApiKey] = useState(false)
    const [isTesting, setIsTesting] = useState(false)

    const handleAutoAnalyzeToggle = async (enabled: boolean) => {
        const newFormData = {
            ...formData,
            auto_analyze: enabled,
        }

        try {
            const response = await fetch(`/api/admin/realms/${realmId}/llm-settings`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newFormData),
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.error || 'Failed to save')
            }

            setFormData(newFormData)
            toast.success('Auto-analyze ' + (enabled ? 'enabled' : 'disabled'))
            router.refresh()
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to save'
            toast.error('Save failed', { description: message })
        }
    }

    const handleAddAccount = () => {
        setEditingAccount({
            id: `llm_${Date.now()}`,
            name: '',
            provider: 'claude',
            api_key: '',
            model: 'claude-sonnet-4-20250514',
            enabled: true,
        })
        setIsAddingAccount(true)
    }

    const handleSaveAccount = async () => {
        if (!editingAccount) return

        if (!editingAccount.name.trim()) {
            toast.error('Account name required')
            return
        }

        if (!editingAccount.api_key.trim()) {
            toast.error('API key required')
            return
        }

        const updatedAccounts = isAddingAccount
            ? [...formData.accounts, editingAccount]
            : formData.accounts.map(a => a.id === editingAccount.id ? editingAccount : a)

        const newFormData = {
            ...formData,
            accounts: updatedAccounts,
            default_account_id: formData.accounts.length === 0 ? editingAccount.id : formData.default_account_id,
        }

        try {
            const response = await fetch(`/api/admin/realms/${realmId}/llm-settings`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newFormData),
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.error || 'Failed to save')
            }

            setFormData(newFormData)
            setEditingAccount(null)
            setIsAddingAccount(false)
            toast.success(isAddingAccount ? 'Account added' : 'Account updated')
            router.refresh()
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to save'
            toast.error('Save failed', { description: message })
        }
    }

    const handleDeleteAccount = async (accountId: string) => {
        if (!confirm('Delete this LLM account?')) return

        const updatedAccounts = formData.accounts.filter(a => a.id !== accountId)

        const newFormData = {
            ...formData,
            accounts: updatedAccounts,
            default_account_id: formData.default_account_id === accountId
                ? (updatedAccounts[0]?.id || null)
                : formData.default_account_id,
        }

        try {
            const response = await fetch(`/api/admin/realms/${realmId}/llm-settings`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newFormData),
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.error || 'Failed to delete')
            }

            setFormData(newFormData)
            toast.success('Account deleted')
            router.refresh()
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to delete'
            toast.error('Delete failed', { description: message })
        }
    }

    const handleSetDefault = async (accountId: string) => {
        const newFormData = {
            ...formData,
            default_account_id: accountId,
        }

        try {
            const response = await fetch(`/api/admin/realms/${realmId}/llm-settings`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newFormData),
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.error || 'Failed to set default')
            }

            setFormData(newFormData)
            toast.success('Default account updated')
            router.refresh()
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to update'
            toast.error('Update failed', { description: message })
        }
    }

    const handleTestAccount = async (account: LlmAccount) => {
        setIsTesting(true)

        try {
            const response = await fetch(`/api/admin/realms/${realmId}/llm-settings/test`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    provider: account.provider,
                    api_key: account.api_key,
                    model: account.model,
                }),
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.error || 'Connection test failed')
            }

            const result = await response.json()
            toast.success('Connection successful', {
                description: `Model: ${result.model}`,
            })
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Connection test failed'
            toast.error('Test failed', { description: message })
        } finally {
            setIsTesting(false)
        }
    }

    return (
        <div className="space-y-6">
            {/* Auto-analyze Card */}
            <Card>
                <div className="p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Analysis Settings</h2>

                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            id="auto_analyze"
                            checked={formData.auto_analyze}
                            onChange={(e) => handleAutoAnalyzeToggle(e.target.checked)}
                            className="h-4 w-4 text-teal-600 rounded border-gray-300 focus:ring-teal-500"
                        />
                        <label htmlFor="auto_analyze" className="text-sm text-gray-700">
                            Automatically analyze new signals on creation
                        </label>
                    </div>
                    <p className="mt-2 text-xs text-gray-500 ml-7">
                        When enabled, new signals will be analyzed immediately using the default account.
                        You can always trigger analysis manually for individual signals.
                    </p>
                </div>
            </Card>

            {/* Accounts List */}
            <Card>
                <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-gray-900">LLM Accounts</h2>
                        <Button onClick={handleAddAccount} size="sm">
                            <Icon name="Plus" size={16} className="mr-2" />
                            Add Account
                        </Button>
                    </div>

                    {formData.accounts.length === 0 && !editingAccount && (
                        <div className="text-center py-8 text-gray-500">
                            <p className="mb-4">No LLM accounts configured</p>
                            <Button onClick={handleAddAccount} variant="outline" size="sm">
                                <Icon name="Plus" size={16} className="mr-2" />
                                Add Your First Account
                            </Button>
                        </div>
                    )}

                    <div className="space-y-4">
                        {formData.accounts.map((account) => (
                            <div
                                key={account.id}
                                className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <h3 className="font-semibold text-gray-900">{account.name}</h3>
                                            {formData.default_account_id === account.id && (
                                                <span className="px-2 py-0.5 bg-teal-100 text-teal-800 text-xs font-medium rounded">
                                                    Default
                                                </span>
                                            )}
                                            {!account.enabled && (
                                                <span className="px-2 py-0.5 bg-gray-200 text-gray-600 text-xs font-medium rounded">
                                                    Disabled
                                                </span>
                                            )}
                                        </div>
                                        <div className="space-y-1 text-sm text-gray-600">
                                            <p>Provider: <span className="font-medium">{account.provider}</span></p>
                                            <p>Model: <span className="font-mono text-xs">{account.model}</span></p>
                                            <p>API Key: <span className="font-mono text-xs">{account.api_key.substring(0, 12)}...</span></p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        {formData.default_account_id !== account.id && (
                                            <Button
                                                onClick={() => handleSetDefault(account.id)}
                                                variant="ghost"
                                                size="sm"
                                            >
                                                Set Default
                                            </Button>
                                        )}
                                        <Button
                                            onClick={() => handleTestAccount(account)}
                                            variant="ghost"
                                            size="sm"
                                            disabled={isTesting}
                                            className="cursor-pointer"
                                        >
                                            {isTesting ? 'Testing...' : 'Test'}
                                        </Button>
                                        <Button
                                            onClick={() => {
                                                setEditingAccount(account)
                                                setIsAddingAccount(false)
                                            }}
                                            variant="ghost"
                                            size="sm"
                                        >
                                            <Icon name="Edit" size={16} />
                                        </Button>
                                        <Button
                                            onClick={() => handleDeleteAccount(account.id)}
                                            variant="ghost"
                                            size="sm"
                                        >
                                            <Icon name="Trash2" size={16} />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Card>

            {/* Edit/Add Account Modal */}
            {editingAccount && (
                <Card>
                    <div className="p-6 space-y-6">
                        <h2 className="text-xl font-semibold text-gray-900">
                            {isAddingAccount ? 'Add Account' : 'Edit Account'}
                        </h2>

                        {/* Account Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Account Name
                            </label>
                            <Input
                                value={editingAccount.name}
                                onChange={(e) =>
                                    setEditingAccount({ ...editingAccount, name: e.target.value })
                                }
                                placeholder="Personal Claude Account"
                            />
                        </div>

                        {/* Provider */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Provider
                            </label>
                            <Select
                                value={editingAccount.provider}
                                onChange={(e) =>
                                    setEditingAccount({
                                        ...editingAccount,
                                        provider: e.target.value as LlmAccount['provider'],
                                    })
                                }
                            >
                                <option value="claude">Claude (Anthropic)</option>
                                <option value="openai" disabled>
                                    OpenAI (Coming Soon)
                                </option>
                                <option value="local" disabled>
                                    Local Models (Coming Soon)
                                </option>
                            </Select>
                        </div>

                        {/* API Key */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                API Key
                            </label>
                            <div className="flex gap-2">
                                <div className="flex-1 relative">
                                    <Input
                                        type={showApiKey ? 'text' : 'password'}
                                        value={editingAccount.api_key}
                                        onChange={(e) =>
                                            setEditingAccount({ ...editingAccount, api_key: e.target.value })
                                        }
                                        placeholder="sk-ant-api03-..."
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowApiKey(!showApiKey)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        <Icon name={showApiKey ? 'EyeOff' : 'Eye'} size={16} />
                                    </button>
                                </div>
                                <Button
                                    onClick={() => handleTestAccount(editingAccount)}
                                    disabled={!editingAccount.api_key || isTesting}
                                    variant="outline"
                                    className="cursor-pointer"
                                >
                                    {isTesting ? 'Testing...' : 'Test'}
                                </Button>
                            </div>
                            <p className="mt-1 text-xs text-gray-500">
                                Your API key is encrypted and stored securely
                            </p>
                        </div>

                        {/* Model */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Model
                            </label>
                            <Input
                                value={editingAccount.model}
                                onChange={(e) =>
                                    setEditingAccount({ ...editingAccount, model: e.target.value })
                                }
                                placeholder="claude-sonnet-4-20250514"
                            />
                        </div>

                        {/* Enabled */}
                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                id="enabled"
                                checked={editingAccount.enabled}
                                onChange={(e) =>
                                    setEditingAccount({ ...editingAccount, enabled: e.target.checked })
                                }
                                className="h-4 w-4 text-teal-600 rounded border-gray-300 focus:ring-teal-500"
                            />
                            <label htmlFor="enabled" className="text-sm text-gray-700">
                                Enable this account
                            </label>
                        </div>

                        <div className="flex gap-3">
                            <Button onClick={handleSaveAccount}>
                                {isAddingAccount ? 'Add Account' : 'Save Changes'}
                            </Button>
                            <Button
                                variant="ghost"
                                onClick={() => {
                                    setEditingAccount(null)
                                    setIsAddingAccount(false)
                                }}
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                </Card>
            )}

            {/* Info Card */}
            <Card>
                <div className="p-6 bg-blue-50 border-l-4 border-blue-500">
                    <div className="flex">
                        <Icon name="Info" size={20} className="text-blue-600 mr-3 flex-shrink-0" />
                        <div className="text-sm text-blue-900">
                            <p className="font-semibold mb-1">About AI Processing</p>
                            <p className="mb-2">
                                This configuration enables both analysis and synthesis:
                            </p>
                            <ul className="list-disc list-inside space-y-1 text-xs">
                                <li>
                                    <strong>Analysis:</strong> Extracts surface and structural metadata from signals
                                </li>
                                <li>
                                    <strong>Synthesis:</strong> Generates reflections (Mirror, Myth, Narrative) from analyzed data
                                </li>
                            </ul>
                            <p className="mt-2 text-xs">
                                Analysis runs on individual signals. Synthesis operates at signal and cluster levels.
                            </p>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    )
}
