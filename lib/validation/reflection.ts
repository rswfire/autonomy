// lib/validation/reflection.ts
import { z } from 'zod'

export const createReflectionSchema = z.object({
    realm_id: z.string(),
    reflection_type: z.enum(['MIRROR', 'MYTH', 'NARRATIVE']),
    reflection_source: z.string().optional(),
    reflection_depth: z.number().default(0),
    polymorphic_id: z.string(),
    polymorphic_type: z.enum(['signal', 'cluster']),
    reflection_content: z.string(),
    reflection_annotations: z.any().optional(),
    reflection_history: z.any().optional(),
    reflection_errors: z.any().optional(),
})

export const updateReflectionSchema = z.object({
    reflection_id: z.string(),
    reflection_content: z.string().optional(),
    reflection_annotations: z.any().optional(),
    reflection_history: z.any().optional(),
    reflection_errors: z.any().optional(),
})

export const reflectionFilterSchema = z.object({
    realm_id: z.string().optional(),
    reflection_type: z.enum(['MIRROR', 'MYTH', 'NARRATIVE']).optional(),
    polymorphic_id: z.string().optional(),
    polymorphic_type: z.enum(['signal', 'cluster']).optional(),
    limit: z.number().min(1).max(100).default(10),
    offset: z.number().min(0).default(0),
})

export type CreateReflectionInput = z.infer<typeof createReflectionSchema>
export type UpdateReflectionInput = z.infer<typeof updateReflectionSchema>
export type ReflectionFilter = z.infer<typeof reflectionFilterSchema>
