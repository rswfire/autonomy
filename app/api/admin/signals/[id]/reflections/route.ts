// app/api/admin/signals/[id]/reflections/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: signalId } = await params
        const reflections = await prisma.reflection.findMany({
            where: {
                polymorphic_id: signalId,
                polymorphic_type: 'signal',
            },
            orderBy: {
                stamp_created: 'desc',
            },
        })

        return NextResponse.json({
            success: true,
            reflections,
        })
    } catch (error) {
        console.error('Failed to fetch reflections:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
