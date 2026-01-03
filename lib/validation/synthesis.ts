// lib/validation/synthesis.ts
import { z } from 'zod'
import {
    SYNTHESIS_TYPES,
    SYNTHESIS_SUBTYPES,
    POLYMORPHIC_TYPES,
    LIMITS,
} from '../constants'

// Base synthesis schema
export const synthesisSchema = z.object({
    synthesis_id: z.string().length(26).optional(),
    realm_id: z.string().length(26),
    synthesis_type: z.enum(SYNTHESIS_TYPES),
    synthesis_subtype: z.string(), // Validated separately based on type
    synthesis_source: z.string().max(100).nullable().optional(),
    synthesis_depth: z.number().int().nonnegative().default(0),

    polymorphic_id: z.string().length(26),
    polymorphic_type: z.enum(POLYMORPHIC_TYPES),

    synthesis_annotations: z.record(z.string(), z.unknown()).nullable().optional(),
    synthesis_history: z.array(z.object({
        timestamp: z.string(),
        action: z.string(),
        data: z.record(z.string(), z.unknown()).optional(),
    })).nullable().optional(),
    synthesis_errors: z.array(z.object({
        timestamp: z.string(),
        error: z.string(),
        context: z.record(z.string(), z.unknown()).optional(),
    })).nullable().optional(),
    synthesis_content: z.record(z.string(), z.unknown()).nullable().optional(),

    synthesis_embedding: z.array(z.number()).length(LIMITS.EMBEDDING_DIMENSIONS).nullable().optional(),

    stamp_created: z.date().optional(),
    stamp_updated: z.date().nullable().optional(),
})

// Subtype validation based on synthesis_type
const metadataSubtypeSchema = z.enum(SYNTHESIS_SUBTYPES.METADATA)
const reflectionSubtypeSchema = z.enum(SYNTHESIS_SUBTYPES.REFLECTION)

// Create synthesis with type-specific subtype validation
export const createSynthesisSchema = z.discriminatedUnion('synthesis_type', [
    z.object({
        realm_id: z.string().length(26),
        synthesis_type: z.literal('METADATA'),
        synthesis_subtype: metadataSubtypeSchema,
        synthesis_source: z.string().max(100).optional(),
        synthesis_depth: z.number().int().nonnegative().default(0),

        polymorphic_id: z.string().length(26),
        polymorphic_type: z.enum(POLYMORPHIC_TYPES),

        synthesis_annotations: z.record(z.string(), z.unknown()).optional(),
        synthesis_content: z.record(z.string(), z.unknown()).optional(),
    }),
    z.object({
        realm_id: z.string().length(26),
        synthesis_type: z.literal('REFLECTION'),
        synthesis_subtype: reflectionSubtypeSchema,
        synthesis_source: z.string().max(100).optional(),
        synthesis_depth: z.number().int().nonnegative().default(0),

        polymorphic_id: z.string().length(26),
        polymorphic_type: z.enum(POLYMORPHIC_TYPES),

        synthesis_annotations: z.record(z.string(), z.unknown()).optional(),
        synthesis_content: z.record(z.string(), z.unknown()).optional(),
    }),
])

// Update synthesis
export const updateSynthesisSchema = z.object({
    synthesis_id: z.string().length(26),
    synthesis_source: z.string().max(100).nullable().optional(),
    synthesis_depth: z.number().int().nonnegative().optional(),

    synthesis_annotations: z.record(z.string(), z.unknown()).nullable().optional(),
    synthesis_content: z.record(z.string(), z.unknown()).nullable().optional(),

    synthesis_embedding: z.array(z.number()).length(LIMITS.EMBEDDING_DIMENSIONS).nullable().optional(),
})

// Add to synthesis history
export const addSynthesisHistorySchema = z.object({
    synthesis_id: z.string().length(26),
    action: z.string(),
    data: z.record(z.string(), z.unknown()).optional(),
})

// Add synthesis error
export const addSynthesisErrorSchema = z.object({
    synthesis_id: z.string().length(26),
    error: z.string(),
    context: z.record(z.string(), z.unknown()).optional(),
})

// Query/filter schema
export const synthesisFilterSchema = z.object({
    synthesis_type: z.enum(SYNTHESIS_TYPES).optional(),
    synthesis_subtype: z.string().optional(),
    synthesis_source: z.string().optional(),
    synthesis_depth: z.number().int().nonnegative().optional(),

    polymorphic_id: z.string().length(26).optional(),
    polymorphic_type: z.enum(POLYMORPHIC_TYPES).optional(),

    // Date range filters
    created_after: z.date().optional(),
    created_before: z.date().optional(),
    updated_after: z.date().optional(),
    updated_before: z.date().optional(),

    // Include relations
    include_target: z.boolean().optional().default(false),

    // Pagination
    limit: z.number().int().positive().max(100).default(10),
    offset: z.number().int().nonnegative().default(0),

    // Sorting
    sort_by: z.enum(['stamp_created', 'stamp_updated', 'synthesis_depth']).optional(),
    sort_order: z.enum(['asc', 'desc']).default('desc'),
})

// Type exports
export type SynthesisInput = z.infer<typeof synthesisSchema>
export type CreateSynthesisInput = z.infer<typeof createSynthesisSchema>
export type UpdateSynthesisInput = z.infer<typeof updateSynthesisSchema>
export type AddSynthesisHistoryInput = z.infer<typeof addSynthesisHistorySchema>
export type AddSynthesisErrorInput = z.infer<typeof addSynthesisErrorSchema>
export type SynthesisFilter = z.infer<typeof synthesisFilterSchema>
