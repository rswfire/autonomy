// proxy.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const secret = new TextEncoder().encode(
    process.env.JWT_SECRET || 'your-secret-key-change-in-production'
)

export async function proxy(request: NextRequest) {
    const path = request.nextUrl.pathname

    // Handle CORS for API routes
    if (path.startsWith('/api/')) {
        const origin = request.headers.get('origin')
        const response = NextResponse.next()

        // Allow any origin (echo it back)
        if (origin) {
            response.headers.set('Access-Control-Allow-Origin', origin)
            response.headers.set('Access-Control-Allow-Credentials', 'true')
            response.headers.set('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
            response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cookie')
        }

        // Handle preflight requests
        if (request.method === 'OPTIONS') {
            return new NextResponse(null, {
                status: 200,
                headers: response.headers,
            })
        }

        return response
    }

    // Handle admin auth
    if (path === '/admin/login' || path === '/admin/login/') {
        return NextResponse.next()
    }

    if (path.startsWith('/admin')) {
        const token = request.cookies.get('auth_token')?.value

        if (!token) {
            return NextResponse.redirect(new URL('/admin/login', request.url))
        }

        try {
            await jwtVerify(token, secret)
            return NextResponse.next()
        } catch (error) {
            return NextResponse.redirect(new URL('/admin/login', request.url))
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/admin/:path*', '/api/:path*'],
}
