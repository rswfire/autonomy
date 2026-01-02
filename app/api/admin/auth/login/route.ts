// app/api/admin/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { SignJWT } from 'jose'
import { verifyPassword } from '@/lib/utils/password'
import { getUserByEmail } from '@/lib/queries/user'

const secret = new TextEncoder().encode(
    process.env.JWT_SECRET || 'your-secret-key-change-in-production'
)

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json()

        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email and password required' },
                { status: 400 }
            )
        }

        const user = await getUserByEmail(email)

        if (!user) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            )
        }

        const isValid = await verifyPassword(password, user.user_password)

        if (!isValid) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            )
        }

        // Only allow OWNER or SANCTUM roles to access admin
        if (user.user_role !== 'OWNER' && user.user_role !== 'SANCTUM') {
            return NextResponse.json(
                { error: 'Insufficient permissions' },
                { status: 403 }
            )
        }

        const token = await new SignJWT({
            userId: user.user_id,
            email: user.user_email,
            role: user.user_role
        })
            .setProtectedHeader({ alg: 'HS256' })
            .setExpirationTime('24h')
            .sign(secret)

        const response = NextResponse.json({
            success: true,
            user: {
                id: user.user_id,
                email: user.user_email,
                name: user.user_name,
                role: user.user_role
            }
        })

        response.cookies.set('admin_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24, // 24 hours
            path: '/',
        })

        return response
    } catch (error) {
        console.error('Login error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
