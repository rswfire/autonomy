// app/api/admin/signals/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { updateSignalSchema } from '@/lib/validation/signal'
import { getSignalById, updateSignal, deleteSignal } from '@/lib/queries/signal'
import { requireAuthAPI } from '@/lib/utils/auth'
import { db } from '@/lib/db'

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const params = await context.params

    try {
        const user = await requireAuthAPI()
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

        // Fetch existing signal for history and annotations
        const existing = await db.signal.findUnique({
            where: { signal_id: params.id },
        })

        if (!existing) {
            return NextResponse.json({ error: 'Signal not found' }, { status: 404 })
        }

        // Track which fields are being changed
        const fieldsChanged: string[] = []
        const previousValues: Record<string, any> = {}

        // Check each field in body against existing
        for (const key of Object.keys(body)) {
            if (key === 'signal_id' || key === 'new_annotation' || key === 'trigger_synthesis') {
                continue
            }

            const existingValue = (existing as any)[key]
            const newValue = body[key]

            // Compare values (handle nulls and undefined)
            const isDifferent = JSON.stringify(existingValue) !== JSON.stringify(newValue)

            if (isDifferent) {
                fieldsChanged.push(key)
                previousValues[key] = existingValue
            }
        }

        // Add update history entry
        const historyEntry = {
            type: 'user_edit',
            timestamp: new Date().toISOString(),
            trigger: 'user_edit' as const,
            fields_changed: fieldsChanged,
            previous_values: previousValues,
            user_id: user.user_id,
        }

        const existingHistory = ((existing.signal_history as any[]) || [])
            .filter((entry: any) => {
                // Must be an object
                if (!entry || typeof entry !== 'object') return false
                // Must have timestamp
                if (!entry.timestamp) return false
                // Must have type OR trigger (for backwards compatibility)
                if (!entry.type && !entry.trigger) return false
                return true
            })

        body.signal_history = [
            ...existingHistory,
            historyEntry
        ]

        // Handle annotation addition
        if (body.new_annotation?.trim()) {
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

            // Add annotation-specific history entry
            body.signal_history.push({
                type: 'user_annotation',
                timestamp: new Date().toISOString(),
                trigger: 'user_annotation' as const,
                fields_changed: ['signal_annotations'],
                previous_values: {
                    signal_annotations: existing.signal_annotations
                },
                user_id: user.user_id,
            })

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
        const user = await requireAuthAPI()
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
