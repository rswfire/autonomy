// app/api/admin/auth/check/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { requireAuthAPI  } from '@/lib/utils/auth'

export async function GET(request: NextRequest) {
    try {
        const user = await requireAuthAPI ()

        return NextResponse.json({
            authenticated: true,
            role: user.role,
            user_id: user.user_id,
            email: user.email
        })
    } catch {
        return NextResponse.json({
            authenticated: false,
            role: null,
            user_id: null,
            email: null
        })
    }
}
