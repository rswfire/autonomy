// components/admin/forms/ClusterForm.tsx
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
import { Controller } from 'react-hook-form'
import { CLUSTER_TYPES, CLUSTER_STATES } from '@/lib/constants'

interface ClusterFormProps {
    mode: 'create' | 'edit'
    defaultValues?: any
    onSuccess?: () => void
}

export function ClusterForm({ mode, defaultValues, onSuccess }: ClusterFormProps) {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const formDefaults = defaultValues ? {
        ...defaultValues,
        cluster_annotations: defaultValues.cluster_annotations ? JSON.stringify(defaultValues.cluster_annotations, null, 2) : '',
        cluster_metadata: defaultValues.cluster_metadata ? JSON.stringify(defaultValues.cluster_metadata, null, 2) : '',
        cluster_payload: defaultValues.cluster_payload ? JSON.stringify(defaultValues.cluster_payload, null, 2) : '',
        cluster_tags: defaultValues.cluster_tags ? JSON.stringify(defaultValues.cluster_tags, null, 2) : '',
    } : undefined

    const { register, control, handleSubmit, formState: { errors } } = useForm({
        defaultValues: formDefaults,
    })

    const onSubmit = async (data: any) => {
        setIsSubmitting(true)
        setError(null)

        try {
            const processedData = { ...data }
            ;['cluster_annotations', 'cluster_metadata', 'cluster_payload', 'cluster_tags'].forEach(field => {
                if (processedData[field] && typeof processedData[field] === 'string') {
                    try {
                        processedData[field] = JSON.parse(processedData[field])
                    } catch {}
                }
            })

            const url = mode === 'create'
                ? '/api/admin/clusters'
                : `/api/admin/clusters/${defaultValues?.cluster_id}`

            const response = await fetch(url, {
                method: mode === 'create' ? 'POST' : 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(processedData),
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Failed to save cluster')
            }

            if (onSuccess) {
                onSuccess()
            } else {
                router.push('/admin/clusters')
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

            <Card title={mode === 'create' ? 'Create Cluster' : 'Edit Cluster'}>
                <FormSection title="Core Information" description="Basic cluster details">
                    <FormField label="Type" name="cluster_type" required error={errors.cluster_type?.message as string}>
                        <Select {...register('cluster_type', { required: 'Type is required' })}>
                            <option value="">Select Type</option>
                            {CLUSTER_TYPES.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </Select>
                    </FormField>

                    <FormField label="Title" name="cluster_title" required error={errors.cluster_title?.message as string}>
                        <Input
                            {...register('cluster_title', { required: 'Title is required' })}
                            placeholder="Enter cluster title"
                        />
                    </FormField>

                    <FormField label="Depth" name="cluster_depth">
                        <Input
                            type="number"
                            {...register('cluster_depth')}
                            placeholder="0"
                        />
                    </FormField>
                </FormSection>

                <FormSection title="Metadata" description="Status and settings">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField label="State" name="cluster_state">
                            <Select {...register('cluster_state')}>
                                <option value="">Select State</option>
                                {CLUSTER_STATES.map(state => (
                                    <option key={state} value={state}>{state}</option>
                                ))}
                            </Select>
                        </FormField>

                        <FormField label="Parent Cluster ID" name="parent_cluster_id">
                            <Input {...register('parent_cluster_id')} placeholder="ULID of parent cluster" />
                        </FormField>

                        <FormField label="Start Date" name="stamp_cluster_start">
                            <Input type="datetime-local" {...register('stamp_cluster_start')} />
                        </FormField>

                        <FormField label="End Date" name="stamp_cluster_end">
                            <Input type="datetime-local" {...register('stamp_cluster_end')} />
                        </FormField>
                    </div>
                </FormSection>

                <FormSection title="Data Payloads" description="JSON data structures">
                    <FormField label="Annotations (JSON)" name="cluster_annotations">
                        <Controller
                            name="cluster_annotations"
                            control={control}
                            render={({ field }) => (
                                <JsonEditor
                                    value={field.value || ''}
                                    onChange={field.onChange}
                                    onBlur={field.onBlur}
                                    rows={6}
                                    placeholder='{\n  "key": "value"\n}'
                                />
                            )}
                        />
                    </FormField>

                    <FormField label="Metadata (JSON)" name="cluster_metadata">
                        <Controller
                            name="cluster_metadata"
                            control={control}
                            render={({ field }) => (
                                <JsonEditor
                                    value={field.value || ''}
                                    onChange={field.onChange}
                                    onBlur={field.onBlur}
                                    rows={6}
                                    placeholder='{\n  "key": "value"\n}'
                                />
                            )}
                        />
                    </FormField>

                    <FormField label="Payload (JSON)" name="cluster_payload">
                        <Controller
                            name="cluster_payload"
                            control={control}
                            render={({ field }) => (
                                <JsonEditor
                                    value={field.value || ''}
                                    onChange={field.onChange}
                                    onBlur={field.onBlur}
                                    rows={6}
                                    placeholder='{\n  "key": "value"\n}'
                                />
                            )}
                        />
                    </FormField>

                    <FormField label="Tags (JSON)" name="cluster_tags">
                        <Controller
                            name="cluster_tags"
                            control={control}
                            render={({ field }) => (
                                <JsonEditor
                                    value={field.value || ''}
                                    onChange={field.onChange}
                                    onBlur={field.onBlur}
                                    rows={4}
                                    placeholder='["tag1", "tag2"]'
                                />
                            )}
                        />
                    </FormField>
                </FormSection>

                {/* TODO: Add signal/cluster relationship management UI */}

                <div className="flex gap-3 pt-8 border-t border-gray-200">
                    <Button type="submit" disabled={isSubmitting} variant="primary" size="lg">
                        {isSubmitting ? 'Saving...' : mode === 'create' ? 'Create Cluster' : 'Save Changes'}
                    </Button>

                    <Button type="button" onClick={() => router.back()} variant="ghost" size="lg">
                        Cancel
                    </Button>
                </div>
            </Card>
        </form>
    )
}
