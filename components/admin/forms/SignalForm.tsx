// components/admin/forms/SignalForm.tsx
'use client'

import {SIGNAL_CONTEXT, SIGNAL_STATUS, SIGNAL_TYPES, SIGNAL_VISIBILITY} from '@/lib/constants'
import type {Realm} from '@/lib/types'
import {useRouter} from 'next/navigation'
import React, {useState} from 'react'
import {Controller, useForm} from 'react-hook-form'
import {toast} from 'sonner'
import { Button, Card, Input, Select, TagInput, Textarea } from '../ui'
import {FormField} from './FormField'
import {FormSection} from './FormSection'
import {ConversationFields} from './signal/ConversationFields'
import {DocumentFields} from './signal/DocumentFields'
import {PhotoFields} from './signal/PhotoFields'
import {TransmissionFields} from './signal/TransmissionFields'
import {AnalysisFields} from './signal/AnalysisFields'
import {
    buildSignalPayload,
    buildAnalysisFields,
    cleanFormData,
    buildCoordinates,
    buildAnnotations
} from '@/lib/forms/signal/processing'
import {
    getSignalFormDefaults,
    extractLocationState
} from '@/lib/forms/signal/defaults'

interface SignalFormProps {
    mode: 'create' | 'edit'
    defaultValues?: any
    onSuccess?: () => void
    isPostgres: boolean
    realms: Realm[]
}

const SIGNAL_CONTEXT_DESCRIPTIONS = {
    CAPTURE: 'Generic documentation, intent to be determined',
    NOTE: 'Quick capture, ephemeral thought',
    JOURNAL: 'Reflective writing, daily log',
    CODE: 'Technical artifact, implementation',
    REFERENCE: 'External source, citation',
    OBSERVATION: 'Field note, documented reality',
    ARTIFACT: 'Created work, finished piece',
} as const

const SIGNAL_TYPES_SORTED = [...SIGNAL_TYPES].sort()
const SIGNAL_CONTEXT_SORTED = [...SIGNAL_CONTEXT].sort()

export function SignalForm({ mode, defaultValues, onSuccess, isPostgres, realms }: SignalFormProps) {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [historyEntries, setHistoryEntries] = useState(defaultValues?.signal_history || [])
    const [annotations, setAnnotations] = useState(defaultValues?.signal_annotations || {})

    const formDefaults = getSignalFormDefaults(defaultValues)
    const { register, control, handleSubmit, setValue, watch, formState: { errors } } = useForm({
        defaultValues: formDefaults,
    })

    const locationState = extractLocationState(defaultValues)
    const [latitude, setLatitude] = useState(locationState.latitude)
    const [longitude, setLongitude] = useState(locationState.longitude)
    const signalType = watch('signal_type')

    const onSubmit = async (data: any) => {
        setIsSubmitting(true)
        setError(null)

        try {
            // Build type-specific payload and metadata
            const { payload, metadata } = buildSignalPayload(signalType, data)

            // Build analysis fields
            const analysisFields = buildAnalysisFields(data)

            // Clean form data and build final payload
            let processedData = cleanFormData(data)
            processedData.signal_payload = payload
            processedData.signal_metadata = metadata

            // Add analysis fields
            Object.assign(processedData, analysisFields)

            // Preserve legacy metadata if editing
            if (mode === 'edit' && defaultValues?.signal_metadata?.legacy) {
                processedData.signal_metadata.legacy = defaultValues.signal_metadata.legacy
            }

            // Add coordinates
            const coordinates = buildCoordinates(latitude, longitude)
            if (coordinates) {
                processedData.coordinates = coordinates
            }

            // Add annotations if provided
            const newAnnotations = buildAnnotations(data.new_annotation, defaultValues?.signal_annotations)
            if (newAnnotations) {
                processedData.signal_annotations = newAnnotations
                processedData.trigger_synthesis = true
            }

            // Clean up fields that shouldn't be sent
            delete processedData.latitude
            delete processedData.longitude
            delete processedData.signal_location
            delete processedData.new_annotation

            // Call API route instead of Prisma query
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

            const result = await response.json()

            // Update local state
            if (result.signal) {
                setHistoryEntries(result.signal.signal_history || [])
                setAnnotations(result.signal.signal_annotations || {})
            }

            toast.success(mode === 'create' ? 'Signal created' : 'Signal updated')
            onSuccess?.()

        } catch (err) {
            const message = err instanceof Error ? err.message : 'An error occurred'
            toast.error('Failed to save signal', {
                description: message,
                duration: 5000,
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    if (realms.length === 0) {
        return (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700 px-4 py-3 rounded">
                <p className="font-medium">No realms found</p>
                <p className="text-sm mt-1">You need at least one realm to create signals.</p>
            </div>
        )
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
                <FormSection title="Realm" description="Select the realm this signal belongs to">
                    <FormField label="Realm" name="realm_id" required error={errors.realm_id?.message as string}>
                        <Select
                            {...register('realm_id', { required: 'Realm is required' })}
                            disabled={mode === 'edit'}
                        >
                            <option value="">Select Realm</option>
                            {realms.map(realm => (
                                <option key={realm.realm_id} value={realm.realm_id}>
                                    {realm.realm_name}
                                </option>
                            ))}
                        </Select>
                    </FormField>
                </FormSection>

                <FormSection title="Core Information" description="Basic signal details">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField label="Type" name="signal_type" required error={errors.signal_type?.message as string}>
                            <Select
                                {...register('signal_type', { required: 'Type is required' })}
                                disabled={mode === 'edit'}
                            >
                                <option value="">Select Type</option>
                                {SIGNAL_TYPES_SORTED.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </Select>
                        </FormField>

                        <FormField label="Context" name="signal_context" required error={errors.signal_context?.message as string}>
                            <Select {...register('signal_context', { required: 'Context is required' })}>
                                {SIGNAL_CONTEXT_SORTED.map(ctx => (
                                    <React.Fragment key={ctx}>
                                        <option value={ctx} className="font-semibold py-2">
                                            {ctx}
                                        </option>
                                        <option disabled className="text-gray-500 text-sm italic pl-4 py-1">
                                            {SIGNAL_CONTEXT_DESCRIPTIONS[ctx]}
                                        </option>
                                    </React.Fragment>
                                ))}
                            </Select>
                        </FormField>
                    </div>

                    <FormField label="Title" name="signal_title" required error={errors.signal_title?.message as string}>
                        <Input
                            {...register('signal_title', { required: 'Title is required' })}
                            placeholder="Enter signal title"
                        />
                    </FormField>

                    <FormField label="Summary" name="signal_summary">
                        <Textarea
                            {...register('signal_summary')}
                            rows={4}
                            placeholder="Enter summary"
                        />
                    </FormField>

                    <FormField
                        label="Tags"
                        name="signal_tags"
                        description="Keywords for categorization and search"
                    >
                        <Controller
                            name="signal_tags"
                            control={control}
                            render={({ field }) => (
                                <TagInput
                                    value={field.value || []}
                                    onChange={field.onChange}
                                />
                            )}
                        />
                    </FormField>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField label="Author" name="signal_author" required error={errors.signal_author?.message as string}>
                            <Input
                                {...register('signal_author', { required: 'Author is required' })}
                                placeholder="Author name"
                            />
                        </FormField>

                        <FormField
                            label="Temperature"
                            name="signal_temperature"
                            description="Importance: -1.0 (low) to 1.0 (critical)"
                        >
                            <div className="flex items-center gap-4">
                                <input
                                    type="range"
                                    min="-1.0"
                                    max="1.0"
                                    step="0.1"
                                    {...register('signal_temperature', { valueAsNumber: true })}
                                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                />
                                <span className="text-sm font-mono text-gray-700 min-w-[3rem] text-right">
                                    {Number(watch('signal_temperature') ?? 0).toFixed(1)}
                                </span>
                            </div>
                        </FormField>
                    </div>
                </FormSection>

                <FormSection title="Location" description="Geospatial coordinates (optional)">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField label="Latitude" name="latitude">
                            <Input
                                type="number"
                                step="any"
                                value={latitude}
                                onChange={(e) => setLatitude(e.target.value)}
                                placeholder="e.g., 43.8041"
                            />
                        </FormField>

                        <FormField label="Longitude" name="longitude">
                            <Input
                                type="number"
                                step="any"
                                value={longitude}
                                onChange={(e) => setLongitude(e.target.value)}
                                placeholder="e.g., -124.0631"
                            />
                        </FormField>
                    </div>
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

                        <FormField
                            label="Created Date"
                            name="stamp_created"
                            description="When the signal was originally created/captured"
                        >
                            <Input type="datetime-local" {...register('stamp_created')} />
                        </FormField>
                    </div>
                </FormSection>

                <FormSection
                    title="Signal Data"
                    description={`Type-specific data for ${signalType || 'signal'}`}
                >
                    {signalType === 'DOCUMENT' && <DocumentFields register={register} />}
                    {signalType === 'PHOTO' && <PhotoFields register={register} />}
                    {signalType === 'TRANSMISSION' && <TransmissionFields register={register} control={control} />}
                    {signalType === 'CONVERSATION' && <ConversationFields register={register} control={control} />}
                    {!signalType && (
                        <p className="text-gray-500 italic">Select a signal type to configure data fields</p>
                    )}
                </FormSection>

                <FormSection
                    title="Analysis"
                    description="Surface and structural signal data"
                >
                    <AnalysisFields register={register} />
                </FormSection>

                <FormSection
                    title="History & Annotations"
                    description="Audit trail and user context for synthesis"
                >
                    {mode === 'edit' && historyEntries.length > 0 && (
                        <div className="mb-6">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">History</h4>
                            <div className="bg-gray-50 rounded border border-gray-200 p-4 max-h-64 overflow-y-auto">
                                {historyEntries.map((entry: any, idx: number) => (
                                    <div key={idx} className="text-sm mb-2 last:mb-0">
                                        <span className="text-gray-500 font-mono">{entry.timestamp}</span>
                                        <span className="mx-2">→</span>
                                        <span className="font-medium">{entry.action}</span>
                                        {entry.field && <span className="text-gray-600 ml-2">({entry.field})</span>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Annotations</h4>

                        {annotations?.user_notes && annotations.user_notes.length > 0 && (
                            <div className="bg-blue-50 rounded border border-blue-200 p-4 mb-4 max-h-48 overflow-y-auto">
                                {annotations.user_notes.map((note: any, idx: number) => (
                                    <div key={idx} className="text-sm mb-3 last:mb-0 pb-3 last:pb-0 border-b border-blue-200 last:border-0">
                                        <div className="text-gray-500 font-mono text-xs mb-1">{note.timestamp}</div>
                                        <div className="text-gray-800">{note.note}</div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <FormField
                            label="Add Annotation"
                            name="new_annotation"
                            description="Context for synthesis pipeline — triggers re-processing"
                        >
                            <Textarea
                                {...register('new_annotation')}
                                rows={3}
                                placeholder="Add context, corrections, or synthesis instructions..."
                            />
                        </FormField>

                        {watch('new_annotation') && (
                            <p className="text-sm text-orange-600 mt-2">
                                ⚠️ Saving this annotation will trigger signal re-synthesis
                            </p>
                        )}
                    </div>
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
