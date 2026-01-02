// lib/queries/signal.ts
import { Prisma } from '@prisma/client'
import { prisma } from '../db'
import type {
    Signal,
    SignalWithSynthesis,
    SignalWithClusters,
    SignalComplete,
} from '../types'
import type {
    CreateSignalInput,
    UpdateSignalInput,
    SignalFilter,
} from '../validation/signal'
import { isPostgres } from '../types'
import { requireOwner, buildVisibilityFilter } from '../utils/permissions'
import type { UserRole } from '../types'
import { ulid, ulidFromDate } from '../utils/ulid'

/**
 * Create a new signal
 */
export async function createSignal(
    data: CreateSignalInput,
    user_role: UserRole,
    options?: {
        timestamp?: Date  // Optional: custom timestamp for ULID
    }
): Promise<Signal> {
    requireOwner(user_role, 'create signals')

    const { coordinates, signal_metadata, signal_payload, signal_tags, ...rest } = data

    // Handle geospatial data based on DB type
    const geoData = coordinates
        ? isPostgres
            ? {
                signal_location: {
                    type: 'Point',
                    coordinates: [coordinates.longitude, coordinates.latitude],
                } as Prisma.InputJsonValue,
            }
            : {
                signal_latitude: coordinates.latitude,
                signal_longitude: coordinates.longitude,
            }
        : {}

    return await prisma.signal.create({
        data: {
            signal_id: ulid(),
            ...rest,
            ...geoData,
            ...(signal_metadata && { signal_metadata: signal_metadata as Prisma.InputJsonValue }),
            ...(signal_payload && { signal_payload: signal_payload as Prisma.InputJsonValue }),
            ...(signal_tags && { signal_tags: signal_tags as Prisma.InputJsonValue }),
        },
    })
}

/**
 * Get signal by ID with visibility check
 */
export async function getSignalById(
    signal_id: string,
    user_role: UserRole | null = null,
    options?: {
        include_synthesis?: boolean
        include_clusters?: boolean
    }
): Promise<Signal | SignalWithSynthesis | SignalWithClusters | SignalComplete | null> {
    const include = {
        synthesis: options?.include_synthesis ?? false,
        clusters: options?.include_clusters
            ? {
                include: {
                    cluster: true,
                },
            }
            : false,
    }

    const signal = await prisma.signal.findUnique({
        where: { signal_id },
        include,
    })

    // Check visibility permissions
    if (signal && user_role !== 'OWNER') {
        const visibilityFilter = buildVisibilityFilter(user_role)
        const allowedLevels = visibilityFilter.signal_visibility?.in || ['PUBLIC']

        if (!allowedLevels.includes(signal.signal_visibility)) {
            return null // Not authorized to view
        }
    }

    return signal
}

/**
 * Update signal
 */
export async function updateSignal(
    data: UpdateSignalInput,
    user_role: UserRole
): Promise<Signal> {
    requireOwner(user_role, 'update signals')

    const {
        signal_id,
        coordinates,
        signal_metadata,
        signal_payload,
        signal_tags,
        signal_embedding,
        ...rest
    } = data

    const geoData = coordinates
        ? isPostgres
            ? {
                signal_location: {
                    type: 'Point',
                    coordinates: [coordinates.longitude, coordinates.latitude],
                } as Prisma.InputJsonValue,
            }
            : {
                signal_latitude: coordinates.latitude,
                signal_longitude: coordinates.longitude,
            }
        : {}

    return await prisma.signal.update({
        where: { signal_id },
        data: {
            ...rest,
            ...geoData,
            ...(signal_metadata !== undefined && { signal_metadata: signal_metadata as Prisma.InputJsonValue }),
            ...(signal_payload !== undefined && { signal_payload: signal_payload as Prisma.InputJsonValue }),
            ...(signal_tags !== undefined && { signal_tags: signal_tags as Prisma.InputJsonValue }),
            ...(signal_embedding !== undefined && { signal_embedding: signal_embedding as Prisma.InputJsonValue }),
        },
    })
}

/**
 * Delete signal
 */
export async function deleteSignal(
    signal_id: string,
    user_role: UserRole
): Promise<Signal> {
    requireOwner(user_role, 'delete signals')

    return await prisma.signal.delete({
        where: { signal_id },
    })
}

/**
 * Query signals with filters
 */
export async function querySignals(
    filter: SignalFilter,
    user_role: UserRole | null = null
): Promise<{
    signals: Signal[]
    total: number
}> {
    const {
        signal_type,
        signal_author,
        signal_status,
        signal_visibility,
        created_after,
        created_before,
        imported_after,
        imported_before,
        tags,
        tags_match,
        search,
        limit,
        offset,
        sort_by,
        sort_order,
        near,
    } = filter

    // Build where clause
    const where: any = {}

    // Apply visibility filter based on user role
    const visibilityFilter = buildVisibilityFilter(user_role)
    Object.assign(where, visibilityFilter)

    // Override if specific visibility requested AND user has permission
    if (signal_visibility && user_role === 'OWNER') {
        where.signal_visibility = signal_visibility
    }

    if (signal_type) where.signal_type = signal_type
    if (signal_author) where.signal_author = signal_author
    if (signal_status) where.signal_status = signal_status

    // Date filters
    if (created_after || created_before) {
        where.stamp_created = {}
        if (created_after) where.stamp_created.gte = created_after
        if (created_before) where.stamp_created.lte = created_before
    }

    if (imported_after || imported_before) {
        where.stamp_imported = {}
        if (imported_after) where.stamp_imported.gte = imported_after
        if (imported_before) where.stamp_imported.lte = imported_before
    }

    // Tag filtering
    if (tags && tags.length > 0) {
        if (tags_match === 'all') {
            where.signal_tags = {
                path: '$',
                array_contains: tags,
            }
        } else {
            // 'any' or default
            where.OR = tags.map((tag) => ({
                signal_tags: {
                    path: '$',
                    array_contains: [tag],
                },
            }))
        }
    }

    // Text search (basic implementation - searches title and description)
    if (search) {
        where.OR = [
            { signal_title: { contains: search, mode: 'insensitive' } },
            { signal_description: { contains: search, mode: 'insensitive' } },
        ]
    }

    // Geospatial query (requires custom implementation per DB)
    if (near) {
        // TODO: Implement geospatial filtering
        console.warn('Geospatial filtering not yet implemented')
    }

    // Build orderBy
    const orderBy: any = {}
    if (sort_by) {
        orderBy[sort_by] = sort_order
    } else {
        orderBy.stamp_created = sort_order
    }

    // Execute query with pagination
    const [signals, total] = await Promise.all([
        prisma.signal.findMany({
            where,
            orderBy,
            skip: offset,
            take: limit,
        }),
        prisma.signal.count({ where }),
    ])

    return { signals, total }
}

/**
 * Get signals by author
 */
export async function getSignalsByAuthor(
    signal_author: string,
    user_role: UserRole | null = null,
    options?: {
        limit?: number
        offset?: number
    }
): Promise<Signal[]> {
    const where: any = { signal_author }

    // Apply visibility filter
    const visibilityFilter = buildVisibilityFilter(user_role)
    Object.assign(where, visibilityFilter)

    return await prisma.signal.findMany({
        where,
        orderBy: { stamp_created: 'desc' },
        take: options?.limit ?? 10,
        skip: options?.offset ?? 0,
    })
}

/**
 * Get signals by type
 */
export async function getSignalsByType(
    signal_type: string,
    user_role: UserRole | null = null,
    options?: {
        limit?: number
        offset?: number
    }
): Promise<Signal[]> {
    const where: any = { signal_type }

    // Apply visibility filter
    const visibilityFilter = buildVisibilityFilter(user_role)
    Object.assign(where, visibilityFilter)

    return await prisma.signal.findMany({
        where,
        orderBy: { stamp_created: 'desc' },
        take: options?.limit ?? 10,
        skip: options?.offset ?? 0,
    })
}

/**
 * Get signals by visibility (owner only)
 */
export async function getSignalsByVisibility(
    signal_visibility: string,
    user_role: UserRole,
    options?: {
        limit?: number
        offset?: number
    }
): Promise<Signal[]> {
    requireOwner(user_role, 'query by visibility')

    return await prisma.signal.findMany({
        where: { signal_visibility },
        orderBy: { stamp_created: 'desc' },
        take: options?.limit ?? 10,
        skip: options?.offset ?? 0,
    })
}

/**
 * Get recent signals
 */
export async function getRecentSignals(
    user_role: UserRole | null = null,
    limit: number = 10
): Promise<Signal[]> {
    const where: any = {}

    // Apply visibility filter
    const visibilityFilter = buildVisibilityFilter(user_role)
    Object.assign(where, visibilityFilter)

    return await prisma.signal.findMany({
        where,
        orderBy: { stamp_created: 'desc' },
        take: limit,
    })
}

/**
 * Count signals by status (owner only)
 */
export async function countSignalsByStatus(
    user_role: UserRole
): Promise<Record<string, number>> {
    requireOwner(user_role, 'view signal statistics')

    const results = await prisma.signal.groupBy({
        by: ['signal_status'],
        _count: true,
    })

    return results.reduce((acc, item) => {
        acc[item.signal_status] = item._count
        return acc
    }, {} as Record<string, number>)
}

/**
 * Get signal with full relations
 */
export async function getSignalComplete(
    signal_id: string,
    user_role: UserRole | null = null
): Promise<SignalComplete | null> {
    const signal = await prisma.signal.findUnique({
        where: { signal_id },
        include: {
            synthesis: true,
            clusters: {
                include: {
                    cluster: true,
                },
            },
        },
    })

    // Check visibility permissions
    if (signal && user_role !== 'OWNER') {
        const visibilityFilter = buildVisibilityFilter(user_role)
        const allowedLevels = visibilityFilter.signal_visibility?.in || ['PUBLIC']

        if (!allowedLevels.includes(signal.signal_visibility)) {
            return null // Not authorized to view
        }
    }

    return signal
}
