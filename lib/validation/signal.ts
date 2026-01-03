// lib/validation/signal.ts
import { z } from 'zod'
import {
    SIGNAL_TYPES,
    SIGNAL_CONTEXT,
    SIGNAL_STATUS,
    SIGNAL_VISIBILITY,
    LIMITS,
    GEO,
} from '../constants'
import { isValidUlid } from '../utils/ulid'

// ====================
// GEOSPATIAL SCHEMAS
// ====================

const coordinatesSchema = z.object({
    latitude: z.number().min(GEO.LATITUDE_MIN).max(GEO.LATITUDE_MAX),
    longitude: z.number().min(GEO.LONGITUDE_MIN).max(GEO.LONGITUDE_MAX),
})

const geographyPointSchema = z.object({
    type: z.literal('Point'),
    coordinates: z.tuple([
        z.number().min(GEO.LONGITUDE_MIN).max(GEO.LONGITUDE_MAX), // longitude first per GeoJSON
        z.number().min(GEO.LATITUDE_MIN).max(GEO.LATITUDE_MAX),   // latitude second
    ]),
})

// ====================
// TYPE-SPECIFIC PAYLOAD SCHEMAS
// ====================

// DOCUMENT
const documentPayloadSchema = z.object({
    content: z.string(),
    format: z.enum(['plain', 'markdown', 'html']).default('plain'),
})

const documentMetadataSchema = z.object({
    word_count: z.number().optional(),
    language: z.string().optional(),
    character_count: z.number().optional(),
    file_extension: z.string().optional(),
    encoding: z.string().optional(),
})

// PHOTO
const photoPayloadSchema = z.object({
    file_path: z.string(),
    thumbnail_path: z.string().optional(),
    original_filename: z.string().optional(),
})

const photoMetadataSchema = z.object({
    camera: z.string().optional(),
    lens: z.string().optional(),
    iso: z.number().optional(),
    aperture: z.string().optional(),
    shutter_speed: z.string().optional(),
    focal_length: z.number().optional(),
    width: z.number().optional(),
    height: z.number().optional(),
    file_size: z.number().optional(),
    mime_type: z.string().optional(),
})

// TRANSMISSION
const transmissionPayloadSchema = z.object({
    file_path: z.string(),
    transcript: z.string().optional(),
    mime_type: z.string().optional(),
})

const transmissionMetadataSchema = z.object({
    source_type: z.enum(['local', 'youtube', 'vimeo', 'podcast']).optional(),
    youtube_id: z.string().optional(),
    youtube_channel: z.string().optional(),
    youtube_published_at: z.string().optional(),
    duration: z.number().optional(),
    bitrate: z.number().optional(),
    sample_rate: z.number().optional(),
    channels: z.number().optional(),
    codec: z.string().optional(),
    file_size: z.number().optional(),
    // Video-specific
    width: z.number().optional(),
    height: z.number().optional(),
    framerate: z.number().optional(),
})

// CONVERSATION
const conversationPayloadSchema = z.object({
    messages: z.array(z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string(),
        timestamp: z.string().optional(),
    })),
    platform: z.enum(['claude', 'chatgpt', 'other']).optional(),
})

const conversationMetadataSchema = z.object({
    message_count: z.number().optional(),
    duration_minutes: z.number().optional(),
    model: z.string().optional(),
    total_tokens: z.number().optional(),
})

// ====================
// SCHEMA MAPS
// ====================

export const signalPayloadSchemas = {
    DOCUMENT: documentPayloadSchema,
    PHOTO: photoPayloadSchema,
    TRANSMISSION: transmissionPayloadSchema,
    CONVERSATION: conversationPayloadSchema,
} as const

export const signalMetadataSchemas = {
    DOCUMENT: documentMetadataSchema,
    PHOTO: photoMetadataSchema,
    TRANSMISSION: transmissionMetadataSchema,
    CONVERSATION: conversationMetadataSchema,
} as const

// ====================
// HISTORY & ANNOTATIONS SCHEMAS
// ====================

const signalHistorySchema = z.array(z.object({
    timestamp: z.string(),
    action: z.string(),
    field: z.string().optional(),
    previous_value: z.unknown().optional(),
    new_value: z.unknown().optional(),
    user_id: z.string().optional(),
    synthesis_id: z.string().optional(),
}))

const signalAnnotationsSchema = z.object({
    user_notes: z.array(z.object({
        timestamp: z.string(),
        note: z.string(),
        user_id: z.string(),
    })).optional(),
    synthesis_feedback: z.array(z.object({
        timestamp: z.string(),
        feedback: z.string(),
        synthesis_type: z.string(),
        synthesis_subtype: z.string(),
        user_id: z.string(),
    })).optional(),
})

// ====================
// MAIN SIGNAL SCHEMAS
// ====================

export const signalSchema = z.object({
    signal_id: z.string().length(26).refine(isValidUlid, 'Invalid ULID').optional(),
    realm_id: z.string().length(26),
    signal_type: z.enum(SIGNAL_TYPES),
    signal_context: z.enum(SIGNAL_CONTEXT).optional(),
    signal_title: z.string().min(1).max(LIMITS.SIGNAL_TITLE_MAX),
    signal_description: z.string().nullable().optional(),
    signal_author: z.string().min(1).max(LIMITS.SIGNAL_AUTHOR_MAX),
    signal_temperature: z.number()
        .min(LIMITS.SIGNAL_TEMPERATURE_MIN)
        .max(LIMITS.SIGNAL_TEMPERATURE_MAX)
        .default(0.0)
        .optional(),

    // Geospatial (one or the other depending on DB)
    signal_latitude: z.number().min(GEO.LATITUDE_MIN).max(GEO.LATITUDE_MAX).nullable().optional(),
    signal_longitude: z.number().min(GEO.LONGITUDE_MIN).max(GEO.LONGITUDE_MAX).nullable().optional(),
    signal_location: geographyPointSchema.nullable().optional(),

    signal_status: z.enum(SIGNAL_STATUS).default('PENDING'),
    signal_visibility: z.enum(SIGNAL_VISIBILITY).default('PUBLIC'),

    signal_metadata: z.record(z.string(), z.unknown()).nullable().optional(),
    signal_payload: z.record(z.string(), z.unknown()).nullable().optional(),
    signal_tags: z.array(z.string()).nullable().optional(),

    signal_history: signalHistorySchema.nullable().optional(),
    signal_annotations: signalAnnotationsSchema.nullable().optional(),

    signal_embedding: z.array(z.number()).length(LIMITS.EMBEDDING_DIMENSIONS).nullable().optional(),

    stamp_created: z.date().optional(),
    stamp_updated: z.date().nullable().optional(),
    stamp_imported: z.date().nullable().optional(),
})

// Create signal (required fields only)
export const createSignalSchema = signalSchema.pick({
    realm_id: true,
    signal_type: true,
    signal_context: true,
    signal_title: true,
    signal_description: true,
    signal_author: true,
    signal_temperature: true,
    signal_status: true,
    signal_visibility: true,
}).extend({
    // Optional location (either format)
    coordinates: coordinatesSchema.optional(),
    signal_location: geographyPointSchema.nullable().optional(),

    signal_metadata: z.record(z.string(), z.unknown()).optional(),
    signal_payload: z.record(z.string(), z.unknown()).optional(),
    signal_tags: z.array(z.string()).optional(),
    stamp_imported: z.date().optional(),
})

// Update signal (all fields optional except id)
export const updateSignalSchema = z.object({
    signal_id: z.string().length(26).refine(isValidUlid, 'Invalid ULID'),
    signal_type: z.enum(SIGNAL_TYPES).optional(),
    signal_context: z.enum(SIGNAL_CONTEXT).optional(),
    signal_title: z.string().min(1).max(LIMITS.SIGNAL_TITLE_MAX).optional(),
    signal_description: z.string().nullable().optional(),
    signal_author: z.string().min(1).max(LIMITS.SIGNAL_AUTHOR_MAX).optional(),
    signal_temperature: z.number()
        .min(LIMITS.SIGNAL_TEMPERATURE_MIN)
        .max(LIMITS.SIGNAL_TEMPERATURE_MAX)
        .optional(),

    coordinates: coordinatesSchema.optional(),
    signal_location: geographyPointSchema.nullable().optional(),

    signal_status: z.enum(SIGNAL_STATUS).optional(),
    signal_visibility: z.enum(SIGNAL_VISIBILITY).optional(),

    signal_metadata: z.record(z.string(), z.unknown()).nullable().optional(),
    signal_payload: z.record(z.string(), z.unknown()).nullable().optional(),
    signal_tags: z.array(z.string()).nullable().optional(),

    signal_history: signalHistorySchema.nullable().optional(),
    signal_annotations: signalAnnotationsSchema.nullable().optional(),

    signal_embedding: z.array(z.number()).length(LIMITS.EMBEDDING_DIMENSIONS).nullable().optional(),
})

// Query/filter schema
export const signalFilterSchema = z.object({
    signal_type: z.enum(SIGNAL_TYPES).optional(),
    signal_context: z.enum(SIGNAL_CONTEXT).optional(),
    signal_author: z.string().optional(),
    signal_status: z.enum(SIGNAL_STATUS).optional(),
    signal_visibility: z.enum(SIGNAL_VISIBILITY).optional(),

    // Temperature range
    temperature_min: z.number().min(LIMITS.SIGNAL_TEMPERATURE_MIN).max(LIMITS.SIGNAL_TEMPERATURE_MAX).optional(),
    temperature_max: z.number().min(LIMITS.SIGNAL_TEMPERATURE_MIN).max(LIMITS.SIGNAL_TEMPERATURE_MAX).optional(),

    // Date range filters
    created_after: z.date().optional(),
    created_before: z.date().optional(),
    imported_after: z.date().optional(),
    imported_before: z.date().optional(),

    // Geospatial filters
    near: z.object({
        latitude: z.number().min(GEO.LATITUDE_MIN).max(GEO.LATITUDE_MAX),
        longitude: z.number().min(GEO.LONGITUDE_MIN).max(GEO.LONGITUDE_MAX),
        radius_meters: z.number().positive(),
    }).optional(),

    // Tag filtering
    tags: z.array(z.string()).optional(),
    tags_match: z.enum(['any', 'all']).optional(),

    // Text search
    search: z.string().optional(),

    // Pagination
    limit: z.number().int().positive().max(100).default(10),
    offset: z.number().int().nonnegative().default(0),

    // Sorting
    sort_by: z.enum(['stamp_created', 'stamp_updated', 'stamp_imported', 'signal_title', 'signal_temperature']).optional(),
    sort_order: z.enum(['asc', 'desc']).default('desc'),
})

// Type exports
export type SignalInput = z.infer<typeof signalSchema>
export type CreateSignalInput = z.infer<typeof createSignalSchema>
export type UpdateSignalInput = z.infer<typeof updateSignalSchema>
export type SignalFilter = z.infer<typeof signalFilterSchema>
