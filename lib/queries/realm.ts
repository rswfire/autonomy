// lib/queries/realm.ts
import { prisma } from '@/lib/db'
import { ulid } from '@/lib/utils/ulid'
import type { Realm, RealmUser } from '@/lib/types'

/**
 * Get realms user has access to
 */
export async function getUserRealms(userId: string): Promise<Realm[]> {
    return await prisma.realm.findMany({
        where: {
            OR: [
                { user_id: userId }, // Created by user
                { members: { some: { user_id: userId } } }, // Member of realm
            ],
        },
        orderBy: { stamp_created: 'desc' },
    })
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
        realm = await prisma.realm.create({
            data: {
                realm_id: ulid(),
                user_id: userId,
                realm_type: 'PRIVATE',
                realm_name: 'My Realm',
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
export async function updateRealm(
    realmId: string,
    data: Partial<Realm>
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
