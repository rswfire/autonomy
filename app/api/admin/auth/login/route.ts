import { SignJWT } from 'jose'
import { NextRequest, NextResponse } from 'next/server'
import { authenticateUser } from '@/lib/queries/user'
import type { AuthPayload } from '@/lib/types/auth'

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || 'your-secret-key-here'
)

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const user = await authenticateUser(body)

        if (!user) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            )
        }

        const payload: AuthPayload = {
            user_id: user.user_id,
            email: user.user_email,
            role: user.user_role,
        }

        const token = await new SignJWT(payload)
            .setProtectedHeader({ alg: 'HS256' })
            .setExpirationTime('7d')
            .sign(JWT_SECRET)

        const response = NextResponse.json({ success: true })
        response.cookies.set('auth_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7, // 7 days
        })

        return response
    } catch (error) {
        return NextResponse.json(
            { error: 'Authentication failed' },
            { status: 500 }
        )
    }
}
