// lib/validation/user.ts
import { z } from 'zod'
import { USER_ROLES } from '../constants'

// Password requirements
const PASSWORD_MIN_LENGTH = 8
const PASSWORD_MAX_LENGTH = 72 // bcrypt limit

// Base user schema
export const userSchema = z.object({
    user_id: z.string().length(26).optional(),
    user_email: z.string().email(),
    user_name: z.string().min(1).max(100).nullable().optional(),
    user_password: z.string().min(PASSWORD_MIN_LENGTH).max(PASSWORD_MAX_LENGTH),
    user_role: z.enum(USER_ROLES).default('GUEST'),
    is_owner: z.boolean().default(false),
    stamp_created: z.date().optional(),
    stamp_updated: z.date().nullable().optional(),
})

// Create user
export const createUserSchema = z.object({
    user_email: z.string().email(),
    user_name: z.string().min(1).max(100).optional(),
    user_password: z.string().min(PASSWORD_MIN_LENGTH).max(PASSWORD_MAX_LENGTH),
    user_role: z.enum(USER_ROLES).optional(),
    is_owner: z.boolean().optional(),
})

// Update user
export const updateUserSchema = z.object({
    user_id: z.string().length(26),
    user_email: z.string().email().optional(),
    user_name: z.string().min(1).max(100).nullable().optional(),
    user_password: z.string().min(PASSWORD_MIN_LENGTH).max(PASSWORD_MAX_LENGTH).optional(),
    user_role: z.enum(USER_ROLES).optional(),
})

// Login
export const loginSchema = z.object({
    user_email: z.string().email(),
    user_password: z.string().min(1),
})

// Change password
export const changePasswordSchema = z.object({
    user_id: z.string().length(26),
    current_password: z.string().min(1),
    new_password: z.string().min(PASSWORD_MIN_LENGTH).max(PASSWORD_MAX_LENGTH),
})

// Type exports
export type UserInput = z.infer<typeof userSchema>
export type CreateUserInput = z.infer<typeof createUserSchema>
export type UpdateUserInput = z.infer<typeof updateUserSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>
