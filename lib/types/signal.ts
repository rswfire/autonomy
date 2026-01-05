// lib/types/signal.ts
import type { Signal, Synthesis, ClusterSignal, Cluster } from '@prisma/client'

// JSON field types
export type SignalMetadata = Record<string, unknown>
export type SignalPayload = Record<string, unknown>
export type SignalTags = string[]

export type SignalHistory = Array<{
    timestamp: string
    action: string  // 'created', 'edited_title', 'edited_tags', 'synthesis_processed', etc.
    field?: string
    previous_value?: unknown
    new_value?: unknown
    user_id?: string
    synthesis_id?: string
}>

export type SignalAnnotations = {
    user_notes?: Array<{
        timestamp: string
        note: string
        user_id: string
    }>
    synthesis_feedback?: Array<{
        timestamp: string
        feedback: string
        synthesis_type: string
        synthesis_subtype: string
        user_id: string
    }>
}

// Signal with relations
export type SignalWithSynthesis = Signal & {
    synthesis: Synthesis[]
}

export type SignalWithClusters = Signal & {
    clusters: (ClusterSignal & {
        cluster: Cluster
    })[]
}

export type SignalComplete = Signal & {
    synthesis: Synthesis[]
    clusters: (ClusterSignal & {
        cluster: Cluster
    })[]
}

// Type-specific payload schemas (used for validation)
export type DocumentPayload = {
    content: string
    format?: 'plain' | 'markdown' | 'html'
}

export type DocumentMetadata = {
    word_count?: number
    language?: string
    character_count?: number
    file_extension?: string
    encoding?: string
}

export type PhotoPayload = {
    file_path: string
    thumbnail_path?: string
    original_filename?: string
}

export type PhotoMetadata = {
    camera?: string
    lens?: string
    iso?: number
    aperture?: string
    shutter_speed?: string
    focal_length?: number
    width?: number
    height?: number
    file_size?: number
    mime_type?: string
}

export interface TransmissionPayload {
    file_path?: string
    transcript?: string
    timed_transcript?: Array<{
        start: number
        end: number
        text: string
    }>
    mime_type?: string
}

export type TransmissionMetadata = {
    source_type?: 'local' | 'youtube' | 'vimeo' | 'podcast'
    source_url?: string

    // Source-specific data (discriminated by source_type)
    youtube?: {
        id: string
        channel: string
        channel_id?: string
        published_at: string
        thumbnail: string
        view_count?: number
        like_count?: number
    }

    vimeo?: {
        id: string
        user: string
        uploaded_at: string
    }

    podcast?: {
        show: string
        episode: string
        published_at: string
        feed_url?: string
    }

    // Technical metadata (applies to all)
    duration?: number
    bitrate?: number
    sample_rate?: number
    channels?: number
    codec?: string
    file_size?: number
    mime_type?: string

    // Video-specific (when applicable)
    video?: {
        width: number
        height: number
        framerate: number
    }

    // Transcription metadata
    transcript?: {
        method: 'whisper' | 'manual' | 'youtube_auto' | 'imported'
        language?: string
        confidence?: number
        processed_at?: string
    }

    // Timestamps (chapters/markers)
    timestamps?: Array<{
        time: number  // seconds
        label: string
        description?: string
    }>
}

export type ConversationPayload = {
    messages: Array<{
        role: 'user' | 'assistant'
        content: string
        timestamp?: string
    }>
    platform?: 'claude' | 'chatgpt' | 'other'
}

export type ConversationMetadata = {
    message_count?: number
    duration_minutes?: number
    model?: string
    total_tokens?: number
}
