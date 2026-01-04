// components/admin/forms/SignalForm.tsx
'use client'

import React, { Fragment } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { useMemo, useState, useEffect } from 'react'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { FormSection } from './FormSection'
import { FormField } from './FormField'
import { Input } from '../ui/Input'
import { Textarea } from '../ui/Textarea'
import { Select } from '../ui/Select'
import { JsonEditor } from './JsonEditor'
import { Controller } from 'react-hook-form'
import { SIGNAL_TYPES, SIGNAL_CONTEXT, SIGNAL_STATUS, SIGNAL_VISIBILITY, DEFAULTS } from '@/lib/constants'
import type { Realm, SignalHistory } from '@/lib/types'
import { TagInput } from '../ui/TagInput'
import { toast } from 'sonner'
import { DocumentFields } from './signal/DocumentFields'
import { PhotoFields } from './signal/PhotoFields'
import { TransmissionFields } from './signal/TransmissionFields'
import { ConversationFields } from './signal/ConversationFields'

interface SignalFormProps {
    mode: 'create' | 'edit'
    defaultValues?: any
    onSuccess?: () => void
    isPostgres: boolean
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

export function SignalForm({ mode, defaultValues, onSuccess, isPostgres }: SignalFormProps) {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [realms, setRealms] = useState<Realm[]>([])
    const [loadingRealms, setLoadingRealms] = useState(true)

    const [historyEntries, setHistoryEntries] = useState(defaultValues?.signal_history || [])
    const [annotations, setAnnotations] = useState(defaultValues?.signal_annotations || {})

    const formDefaults = defaultValues ? {
        ...defaultValues,
        signal_metadata: defaultValues.signal_metadata ? JSON.stringify(defaultValues.signal_metadata, null, 2) : '',
        signal_payload: defaultValues.signal_payload ? JSON.stringify(defaultValues.signal_payload, null, 2) : '',
        signal_tags: (() => {
            if (Array.isArray(defaultValues.signal_tags)) return defaultValues.signal_tags;
            if (typeof defaultValues.signal_tags === 'string') {
                try {
                    return JSON.parse(defaultValues.signal_tags);
                } catch {
                    return [];
                }
            }
            return [];
        })(),
        signal_location: defaultValues.signal_location ? JSON.stringify(defaultValues.signal_location, null, 2) : '',

        metadata_source_type: defaultValues.signal_metadata?.source_type || '',
        metadata_source_url: defaultValues.signal_metadata?.source_url || '',
        metadata_youtube_id: defaultValues.signal_metadata?.youtube?.id || '',
        metadata_youtube_channel: defaultValues.signal_metadata?.youtube?.channel || '',
        metadata_youtube_channel_id: defaultValues.signal_metadata?.youtube?.channel_id || '',
        metadata_youtube_published_at: defaultValues.signal_metadata?.youtube?.published_at || '',
        metadata_youtube_thumbnail: defaultValues.signal_metadata?.youtube?.thumbnail || '',
        metadata_duration: defaultValues.signal_metadata?.duration || '',

        payload_file_path: defaultValues.signal_payload?.file_path || '',
        payload_transcript: defaultValues.signal_payload?.transcript || '',
        payload_timed_transcript: defaultValues.signal_payload?.timed_transcript ?
            JSON.stringify(defaultValues.signal_payload.timed_transcript, null, 2) : '',

        metadata_transcript_method: defaultValues.signal_metadata?.transcript?.method || '',
        metadata_transcript_language: defaultValues.signal_metadata?.transcript?.language || '',
        metadata_transcript_confidence: defaultValues.signal_metadata?.transcript?.confidence || '',
        metadata_transcript_processed_at: defaultValues.signal_metadata?.transcript?.processed_at || '',

        metadata_video_width: defaultValues.signal_metadata?.video?.width || '',
        metadata_video_height: defaultValues.signal_metadata?.video?.height || '',
        metadata_video_framerate: defaultValues.signal_metadata?.video?.framerate || '',

        metadata_timestamps: defaultValues.signal_metadata?.timestamps ?
            JSON.stringify(defaultValues.signal_metadata.timestamps, null, 2) : '',
    } : {
        realm_id: '',
        signal_type: 'DOCUMENT',
        signal_context: DEFAULTS.SIGNAL_CONTEXT,
        signal_status: DEFAULTS.SIGNAL_STATUS,
        signal_visibility: DEFAULTS.SIGNAL_VISIBILITY,
        signal_temperature: DEFAULTS.SIGNAL_TEMPERATURE,
    }

    const { register, control, handleSubmit, setValue, watch, formState: { errors } } = useForm({
        defaultValues: formDefaults,
    })

    const [latitude, setLatitude] = useState<string>(
        defaultValues?.signal_location?.coordinates?.[1]?.toString() ||
        defaultValues?.signal_latitude?.toString() ||
        ''
    )

    const [longitude, setLongitude] = useState<string>(
        defaultValues?.signal_location?.coordinates?.[0]?.toString() ||
        defaultValues?.signal_longitude?.toString() ||
        ''
    )

    const signalType = watch('signal_type')

    useEffect(() => {
        async function loadRealms() {
            try {
                const res = await fetch('/api/admin/realms')
                if (!res.ok) throw new Error('Failed to load realms')

                const data = await res.json()
                setRealms(data)

                if (mode === 'create' && data.length > 0 && !defaultValues?.realm_id) {
                    setValue('realm_id', data[0].realm_id)
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load realms')
            } finally {
                setLoadingRealms(false)
            }
        }
        loadRealms()
    }, [mode, defaultValues, setValue])

    const onSubmit = async (data: any) => {
        setIsSubmitting(true)
        setError(null)

        try {
            const processedData = { ...data }

            // Build signal_payload based on type
            if (signalType === 'DOCUMENT') {
                processedData.signal_payload = {
                    content: data.payload_content,
                    format: data.payload_format || 'plain',
                }
                processedData.signal_metadata = {
                    word_count: data.metadata_word_count,
                    character_count: data.metadata_character_count,
                    language: data.metadata_language,
                    file_extension: data.metadata_file_extension,
                    encoding: data.metadata_encoding,
                    mime_type: data.metadata_mime_type,
                }
            } else if (signalType === 'PHOTO') {
                processedData.signal_payload = {
                    file_path: data.payload_file_path,
                    thumbnail_path: data.payload_thumbnail_path,
                    original_filename: data.payload_original_filename,
                }
                processedData.signal_metadata = {
                    camera: data.metadata_camera,
                    lens: data.metadata_lens,
                    iso: data.metadata_iso,
                    aperture: data.metadata_aperture,
                    shutter_speed: data.metadata_shutter_speed,
                    focal_length: data.metadata_focal_length,
                    width: data.metadata_width,
                    height: data.metadata_height,
                    file_size: data.metadata_file_size,
                    mime_type: data.metadata_mime_type,
                    color_space: data.metadata_color_space,
                    timestamp_original: data.metadata_timestamp_original,
                    gps_altitude: data.metadata_gps_altitude,
                }
            } else if (signalType === 'TRANSMISSION') {
                processedData.signal_payload = {
                    file_path: data.payload_file_path,
                    transcript: data.payload_transcript,
                    timed_transcript: data.payload_timed_transcript
                        ? (typeof data.payload_timed_transcript === 'string'
                            ? JSON.parse(data.payload_timed_transcript)
                            : data.payload_timed_transcript)
                        : undefined,
                }

                // Build nested metadata structure
                const metadata: any = {
                    source_type: data.metadata_source_type,
                    source_url: data.metadata_source_url,
                    duration: data.metadata_duration,
                    bitrate: data.metadata_bitrate,
                    sample_rate: data.metadata_sample_rate,
                    channels: data.metadata_channels,
                    codec: data.metadata_codec,
                    file_size: data.metadata_file_size,
                    mime_type: data.metadata_mime_type,
                }

                // Source-specific nested data
                if (data.metadata_source_type === 'youtube') {
                    metadata.youtube = {
                        id: data.metadata_youtube_id,
                        channel: data.metadata_youtube_channel,
                        channel_id: data.metadata_youtube_channel_id,
                        published_at: data.metadata_youtube_published_at,
                        thumbnail: data.metadata_youtube_thumbnail,
                    }
                } else if (data.metadata_source_type === 'vimeo') {
                    metadata.vimeo = {
                        id: data.metadata_vimeo_id,
                        user: data.metadata_vimeo_user,
                        uploaded_at: data.metadata_vimeo_uploaded_at,
                    }
                } else if (data.metadata_source_type === 'podcast') {
                    metadata.podcast = {
                        show: data.metadata_podcast_show,
                        episode: data.metadata_podcast_episode,
                        published_at: data.metadata_podcast_published_at,
                        feed_url: data.metadata_podcast_feed_url,
                    }
                }

                // Video properties (if present)
                if (data.metadata_video_width || data.metadata_video_height || data.metadata_video_framerate) {
                    metadata.video = {
                        width: data.metadata_video_width,
                        height: data.metadata_video_height,
                        framerate: data.metadata_video_framerate,
                    }
                }

                // Transcript metadata (if present)
                if (data.metadata_transcript_method) {
                    metadata.transcript = {
                        method: data.metadata_transcript_method,
                        language: data.metadata_transcript_language,
                        confidence: data.metadata_transcript_confidence,
                    }
                }

                // Timestamps (if present)
                if (data.metadata_timestamps) {
                    metadata.timestamps = typeof data.metadata_timestamps === 'string'
                        ? JSON.parse(data.metadata_timestamps)
                        : data.metadata_timestamps
                }

                processedData.signal_metadata = metadata
            } else if (signalType === 'CONVERSATION') {
                processedData.signal_payload = {
                    messages: data.payload_messages || [],
                    summary: data.payload_summary,
                    key_points: data.payload_key_points?.split(',').map((s: string) => s.trim()).filter(Boolean),
                }
                processedData.signal_metadata = {
                    platform: data.metadata_platform,
                    model: data.metadata_model,
                    message_count: data.metadata_message_count,
                    turn_count: data.metadata_turn_count,
                    duration_minutes: data.metadata_duration_minutes,
                    total_tokens: data.metadata_total_tokens,
                    started_at: data.metadata_started_at,
                    ended_at: data.metadata_ended_at,
                }
            }

            if (mode === 'edit' && defaultValues?.signal_metadata?.legacy) {
                processedData.signal_metadata = {
                    ...processedData.signal_metadata,
                    legacy: defaultValues.signal_metadata.legacy,
                };
            }

            // Clean up temporary form fields
            Object.keys(processedData).forEach(key => {
                if (key.startsWith('payload_') || key.startsWith('metadata_')) {
                    delete processedData[key]
                }
            })

            // Convert lat/lng to coordinates object (server handles DB-specific format)
            if (latitude && longitude) {
                processedData.coordinates = {
                    latitude: parseFloat(latitude),
                    longitude: parseFloat(longitude)
                }
            }

            // Delete fields that server doesn't need
            delete processedData.latitude
            delete processedData.longitude
            delete processedData.signal_location  // Server handles this via coordinates

            // Parse tags
            if (processedData.signal_tags && typeof processedData.signal_tags === 'string') {
                try {
                    processedData.signal_tags = JSON.parse(processedData.signal_tags)
                } catch {
                    // Keep as string if invalid
                }
            }

            if (processedData.new_annotation?.trim()) {
                const existingAnnotations = defaultValues?.signal_annotations || {user_notes: []}

                processedData.signal_annotations = {
                    ...existingAnnotations,
                    user_notes: [
                        ...(existingAnnotations.user_notes || []),
                        {
                            timestamp: new Date().toISOString(),
                            note: processedData.new_annotation.trim(),
                            user_id: 'current_user_id', // Get from auth context
                        }
                    ]
                }

                // Flag for re-synthesis
                processedData.trigger_synthesis = true
            }

            delete processedData.new_annotation

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
            if (result.signal) {
                setHistoryEntries(result.signal.signal_history || [])
                setAnnotations(result.signal.signal_annotations || {})
            }

            toast.success(mode === 'create' ? 'Signal created' : 'Signal updated')
            if (onSuccess) {
                onSuccess()
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

    if (loadingRealms) {
        return <div className="text-gray-600">Loading realms...</div>
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
                                disabled={mode === 'edit'} // ADD THIS
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

                    <FormField label="Description" name="signal_description">
                        <Textarea
                            {...register('signal_description')}
                            rows={4}
                            placeholder="Enter description"
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
                    title="History & Annotations"
                    description="Audit trail and user context for synthesis"
                >
                    {/* History - Read-only */}
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

                    {/* Annotations - Editable */}
                    <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Annotations</h4>

                        {/* Existing annotations - read-only */}
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

                        {/* New annotation input */}
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
