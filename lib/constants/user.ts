// lib/constants/user.ts

export const USER_ROLES = [
    'OWNER',    // Full control - can create/edit/delete everything
    'SANCTUM',  // Can view SANCTUM visibility signals
    'GUEST',    // Can only view PUBLIC signals
] as const

export const ROLE_PERMISSIONS = {
    OWNER: {
        can_create: true,
        can_edit: true,
        can_delete: true,
        can_view_sanctum: true,
        can_view_private: true,
    },
    SANCTUM: {
        can_create: false,
        can_edit: false,
        can_delete: false,
        can_view_sanctum: true,
        can_view_private: false,
    },
    GUEST: {
        can_create: false,
        can_edit: false,
        can_delete: false,
        can_view_sanctum: false,
        can_view_private: false,
    },
} as const
