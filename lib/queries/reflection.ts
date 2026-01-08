// lib/queries/reflection.ts
import { prisma } from '../db'
import type { Reflection } from '@prisma/client'
import { ulid } from '../utils/ulid'
import type {
    CreateReflectionInput,
    UpdateReflectionInput,
    ReflectionFilter,
} from '../validation/reflection'

/**
 * Create a new reflection
 */
export async function createReflection(
    data: CreateReflectionInput
): Promise<Reflection> {
    return await prisma.reflection.create({
        data: {
            reflection_id: ulid(),
            ...data,
        } as any,
    })
}

/**
 * Get reflection by ID
 */
export async function getReflectionById(
    reflection_id: string
): Promise<Reflection | null> {
    return await prisma.reflection.findUnique({
        where: { reflection_id },
    })
}

/**
 * Get reflections for a signal
 */
export async function getReflectionsForSignal(
    signal_id: string,
    reflection_type?: string
): Promise<Reflection[]> {
    return await prisma.reflection.findMany({
        where: {
            polymorphic_id: signal_id,
            polymorphic_type: 'signal',
            ...(reflection_type && { reflection_type }),
        },
        orderBy: { stamp_created: 'desc' },
    })
}

/**
 * Get reflections for a cluster
 */
export async function getReflectionsForCluster(
    cluster_id: string,
    reflection_type?: string
): Promise<Reflection[]> {
    return await prisma.reflection.findMany({
        where: {
            polymorphic_id: cluster_id,
            polymorphic_type: 'cluster',
            ...(reflection_type && { reflection_type }),
        },
        orderBy: { stamp_created: 'desc' },
    })
}

/**
 * Update reflection
 */
export async function updateReflection(
    data: UpdateReflectionInput
): Promise<Reflection> {
    const { reflection_id, ...rest } = data

    return await prisma.reflection.update({
        where: { reflection_id },
        data: rest as any,
    })
}

/**
 * Delete reflection
 */
export async function deleteReflection(
    reflection_id: string
): Promise<Reflection> {
    return await prisma.reflection.delete({
        where: { reflection_id },
    })
}

/**
 * Query reflections with filters
 */
export async function queryReflections(
    filter: ReflectionFilter
): Promise<{
    reflections: Reflection[]
    total: number
}> {
    const {
        realm_id,
        reflection_type,
        polymorphic_id,
        polymorphic_type,
        limit,
        offset,
    } = filter

    const where: any = {}

    if (realm_id) where.realm_id = realm_id
    if (reflection_type) where.reflection_type = reflection_type
    if (polymorphic_id) where.polymorphic_id = polymorphic_id
    if (polymorphic_type) where.polymorphic_type = polymorphic_type

    const [reflections, total] = await Promise.all([
        prisma.reflection.findMany({
            where,
            orderBy: { stamp_created: 'desc' },
            skip: offset,
            take: limit,
        }),
        prisma.reflection.count({ where }),
    ])

    return { reflections, total }
}

/**
 * Get reflections by realm
 */
export async function getReflectionsByRealm(
    realm_id: string,
    options?: {
        limit?: number
        offset?: number
    }
): Promise<Reflection[]> {
    return await prisma.reflection.findMany({
        where: { realm_id },
        orderBy: { stamp_created: 'desc' },
        take: options?.limit ?? 10,
        skip: options?.offset ?? 0,
    })
}
