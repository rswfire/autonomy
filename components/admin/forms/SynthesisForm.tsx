// components/admin/forms/SynthesisForm.tsx
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
import { SYNTHESIS_TYPES, SYNTHESIS_SUBTYPES } from '@/lib/constants'

interface SynthesisFormProps {
    mode: 'create' | 'edit'
    defaultValues?: any
    onSuccess?: () => void
}

export function SynthesisForm({ mode, defaultValues, onSuccess }: SynthesisFormProps) {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const formDefaults = defaultValues ? {
        ...defaultValues,
        synthesis_annotations: defaultValues.synthesis_annotations ? JSON.stringify(defaultValues.synthesis_annotations, null, 2) : '',
        synthesis_content: defaultValues.synthesis_content ? JSON.stringify(defaultValues.synthesis_content, null, 2) : '',
    } : undefined

    const { register, control, handleSubmit, watch, formState: { errors } } = useForm({
        defaultValues: formDefaults,
    })

    // Watch synthesis_type to show correct subtypes
    const watchedType = watch('synthesis_type')

    const getSubtypeOptions = () => {
        if (watchedType === 'METADATA') return SYNTHESIS_SUBTYPES.METADATA
        if (watchedType === 'REFLECTION') return SYNTHESIS_SUBTYPES.REFLECTION
        return []
    }

    const onSubmit = async (data: any) => {
        setIsSubmitting(true)
        setError(null)

        try {
            const processedData = { ...data }
            ;['synthesis_annotations', 'synthesis_content'].forEach(field => {
                if (processedData[field] && typeof processedData[field] === 'string') {
                    try {
                        processedData[field] = JSON.parse(processedData[field])
                    } catch {}
                }
            })

            const url = mode === 'create'
                ? '/api/admin/synthesis'
                : `/api/admin/synthesis/${defaultValues?.synthesis_id}`

            const response = await fetch(url, {
                method: mode === 'create' ? 'POST' : 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(processedData),
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Failed to save synthesis')
            }

            if (onSuccess) {
                onSuccess()
            } else {
                router.push('/admin/synthesis')
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

            <Card title={mode === 'create' ? 'Create Synthesis' : 'Edit Synthesis'}>
                <FormSection title="Core Information" description="Basic synthesis details">
                    <FormField label="Type" name="synthesis_type" required error={errors.synthesis_type?.message as string}>
                        <Select {...register('synthesis_type', { required: 'Type is required' })}>
                            <option value="">Select Type</option>
                            {SYNTHESIS_TYPES.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </Select>
                    </FormField>

                    <FormField label="Subtype" name="synthesis_subtype" required error={errors.synthesis_subtype?.message as string}>
                        <Select {...register('synthesis_subtype', { required: 'Subtype is required' })}>
                            <option value="">Select Subtype</option>
                            {getSubtypeOptions().map(subtype => (
                                <option key={subtype} value={subtype}>{subtype}</option>
                            ))}
                        </Select>
                    </FormField>

                    <FormField label="Source" name="synthesis_source">
                        <Input {...register('synthesis_source')} placeholder="Source identifier" />
                    </FormField>

                    <FormField label="Depth" name="synthesis_depth">
                        <Input type="number" {...register('synthesis_depth')} placeholder="0" />
                    </FormField>

                    <FormField label="Target Type" name="polymorphic_type" required error={errors.polymorphic_type?.message as string}>
                        <Select {...register('polymorphic_type', { required: 'Target type is required' })}>
                            <option value="">Select Target Type</option>
                            <option value="Signal">Signal</option>
                            <option value="Cluster">Cluster</option>
                        </Select>
                    </FormField>

                    <FormField label="Target ID" name="polymorphic_id" required error={errors.polymorphic_id?.message as string}>
                        <Input
                            {...register('polymorphic_id', { required: 'Target ID is required' })}
                            placeholder="ULID of target entity"
                        />
                    </FormField>
                </FormSection>

                <FormSection title="Data Payloads" description="JSON data structures">
                    <FormField label="Annotations (JSON)" name="synthesis_annotations">
                        <Controller
                            name="synthesis_annotations"
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

                    <FormField label="Content (JSON)" name="synthesis_content">
                        <Controller
                            name="synthesis_content"
                            control={control}
                            render={({ field }) => (
                                <JsonEditor
                                    value={field.value || ''}
                                    onChange={field.onChange}
                                    onBlur={field.onBlur}
                                    rows={8}
                                    placeholder='{\n  "key": "value"\n}'
                                />
                            )}
                        />
                    </FormField>
                </FormSection>

                <div className="flex gap-3 pt-8 border-t border-gray-200">
                    <Button type="submit" disabled={isSubmitting} variant="primary" size="lg">
                        {isSubmitting ? 'Saving...' : mode === 'create' ? 'Create Synthesis' : 'Save Changes'}
                    </Button>

                    <Button type="button" onClick={() => router.back()} variant="ghost" size="lg">
                        Cancel
                    </Button>
                </div>
            </Card>
        </form>
    )
}
