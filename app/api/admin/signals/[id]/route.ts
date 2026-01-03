// app/api/admin/signals/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getSignalById, updateSignal, deleteSignal } from '@/lib/queries/signal'
import { updateSignalSchema } from '@/lib/validation/signal'
import { requireAuth } from '@/lib/utils/auth'

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const params = await context.params

    try {
        const user = await requireAuth()
        const signal = await getSignalById(params.id, user.user_id)

        if (!signal) {
            return NextResponse.json(
                { error: 'Signal not found' },
                { status: 404 }
            )
        }

        return NextResponse.json({ signal })
    } catch (error) {
        if (error instanceof Error && error.message === 'Unauthorized') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }
        console.error('Error fetching signal:', error)
        return NextResponse.json(
            { error: 'Failed to fetch signal' },
            { status: 500 }
        )
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

        const dataWithId = {
            signal_id: params.id,
            ...body
        }

        const validated = updateSignalSchema.parse(dataWithId)
        const signal = await updateSignal(validated, user.user_id)

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

        console.error('Error updating signal:', error)
        return NextResponse.json(
            { error: 'Failed to update signal' },
            { status: 500 }
        )
    }
}

export async function DELETE(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const params = await context.params

    try {
        const user = await requireAuth()
        await deleteSignal(params.id, user.user_id)

        return NextResponse.json({ success: true })
    } catch (error) {
        if (error instanceof Error && error.message === 'Unauthorized') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }
        console.error('Error deleting signal:', error)
        return NextResponse.json(
            { error: 'Failed to delete signal' },
            { status: 500 }
        )
    }
}
