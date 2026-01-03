// app/api/admin/realms/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/utils/auth'
import { getUserRealms, createRealm } from '@/lib/queries/realm'
import { createRealmSchema } from '@/lib/validation/realm'

export async function GET(request: NextRequest) {
    const user = await requireAuth()
    const realms = await getUserRealms(user.user_id)
    return NextResponse.json(realms)
}

export async function POST(request: NextRequest) {
    const user = await requireAuth()
    const body = await request.json()

    const validated = createRealmSchema.parse(body)
    const realm = await createRealm(user.user_id, validated)

    return NextResponse.json(realm, { status: 201 })
}
