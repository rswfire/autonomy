// lib/types/signal.ts
import type { Signal, Reflection, ClusterSignal, Cluster } from "@prisma/client"

// Relations

export type SignalComplete = Signal & {
    reflections: Reflection[]
    clusters: (ClusterSignal & {
        cluster: Cluster
    })[]
}

export type SignalWithClusters = Signal & {
    clusters: (ClusterSignal & {
        cluster: Cluster
    })[]
}

export type SignalWithReflections = Signal & {
    reflections: Reflection[]
}

// Definitions

export type SignalAnnotations = {
    user_notes?: Array<{
        timestamp: string
        note: string
        user_id: string
    }>
    reflection_feedback?: Array<{
        timestamp: string
        feedback: string
        reflection_type: string
        user_id: string
    }>
}

export type SignalEntities = {
    beings?: string[]
    places?: string[]
    systems?: string[]
    concepts?: string[]
    media?: string[]
}

export type SignalHistory = Array<{
    timestamp: string
    model?: string
    fields_changed: string[]
    previous_values: Record<string, unknown>
    trigger: "creation" | "user_edit" | "user_annotation" | "re_analysis" | "manual_override"
    user_id?: string
    reflection_id?: string
}>

export type SignalMetadata = Record<string, unknown>

export type SignalPayload = Record<string, unknown>

export type SignalTags = string[]

// JSON Fields

export type DocumentMetadata = {
    word_count?: number
    language?: string
    character_count?: number
    file_extension?: string
    encoding?: string
}

export type DocumentPayload = {
    content: string
    format?: "plain" | "markdown" | "html"
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

export type PhotoPayload = {
    file_path: string
    thumbnail_path?: string
    original_filename?: string
}

export type TransmissionMetadata = {
    source_type?: "local" | "youtube" | "vimeo" | "podcast"
    source_url?: string

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

    duration?: number
    bitrate?: number
    sample_rate?: number
    channels?: number
    codec?: string
    file_size?: number
    mime_type?: string

    video?: {
        width: number
        height: number
        framerate: number
    }

    transcript?: {
        method: "whisper" | "manual" | "youtube_auto" | "imported"
        language?: string
        confidence?: number
        processed_at?: string
    }

    timestamps?: Array<{
        time: number  // seconds
        label: string
        description?: string
    }>
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
