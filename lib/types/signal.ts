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

export type TransmissionPayload = {
    file_path: string
    transcript?: string
    mime_type?: string
}

export type TransmissionMetadata = {
    source_type?: 'local' | 'youtube' | 'vimeo' | 'podcast'
    youtube_id?: string
    youtube_channel?: string
    youtube_published_at?: string
    duration?: number
    bitrate?: number
    sample_rate?: number
    channels?: number
    codec?: string
    file_size?: number
    // Video-specific
    width?: number
    height?: number
    framerate?: number
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
