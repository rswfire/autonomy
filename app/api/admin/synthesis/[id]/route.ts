// app/api/admin/synthesis/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/utils/auth'
import { getSynthesisById, updateSynthesis, deleteSynthesis } from '@/lib/queries/synthesis'
import { updateSynthesisSchema } from '@/lib/validation/synthesis'

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const params = await context.params
    try {
        const user = await requireAuth()
        const synthesis = await getSynthesisById(params.id, user.user_id)

        if (!synthesis) {
            return NextResponse.json({ error: 'Synthesis not found' }, { status: 404 })
        }

        return NextResponse.json({ synthesis })
    } catch (error) {
        if (error instanceof Error && error.message === 'Unauthorized') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }
        return NextResponse.json({ error: 'Failed to fetch synthesis' }, { status: 500 })
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
        const validated = updateSynthesisSchema.parse({ synthesis_id: params.id, ...body })
        const synthesis = await updateSynthesis(validated, user.user_id)
        return NextResponse.json({ synthesis })
    } catch (error) {
        if (error instanceof Error && error.message === 'Unauthorized') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }
        if (error instanceof Error && error.name === 'ZodError') {
            return NextResponse.json({ error: 'Validation failed', details: error }, { status: 400 })
        }
        return NextResponse.json({ error: 'Failed to update synthesis' }, { status: 500 })
    }
}

export async function DELETE(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const params = await context.params
    try {
        const user = await requireAuth()
        await deleteSynthesis(params.id, user.user_id)
        return NextResponse.json({ success: true })
    } catch (error) {
        if (error instanceof Error && error.message === 'Unauthorized') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }
        return NextResponse.json({ error: 'Failed to delete synthesis' }, { status: 500 })
    }
}
