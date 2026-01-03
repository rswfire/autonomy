// app/api/admin/signals/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { querySignals, createSignal } from '@/lib/queries/signal'
import { createSignalSchema } from '@/lib/validation/signal'
import { requireAuth } from '@/lib/utils/auth'

export async function GET(request: NextRequest) {
    try {
        const user = await requireAuth()
        const { signals } = await querySignals(
            {
                limit: 100,
                offset: 0,
                sort_order: 'desc',
            },
            user.user_id
        )
        return NextResponse.json({ signals })
    } catch (error) {
        if (error instanceof Error && error.message === 'Unauthorized') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }
        console.error('Error fetching signals:', error)
        return NextResponse.json(
            { error: 'Failed to fetch signals' },
            { status: 500 }
        )
    }
}

export async function POST(request: NextRequest) {
    try {
        const user = await requireAuth()
        const body = await request.json()

        const validated = createSignalSchema.parse(body)
        const signal = await createSignal(validated, user.user_id)

        return NextResponse.json({ signal }, { status: 201 })
    } catch (error) {
        if (error instanceof Error && error.message === 'Unauthorized') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        if (error instanceof Error && error.name === 'ZodError') {
            return NextResponse.json(
                { error: 'Validation failed', details: error },
                { status: 400 }
            )
        }

        console.error('Error creating signal:', error)
        return NextResponse.json(
            { error: 'Failed to create signal' },
            { status: 500 }
        )
    }
}
