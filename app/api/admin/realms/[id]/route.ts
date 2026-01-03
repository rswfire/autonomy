import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/utils/auth'
import { updateRealm, deleteRealm, userHasRealmAccess } from '@/lib/queries/realm'
import { prisma } from '@/lib/db'

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params
    const user = await requireAuth()
    const hasAccess = await userHasRealmAccess(user.user_id, id)

    if (!hasAccess) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const realm = await prisma.realm.findUnique({
        where: { realm_id: id },
    })

    return NextResponse.json(realm)
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params
    const user = await requireAuth()
    const body = await request.json()

    // Only realm creator can update
    const realm = await prisma.realm.findUnique({
        where: { realm_id: id },
    })

    if (realm?.user_id !== user.user_id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const updated = await updateRealm(id, body)

    return NextResponse.json(updated)
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params
    const user = await requireAuth()

    const realm = await prisma.realm.findUnique({
        where: { realm_id: id },
    })

    if (realm?.user_id !== user.user_id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    await deleteRealm(id)

    return NextResponse.json({ success: true })
}
