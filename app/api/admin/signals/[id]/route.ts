// app/api/admin/signals/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getSignalById, updateSignal, deleteSignal } from '@/lib/queries/signal'
import { updateSignalSchema } from '@/lib/validation/signal'
import { requireAuthAPI  } from '@/lib/utils/auth'
import db from "@/lib/db";

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const params = await context.params

    try {
        const user = await requireAuthAPI ()
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
        const user = await requireAuthAPI()
        const body = await request.json()

        // Handle annotation addition
        if (body.new_annotation?.trim()) {
            const existing = await db.signal.findUnique({
                where: { signal_id: params.id },
                select: { signal_annotations: true, signal_history: true }
            })

            if (!existing) {
                return NextResponse.json({ error: 'Signal not found' }, { status: 404 })
            }

            // Add new annotation
            const existingAnnotations = (existing.signal_annotations as any) || { user_notes: [] }
            body.signal_annotations = {
                ...existingAnnotations,
                user_notes: [
                    ...(existingAnnotations.user_notes || []),
                    {
                        timestamp: new Date().toISOString(),
                        note: body.new_annotation.trim(),
                        user_id: user.user_id,
                    }
                ]
            }

            // Add history entry
            const historyEntry = {
                timestamp: new Date().toISOString(),
                action: 'annotation_added',
                field: 'signal_annotations',
                user_id: user.user_id,
            }
            body.signal_history = [
                ...((existing.signal_history as any) || []),
                historyEntry
            ]

            // TODO: Queue synthesis job when Phase 4 is ready
            // await queueSynthesis({ signal_id: params.id, reason: 'annotation_added' })

            delete body.new_annotation
            delete body.trigger_synthesis
        }

        const dataWithId = {
            signal_id: params.id,
            ...body
        }

        const validated = updateSignalSchema.parse(dataWithId)
        const signal = await updateSignal(validated, user.user_id)

        return NextResponse.json({ signal })
    } catch (error: any) {
        if (error instanceof Error && error.message === 'Unauthorized') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        if (error instanceof Error && error.name === 'ZodError') {
            return NextResponse.json(
                { error: 'Validation failed', details: error },
                { status: 400 }
            )
        }

        return NextResponse.json(
            {
                error: 'Failed to update signal',
                message: error?.message,
                details: error?.stack
            },
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
        const user = await requireAuthAPI ()
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
