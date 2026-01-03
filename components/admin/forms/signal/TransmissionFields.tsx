// components/admin/forms/signal-fields/TransmissionFields.tsx
'use client'

import { UseFormRegister, Control, Controller } from 'react-hook-form'
import { FormField } from '../FormField'
import { Input } from '../../ui/Input'
import { Textarea } from '../../ui/Textarea'
import { Select } from '../../ui/Select'
import { JsonEditor } from '../JsonEditor'
import { useState } from 'react'

interface TransmissionFieldsProps {
    register: UseFormRegister<any>
    control: Control<any>
}

export function TransmissionFields({ register, control }: TransmissionFieldsProps) {
    const [showYouTubeFields, setShowYouTubeFields] = useState(false)

    return (
        <div className="space-y-6">
            {/* Payload Section */}
            <FormField
                label="File Path"
                name="payload_file_path"
                description="Local file or cloud storage URL (optional if YouTube)"
            >
                <Input
                    {...register('payload_file_path')}
                    placeholder="/uploads/audio/recording.mp3 or https://..."
                />
            </FormField>

            <FormField
                label="Transcript"
                name="payload_transcript"
                description="Plain text transcript"
            >
                <Textarea
                    {...register('payload_transcript')}
                    rows={8}
                    placeholder="Full transcript text..."
                    className="font-mono text-sm"
                />
            </FormField>

            <FormField
                label="Timed Transcript (JSON)"
                name="payload_timed_transcript"
                description="Array of timestamped transcript segments"
            >
                <Controller
                    name="payload_timed_transcript"
                    control={control}
                    render={({ field }) => (
                        <JsonEditor
                            value={field.value}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            rows={8}
                            placeholder='[{"text": "...", "start": 0, "end": 5}]'
                        />
                    )}
                />
            </FormField>

            {/* Metadata Section */}
            <div className="border-t border-gray-200 pt-6 mt-6">
                <h4 className="text-sm font-semibold text-gray-700 mb-4">Metadata</h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField label="Source Type" name="metadata_source_type" required>
                        <Select {...register('metadata_source_type', { required: 'Source type is required' })}>
                            <option value="">Select Type</option>
                            <option value="audio">Audio</option>
                            <option value="video">Video</option>
                            <option value="other">Other</option>
                        </Select>
                    </FormField>

                    <FormField label="Source URL" name="metadata_source_url">
                        <Input
                            {...register('metadata_source_url')}
                            placeholder="https://youtube.com/watch?v=..."
                        />
                    </FormField>
                </div>

                {/* YouTube Fields Toggle */}
                <div className="mt-4">
                    <button
                        type="button"
                        onClick={() => setShowYouTubeFields(!showYouTubeFields)}
                        className="text-sm text-blue-600 hover:underline"
                    >
                        {showYouTubeFields ? '− Hide' : '+ Show'} YouTube Fields
                    </button>
                </div>

                {showYouTubeFields && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 p-4 bg-gray-50 rounded-lg">
                        <FormField label="YouTube ID" name="metadata_youtube_id">
                            <Input
                                {...register('metadata_youtube_id')}
                                placeholder="e.g., dQw4w9WgXcQ"
                            />
                        </FormField>

                        <FormField label="YouTube Channel" name="metadata_youtube_channel">
                            <Input
                                {...register('metadata_youtube_channel')}
                                placeholder="Channel Name"
                            />
                        </FormField>

                        <FormField label="Published At" name="metadata_youtube_published_at">
                            <Input
                                type="datetime-local"
                                {...register('metadata_youtube_published_at')}
                            />
                        </FormField>

                        <FormField label="Thumbnail URL" name="metadata_youtube_thumbnail">
                            <Input
                                {...register('metadata_youtube_thumbnail')}
                                placeholder="https://i.ytimg.com/vi/..."
                            />
                        </FormField>
                    </div>
                )}

                {/* Technical Properties */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <FormField label="Duration (seconds)" name="metadata_duration">
                        <Input
                            type="number"
                            {...register('metadata_duration', { valueAsNumber: true })}
                            placeholder="e.g., 945"
                        />
                    </FormField>

                    <FormField label="Bitrate (kbps)" name="metadata_bitrate">
                        <Input
                            type="number"
                            {...register('metadata_bitrate', { valueAsNumber: true })}
                            placeholder="e.g., 128"
                        />
                    </FormField>

                    <FormField label="Sample Rate (Hz)" name="metadata_sample_rate">
                        <Input
                            type="number"
                            {...register('metadata_sample_rate', { valueAsNumber: true })}
                            placeholder="e.g., 44100"
                        />
                    </FormField>

                    <FormField label="Channels" name="metadata_channels">
                        <Input
                            type="number"
                            {...register('metadata_channels', { valueAsNumber: true })}
                            placeholder="1 (mono) or 2 (stereo)"
                        />
                    </FormField>

                    <FormField label="Codec" name="metadata_codec">
                        <Input
                            {...register('metadata_codec')}
                            placeholder="e.g., h264, aac, mp3"
                        />
                    </FormField>

                    <FormField label="File Size (bytes)" name="metadata_file_size">
                        <Input
                            type="number"
                            {...register('metadata_file_size', { valueAsNumber: true })}
                            placeholder="e.g., 10485760"
                        />
                    </FormField>

                    <FormField label="MIME Type" name="metadata_mime_type">
                        <Input
                            {...register('metadata_mime_type')}
                            placeholder="e.g., video/mp4, audio/mpeg"
                        />
                    </FormField>
                </div>

                {/* Video-Specific Properties */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                    <FormField label="Width (px)" name="metadata_width">
                        <Input
                            type="number"
                            {...register('metadata_width', { valueAsNumber: true })}
                            placeholder="e.g., 1920"
                        />
                    </FormField>

                    <FormField label="Height (px)" name="metadata_height">
                        <Input
                            type="number"
                            {...register('metadata_height', { valueAsNumber: true })}
                            placeholder="e.g., 1080"
                        />
                    </FormField>

                    <FormField label="Framerate (fps)" name="metadata_framerate">
                        <Input
                            type="number"
                            {...register('metadata_framerate', { valueAsNumber: true })}
                            placeholder="e.g., 30"
                        />
                    </FormField>
                </div>

                {/* Processing Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <FormField label="Has Transcript" name="metadata_has_transcript">
                        <Select {...register('metadata_has_transcript')}>
                            <option value="">Not Set</option>
                            <option value="true">Yes</option>
                            <option value="false">No</option>
                        </Select>
                    </FormField>

                    <FormField label="Transcript Method" name="metadata_transcript_method">
                        <Select {...register('metadata_transcript_method')}>
                            <option value="">Select Method</option>
                            <option value="ai">AI Generated</option>
                            <option value="manual">Manual</option>
                            <option value="imported">Imported</option>
                        </Select>
                    </FormField>
                </div>

                {/* Timestamps */}
                <FormField
                    label="Timestamps (JSON)"
                    name="metadata_timestamps"
                    description="Topic markers for navigation"
                >
                    <Controller
                        name="metadata_timestamps"
                        control={control}
                        render={({ field }) => (
                            <JsonEditor
                                value={field.value}
                                onChange={field.onChange}
                                onBlur={field.onBlur}
                                rows={6}
                                placeholder='[{"topic": "intro", "timestamp": "00:00:00"}]'
                            />
                        )}
                    />
                </FormField>
            </div>
        </div>
    )
}
