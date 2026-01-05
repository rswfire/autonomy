// lib/forms/signal/defaults.ts

import { DEFAULTS } from '@/lib/constants'

export function getSignalFormDefaults(defaultValues?: any) {
    if (!defaultValues) {
        return getCreateDefaults()
    }

    return getEditDefaults(defaultValues)
}

function getCreateDefaults() {
    return {
        realm_id: '',
        signal_type: 'DOCUMENT',
        signal_context: DEFAULTS.SIGNAL_CONTEXT,
        signal_status: DEFAULTS.SIGNAL_STATUS,
        signal_visibility: DEFAULTS.SIGNAL_VISIBILITY,
        signal_temperature: DEFAULTS.SIGNAL_TEMPERATURE,
    }
}

function getEditDefaults(values: any) {
    return {
        ...values,
        signal_tags: parseTagsField(values.signal_tags),
        ...flattenPayloadFields(values),
        ...flattenMetadataFields(values),
    }
}

function parseTagsField(tags: any): string[] {
    if (Array.isArray(tags)) return tags
    if (typeof tags === 'string') {
        try {
            return JSON.parse(tags)
        } catch {
            return []
        }
    }
    return []
}

function flattenPayloadFields(values: any) {
    const payload = values.signal_payload || {}

    return {
        // TRANSMISSION fields
        payload_file_path: payload.file_path || '',
        payload_transcript: payload.transcript || '',
        payload_timed_transcript: payload.timed_transcript
            ? JSON.stringify(payload.timed_transcript, null, 2)
            : '',

        // DOCUMENT fields
        payload_content: payload.content || '',
        payload_format: payload.format || 'plain',

        // PHOTO fields
        payload_thumbnail_path: payload.thumbnail_path || '',
        payload_original_filename: payload.original_filename || '',
    }
}

function flattenMetadataFields(values: any) {
    const metadata = values.signal_metadata || {}

    return {
        // TRANSMISSION - Basic fields
        metadata_source_type: metadata.source_type || '',
        metadata_source_url: metadata.source_url || '',
        metadata_duration: metadata.duration || '',

        // TRANSMISSION - YouTube fields
        metadata_youtube_id: metadata.youtube?.id || '',
        metadata_youtube_channel: metadata.youtube?.channel || '',
        metadata_youtube_channel_id: metadata.youtube?.channel_id || '',
        metadata_youtube_published_at: metadata.youtube?.published_at || '',
        metadata_youtube_thumbnail: metadata.youtube?.thumbnail || '',

        // TRANSMISSION - Video fields
        metadata_video_width: metadata.video?.width || '',
        metadata_video_height: metadata.video?.height || '',
        metadata_video_framerate: metadata.video?.framerate || '',

        // TRANSMISSION - Transcript fields
        metadata_transcript_method: metadata.transcript?.method || '',
        metadata_transcript_language: metadata.transcript?.language || '',
        metadata_transcript_confidence: metadata.transcript?.confidence || '',

        // TRANSMISSION - Timestamps
        metadata_timestamps: metadata.timestamps
            ? JSON.stringify(metadata.timestamps, null, 2)
            : '',

        // DOCUMENT fields
        metadata_word_count: metadata.word_count || '',
        metadata_character_count: metadata.character_count || '',
        metadata_language: metadata.language || '',
        metadata_file_extension: metadata.file_extension || '',
        metadata_encoding: metadata.encoding || '',
        metadata_mime_type: metadata.mime_type || '',

        // PHOTO fields
        metadata_camera: metadata.camera || '',
        metadata_lens: metadata.lens || '',
        metadata_iso: metadata.iso || '',
        metadata_aperture: metadata.aperture || '',
        metadata_shutter_speed: metadata.shutter_speed || '',
        metadata_focal_length: metadata.focal_length || '',
        metadata_width: metadata.width || '',
        metadata_height: metadata.height || '',
        metadata_file_size: metadata.file_size || '',
        metadata_color_space: metadata.color_space || '',
        metadata_timestamp_original: metadata.timestamp_original || '',
        metadata_gps_altitude: metadata.gps_altitude || '',
    }
}

export function extractLocationState(defaultValues?: any) {
    return {
        latitude: defaultValues?.signal_location?.coordinates?.[1]?.toString() ||
            defaultValues?.signal_latitude?.toString() ||
            '',
        longitude: defaultValues?.signal_location?.coordinates?.[0]?.toString() ||
            defaultValues?.signal_longitude?.toString() ||
            '',
    }
}
