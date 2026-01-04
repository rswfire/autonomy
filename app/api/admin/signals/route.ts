// app/api/admin/signals/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { querySignals, createSignal } from '@/lib/queries/signal'
import { createSignalSchema } from '@/lib/validation/signal'
import { requireAuthAPI  } from '@/lib/utils/auth'

export async function GET(request: NextRequest) {
    try {
        const user = await requireAuthAPI ()
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
        const user = await requireAuthAPI()
        const body = await request.json()

        // ADD THIS LOGGING
        console.log('📥 Received signal data:', JSON.stringify(body, null, 2))

        const validated = createSignalSchema.parse(body)

        // ADD THIS TOO
        console.log('✅ Validation passed')

        const signal = await createSignal(validated, user.user_id)

        return NextResponse.json({ signal })
    } catch (error: any) {
        if (error instanceof Error && error.message === 'Unauthorized') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        if (error?.name === 'ZodError') {
            console.error('Zod validation details:', JSON.stringify(error.issues, null, 2))
            return NextResponse.json(
                { error: 'Validation failed', details: error.issues },
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
