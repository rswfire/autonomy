// app/api/admin/clusters/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/utils/auth'
import { queryClusters, createCluster } from '@/lib/queries/cluster'
import { createClusterSchema } from '@/lib/validation/cluster'

export async function GET(request: NextRequest) {
    try {
        const user = await requireAuth()
        const { clusters } = await queryClusters({
            limit: 100,
            offset: 0,
            sort_order: 'desc',
        })
        return NextResponse.json({ clusters })
    } catch (error) {
        if (error instanceof Error && error.message === 'Unauthorized') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }
        return NextResponse.json({ error: 'Failed to fetch clusters' }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        const user = await requireAuth()
        const body = await request.json()
        const validated = createClusterSchema.parse(body)
        const cluster = await createCluster(validated, user.user_id)
        return NextResponse.json({ cluster }, { status: 201 })
    } catch (error) {
        if (error instanceof Error && error.message === 'Unauthorized') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }
        if (error instanceof Error && error.name === 'ZodError') {
            return NextResponse.json({ error: 'Validation failed', details: error }, { status: 400 })
        }
        return NextResponse.json({ error: 'Failed to create cluster' }, { status: 500 })
    }
}
