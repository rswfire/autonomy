// lib/forms/signal/processing.ts

export function buildSignalPayload(signalType: string, data: any) {
    switch (signalType) {
        case 'DOCUMENT':
            return buildDocumentData(data)
        case 'PHOTO':
            return buildPhotoData(data)
        case 'TRANSMISSION':
            return buildTransmissionData(data)
        case 'CONVERSATION':
            return buildConversationData(data)
        default:
            return { payload: {}, metadata: {} }
    }
}

function buildDocumentData(data: any) {
    return {
        payload: {
            content: data.payload_content,
            format: data.payload_format || 'plain',
        },
        metadata: {
            word_count: data.metadata_word_count,
            character_count: data.metadata_character_count,
            language: data.metadata_language,
            file_extension: data.metadata_file_extension,
            encoding: data.metadata_encoding,
            mime_type: data.metadata_mime_type,
        }
    }
}

function buildPhotoData(data: any) {
    return {
        payload: {
            file_path: data.payload_file_path,
            thumbnail_path: data.payload_thumbnail_path,
            original_filename: data.payload_original_filename,
        },
        metadata: {
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
    }
}

function buildTransmissionData(data: any) {
    const payload = {
        file_path: data.payload_file_path,
        transcript: data.payload_transcript,
        timed_transcript: parseJSONField(data.payload_timed_transcript)
    }

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

    // Video properties
    if (data.metadata_video_width || data.metadata_video_height || data.metadata_video_framerate) {
        metadata.video = {
            width: data.metadata_video_width,
            height: data.metadata_video_height,
            framerate: data.metadata_video_framerate,
        }
    }

    // Transcript metadata
    if (data.metadata_transcript_method) {
        metadata.transcript = {
            method: data.metadata_transcript_method,
            language: data.metadata_transcript_language,
            confidence: data.metadata_transcript_confidence,
        }
    }

    // Timestamps
    if (data.metadata_timestamps) {
        metadata.timestamps = parseJSONField(data.metadata_timestamps)
    }

    return { payload, metadata }
}

function buildConversationData(data: any) {
    return {
        payload: {
            messages: data.payload_messages || [],
            summary: data.payload_summary,
            key_points: data.payload_key_points?.split(',').map((s: string) => s.trim()).filter(Boolean),
        },
        metadata: {
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
}

function parseJSONField(value: any) {
    if (!value) return undefined
    if (typeof value === 'string') {
        try {
            return JSON.parse(value)
        } catch {
            return undefined
        }
    }
    return value
}

export function cleanFormData(data: any) {
    const cleaned = { ...data }

    // Remove temporary form fields
    Object.keys(cleaned).forEach(key => {
        if (key.startsWith('payload_') || key.startsWith('metadata_')) {
            delete cleaned[key]
        }
    })

    return cleaned
}

export function buildCoordinates(latitude: string, longitude: string) {
    if (!latitude || !longitude) return null

    return {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude)
    }
}

export function buildAnnotations(newAnnotation: string | undefined, existingAnnotations: any) {
    if (!newAnnotation?.trim()) return null

    return {
        ...existingAnnotations,
        user_notes: [
            ...(existingAnnotations?.user_notes || []),
            {
                timestamp: new Date().toISOString(),
                note: newAnnotation.trim(),
                user_id: 'current_user_id',
            }
        ]
    }
}
