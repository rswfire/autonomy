import { z } from 'zod'
import { REALM_TYPES, REALM_USER_ROLES, STRIPE_SUBSCRIPTION_STATUSES } from '@/lib/constants'

export const createRealmSchema = z.object({
    realm_name: z.string().min(1).max(100),
    realm_slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
    realm_description: z.string().optional(),
    realm_type: z.enum(REALM_TYPES as [string, ...string[]]),
    flag_registry: z.boolean().default(false),
})

export const updateRealmSchema = createRealmSchema.partial()

export const realmUserSchema = z.object({
    user_id: z.string().length(26),
    user_role: z.enum(REALM_USER_ROLES as [string, ...string[]]),
    sanctum_tier: z.string().max(255).optional(),
    stripe_subscription_id: z.string().max(255).optional(),
    stripe_subscription_status: z.enum(STRIPE_SUBSCRIPTION_STATUSES as [string, ...string[]]).optional(),
})
