// components/admin/forms/SignalForm.tsx
'use client'

import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import {useMemo, useState} from 'react'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { FormSection } from './FormSection'
import { FormField } from './FormField'
import { Input } from '../ui/Input'
import { Textarea } from '../ui/Textarea'
import { Select } from '../ui/Select'
import { JsonEditor } from './JsonEditor'
import { Controller } from 'react-hook-form'
import { SIGNAL_TYPES, SIGNAL_STATUS, SIGNAL_VISIBILITY } from '@/lib/constants'

interface SignalFormProps {
    mode: 'create' | 'edit'
    defaultValues?: any
    onSuccess?: () => void
}

export function SignalForm({ mode, defaultValues, onSuccess }: SignalFormProps) {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Determine database type from defaultValues instead
    const usePostgres = useMemo(() => {
        // If editing and has signal_location field, it's postgres
        if (defaultValues?.signal_location !== undefined) return true
        // If editing and has lat/lng fields, it's MySQL
        if (defaultValues?.signal_latitude !== undefined || defaultValues?.signal_longitude !== undefined) return false
        // Default: check if postgres via environment (client-side safe check)
        return typeof window !== 'undefined' ? false : process.env.NEXT_PUBLIC_USE_POSTGRES === 'true'
    }, [defaultValues])

    const formDefaults = defaultValues ? {
        ...defaultValues,
        signal_metadata: defaultValues.signal_metadata ? JSON.stringify(defaultValues.signal_metadata, null, 2) : '',
        signal_payload: defaultValues.signal_payload ? JSON.stringify(defaultValues.signal_payload, null, 2) : '',
        signal_tags: defaultValues.signal_tags ? JSON.stringify(defaultValues.signal_tags, null, 2) : '',
        signal_location: defaultValues.signal_location ? JSON.stringify(defaultValues.signal_location, null, 2) : '',
    } : undefined

    const { register, control, handleSubmit, formState: { errors } } = useForm({
        defaultValues: formDefaults,  // ← Use pre-processed defaults
    })

    const onSubmit = async (data: any) => {
        setIsSubmitting(true)
        setError(null)

        try {
            // Parse JSON fields
            const processedData = { ...data }
            ;['signal_metadata', 'signal_payload', 'signal_tags', 'signal_location'].forEach(field => {
                if (processedData[field] && typeof processedData[field] === 'string') {
                    try {
                        processedData[field] = JSON.parse(processedData[field])
                    } catch {
                        // Keep as string if invalid
                    }
                }
            })

            const url = mode === 'create'
                ? '/api/admin/signals'
                : `/api/admin/signals/${defaultValues?.signal_id}`

            const response = await fetch(url, {
                method: mode === 'create' ? 'POST' : 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(processedData),
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Failed to save signal')
            }

            if (onSuccess) {
                onSuccess()
            } else {
                router.push('/admin/signals')
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

            <Card title={mode === 'create' ? 'Create Signal' : 'Edit Signal'}>
                <FormSection title="Core Information" description="Basic signal details">
                    <FormField label="Type" name="signal_type" required error={errors.signal_type?.message as string}>
                        <Select {...register('signal_type', { required: 'Type is required' })}>
                            <option value="">Select Type</option>
                            {SIGNAL_TYPES.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </Select>
                    </FormField>

                    <FormField label="Title" name="signal_title" required error={errors.signal_title?.message as string}>
                        <Input
                            {...register('signal_title', { required: 'Title is required' })}
                            placeholder="Enter signal title"
                        />
                    </FormField>

                    <FormField label="Description" name="signal_description">
                        <Textarea
                            {...register('signal_description')}
                            rows={4}
                            placeholder="Enter description"
                        />
                    </FormField>

                    <FormField label="Author" name="signal_author" required error={errors.signal_author?.message as string}>
                        <Input
                            {...register('signal_author', { required: 'Author is required' })}
                            placeholder="Author name"
                        />
                    </FormField>
                </FormSection>

                <FormSection title="Location" description="Geospatial coordinates (optional)">
                    {usePostgres ? (
                        <FormField label="Location (GeoJSON)" name="signal_location">
                            <Controller
                                name="signal_location"
                                control={control}
                                render={({ field }) => (
                                    <JsonEditor
                                        value={field.value}
                                        onChange={field.onChange}
                                        onBlur={field.onBlur}
                                        rows={3}
                                        placeholder='{"type": "Point", "coordinates": [-124.0631, 43.8041]}'
                                    />
                                )}
                            />
                        </FormField>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField label="Latitude" name="signal_latitude">
                                <Input
                                    type="number"
                                    step="any"
                                    {...register('signal_latitude')}
                                    placeholder="e.g., 43.8041"
                                />
                            </FormField>

                            <FormField label="Longitude" name="signal_longitude">
                                <Input
                                    type="number"
                                    step="any"
                                    {...register('signal_longitude')}
                                    placeholder="e.g., -124.0631"
                                />
                            </FormField>
                        </div>
                    )}
                </FormSection>

                <FormSection title="Metadata" description="Status and visibility settings">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <FormField label="Status" name="signal_status">
                            <Select {...register('signal_status')}>
                                <option value="">Select Status</option>
                                {SIGNAL_STATUS.map(status => (
                                    <option key={status} value={status}>{status}</option>
                                ))}
                            </Select>
                        </FormField>

                        <FormField label="Visibility" name="signal_visibility">
                            <Select {...register('signal_visibility')}>
                                <option value="">Select Visibility</option>
                                {SIGNAL_VISIBILITY.map(vis => (
                                    <option key={vis} value={vis}>{vis}</option>
                                ))}
                            </Select>
                        </FormField>

                        <FormField label="Import Date" name="stamp_imported">
                            <Input type="datetime-local" {...register('stamp_imported')} />
                        </FormField>
                    </div>
                </FormSection>

                <FormSection title="Data Payloads" description="JSON data structures">
                    <FormField label="Metadata (JSON)" name="signal_metadata">
                        <Controller
                            name="signal_metadata"
                            control={control}
                            render={({ field }) => (
                                <JsonEditor
                                    value={field.value}
                                    onChange={field.onChange}
                                    onBlur={field.onBlur}
                                    rows={6}
                                    placeholder='{\n  "key": "value"\n}'
                                />
                            )}
                        />
                    </FormField>

                    <FormField label="Payload (JSON)" name="signal_payload">
                        <Controller
                            name="signal_payload"
                            control={control}
                            render={({ field }) => (
                                <JsonEditor
                                    value={field.value}
                                    onChange={field.onChange}
                                    onBlur={field.onBlur}
                                    rows={6}
                                    placeholder='{\n  "key": "value"\n}'
                                />
                            )}
                        />
                    </FormField>

                    <FormField label="Tags (JSON)" name="signal_tags">
                        <Controller
                            name="signal_tags"
                            control={control}
                            render={({ field }) => (
                                <JsonEditor
                                    value={field.value}
                                    onChange={field.onChange}
                                    onBlur={field.onBlur}
                                    rows={4}
                                    placeholder='["tag1", "tag2"]'
                                />
                            )}
                        />
                    </FormField>
                </FormSection>

                <div className="flex gap-3 pt-8 border-t border-gray-200">
                    <Button type="submit" disabled={isSubmitting} variant="primary" size="lg">
                        {isSubmitting ? 'Saving...' : mode === 'create' ? 'Create Signal' : 'Save Changes'}
                    </Button>

                    <Button type="button" onClick={() => router.back()} variant="ghost" size="lg">
                        Cancel
                    </Button>
                </div>
            </Card>
        </form>
    )
}
