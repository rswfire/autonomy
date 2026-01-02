// lib/validation/signal.ts
import { z } from 'zod'
import {
    SIGNAL_TYPES,
    SIGNAL_STATUS,
    SIGNAL_VISIBILITY,
    LIMITS,
    GEO,
} from '../constants'
import { isValidUlid } from '../utils/ulid'

// Geospatial validation
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

// Base signal schema
export const signalSchema = z.object({
    signal_id: z.string().length(26).refine(isValidUlid, 'Invalid ULID').optional(),
    signal_type: z.enum(SIGNAL_TYPES),
    signal_title: z.string().min(1).max(LIMITS.SIGNAL_TITLE_MAX),
    signal_description: z.string().nullable().optional(),
    signal_author: z.string().min(1).max(LIMITS.SIGNAL_AUTHOR_MAX),

    // Geospatial (one or the other depending on DB)
    signal_latitude: z.number().min(GEO.LATITUDE_MIN).max(GEO.LATITUDE_MAX).nullable().optional(),
    signal_longitude: z.number().min(GEO.LONGITUDE_MIN).max(GEO.LONGITUDE_MAX).nullable().optional(),
    signal_location: geographyPointSchema.nullable().optional(),

    signal_status: z.enum(SIGNAL_STATUS).default('PENDING'),
    signal_visibility: z.enum(SIGNAL_VISIBILITY).default('PUBLIC'),

    signal_metadata: z.record(z.string(), z.unknown()).nullable().optional(),
    signal_payload: z.record(z.string(), z.unknown()).nullable().optional(),
    signal_tags: z.array(z.string()).nullable().optional(),

    signal_embedding: z.array(z.number()).length(LIMITS.EMBEDDING_DIMENSIONS).nullable().optional(),

    stamp_created: z.date().optional(),
    stamp_updated: z.date().nullable().optional(),
    stamp_imported: z.date().nullable().optional(),
})

// Create signal (required fields only)
export const createSignalSchema = signalSchema.pick({
    signal_type: true,
    signal_title: true,
    signal_description: true,
    signal_author: true,
    signal_status: true,
    signal_visibility: true,
}).extend({
    // Optional location (either format)
    coordinates: coordinatesSchema.optional(),
    signal_location: geographyPointSchema.nullable().optional(),

    signal_metadata: z.record(z.string(), z.unknown()).optional(),
    signal_payload: z.record(z.string(), z.unknown()).optional(),
    signal_tags: z.array(z.string()).optional(),
})

// Update signal (all fields optional except id)
export const updateSignalSchema = z.object({
    signal_id: z.string().length(26).refine(isValidUlid, 'Invalid ULID'),
    signal_type: z.enum(SIGNAL_TYPES).optional(),
    signal_title: z.string().min(1).max(LIMITS.SIGNAL_TITLE_MAX).optional(),
    signal_description: z.string().nullable().optional(),
    signal_author: z.string().min(1).max(LIMITS.SIGNAL_AUTHOR_MAX).optional(),

    coordinates: coordinatesSchema.optional(),
    signal_location: geographyPointSchema.nullable().optional(),

    signal_status: z.enum(SIGNAL_STATUS).optional(),
    signal_visibility: z.enum(SIGNAL_VISIBILITY).optional(),

    signal_metadata: z.record(z.string(), z.unknown()).nullable().optional(),
    signal_payload: z.record(z.string(), z.unknown()).nullable().optional(),
    signal_tags: z.array(z.string()).nullable().optional(),

    signal_embedding: z.array(z.number()).length(LIMITS.EMBEDDING_DIMENSIONS).nullable().optional(),
})

// Query/filter schema
export const signalFilterSchema = z.object({
    signal_type: z.enum(SIGNAL_TYPES).optional(),
    signal_author: z.string().optional(),
    signal_status: z.enum(SIGNAL_STATUS).optional(),
    signal_visibility: z.enum(SIGNAL_VISIBILITY).optional(),

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
    sort_by: z.enum(['stamp_created', 'stamp_updated', 'stamp_imported', 'signal_title']).optional(),
    sort_order: z.enum(['asc', 'desc']).default('desc'),
})

// Type exports
export type SignalInput = z.infer<typeof signalSchema>
export type CreateSignalInput = z.infer<typeof createSignalSchema>
export type UpdateSignalInput = z.infer<typeof updateSignalSchema>
export type SignalFilter = z.infer<typeof signalFilterSchema>
