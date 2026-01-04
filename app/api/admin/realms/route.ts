// app/api/admin/realms/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { requireAuthAPI  } from '@/lib/utils/auth'
import { getUserRealms, createRealm } from '@/lib/queries/realm'
import { createRealmSchema } from '@/lib/validation/realm'

export async function GET(request: NextRequest) {
    const user = await requireAuthAPI()
    const realmData = await getUserRealms({ userId: user.user_id })
    return NextResponse.json(realmData.realms)
}

export async function POST(request: NextRequest) {
    const user = await requireAuthAPI ()
    const body = await request.json()

    const validated = createRealmSchema.parse(body)
    const realm = await createRealm(user.user_id, validated)

    return NextResponse.json(realm, { status: 201 })
}
