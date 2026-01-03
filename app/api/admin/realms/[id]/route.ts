// app/api/admin/realms/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/utils/auth'
import { updateRealm, deleteRealm, userHasRealmAccess } from '@/lib/queries/realm'
import { updateRealmSchema } from '@/lib/validation/realm'

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const user = await requireAuth(request)
    const hasAccess = await userHasRealmAccess(user.user_id, params.id)

    if (!hasAccess) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const realm = await prisma.realm.findUnique({
        where: { realm_id: params.id },
    })

    return NextResponse.json(realm)
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const user = await requireAuth(request)
    const body = await request.json()

    // Only realm creator can update
    const realm = await prisma.realm.findUnique({
        where: { realm_id: params.id },
    })

    if (realm?.user_id !== user.user_id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const validated = updateRealmSchema.parse(body)
    const updated = await updateRealm(params.id, validated)

    return NextResponse.json(updated)
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const user = await requireAuth(request)

    const realm = await prisma.realm.findUnique({
        where: { realm_id: params.id },
    })

    if (realm?.user_id !== user.user_id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    await deleteRealm(params.id)

    return NextResponse.json({ success: true })
}
