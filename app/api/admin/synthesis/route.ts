// app/api/admin/synthesis/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/utils/auth'
import { querySynthesis, createSynthesis } from '@/lib/queries/synthesis'
import { createSynthesisSchema } from '@/lib/validation/synthesis'

export async function GET(request: NextRequest) {
    try {
        const user = await requireAuth()
        const { synthesis } = await querySynthesis({
            limit: 100,
            offset: 0,
            sort_order: 'desc',
        }, user.user_id)
        return NextResponse.json({ synthesis })
    } catch (error) {
        if (error instanceof Error && error.message === 'Unauthorized') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }
        return NextResponse.json({ error: 'Failed to fetch synthesis' }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        const user = await requireAuth()
        const body = await request.json()
        const validated = createSynthesisSchema.parse(body)
        const synthesis = await createSynthesis(validated, user.user_id)
        return NextResponse.json({ synthesis }, { status: 201 })
    } catch (error) {
        if (error instanceof Error && error.message === 'Unauthorized') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }
        if (error instanceof Error && error.name === 'ZodError') {
            return NextResponse.json({ error: 'Validation failed', details: error }, { status: 400 })
        }
        return NextResponse.json({ error: 'Failed to create synthesis' }, { status: 500 })
    }
}
