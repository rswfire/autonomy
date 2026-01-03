// lib/types/user.ts
import type { User, Realm, RealmUser } from '@prisma/client'
import type { USER_ROLES } from '../constants'

export type UserRole = typeof USER_ROLES[number]

export type UserWithPermissions = User & {
    permissions: {
        can_create: boolean
        can_edit: boolean
        can_delete: boolean
        can_view_sanctum: boolean
        can_view_private: boolean
    }
}

export type UserWithRealms = User & {
    created_realms: Realm[]
    realm_memberships: RealmUser[]
}
