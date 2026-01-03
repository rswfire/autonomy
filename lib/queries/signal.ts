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
 * Create a new signal
 */
export async function createSignal(
    data: CreateSignalInput,
    userId: string
): Promise<Signal> {
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
 * Get signal by ID with realm access check
 */
export async function getSignalById(
    signal_id: string,
    userId: string,
    options?: {
        include_synthesis?: boolean
        include_clusters?: boolean
    }
): Promise<Signal | SignalWithSynthesis | SignalWithClusters | SignalComplete | null> {
    const userRealmIds = await getUserRealmIds(userId)

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

    const signal = await prisma.signal.findFirst({
        where: {
            signal_id,
            realm_id: { in: userRealmIds },
        },
        include,
    })

    return signal
}

/**
 * Update signal
 */
export async function updateSignal(
    data: UpdateSignalInput,
    userId: string
): Promise<Signal> {
    const { signal_id, coordinates, signal_metadata, signal_payload, signal_tags, signal_embedding, ...rest } = data

    // Verify user owns the realm this signal belongs to
    const signal = await prisma.signal.findUnique({
        where: { signal_id },
        include: { realm: true },
    })

    if (!signal || signal.realm.user_id !== userId) {
        throw new Error('Not authorized to update this signal')
    }

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
    userId: string
): Promise<Signal> {
    // Verify user owns the realm this signal belongs to
    const signal = await prisma.signal.findUnique({
        where: { signal_id },
        include: { realm: true },
    })

    if (!signal || signal.realm.user_id !== userId) {
        throw new Error('Not authorized to delete this signal')
    }

    return await prisma.signal.delete({
        where: { signal_id },
    })
}

/**
 * Query signals with filters (realm-scoped)
 */
export async function querySignals(
    filter: SignalFilter,
    userId: string
): Promise<{
    signals: Signal[]
    total: number
}> {
    const userRealmIds = await getUserRealmIds(userId)

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
    const where: any = {
        realm_id: { in: userRealmIds },  // Realm filter replaces role-based visibility
    }

    if (signal_type) where.signal_type = signal_type
    if (signal_author) where.signal_author = signal_author
    if (signal_status) where.signal_status = signal_status
    if (signal_visibility) where.signal_visibility = signal_visibility

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
            where.OR = tags.map((tag) => ({
                signal_tags: {
                    path: '$',
                    array_contains: [tag],
                },
            }))
        }
    }

    // Text search
    if (search) {
        where.OR = [
            { signal_title: { contains: search, mode: 'insensitive' } },
            { signal_description: { contains: search, mode: 'insensitive' } },
        ]
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
 * Get signals by author (realm-scoped)
 */
export async function getSignalsByAuthor(
    signal_author: string,
    userId: string,
    options?: {
        limit?: number
        offset?: number
    }
): Promise<Signal[]> {
    const userRealmIds = await getUserRealmIds(userId)

    return await prisma.signal.findMany({
        where: {
            signal_author,
            realm_id: { in: userRealmIds },
        },
        orderBy: { stamp_created: 'desc' },
        take: options?.limit ?? 10,
        skip: options?.offset ?? 0,
    })
}

/**
 * Get signals by type (realm-scoped)
 */
export async function getSignalsByType(
    signal_type: string,
    userId: string,
    options?: {
        limit?: number
        offset?: number
    }
): Promise<Signal[]> {
    const userRealmIds = await getUserRealmIds(userId)

    return await prisma.signal.findMany({
        where: {
            signal_type,
            realm_id: { in: userRealmIds },
        },
        orderBy: { stamp_created: 'desc' },
        take: options?.limit ?? 10,
        skip: options?.offset ?? 0,
    })
}

/**
 * Get signals by visibility (realm-scoped)
 */
export async function getSignalsByVisibility(
    signal_visibility: string,
    userId: string,
    options?: {
        limit?: number
        offset?: number
    }
): Promise<Signal[]> {
    const userRealmIds = await getUserRealmIds(userId)

    return await prisma.signal.findMany({
        where: {
            signal_visibility,
            realm_id: { in: userRealmIds },
        },
        orderBy: { stamp_created: 'desc' },
        take: options?.limit ?? 10,
        skip: options?.offset ?? 0,
    })
}

/**
 * Get recent signals (realm-scoped)
 */
export async function getRecentSignals(
    userId: string,
    limit: number = 10
): Promise<Signal[]> {
    const userRealmIds = await getUserRealmIds(userId)

    return await prisma.signal.findMany({
        where: {
            realm_id: { in: userRealmIds },
        },
        orderBy: { stamp_created: 'desc' },
        take: limit,
    })
}

/**
 * Count signals by status (realm-scoped)
 */
export async function countSignalsByStatus(
    userId: string
): Promise<Record<string, number>> {
    const userRealmIds = await getUserRealmIds(userId)

    const results = await prisma.signal.groupBy({
        by: ['signal_status'],
        where: {
            realm_id: { in: userRealmIds },
        },
        _count: true,
    })

    return results.reduce((acc, item) => {
        acc[item.signal_status] = item._count
        return acc
    }, {} as Record<string, number>)
}

/**
 * Get signal with full relations (realm-scoped)
 */
export async function getSignalComplete(
    signal_id: string,
    userId: string
): Promise<SignalComplete | null> {
    const userRealmIds = await getUserRealmIds(userId)

    return await prisma.signal.findFirst({
        where: {
            signal_id,
            realm_id: { in: userRealmIds },
        },
        include: {
            synthesis: true,
            clusters: {
                include: {
                    cluster: true,
                },
            },
        },
    })
}
