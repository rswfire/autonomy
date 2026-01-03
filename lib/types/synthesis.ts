// lib/types/synthesis.ts
import type { Synthesis, Signal, Cluster } from '@prisma/client'

export type SynthesisContent = Record<string, unknown>
export type SynthesisAnnotations = Record<string, unknown>

export type SynthesisHistory = Array<{
    timestamp: string
    action: string  // 'processing_started', 'completed', 'failed', 'retried'
    model?: string  // 'gpt-4', 'claude-sonnet-4', etc.
    input_tokens?: number
    output_tokens?: number
    processing_time_ms?: number
    error?: string
    result_summary?: string
}>

export type SynthesisErrors = Array<{
    timestamp: string
    error: string
    context?: Record<string, unknown>
}>

export type SynthesisWithSignal = Synthesis & {
    signal: Signal | null
}

export type SynthesisWithCluster = Synthesis & {
    cluster: Cluster | null
}

export type SynthesisComplete = Synthesis & {
    signal: Signal | null
    cluster: Cluster | null
}

// Type-specific synthesis content schemas
export type SurfaceSynthesis = {
    title: string
    description: string
    tags: string[]
    entities?: string[]
    themes?: string[]
}

export type StructureSynthesis = {
    entities: Array<{
        name: string
        type: string
        mentions: number
    }>
    themes: string[]
    relationships: Array<{
        from: string
        to: string
        type: string
    }>
}

export type PatternsSynthesis = {
    temporal_patterns?: Record<string, unknown>
    frequency_analysis?: Record<string, unknown>
    recurring_themes?: string[]
}

export type MirrorSynthesis = {
    narrative: string
    temporal_span: {
        start: string
        end: string
    }
    coherence_score: number
}

export type MythSynthesis = {
    archetypal_patterns: string[]
    narrative: string
    symbolic_elements: Record<string, unknown>
}

export type NarrativeSynthesis = {
    narrative: string
    chapters?: Array<{
        title: string
        content: string
        timespan: {
            start: string
            end: string
        }
    }>
}
