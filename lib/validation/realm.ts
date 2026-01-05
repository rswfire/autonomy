import { z } from 'zod'
import { REALM_TYPES, REALM_USER_ROLES } from '@/lib/constants'

export const createRealmSchema = z.object({
    realm_name: z.string().min(1).max(100),
    realm_slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
    realm_description: z.string().optional(),
    realm_type: z.enum(['PRIVATE', 'PUBLIC', 'SHARED']),
    flag_registry: z.boolean().default(false),
})

export const updateRealmSchema = createRealmSchema.partial()

export const realmUserSchema = z.object({
    user_id: z.string().length(26),
    user_role: z.enum(['OWNER', 'CONTRIBUTOR', 'OBSERVER']),
})
