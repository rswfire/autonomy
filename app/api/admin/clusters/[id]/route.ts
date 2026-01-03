// app/api/admin/clusters/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/utils/auth'
import { getClusterById, updateCluster, deleteCluster } from '@/lib/queries/cluster'
import { updateClusterSchema } from '@/lib/validation/cluster'

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const params = await context.params
    try {
        const user = await requireAuth()
        const cluster = await getClusterById(params.id, user.user_id)

        if (!cluster) {
            return NextResponse.json({ error: 'Cluster not found' }, { status: 404 })
        }

        return NextResponse.json({ cluster })
    } catch (error) {
        if (error instanceof Error && error.message === 'Unauthorized') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }
        return NextResponse.json({ error: 'Failed to fetch cluster' }, { status: 500 })
    }
}

export async function PATCH(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const params = await context.params
    try {
        const user = await requireAuth()
        const body = await request.json()
        const validated = updateClusterSchema.parse({ cluster_id: params.id, ...body })
        const cluster = await updateCluster(validated, user.user_id)
        return NextResponse.json({ cluster })
    } catch (error) {
        if (error instanceof Error && error.message === 'Unauthorized') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }
        if (error instanceof Error && error.name === 'ZodError') {
            return NextResponse.json({ error: 'Validation failed', details: error }, { status: 400 })
        }
        return NextResponse.json({ error: 'Failed to update cluster' }, { status: 500 })
    }
}

export async function DELETE(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const params = await context.params
    try {
        const user = await requireAuth()
        await deleteCluster(params.id, user.user_id)
        return NextResponse.json({ success: true })
    } catch (error) {
        if (error instanceof Error && error.message === 'Unauthorized') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }
        return NextResponse.json({ error: 'Failed to delete cluster' }, { status: 500 })
    }
}
