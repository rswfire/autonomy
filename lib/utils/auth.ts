// lib/utils/auth.ts
import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'
import type { AuthPayload } from '@/lib/types/auth'

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || 'your-secret-key-change-in-production'
)

/**
 * Get current authenticated user from JWT token
 * Returns null if not authenticated
 */
export async function getCurrentUser(): Promise<AuthPayload | null> {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get('auth_token')?.value

        if (!token) {
            return null
        }

        const { payload } = await jwtVerify(token, JWT_SECRET)

        return payload as AuthPayload
    } catch (error) {
        console.error('JWT verification failed:', error)
        return null
    }
}

/**
 * Require authentication - throws if not authenticated
 * Use this in API routes and server components that require auth
 */
export async function requireAuth(): Promise<AuthPayload> {
    const user = await getCurrentUser()

    if (!user) {
        throw new Error('Not authenticated')
    }

    return user
}

/**
 * Verify a JWT token string
 * Returns payload if valid, null if invalid
 */
export async function verifyToken(token: string): Promise<AuthPayload | null> {
    try {
        const { payload } = await jwtVerify(token, JWT_SECRET)
        return payload as AuthPayload
    } catch {
        return null
    }
}
