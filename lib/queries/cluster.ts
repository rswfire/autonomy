// lib/queries/cluster.ts
import { Prisma } from '@prisma/client'
import { prisma } from '../db'
import type {
    Cluster,
    ClusterWithSignals,
    ClusterWithSynthesis,
    ClusterWithHierarchy,
    ClusterComplete,
} from '../types'
import type {
    CreateClusterInput,
    UpdateClusterInput,
    AddSignalToClusterInput,
    RemoveSignalFromClusterInput,
    UpdateClusterSignalInput,
    ClusterFilter,
} from '../validation/cluster'
import { ulid } from '../utils/ulid'
import { getUserRealmIds } from './realm'

/**
 * Create a new cluster
 */
export async function createCluster(
    data: CreateClusterInput,
    userId: string
): Promise<Cluster> {
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

    const { parent_cluster_id, cluster_annotations, cluster_metadata, cluster_payload, cluster_tags, ...rest } = data

    return await prisma.cluster.create({
        data: {
            cluster_id: ulid(),
            ...rest,
            ...(parent_cluster_id && { parent_cluster_id }),  // ← Use unchecked approach
            ...(cluster_annotations && { cluster_annotations: cluster_annotations as Prisma.InputJsonValue }),
            ...(cluster_metadata && { cluster_metadata: cluster_metadata as Prisma.InputJsonValue }),
            ...(cluster_payload && { cluster_payload: cluster_payload as Prisma.InputJsonValue }),
            ...(cluster_tags && { cluster_tags: cluster_tags as Prisma.InputJsonValue }),
        },
    })
}

/**
 * Get cluster by ID (realm-scoped)
 */
export async function getClusterById(
    cluster_id: string,
    userId: string,
    options?: {
        include_signals?: boolean
        include_synthesis?: boolean
        include_hierarchy?: boolean
    }
): Promise<Cluster | ClusterWithSignals | ClusterWithSynthesis | ClusterComplete | null> {
    const userRealmIds = await getUserRealmIds(userId)

    const include: any = {}

    if (options?.include_signals) {
        include.signals = {
            include: {
                signal: true,
            },
            orderBy: {
                pivot_position: 'asc',
            },
        }
    }

    if (options?.include_synthesis) {
        include.synthesis = true
    }

    if (options?.include_hierarchy) {
        include.parent_cluster = true
        include.child_clusters = true
    }

    return await prisma.cluster.findFirst({
        where: {
            cluster_id,
            realm_id: { in: userRealmIds },
        },
        include: Object.keys(include).length > 0 ? include : undefined,
    })
}

/**
 * Update cluster
 */
export async function updateCluster(
    data: UpdateClusterInput,
    userId: string
): Promise<Cluster> {
    const {
        cluster_id,
        cluster_annotations,
        cluster_metadata,
        cluster_payload,
        cluster_tags,
        cluster_embedding,
        parent_cluster_id,
        ...rest
    } = data

    // Verify user owns the realm this cluster belongs to
    const cluster = await prisma.cluster.findUnique({
        where: { cluster_id },
        include: { realm: true },
    })

    if (!cluster || cluster.realm.user_id !== userId) {
        throw new Error('Not authorized to update this cluster')
    }

    return await prisma.cluster.update({
        where: { cluster_id },
        data: {
            ...rest,
            ...(cluster_annotations !== undefined && { cluster_annotations: cluster_annotations as Prisma.InputJsonValue }),
            ...(cluster_metadata !== undefined && { cluster_metadata: cluster_metadata as Prisma.InputJsonValue }),
            ...(cluster_payload !== undefined && { cluster_payload: cluster_payload as Prisma.InputJsonValue }),
            ...(cluster_tags !== undefined && { cluster_tags: cluster_tags as Prisma.InputJsonValue }),
            ...(cluster_embedding !== undefined && { cluster_embedding: cluster_embedding as Prisma.InputJsonValue }),
            ...(parent_cluster_id !== undefined && {
                parent_cluster: parent_cluster_id
                    ? { connect: { cluster_id: parent_cluster_id } }
                    : { disconnect: true },
            }),
        },
    })
}

/**
 * Delete cluster
 */
export async function deleteCluster(
    cluster_id: string,
    userId: string
): Promise<Cluster> {
    // Verify user owns the realm this cluster belongs to
    const cluster = await prisma.cluster.findUnique({
        where: { cluster_id },
        include: { realm: true },
    })

    if (!cluster || cluster.realm.user_id !== userId) {
        throw new Error('Not authorized to delete this cluster')
    }

    return await prisma.cluster.delete({
        where: { cluster_id },
    })
}

/**
 * Add signal to cluster
 */
export async function addSignalToCluster(
    data: AddSignalToClusterInput,
    userId: string
): Promise<void> {
    const { cluster_id, signal_id, pivot_position, pivot_metadata } = data

    // Verify user owns the realm this cluster belongs to
    const cluster = await prisma.cluster.findUnique({
        where: { cluster_id },
        include: { realm: true },
    })

    if (!cluster || cluster.realm.user_id !== userId) {
        throw new Error('Not authorized to modify this cluster')
    }

    // Verify signal belongs to same realm as cluster
    const signal = await prisma.signal.findUnique({
        where: { signal_id },
    })

    if (!signal || signal.realm_id !== cluster.realm_id) {
        throw new Error('Signal must belong to same realm as cluster')
    }

    await prisma.clusterSignal.create({
        data: {
            cluster_id,
            signal_id,
            pivot_position,
            ...(pivot_metadata && { pivot_metadata: pivot_metadata as Prisma.InputJsonValue }),
        },
    })
}

/**
 * Remove signal from cluster
 */
export async function removeSignalFromCluster(
    data: RemoveSignalFromClusterInput,
    userId: string
): Promise<void> {
    const { cluster_id, signal_id } = data

    // Verify user owns the realm this cluster belongs to
    const cluster = await prisma.cluster.findUnique({
        where: { cluster_id },
        include: { realm: true },
    })

    if (!cluster || cluster.realm.user_id !== userId) {
        throw new Error('Not authorized to modify this cluster')
    }

    await prisma.clusterSignal.delete({
        where: {
            cluster_id_signal_id: {
                cluster_id,
                signal_id,
            },
        },
    })
}

/**
 * Update signal in cluster (position/metadata)
 */
export async function updateClusterSignal(
    data: UpdateClusterSignalInput,
    userId: string
): Promise<void> {
    const { cluster_id, signal_id, pivot_position, pivot_metadata } = data

    // Verify user owns the realm this cluster belongs to
    const cluster = await prisma.cluster.findUnique({
        where: { cluster_id },
        include: { realm: true },
    })

    if (!cluster || cluster.realm.user_id !== userId) {
        throw new Error('Not authorized to modify this cluster')
    }

    await prisma.clusterSignal.update({
        where: {
            cluster_id_signal_id: {
                cluster_id,
                signal_id,
            },
        },
        data: {
            ...(pivot_position !== undefined && { pivot_position }),
            ...(pivot_metadata !== undefined && { pivot_metadata: pivot_metadata as Prisma.InputJsonValue }),
        },
    })
}

/**
 * Get signals in cluster (ordered by position, realm-scoped)
 */
export async function getClusterSignals(
    cluster_id: string,
    userId: string
): Promise<any[]> {
    const userRealmIds = await getUserRealmIds(userId)

    // Verify cluster is in accessible realm
    const cluster = await prisma.cluster.findFirst({
        where: {
            cluster_id,
            realm_id: { in: userRealmIds },
        },
    })

    if (!cluster) {
        throw new Error('Cluster not found or not accessible')
    }

    const clusterSignals = await prisma.clusterSignal.findMany({
        where: { cluster_id },
        include: {
            signal: true,
        },
        orderBy: {
            pivot_position: 'asc',
        },
    })

    return clusterSignals
}

/**
 * Query clusters with filters (realm-scoped)
 */
export async function queryClusters(
    filter: Partial<ClusterFilter>,
    userId: string
): Promise<{
    clusters: Cluster[]
    total: number
}> {
    const userRealmIds = await getUserRealmIds(userId)

    const {
        cluster_type,
        cluster_state,
        cluster_depth,
        parent_cluster_id,
        created_after,
        created_before,
        cluster_start_after,
        cluster_start_before,
        cluster_end_after,
        cluster_end_before,
        tags,
        tags_match,
        search,
        include_signals = false,
        include_synthesis = false,
        include_hierarchy = false,
        limit = 10,
        offset = 0,
        sort_by,
        sort_order = 'desc',
    } = filter

    // Build where clause
    const where: any = {
        realm_id: { in: userRealmIds },
    }

    if (cluster_type) where.cluster_type = cluster_type
    if (cluster_state) where.cluster_state = cluster_state
    if (cluster_depth !== undefined) where.cluster_depth = cluster_depth
    if (parent_cluster_id) where.parent_cluster_id = parent_cluster_id

    // Date filters
    if (created_after || created_before) {
        where.stamp_created = {}
        if (created_after) where.stamp_created.gte = created_after
        if (created_before) where.stamp_created.lte = created_before
    }

    if (cluster_start_after || cluster_start_before) {
        where.stamp_cluster_start = {}
        if (cluster_start_after) where.stamp_cluster_start.gte = cluster_start_after
        if (cluster_start_before) where.stamp_cluster_start.lte = cluster_start_before
    }

    if (cluster_end_after || cluster_end_before) {
        where.stamp_cluster_end = {}
        if (cluster_end_after) where.stamp_cluster_end.gte = cluster_end_after
        if (cluster_end_before) where.stamp_cluster_end.lte = cluster_end_before
    }

    // Tag filtering
    if (tags && tags.length > 0) {
        if (tags_match === 'all') {
            where.cluster_tags = {
                path: '$',
                array_contains: tags,
            }
        } else {
            where.OR = tags.map((tag) => ({
                cluster_tags: {
                    path: '$',
                    array_contains: [tag],
                },
            }))
        }
    }

    // Text search
    if (search) {
        where.cluster_title = { contains: search, mode: 'insensitive' }
    }

    // Build include
    const include: any = {}

    if (include_signals) {
        include.signals = {
            include: {
                signal: true,
            },
            orderBy: {
                pivot_position: 'asc',
            },
        }
    }

    if (include_synthesis) {
        include.synthesis = true
    }

    if (include_hierarchy) {
        include.parent_cluster = true
        include.child_clusters = true
    }

    // Build orderBy
    const orderBy: any = {}
    if (sort_by) {
        orderBy[sort_by] = sort_order
    } else {
        orderBy.stamp_created = sort_order
    }

    // Execute query
    const [clusters, total] = await Promise.all([
        prisma.cluster.findMany({
            where,
            include: Object.keys(include).length > 0 ? include : undefined,
            orderBy,
            skip: offset,
            take: limit,
        }),
        prisma.cluster.count({ where }),
    ])

    return { clusters, total }
}

/**
 * Get child clusters (realm-scoped)
 */
export async function getChildClusters(
    parent_cluster_id: string,
    userId: string
): Promise<Cluster[]> {
    const userRealmIds = await getUserRealmIds(userId)

    return await prisma.cluster.findMany({
        where: {
            parent_cluster_id,
            realm_id: { in: userRealmIds },
        },
        orderBy: { stamp_created: 'desc' },
    })
}

/**
 * Get cluster hierarchy (ancestors and descendants, realm-scoped)
 */
export async function getClusterHierarchy(
    cluster_id: string,
    userId: string
): Promise<{
    cluster: ClusterWithHierarchy | null
    ancestors: Cluster[]
    descendants: Cluster[]
}> {
    const userRealmIds = await getUserRealmIds(userId)

    const cluster = await prisma.cluster.findFirst({
        where: {
            cluster_id,
            realm_id: { in: userRealmIds },
        },
        include: {
            parent_cluster: true,
            child_clusters: true,
        },
    })

    if (!cluster) {
        return { cluster: null, ancestors: [], descendants: [] }
    }

    // Get all ancestors (recursive, realm-scoped)
    const ancestors: Cluster[] = []
    let current = cluster.parent_cluster
    while (current) {
        ancestors.push(current)
        current = await prisma.cluster.findFirst({
            where: {
                cluster_id: current.parent_cluster_id || '',
                realm_id: { in: userRealmIds },
            },
        })
    }

    // Get all descendants (recursive, realm-scoped)
    const descendants: Cluster[] = []
    const getDescendants = async (parentId: string) => {
        const children = await prisma.cluster.findMany({
            where: {
                parent_cluster_id: parentId,
                realm_id: { in: userRealmIds },
            },
        })

        for (const child of children) {
            descendants.push(child)
            await getDescendants(child.cluster_id)
        }
    }

    await getDescendants(cluster_id)

    return { cluster, ancestors, descendants }
}

/**
 * Get cluster with full relations (realm-scoped)
 */
export async function getClusterComplete(
    cluster_id: string,
    userId: string
): Promise<ClusterComplete | null> {
    const userRealmIds = await getUserRealmIds(userId)

    return await prisma.cluster.findFirst({
        where: {
            cluster_id,
            realm_id: { in: userRealmIds },
        },
        include: {
            signals: {
                include: {
                    signal: true,
                },
                orderBy: {
                    pivot_position: 'asc',
                },
            },
            synthesis: true,
            parent_cluster: true,
            child_clusters: true,
        },
    })
}
