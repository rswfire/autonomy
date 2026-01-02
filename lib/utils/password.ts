// lib/utils/password.ts
import bcrypt from 'bcryptjs'

const SALT_ROUNDS = 10

/**
 * Hash a password
 */
export async function hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, SALT_ROUNDS)
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(
    password: string,
    hash: string
): Promise<boolean> {
    return await bcrypt.compare(password, hash)
}

/**
 * Validate password strength
 * Returns array of error messages, empty if valid
 */
export function validatePasswordStrength(password: string): string[] {
    const errors: string[] = []

    if (password.length < 8) {
        errors.push('Password must be at least 8 characters long')
    }

    if (password.length > 72) {
        errors.push('Password must be less than 72 characters')
    }

    if (!/[a-z]/.test(password)) {
        errors.push('Password must contain at least one lowercase letter')
    }

    if (!/[A-Z]/.test(password)) {
        errors.push('Password must contain at least one uppercase letter')
    }

    if (!/[0-9]/.test(password)) {
        errors.push('Password must contain at least one number')
    }

    if (!/[^a-zA-Z0-9]/.test(password)) {
        errors.push('Password must contain at least one special character')
    }

    return errors
}

/**
 * Generate a random password
 */
export function generateRandomPassword(length: number = 16): string {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz'
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const numbers = '0123456789'
    const special = '!@#$%^&*()_+-=[]{}|;:,.<>?'
    const all = lowercase + uppercase + numbers + special

    let password = ''

    // Ensure at least one of each type
    password += lowercase[Math.floor(Math.random() * lowercase.length)]
    password += uppercase[Math.floor(Math.random() * uppercase.length)]
    password += numbers[Math.floor(Math.random() * numbers.length)]
    password += special[Math.floor(Math.random() * special.length)]

    // Fill the rest randomly
    for (let i = password.length; i < length; i++) {
        password += all[Math.floor(Math.random() * all.length)]
    }

    // Shuffle the password
    return password
        .split('')
        .sort(() => Math.random() - 0.5)
        .join('')
}
