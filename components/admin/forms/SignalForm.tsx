// components/admin/forms/SignalForm.tsx
'use client'

import {AnalysisHistory} from "@/components/admin/AnalysisHistory";
import {AnnotationsPanel} from "@/components/admin/AnnotationsPanel";
import {SignalAnalysisForm} from "@/components/admin/forms/SignalAnalysisForm";
import Icon from "@/components/Icon";
import {SIGNAL_CONTEXT, SIGNAL_STATUS, SIGNAL_TYPES, SIGNAL_VISIBILITY} from '@/lib/constants'
import type {Realm} from '@/lib/types'
import {useRouter} from 'next/navigation'
import React, {useEffect, useState} from 'react'
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
import { REFLECTION_DESCRIPTIONS, REFLECTION_TYPES } from '@/lib/constants/reflection'

interface SignalFormProps {
    mode: 'create' | 'edit'
    defaultValues?: any
    onSuccess?: () => void
    isPostgres: boolean
    realms: Realm[]
    signalId?: string
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

export function SignalForm({ mode, defaultValues, onSuccess, isPostgres, realms, signalId }: SignalFormProps) {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [historyEntries, setHistoryEntries] = useState(defaultValues?.signal_history || [])
    const [annotations, setAnnotations] = useState(defaultValues?.signal_annotations || {})
    const [triggerReanalysis, setTriggerReanalysis] = useState(false)

    // Add reflection state here
    const [showReflectionForm, setShowReflectionForm] = useState(false)
    const [reflectionTypes, setReflectionTypes] = useState<string[]>([])
    const [isReflecting, setIsReflecting] = useState(false)
    const [reflections, setReflections] = useState<any[]>([])

    const formDefaults = getSignalFormDefaults(defaultValues)
    const { register, control, handleSubmit, setValue, watch, formState: { errors } } = useForm({
        defaultValues: formDefaults,
    })

    const locationState = extractLocationState(defaultValues)
    const [latitude, setLatitude] = useState(locationState.latitude)
    const [longitude, setLongitude] = useState(locationState.longitude)
    const signalType = watch('signal_type')
    const [showAnalysisForm, setShowAnalysisForm] = useState(false)

    useEffect(() => {
        if (mode === 'edit' && signalId) {
            const loadReflections = async () => {
                try {
                    const response = await fetch(`/api/admin/signals/${signalId}/reflections`)
                    if (response.ok) {
                        const data = await response.json()
                        setReflections(data.reflections || [])
                    }
                } catch (error) {
                    console.error('Failed to load reflections:', error)
                }
            }

            loadReflections()
        }
    }, [mode, signalId])

// Add reflection handler
    const handleReflect = async () => {
        if (reflectionTypes.length === 0) {
            toast.error('Please select at least one reflection type')
            return
        }

        setIsReflecting(true)
        toast.info('Generating reflections...', {
            duration: Infinity,
            id: 'reflection',
            description: 'This may take a moment.'
        })

        try {
            const response = await fetch(`/api/admin/signals/${signalId}/reflect`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    realm_id: watch('realm_id'),
                    reflection_types: reflectionTypes,
                }),
            })

            toast.dismiss('reflection')

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Reflection failed')
            }

            const data = await response.json()

            toast.success(`Generated ${data.reflections.length} reflection(s)`)

            // Reload reflections
            const reflectionsResponse = await fetch(`/api/admin/signals/${signalId}/reflections`)
            if (reflectionsResponse.ok) {
                const reflectionsData = await reflectionsResponse.json()
                setReflections(reflectionsData.reflections || [])
            }

            // Clear selection
            setReflectionTypes([])
        } catch (error) {
            console.error('Reflection error:', error)
            toast.error('Failed to generate reflections', {
                description: error instanceof Error ? error.message : 'Unknown error'
            })
        } finally {
            setIsReflecting(false)
        }
    }

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
                if (triggerReanalysis) {
                    processedData.trigger_synthesis = true
                }
            }

            // Clean up fields that shouldn't be sent
            delete processedData.latitude
            delete processedData.longitude
            delete processedData.signal_location
            delete processedData.new_annotation

            // Call API route instead of Prisma query
            const url = mode === 'create'
                ? '/api/admin/signals/'
                : `/api/admin/signals/${defaultValues?.signal_id}/`

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

            if (result.signal && triggerReanalysis) {
                toast.info('Analysis started...', {
                    duration: Infinity,
                    id: 'analysis',
                    description: 'Safe to navigate away. Page will refresh when complete, or check back later to see results.'
                })

                // Trigger analysis
                const analysisResponse = await fetch(`/api/admin/signals/${defaultValues?.signal_id}/analyze`, {
                    method: 'POST',
                })

                const analysisData = await analysisResponse.json()

                toast.dismiss('analysis')

                if (analysisResponse.ok) {
                    toast.success('Analysis complete!', {
                        description: `Updated ${analysisData.fields.length} fields`,
                    })
                } else {
                    toast.error('Analysis failed', {
                        description: analysisData.error,
                    })
                }

                // Refresh to show new data
                window.location.reload()
            }

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

            {mode === 'edit' && signalId && (
                <div className="mb-8">
                    <div className="flex justify-end gap-3">
                        <button
                            onClick={(e) => {
                                e.preventDefault()
                                setShowAnalysisForm(!showAnalysisForm)
                            }}
                            className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition-colors"
                        >
                            <Icon name="Sparkles" size={16} />
                            Analyze Signal
                            <Icon name={showAnalysisForm ? "ChevronUp" : "ChevronDown"} size={16} />
                        </button>

                        <button
                            onClick={(e) => {
                                e.preventDefault()
                                setShowReflectionForm(!showReflectionForm)
                            }}
                            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
                        >
                            <Icon name="BookOpen" size={16} />
                            Generate Reflections
                            <Icon name={showReflectionForm ? "ChevronUp" : "ChevronDown"} size={16} />
                        </button>
                    </div>

                    {showAnalysisForm && (
                        <div className="mt-4 p-6 bg-white border border-gray-200 rounded-lg">
                            <h2 className="text-xl font-semibold text-gray-900 mb-2">Signal Analysis</h2>
                            <p className="text-sm text-gray-600 mb-6">
                                Select which fields to update, then run analysis. Only the selected fields will be processed and updated.
                            </p>
                            <SignalAnalysisForm signalId={signalId} realmId={watch('realm_id')} />
                        </div>
                    )}

                    {showReflectionForm && (
                        <div className="mt-4 p-6 bg-white border border-gray-200 rounded-lg">
                            <h2 className="text-xl font-semibold text-gray-900 mb-2">Generate Reflections</h2>
                            <p className="text-sm text-gray-600 mb-6">
                                Select reflection types to generate narrative insights from this signal's complete data.
                            </p>

                            <div className="space-y-4">
                                <div className="flex flex-wrap gap-4">
                                    <div className="flex flex-wrap gap-4">
                                        {REFLECTION_TYPES.map((type) => (
                                            <label key={type} className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={reflectionTypes.includes(type)}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setReflectionTypes([...reflectionTypes, type])
                                                        } else {
                                                            setReflectionTypes(reflectionTypes.filter(t => t !== type))
                                                        }
                                                    }}
                                                    className="w-4 h-4 text-purple-600 rounded"
                                                />
                                                <span className="font-medium">{type.charAt(0) + type.slice(1).toLowerCase()}</span>
                                                <span className="text-sm text-gray-500">— {REFLECTION_DESCRIPTIONS[type]}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    onClick={handleReflect}
                                    disabled={isReflecting || reflectionTypes.length === 0}
                                    className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {isReflecting ? 'Generating...' : 'Generate Selected Reflections'}
                                </button>
                            </div>

                            {reflections.length > 0 && (
                                <div className="mt-8 space-y-6">
                                    <h3 className="text-lg font-semibold text-gray-900">Existing Reflections</h3>
                                    {reflections.map((reflection) => (
                                        <div key={reflection.reflection_id} className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="flex items-center gap-2">
                                                    <Icon name="BookOpen" size={16} className="text-purple-600" />
                                                    <h4 className="text-lg font-semibold text-gray-900">
                                                        {reflection.reflection_type}
                                                    </h4>
                                                </div>
                                                <span className="text-sm text-gray-500">
                                        {new Date(reflection.stamp_created).toLocaleDateString()}
                                    </span>
                                            </div>
                                            <div className="prose prose-gray max-w-none text-gray-700 whitespace-pre-wrap">
                                                {reflection.reflection_content}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
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
                    title="Analysis History"
                    description="Complete audit trail of all AI analysis runs with full input/output"
                >
                    <AnalysisHistory history={historyEntries} />
                </FormSection>

                <FormSection
                    title="Annotations & Re-analysis"
                    description="Add high-priority context to correct or clarify signal details"
                >
                    <AnnotationsPanel
                        annotations={annotations}
                        newAnnotation={watch('new_annotation') || ''}
                        onNewAnnotationChange={(value) => setValue('new_annotation', value)}
                        triggerReanalysis={triggerReanalysis}
                        onTriggerReanalysisChange={setTriggerReanalysis}
                    />
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
