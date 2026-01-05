// components/admin/forms/RealmForm.tsx
'use client'

import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { FormSection } from './FormSection'
import { FormField } from './FormField'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'
import { JsonEditor } from './JsonEditor'
import { REALM_TYPES } from '@/lib/constants'

interface RealmFormProps {
    mode: 'create' | 'edit'
    defaultValues?: any
    userId: string // Current user creating/editing the realm
    onSuccess?: () => void
}

export function RealmForm({ mode, defaultValues, userId, onSuccess }: RealmFormProps) {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm({
        defaultValues: {
            realm_type: 'PRIVATE',
            flag_registry: false,
            realm_settings: null,
            ...defaultValues,
        },
    })

    const onSubmit = async (data: any) => {
        setIsSubmitting(true)
        setError(null)

        try {
            // Parse JSON fields
            let parsedSettings = null
            if (data.realm_settings) {
                try {
                    parsedSettings = typeof data.realm_settings === 'string'
                        ? JSON.parse(data.realm_settings)
                        : data.realm_settings
                } catch (err) {
                    throw new Error('Invalid JSON in realm settings')
                }
            }

            const payload = {
                ...data,
                realm_settings: parsedSettings,
            }

            const url = mode === 'create'
                ? '/api/admin/realms'
                : `/api/admin/realms/${defaultValues?.realm_id}`

            const response = await fetch(url, {
                method: mode === 'create' ? 'POST' : 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Failed to save realm')
            }

            if (onSuccess) {
                onSuccess()
            } else {
                router.push('/admin/realms')
                router.refresh()
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && (
                <div className="bg-red-50 border-l-4 border-red-400 text-red-700 px-4 py-3 rounded">
                    <p className="font-medium">Error</p>
                    <p className="text-sm mt-1">{error}</p>
                </div>
            )}

            <Card title={mode === 'create' ? 'Create Realm' : 'Edit Realm'}>
                <FormSection title="Core Information" description="Basic realm details">
                    <FormField label="Realm Name" name="realm_name" required error={errors.realm_name?.message as string}>
                        <Input
                            {...register('realm_name', { required: 'Realm name is required' })}
                            placeholder="My Realm"
                        />
                    </FormField>

                    <FormField
                        label="Slug"
                        name="realm_slug"
                        required
                        error={errors.realm_slug?.message as string}
                        description="URL-safe identifier for subdomain (lowercase, alphanumeric, hyphens only)"
                    >
                        <Input
                            {...register('realm_slug', {
                                required: 'Slug is required',
                                pattern: {
                                    value: /^[a-z0-9-]+$/,
                                    message: 'Slug must be lowercase alphanumeric with hyphens only'
                                }
                            })}
                            placeholder="my-realm"
                        />
                    </FormField>

                    <FormField label="Description" name="realm_description">
                        <textarea
                            {...register('realm_description')}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                            placeholder="Describe this realm..."
                        />
                    </FormField>
                </FormSection>

                <FormSection title="Realm Type" description="Visibility and access control">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField label="Type" name="realm_type">
                            <Select {...register('realm_type')}>
                                {REALM_TYPES.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </Select>
                        </FormField>

                        <FormField label="Public Registry" name="flag_registry">
                            <div className="flex items-center h-full">
                                <input
                                    type="checkbox"
                                    {...register('flag_registry')}
                                    className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                                />
                                <span className="ml-2 text-sm text-gray-600">List in public realm registry</span>
                            </div>
                        </FormField>
                    </div>
                </FormSection>

                <FormSection
                    title="Realm Settings"
                    description="Global configuration (JSON format)"
                >
                    <FormField
                        label="Settings"
                        name="realm_settings"
                        description="Theme colors, layout preferences, feature flags, etc."
                    >
                        <JsonEditor
                            value={watch('realm_settings')}
                            onChange={(value) => setValue('realm_settings', value)}
                            placeholder={JSON.stringify({
                                theme: {
                                    primaryColor: "#0d9488",
                                    backgroundColor: "#ffffff"
                                },
                                layout: "default",
                                features: {
                                    publicSignals: true,
                                    comments: false
                                }
                            }, null, 2)}
                        />
                    </FormField>
                </FormSection>

                <div className="flex gap-3 pt-8 border-t border-gray-200">
                    <Button type="submit" disabled={isSubmitting} variant="primary" size="lg">
                        {isSubmitting ? 'Saving...' : mode === 'create' ? 'Create Realm' : 'Save Changes'}
                    </Button>

                    <Button type="button" onClick={() => router.back()} variant="ghost" size="lg">
                        Cancel
                    </Button>
                </div>
            </Card>
        </form>
    )
}
