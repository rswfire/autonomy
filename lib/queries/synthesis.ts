// lib/queries/synthesis.ts
import { Prisma } from '@prisma/client'
import { prisma } from '../db'
import type {
    Synthesis,
    SynthesisWithSignal,
    SynthesisWithCluster,
    SynthesisComplete,
} from '../types'
import type {
    CreateSynthesisInput,
    UpdateSynthesisInput,
    AddSynthesisHistoryInput,
    AddSynthesisErrorInput,
    SynthesisFilter,
} from '../validation/synthesis'
import { ulid } from '../utils/ulid'

/**
 * Get user's accessible realm IDs
 */
async function getUserRealmIds(userId: string): Promise<string[]> {
    const realms = await prisma.realm.findMany({
        where: {
            OR: [
                { user_id: userId },
                { members: { some: { user_id: userId } } },
            ],
        },
        select: { realm_id: true },
    })
    return realms.map(r => r.realm_id)
}

/**
 * Create a new synthesis
 */
export async function createSynthesis(
    data: CreateSynthesisInput,
    userId: string
): Promise<Synthesis> {
    // Verify user has access to this realm
    const hasAccess = await prisma.realm.findFirst({
        where: {
            realm_id: data.realm_id,
            OR: [
                { user_id: userId },
                { members: { some: { user_id: userId } } },
            ],
        },
    })

    if (!hasAccess) {
        throw new Error('User does not have access to this realm')
    }

    // Verify polymorphic target belongs to same realm
    if (data.polymorphic_type === 'Signal') {
        const signal = await prisma.signal.findUnique({
            where: { signal_id: data.polymorphic_id },
        })
        if (!signal || signal.realm_id !== data.realm_id) {
            throw new Error('Signal must belong to same realm as synthesis')
        }
    } else if (data.polymorphic_type === 'Cluster') {
        const cluster = await prisma.cluster.findUnique({
            where: { cluster_id: data.polymorphic_id },
        })
        if (!cluster || cluster.realm_id !== data.realm_id) {
            throw new Error('Cluster must belong to same realm as synthesis')
        }
    }

    const { synthesis_annotations, synthesis_content, ...rest } = data

    return await prisma.synthesis.create({
        data: {
            synthesis_id: ulid(),
            ...rest,
            ...(synthesis_annotations && { synthesis_annotations: synthesis_annotations as Prisma.InputJsonValue }),
            ...(synthesis_content && { synthesis_content: synthesis_content as Prisma.InputJsonValue }),
        },
    })
}

/**
 * Get synthesis by ID (realm-scoped)
 */
export async function getSynthesisById(
    synthesis_id: string,
    userId: string,
    options?: {
        include_target?: boolean
    }
): Promise<Synthesis | SynthesisComplete | null> {
    const userRealmIds = await getUserRealmIds(userId)

    const synthesis = await prisma.synthesis.findFirst({
        where: {
            synthesis_id,
            realm_id: { in: userRealmIds },
        },
    })

    if (!synthesis || !options?.include_target) {
        return synthesis
    }

    // Manually include the polymorphic relation
    if (synthesis.polymorphic_type === 'Signal') {
        const signal = await prisma.signal.findUnique({
            where: { signal_id: synthesis.polymorphic_id },
        })
        return { ...synthesis, signal, cluster: null }
    } else if (synthesis.polymorphic_type === 'Cluster') {
        const cluster = await prisma.cluster.findUnique({
            where: { cluster_id: synthesis.polymorphic_id },
        })
        return { ...synthesis, signal: null, cluster }
    }

    return synthesis
}

/**
 * Update synthesis
 */
export async function updateSynthesis(
    data: UpdateSynthesisInput,
    userId: string
): Promise<Synthesis> {
    const {
        synthesis_id,
        synthesis_annotations,
        synthesis_content,
        synthesis_embedding,
        ...rest
    } = data

    // Verify user owns the realm this synthesis belongs to
    const synthesis = await prisma.synthesis.findUnique({
        where: { synthesis_id },
        include: { realm: true },
    })

    if (!synthesis || synthesis.realm.user_id !== userId) {
        throw new Error('Not authorized to update this synthesis')
    }

    return await prisma.synthesis.update({
        where: { synthesis_id },
        data: {
            ...rest,
            ...(synthesis_annotations !== undefined && { synthesis_annotations: synthesis_annotations as Prisma.InputJsonValue }),
            ...(synthesis_content !== undefined && { synthesis_content: synthesis_content as Prisma.InputJsonValue }),
            ...(synthesis_embedding !== undefined && { synthesis_embedding: synthesis_embedding as Prisma.InputJsonValue }),
        },
    })
}

/**
 * Delete synthesis
 */
export async function deleteSynthesis(
    synthesis_id: string,
    userId: string
): Promise<Synthesis> {
    // Verify user owns the realm this synthesis belongs to
    const synthesis = await prisma.synthesis.findUnique({
        where: { synthesis_id },
        include: { realm: true },
    })

    if (!synthesis || synthesis.realm.user_id !== userId) {
        throw new Error('Not authorized to delete this synthesis')
    }

    return await prisma.synthesis.delete({
        where: { synthesis_id },
    })
}

/**
 * Add entry to synthesis history
 */
export async function addSynthesisHistory(
    data: AddSynthesisHistoryInput,
    userId: string
): Promise<Synthesis> {
    const { synthesis_id, action, data: historyData } = data

    const synthesis = await prisma.synthesis.findUnique({
        where: { synthesis_id },
        include: { realm: true },
    })

    if (!synthesis) {
        throw new Error('Synthesis not found')
    }

    if (synthesis.realm.user_id !== userId) {
        throw new Error('Not authorized to modify this synthesis')
    }

    const history = (synthesis.synthesis_history as any[]) || []
    history.push({
        timestamp: new Date().toISOString(),
        action,
        data: historyData,
    })

    return await prisma.synthesis.update({
        where: { synthesis_id },
        data: {
            synthesis_history: history as Prisma.InputJsonValue,
        },
    })
}

/**
 * Add synthesis error
 */
export async function addSynthesisError(
    data: AddSynthesisErrorInput,
    userId: string
): Promise<Synthesis> {
    const { synthesis_id, error, context } = data

    const synthesis = await prisma.synthesis.findUnique({
        where: { synthesis_id },
        include: { realm: true },
    })

    if (!synthesis) {
        throw new Error('Synthesis not found')
    }

    if (synthesis.realm.user_id !== userId) {
        throw new Error('Not authorized to modify this synthesis')
    }

    const errors = (synthesis.synthesis_errors as any[]) || []
    errors.push({
        timestamp: new Date().toISOString(),
        error,
        context,
    })

    return await prisma.synthesis.update({
        where: { synthesis_id },
        data: {
            synthesis_errors: errors as Prisma.InputJsonValue,
        },
    })
}

/**
 * Get synthesis for a signal (realm-scoped)
 */
export async function getSynthesisForSignal(
    signal_id: string,
    userId: string,
    options?: {
        synthesis_type?: string
        synthesis_subtype?: string
    }
): Promise<Synthesis[]> {
    const userRealmIds = await getUserRealmIds(userId)

    const where: any = {
        polymorphic_id: signal_id,
        polymorphic_type: 'Signal',
        realm_id: { in: userRealmIds },
    }

    if (options?.synthesis_type) {
        where.synthesis_type = options.synthesis_type
    }

    if (options?.synthesis_subtype) {
        where.synthesis_subtype = options.synthesis_subtype
    }

    return await prisma.synthesis.findMany({
        where,
        orderBy: { stamp_created: 'desc' },
    })
}

/**
 * Get synthesis for a cluster (realm-scoped)
 */
export async function getSynthesisForCluster(
    cluster_id: string,
    userId: string,
    options?: {
        synthesis_type?: string
        synthesis_subtype?: string
    }
): Promise<Synthesis[]> {
    const userRealmIds = await getUserRealmIds(userId)

    const where: any = {
        polymorphic_id: cluster_id,
        polymorphic_type: 'Cluster',
        realm_id: { in: userRealmIds },
    }

    if (options?.synthesis_type) {
        where.synthesis_type = options.synthesis_type
    }

    if (options?.synthesis_subtype) {
        where.synthesis_subtype = options.synthesis_subtype
    }

    return await prisma.synthesis.findMany({
        where,
        orderBy: { stamp_created: 'desc' },
    })
}

/**
 * Query synthesis with filters (realm-scoped)
 */
export async function querySynthesis(
    filter: Partial<SynthesisFilter>,
    userId: string
): Promise<{
    synthesis: Synthesis[]
    total: number
}> {
    const userRealmIds = await getUserRealmIds(userId)

    const {
        synthesis_type,
        synthesis_subtype,
        synthesis_source,
        synthesis_depth,
        polymorphic_id,
        polymorphic_type,
        created_after,
        created_before,
        updated_after,
        updated_before,
        include_target = false,
        limit = 10,
        offset = 0,
        sort_by,
        sort_order = 'desc',
    } = filter

    // Build where clause
    const where: any = {
        realm_id: { in: userRealmIds },
    }

    if (synthesis_type) where.synthesis_type = synthesis_type
    if (synthesis_subtype) where.synthesis_subtype = synthesis_subtype
    if (synthesis_source) where.synthesis_source = synthesis_source
    if (synthesis_depth !== undefined) where.synthesis_depth = synthesis_depth
    if (polymorphic_id) where.polymorphic_id = polymorphic_id
    if (polymorphic_type) where.polymorphic_type = polymorphic_type

    // Date filters
    if (created_after || created_before) {
        where.stamp_created = {}
        if (created_after) where.stamp_created.gte = created_after
        if (created_before) where.stamp_created.lte = created_before
    }

    if (updated_after || updated_before) {
        where.stamp_updated = {}
        if (updated_after) where.stamp_updated.gte = updated_after
        if (updated_before) where.stamp_updated.lte = updated_before
    }

    // Build orderBy
    const orderBy: any = {}
    if (sort_by) {
        orderBy[sort_by] = sort_order
    } else {
        orderBy.stamp_created = sort_order
    }

    // Execute query
    const [synthesisList, total] = await Promise.all([
        prisma.synthesis.findMany({
            where,
            orderBy,
            skip: offset,
            take: limit,
        }),
        prisma.synthesis.count({ where }),
    ])

    // If include_target is requested, fetch polymorphic relations manually
    if (include_target) {
        const enriched = await Promise.all(
            synthesisList.map(async (s) => {
                if (s.polymorphic_type === 'Signal') {
                    const signal = await prisma.signal.findUnique({
                        where: { signal_id: s.polymorphic_id },
                    })
                    return { ...s, signal, cluster: null }
                } else if (s.polymorphic_type === 'Cluster') {
                    const cluster = await prisma.cluster.findUnique({
                        where: { cluster_id: s.polymorphic_id },
                    })
                    return { ...s, signal: null, cluster }
                }
                return s
            })
        )
        return { synthesis: enriched, total }
    }

    return { synthesis: synthesisList, total }
}

/**
 * Get synthesis by type and subtype (realm-scoped)
 */
export async function getSynthesisByTypeAndSubtype(
    synthesis_type: string,
    synthesis_subtype: string,
    userId: string,
    options?: {
        limit?: number
        offset?: number
    }
): Promise<Synthesis[]> {
    const userRealmIds = await getUserRealmIds(userId)

    return await prisma.synthesis.findMany({
        where: {
            synthesis_type,
            synthesis_subtype,
            realm_id: { in: userRealmIds },
        },
        orderBy: { stamp_created: 'desc' },
        take: options?.limit ?? 10,
        skip: options?.offset ?? 0,
    })
}
