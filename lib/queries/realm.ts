// lib/queries/realm.ts
import { prisma } from '@/lib/db'
import { ulid } from '@/lib/utils/ulid'
import type { Realm, RealmUser } from '@/lib/types'

/**
 * Get realms user has access to
 */
export async function getUserRealms(filter: { userId: string }): Promise<{ realms: Realm[], total: number }> {
    const realms = await prisma.realm.findMany({
        where: {
            OR: [
                { user_id: filter.userId },
                { members: { some: { user_id: filter.userId } } },
            ],
        },
        orderBy: { stamp_created: 'desc' },
    })

    return {
        realms,
        total: realms.length
    }
}

/**
 * Get user's default realm (or create if doesn't exist)
 */
export async function getOrCreateDefaultRealm(userId: string): Promise<Realm> {
    let realm = await prisma.realm.findFirst({
        where: {
            user_id: userId,
            realm_type: 'PRIVATE',
        },
    })

    if (!realm) {
        const id = ulid()
        realm = await prisma.realm.create({
            data: {
                realm_id: id,
                user_id: userId,
                realm_type: 'PRIVATE',
                realm_name: 'My Realm',
                realm_slug: id.toLowerCase(),
                flag_registry: false,
            },
        })
    }

    return realm
}

/**
 * Create new realm
 */
export async function createRealm(
    userId: string,
    data: {
        realm_name: string
        realm_slug: string
        realm_description?: string
        realm_type: string
        flag_registry?: boolean
    }
): Promise<Realm> {
    return await prisma.realm.create({
        data: {
            realm_id: ulid(),
            user_id: userId,
            ...data,
        },
    })
}

/**
 * Update realm
 */
/**
 * Update realm
 */
export async function updateRealm(
    realmId: string,
    data: {
        realm_name?: string
        realm_slug?: string
        realm_description?: string | null
        realm_type?: string
        realm_settings?: any
        flag_registry?: boolean
    }
): Promise<Realm> {
    return await prisma.realm.update({
        where: { realm_id: realmId },
        data,
    })
}

/**
 * Delete realm
 */
export async function deleteRealm(realmId: string): Promise<void> {
    await prisma.realm.delete({
        where: { realm_id: realmId },
    })
}

/**
 * Check if user has access to realm
 */
export async function userHasRealmAccess(
    userId: string,
    realmId: string
): Promise<boolean> {
    const realm = await prisma.realm.findFirst({
        where: {
            realm_id: realmId,
            OR: [
                { user_id: userId },
                { members: { some: { user_id: userId } } },
            ],
        },
    })
    return !!realm
}

/**
 * Get user's accessible realm IDs
 */
export async function getUserRealmIds(userId: string): Promise<string[]> {
    const realms = await prisma.realm.findMany({
        where: {
            OR: [
                { user_id: userId },
                { members: { some: { user_id: userId } } },
            ],
        },
        select: { realm_id: true },
    })
    return realms.map((r: { realm_id: string }) => r.realm_id)
}

/**
 * Get realm by ID
 */
export async function getRealmById(realmId: string): Promise<Realm | null> {
    return await prisma.realm.findUnique({
        where: { realm_id: realmId },
    })
}

/**
 * Get realm by Slug
 */
export async function getRealmBySlug(slug: string): Promise<Realm | null> {
    return await prisma.realm.findUnique({
        where: { realm_slug: slug },
    })
}
