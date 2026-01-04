// app/api/admin/signals/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createSignalSchema } from '@/lib/validation/signal'
import { createSignal, querySignals } from '@/lib/queries/signal'
import { requireAuthAPI } from '@/lib/utils/auth'
import { ulidFromDate, ulid } from '@/lib/utils/ulid'

export async function GET(request: NextRequest) {
    const user = await requireAuthAPI()
    const { searchParams } = new URL(request.url)

    const filter = {
        signal_type: searchParams.get('signal_type') as 'DOCUMENT' | 'PHOTO' | 'TRANSMISSION' | 'CONVERSATION' | undefined,
        signal_status: searchParams.get('signal_status') as 'ACTIVE' | 'PENDING' | 'REJECTED' | 'FAILED' | 'ARCHIVED' | undefined,
        signal_visibility: searchParams.get('signal_visibility') as 'PUBLIC' | 'PRIVATE' | 'SANCTUM' | 'SHARED' | undefined,
        limit: parseInt(searchParams.get('limit') || '10'),
        offset: parseInt(searchParams.get('offset') || '0'),
        sort_by: (searchParams.get('sort_by') || 'stamp_created') as 'stamp_created' | 'stamp_updated' | 'stamp_imported' | 'signal_title' | 'signal_temperature' | undefined,
        sort_order: (searchParams.get('sort_order') || 'desc') as 'asc' | 'desc',
    }

    const signals = await querySignals(filter, user.user_id)
    return NextResponse.json(signals)
}


export async function POST(request: NextRequest) {
    try {
        const user = await requireAuthAPI()
        const body = await request.json()

        // Generate ULID from stamp_created timestamp
        const signalId = body.stamp_created
            ? ulidFromDate(new Date(body.stamp_created))
            : ulid()

        // Add creation history entry
        const historyEntry = {
            timestamp: new Date().toISOString(),
            action: 'created',
            user_id: user.user_id,
        }

        const dataWithId = {
            signal_id: signalId,
            ...body,
            signal_history: [historyEntry],
        }

        const validated = createSignalSchema.parse(dataWithId)
        const signal = await createSignal(validated, user.user_id)

        return NextResponse.json({ signal })
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
