// app/api/signals/[id]/reflections/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        console.log('ROUTE HIT')
        const { id } = await params
        console.log('Signal ID:', id)

        const reflections = await prisma.reflection.findMany({
            where: {
                polymorphic_id: id,
                polymorphic_type: 'signal',
            },
            orderBy: {
                stamp_created: 'desc',
            },
        })

        console.log('Found reflections:', reflections.length)

        return NextResponse.json({
            success: true,
            reflections,
        })
    } catch (error) {
        console.error('ROUTE ERROR:', error)
        return NextResponse.json(
            { error: String(error) },
            { status: 500 }
        )
    }
}
