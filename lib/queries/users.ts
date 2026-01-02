// lib/queries/user.ts
import { prisma } from '../db'
import type { User } from '../types'
import { hashPassword, verifyPassword } from '../utils/password'
import type { CreateUserInput, UpdateUserInput, LoginInput, ChangePasswordInput } from '../validation/user'
import { ulid } from '../utils/ulid'

/**
 * Create a new user
 */
export async function createUser(data: CreateUserInput): Promise<User> {
    const { user_password, ...rest } = data

    // Hash password
    const hashedPassword = await hashPassword(user_password)

    return await prisma.user.create({
        data: {
            user_id: ulid(),
            ...rest,
            user_password: hashedPassword,
        },
    })
}

/**
 * Get user by ID
 */
export async function getUserById(user_id: string): Promise<User | null> {
    return await prisma.user.findUnique({
        where: { user_id },
    })
}

/**
 * Get user by email
 */
export async function getUserByEmail(user_email: string): Promise<User | null> {
    return await prisma.user.findUnique({
        where: { user_email },
    })
}

/**
 * Authenticate user with email and password
 */
export async function authenticateUser(data: LoginInput): Promise<User | null> {
    const { user_email, user_password } = data

    const user = await prisma.user.findUnique({
        where: { user_email },
    })

    if (!user) {
        return null
    }

    const isValid = await verifyPassword(user_password, user.user_password)

    if (!isValid) {
        return null
    }

    return user
}

/**
 * Update user
 */
export async function updateUser(data: UpdateUserInput): Promise<User> {
    const { user_id, user_password, ...rest } = data

    // Hash password if provided
    const updateData: any = { ...rest }
    if (user_password) {
        updateData.user_password = await hashPassword(user_password)
    }

    return await prisma.user.update({
        where: { user_id },
        data: updateData,
    })
}

/**
 * Change user password
 */
export async function changePassword(data: ChangePasswordInput): Promise<boolean> {
    const { user_id, current_password, new_password } = data

    const user = await prisma.user.findUnique({
        where: { user_id },
    })

    if (!user) {
        throw new Error('User not found')
    }

    // Verify current password
    const isValid = await verifyPassword(current_password, user.user_password)

    if (!isValid) {
        throw new Error('Current password is incorrect')
    }

    // Hash and update new password
    const hashedPassword = await hashPassword(new_password)

    await prisma.user.update({
        where: { user_id },
        data: { user_password: hashedPassword },
    })

    return true
}

/**
 * Delete user
 */
export async function deleteUser(user_id: string): Promise<User> {
    return await prisma.user.delete({
        where: { user_id },
    })
}

/**
 * List all users (excluding passwords)
 */
export async function listUsers(options?: {
    limit?: number
    offset?: number
}): Promise<Omit<User, 'user_password'>[]> {
    const users = await prisma.user.findMany({
        orderBy: { stamp_created: 'desc' },
        take: options?.limit ?? 10,
        skip: options?.offset ?? 0,
    })

    // Strip passwords from response
    return users.map(({ user_password, ...user }) => user)
}

/**
 * Count total users
 */
export async function countUsers(): Promise<number> {
    return await prisma.user.count()
}

/**
 * Get owner user
 */
export async function getOwner(): Promise<User | null> {
    return await prisma.user.findFirst({
        where: { is_owner: true },
    })
}

/**
 * Check if owner exists
 */
export async function ownerExists(): Promise<boolean> {
    const count = await prisma.user.count({
        where: { is_owner: true },
    })
    return count > 0
}
