import { SignJWT } from 'jose'
import { NextRequest, NextResponse } from 'next/server'
import { authenticateUser } from '@/lib/queries/user'
import type { AuthPayload } from '@/lib/types/auth'

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || 'your-secret-key-here'
)

export async function POST(request: NextRequest) {
    console.log('🔐 Login attempt started')

    try {
        const body = await request.json()
        console.log('📧 Email from request:', body.user_email ? 'present' : 'MISSING')

        const user = await authenticateUser(body)
        console.log('👤 User authenticated:', user ? user.user_email : 'FAILED')

        if (!user) {
            console.log('❌ Invalid credentials')
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
        console.log('🎫 Creating token for:', payload.email)

        const token = await new SignJWT(payload)
            .setProtectedHeader({ alg: 'HS256' })
            .setExpirationTime('7d')
            .sign(JWT_SECRET)

        console.log('✅ Token created, length:', token.length)

        const response = NextResponse.json({ success: true })
        response.cookies.set('auth_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7,
            path: '/',
        })

        console.log('🍪 Cookie set with secure:', process.env.NODE_ENV === 'production')

        return response
    } catch (error) {
        console.error('💥 Login error:', error)
        return NextResponse.json(
            {
                error: 'Authentication failed',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        )
    }
}
