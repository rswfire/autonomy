// lib/utils/permissions.ts
import type { UserRole } from '../constants'
import { ROLE_PERMISSIONS } from '../constants'
import { prisma } from '../db'

/**
 * Get permissions for a user role
 */
export function getPermissions(role: UserRole) {
    return ROLE_PERMISSIONS[role]
}

/**
 * Check if user can create content
 */
export function canCreate(role: UserRole): boolean {
    return getPermissions(role).can_create
}

/**
 * Check if user can edit content
 */
export function canEdit(role: UserRole): boolean {
    return getPermissions(role).can_edit
}

/**
 * Check if user can delete content
 */
export function canDelete(role: UserRole): boolean {
    return getPermissions(role).can_delete
}

/**
 * Check if user can view SANCTUM content
 */
export function canViewSanctum(role: UserRole): boolean {
    return getPermissions(role).can_view_sanctum
}

/**
 * Check if user can view PRIVATE content
 */
export function canViewPrivate(role: UserRole): boolean {
    return getPermissions(role).can_view_private
}

/**
 * Get owner user
 */
export async function getOwner() {
    return await prisma.user.findFirst({
        where: { is_owner: true },
    })
}

/**
 * Check if user is owner
 */
export async function isOwner(user_id: string): Promise<boolean> {
    const user = await prisma.user.findUnique({
        where: { user_id },
    })
    return user?.is_owner ?? false
}

/**
 * Get allowed visibility levels for a user role
 */
export function getAllowedVisibilityLevels(role: UserRole): string[] {
    const permissions = getPermissions(role)
    const levels = ['PUBLIC']

    if (permissions.can_view_sanctum) levels.push('SANCTUM')
    if (permissions.can_view_private) levels.push('PRIVATE', 'SHARED')

    return levels
}

/**
 * Build visibility filter for queries based on user role
 */
export function buildVisibilityFilter(role: UserRole | null): any {
    if (!role) {
        // No user = only PUBLIC
        return { signal_visibility: 'PUBLIC' }
    }

    const allowedLevels = getAllowedVisibilityLevels(role)

    return {
        signal_visibility: {
            in: allowedLevels,
        },
    }
}

/**
 * Require owner role or throw error
 */
export function requireOwner(role: UserRole, action: string = 'perform this action') {
    if (role !== 'OWNER') {
        throw new Error(`Only the owner can ${action}`)
    }
}
