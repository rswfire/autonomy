// components/admin/forms/signal/TransmissionFields.tsx
import { UseFormRegister, Control } from 'react-hook-form'
import { FormField } from '../FormField'
import { Input } from '../../ui/Input'
import { Textarea } from '../../ui/Textarea'
import { Select } from '../../ui/Select'
import { Controller, useWatch } from 'react-hook-form'

interface TransmissionFieldsProps {
    register: UseFormRegister<any>
    control: Control<any>
}

export function TransmissionFields({ register, control }: TransmissionFieldsProps) {
    const sourceType = useWatch({ control, name: 'metadata_source_type' })

    return (
        <div className="space-y-6">
            {/* Payload Fields */}
            <div className="space-y-4">
                <h4 className="text-sm font-semibold text-gray-700 border-b pb-2">File & Content</h4>

                <FormField label="File Path" name="payload_file_path">
                    <Input {...register('payload_file_path')} placeholder="/path/to/file.mp4" />
                </FormField>

                <FormField label="Transcript" name="payload_transcript">
                    <Textarea {...register('payload_transcript')} rows={6} placeholder="Full transcript text..." />
                </FormField>

                <FormField
                    label="Timed Transcript"
                    name="payload_timed_transcript"
                    description="JSON array of {time, text} objects"
                >
                    <Textarea
                        {...register('payload_timed_transcript')}
                        rows={4}
                        placeholder='[{"time": 0, "text": "Hello"}, {"time": 3.5, "text": "World"}]'
                        className="font-mono text-sm"
                    />
                </FormField>
            </div>

            {/* Metadata Fields */}
            <div className="space-y-4">
                <h4 className="text-sm font-semibold text-gray-700 border-b pb-2">Source Information</h4>

                <FormField label="Source Type" name="metadata_source_type">
                    <Select {...register('metadata_source_type')}>
                        <option value="">Select Source</option>
                        <option value="local">Local File</option>
                        <option value="youtube">YouTube</option>
                        <option value="vimeo">Vimeo</option>
                        <option value="podcast">Podcast</option>
                    </Select>
                </FormField>

                <FormField label="Source URL" name="metadata_source_url">
                    <Input {...register('metadata_source_url')} placeholder="https://..." />
                </FormField>

                {/* YouTube-specific fields */}
                {sourceType === 'youtube' && (
                    <div className="pl-4 border-l-2 border-blue-200 space-y-4">
                        <FormField label="YouTube ID" name="metadata_youtube_id">
                            <Input {...register('metadata_youtube_id')} placeholder="dQw4w9WgXcQ" />
                        </FormField>
                        <FormField label="Channel" name="metadata_youtube_channel">
                            <Input {...register('metadata_youtube_channel')} />
                        </FormField>
                        <FormField label="Channel ID" name="metadata_youtube_channel_id">
                            <Input {...register('metadata_youtube_channel_id')} />
                        </FormField>
                        <FormField label="Published At" name="metadata_youtube_published_at">
                            <Input type="datetime-local" {...register('metadata_youtube_published_at')} />
                        </FormField>
                        <FormField label="Thumbnail URL" name="metadata_youtube_thumbnail">
                            <Input {...register('metadata_youtube_thumbnail')} />
                        </FormField>
                    </div>
                )}

                {/* Vimeo-specific fields */}
                {sourceType === 'vimeo' && (
                    <div className="pl-4 border-l-2 border-purple-200 space-y-4">
                        <FormField label="Vimeo ID" name="metadata_vimeo_id">
                            <Input {...register('metadata_vimeo_id')} />
                        </FormField>
                        <FormField label="User" name="metadata_vimeo_user">
                            <Input {...register('metadata_vimeo_user')} />
                        </FormField>
                        <FormField label="Uploaded At" name="metadata_vimeo_uploaded_at">
                            <Input type="datetime-local" {...register('metadata_vimeo_uploaded_at')} />
                        </FormField>
                    </div>
                )}

                {/* Podcast-specific fields */}
                {sourceType === 'podcast' && (
                    <div className="pl-4 border-l-2 border-green-200 space-y-4">
                        <FormField label="Show" name="metadata_podcast_show">
                            <Input {...register('metadata_podcast_show')} />
                        </FormField>
                        <FormField label="Episode" name="metadata_podcast_episode">
                            <Input {...register('metadata_podcast_episode')} />
                        </FormField>
                        <FormField label="Published At" name="metadata_podcast_published_at">
                            <Input type="datetime-local" {...register('metadata_podcast_published_at')} />
                        </FormField>
                        <FormField label="Feed URL" name="metadata_podcast_feed_url">
                            <Input {...register('metadata_podcast_feed_url')} />
                        </FormField>
                    </div>
                )}
            </div>

            {/* Technical Metadata */}
            <div className="space-y-4">
                <h4 className="text-sm font-semibold text-gray-700 border-b pb-2">Technical Details</h4>

                <div className="grid grid-cols-2 gap-4">
                    <FormField label="Duration (seconds)" name="metadata_duration">
                        <Input type="number" {...register('metadata_duration', { valueAsNumber: true })} />
                    </FormField>
                    <FormField label="File Size (bytes)" name="metadata_file_size">
                        <Input type="number" {...register('metadata_file_size', { valueAsNumber: true })} />
                    </FormField>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <FormField label="Bitrate" name="metadata_bitrate">
                        <Input type="number" {...register('metadata_bitrate', { valueAsNumber: true })} />
                    </FormField>
                    <FormField label="Sample Rate" name="metadata_sample_rate">
                        <Input type="number" {...register('metadata_sample_rate', { valueAsNumber: true })} />
                    </FormField>
                    <FormField label="Channels" name="metadata_channels">
                        <Input type="number" {...register('metadata_channels', { valueAsNumber: true })} />
                    </FormField>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <FormField label="Codec" name="metadata_codec">
                        <Input {...register('metadata_codec')} placeholder="h264, aac, etc." />
                    </FormField>
                    <FormField label="MIME Type" name="metadata_mime_type">
                        <Input {...register('metadata_mime_type')} placeholder="video/mp4" />
                    </FormField>
                </div>
            </div>

            {/* Video Metadata */}
            <div className="space-y-4">
                <h4 className="text-sm font-semibold text-gray-700 border-b pb-2">Video Properties (if applicable)</h4>

                <div className="grid grid-cols-3 gap-4">
                    <FormField label="Width" name="metadata_video_width">
                        <Input type="number" {...register('metadata_video_width', { valueAsNumber: true })} />
                    </FormField>
                    <FormField label="Height" name="metadata_video_height">
                        <Input type="number" {...register('metadata_video_height', { valueAsNumber: true })} />
                    </FormField>
                    <FormField label="Framerate" name="metadata_video_framerate">
                        <Input type="number" step="0.01" {...register('metadata_video_framerate', { valueAsNumber: true })} />
                    </FormField>
                </div>
            </div>

            {/* Transcript Metadata */}
            <div className="space-y-4">
                <h4 className="text-sm font-semibold text-gray-700 border-b pb-2">Transcript Information</h4>

                <div className="grid grid-cols-2 gap-4">
                    <FormField label="Transcript Method" name="metadata_transcript_method">
                        <Select {...register('metadata_transcript_method')}>
                            <option value="">Select Method</option>
                            <option value="whisper">Whisper</option>
                            <option value="manual">Manual</option>
                            <option value="youtube_auto">YouTube Auto</option>
                            <option value="imported">Imported</option>
                        </Select>
                    </FormField>
                    <FormField label="Language" name="metadata_transcript_language">
                        <Input {...register('metadata_transcript_language')} placeholder="en, es, etc." />
                    </FormField>
                </div>

                <FormField label="Confidence" name="metadata_transcript_confidence">
                    <Input type="number" step="0.01" {...register('metadata_transcript_confidence', { valueAsNumber: true })} placeholder="0.0 - 1.0" />
                </FormField>
            </div>

            {/* Timestamps */}
            <div className="space-y-4">
                <h4 className="text-sm font-semibold text-gray-700 border-b pb-2">Timestamps / Chapters</h4>

                <FormField
                    label="Timestamps"
                    name="metadata_timestamps"
                    description="JSON array of {time, label, description} objects"
                >
                    <Textarea
                        {...register('metadata_timestamps')}
                        rows={4}
                        placeholder='[{"time": 120, "label": "Introduction", "description": "Overview"}]'
                        className="font-mono text-sm"
                    />
                </FormField>
            </div>
        </div>
    )
}
