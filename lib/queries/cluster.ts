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
import { requireOwner } from '../utils/permissions'
import type { UserRole } from '../types'

/**
 * Create a new cluster
 */
export async function createCluster(
    data: CreateClusterInput,
    user_role: UserRole
): Promise<Cluster> {
    requireOwner(user_role, 'create clusters')

    const { parent_cluster_id, cluster_annotations, cluster_metadata, cluster_payload, cluster_tags, ...rest } = data

    return await prisma.cluster.create({
        data: {
            ...rest,
            ...(cluster_annotations && { cluster_annotations: cluster_annotations as Prisma.InputJsonValue }),
            ...(cluster_metadata && { cluster_metadata: cluster_metadata as Prisma.InputJsonValue }),
            ...(cluster_payload && { cluster_payload: cluster_payload as Prisma.InputJsonValue }),
            ...(cluster_tags && { cluster_tags: cluster_tags as Prisma.InputJsonValue }),
            ...(parent_cluster_id && {
                parent_cluster: {
                    connect: { cluster_id: parent_cluster_id },
                },
            }),
        },
    })
}

/**
 * Get cluster by ID
 */
export async function getClusterById(
    cluster_id: string,
    options?: {
        include_signals?: boolean
        include_synthesis?: boolean
        include_hierarchy?: boolean
    }
): Promise<Cluster | ClusterWithSignals | ClusterWithSynthesis | ClusterComplete | null> {
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

    return await prisma.cluster.findUnique({
        where: { cluster_id },
        include: Object.keys(include).length > 0 ? include : undefined,
    })
}

/**
 * Update cluster
 */
export async function updateCluster(
    data: UpdateClusterInput,
    user_role: UserRole
): Promise<Cluster> {
    requireOwner(user_role, 'update clusters')

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
    user_role: UserRole
): Promise<Cluster> {
    requireOwner(user_role, 'delete clusters')

    return await prisma.cluster.delete({
        where: { cluster_id },
    })
}

/**
 * Add signal to cluster
 */
export async function addSignalToCluster(
    data: AddSignalToClusterInput,
    user_role: UserRole
): Promise<void> {
    requireOwner(user_role, 'modify clusters')

    const { cluster_id, signal_id, pivot_position, pivot_metadata } = data

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
    user_role: UserRole
): Promise<void> {
    requireOwner(user_role, 'modify clusters')

    const { cluster_id, signal_id } = data

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
    user_role: UserRole
): Promise<void> {
    requireOwner(user_role, 'modify clusters')

    const { cluster_id, signal_id, pivot_position, pivot_metadata } = data

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
 * Get signals in cluster (ordered by position)
 */
export async function getClusterSignals(cluster_id: string): Promise<any[]> {
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
 * Query clusters with filters
 */
export async function queryClusters(filter: ClusterFilter): Promise<{
    clusters: Cluster[]
    total: number
}> {
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
        include_signals,
        include_synthesis,
        include_hierarchy,
        limit,
        offset,
        sort_by,
        sort_order,
    } = filter

    // Build where clause
    const where: any = {}

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
 * Get child clusters
 */
export async function getChildClusters(parent_cluster_id: string): Promise<Cluster[]> {
    return await prisma.cluster.findMany({
        where: { parent_cluster_id },
        orderBy: { stamp_created: 'desc' },
    })
}

/**
 * Get cluster hierarchy (ancestors and descendants)
 */
export async function getClusterHierarchy(cluster_id: string): Promise<{
    cluster: ClusterWithHierarchy | null
    ancestors: Cluster[]
    descendants: Cluster[]
}> {
    const cluster = await prisma.cluster.findUnique({
        where: { cluster_id },
        include: {
            parent_cluster: true,
            child_clusters: true,
        },
    })

    if (!cluster) {
        return { cluster: null, ancestors: [], descendants: [] }
    }

    // Get all ancestors (recursive)
    const ancestors: Cluster[] = []
    let current = cluster.parent_cluster
    while (current) {
        ancestors.push(current)
        current = await prisma.cluster.findUnique({
            where: { cluster_id: current.parent_cluster_id || '' },
        })
    }

    // Get all descendants (recursive)
    const descendants: Cluster[] = []
    const getDescendants = async (parentId: string) => {
        const children = await prisma.cluster.findMany({
            where: { parent_cluster_id: parentId },
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
 * Get cluster with full relations
 */
export async function getClusterComplete(cluster_id: string): Promise<ClusterComplete | null> {
    return await prisma.cluster.findUnique({
        where: { cluster_id },
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
