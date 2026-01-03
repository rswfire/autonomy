// lib/validation/cluster.ts
import { z } from 'zod'
import {
    CLUSTER_TYPES,
    CLUSTER_STATES,
    LIMITS,
} from '../constants'

// Base cluster schema
export const clusterSchema = z.object({
    cluster_id: z.string().length(26).optional(),
    realm_id: z.string().length(26),
    cluster_type: z.enum(CLUSTER_TYPES),
    cluster_title: z.string().min(1).max(LIMITS.CLUSTER_TITLE_MAX),
    cluster_depth: z.number().int().nonnegative().max(LIMITS.MAX_CLUSTER_DEPTH).default(0),

    cluster_annotations: z.record(z.string(), z.unknown()).nullable().optional(),
    cluster_metadata: z.record(z.string(), z.unknown()).nullable().optional(),
    cluster_payload: z.record(z.string(), z.unknown()).nullable().optional(),
    cluster_tags: z.array(z.string()).nullable().optional(),
    cluster_state: z.enum(CLUSTER_STATES),

    cluster_embedding: z.array(z.number()).length(LIMITS.EMBEDDING_DIMENSIONS).nullable().optional(),

    stamp_cluster_start: z.date().nullable().optional(),
    stamp_cluster_end: z.date().nullable().optional(),
    stamp_created: z.date().optional(),

    parent_cluster_id: z.string().length(26).nullable().optional(),
})

// Create cluster
export const createClusterSchema = clusterSchema.pick({
    realm_id: true,
    cluster_type: true,
    cluster_title: true,
    cluster_depth: true,
    cluster_state: true,
}).extend({
    cluster_annotations: z.record(z.string(), z.unknown()).optional(),
    cluster_metadata: z.record(z.string(), z.unknown()).optional(),
    cluster_payload: z.record(z.string(), z.unknown()).optional(),
    cluster_tags: z.array(z.string()).optional(),

    stamp_cluster_start: z.date().optional(),
    stamp_cluster_end: z.date().optional(),

    parent_cluster_id: z.string().length(26).optional(),
})

// Update cluster
export const updateClusterSchema = z.object({
    cluster_id: z.string().length(26),
    cluster_type: z.enum(CLUSTER_TYPES).optional(),
    cluster_title: z.string().min(1).max(LIMITS.CLUSTER_TITLE_MAX).optional(),
    cluster_depth: z.number().int().nonnegative().max(LIMITS.MAX_CLUSTER_DEPTH).optional(),

    cluster_annotations: z.record(z.string(), z.unknown()).nullable().optional(),
    cluster_metadata: z.record(z.string(), z.unknown()).nullable().optional(),
    cluster_payload: z.record(z.string(), z.unknown()).nullable().optional(),
    cluster_tags: z.array(z.string()).nullable().optional(),
    cluster_state: z.enum(CLUSTER_STATES).optional(),

    cluster_embedding: z.array(z.number()).length(LIMITS.EMBEDDING_DIMENSIONS).nullable().optional(),

    stamp_cluster_start: z.date().nullable().optional(),
    stamp_cluster_end: z.date().nullable().optional(),

    parent_cluster_id: z.string().length(26).nullable().optional(),
})

// Add signal to cluster
export const addSignalToClusterSchema = z.object({
    cluster_id: z.string().length(26),
    signal_id: z.string().length(26),
    pivot_position: z.number().int().nonnegative().optional(),
    pivot_metadata: z.record(z.string(), z.unknown()).optional(),
})

// Remove signal from cluster
export const removeSignalFromClusterSchema = z.object({
    cluster_id: z.string().length(26),
    signal_id: z.string().length(26),
})

// Update signal position in cluster
export const updateClusterSignalSchema = z.object({
    cluster_id: z.string().length(26),
    signal_id: z.string().length(26),
    pivot_position: z.number().int().nonnegative().optional(),
    pivot_metadata: z.record(z.string(), z.unknown()).optional(),
})

// Query/filter schema
export const clusterFilterSchema = z.object({
    cluster_type: z.enum(CLUSTER_TYPES).optional(),
    cluster_state: z.enum(CLUSTER_STATES).optional(),
    cluster_depth: z.number().int().nonnegative().optional(),

    parent_cluster_id: z.string().length(26).optional(),

    // Date range filters
    created_after: z.date().optional(),
    created_before: z.date().optional(),
    cluster_start_after: z.date().optional(),
    cluster_start_before: z.date().optional(),
    cluster_end_after: z.date().optional(),
    cluster_end_before: z.date().optional(),

    // Tag filtering
    tags: z.array(z.string()).optional(),
    tags_match: z.enum(['any', 'all']).optional(),

    // Text search
    search: z.string().optional(),

    // Include relations
    include_signals: z.boolean().optional().default(false),
    include_synthesis: z.boolean().optional().default(false),
    include_hierarchy: z.boolean().optional().default(false),

    // Pagination
    limit: z.number().int().positive().max(100).default(10),
    offset: z.number().int().nonnegative().default(0),

    // Sorting
    sort_by: z.enum(['stamp_created', 'stamp_cluster_start', 'stamp_cluster_end', 'cluster_title']).optional(),
    sort_order: z.enum(['asc', 'desc']).default('desc'),
})

// Type exports
export type ClusterInput = z.infer<typeof clusterSchema>
export type CreateClusterInput = z.infer<typeof createClusterSchema>
export type UpdateClusterInput = z.infer<typeof updateClusterSchema>
export type AddSignalToClusterInput = z.infer<typeof addSignalToClusterSchema>
export type RemoveSignalFromClusterInput = z.infer<typeof removeSignalFromClusterSchema>
export type UpdateClusterSignalInput = z.infer<typeof updateClusterSignalSchema>
export type ClusterFilter = z.infer<typeof clusterFilterSchema>
