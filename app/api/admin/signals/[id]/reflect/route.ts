// app/api/admin/signals/[id]/reflect/route.ts
import {REFLECTION_TYPES} from "@/lib/constants/reflection";
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { ReflectionService } from '@/lib/services/reflection'

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: signalId } = await params
        const body = await request.json()
        const { realm_id, reflection_types } = body
        if (!realm_id || !reflection_types || !Array.isArray(reflection_types)) {
            return NextResponse.json(
                { error: 'Missing realm_id or reflection_types' },
                { status: 400 }
            )
        }

        // Validate reflection types
        const validTypes = [...REFLECTION_TYPES]
        const invalidTypes = reflection_types.filter(t => !validTypes.includes(t.toUpperCase()))
        if (invalidTypes.length > 0) {
            return NextResponse.json(
                { error: `Invalid reflection types: ${invalidTypes.join(', ')}` },
                { status: 400 }
            )
        }

        // Fetch signal with all analysis data
        const signal = await prisma.signal.findUnique({
            where: { signal_id: signalId },
            include: {
                realm: true,
            }
        })

        if (!signal) {
            return NextResponse.json(
                { error: 'Signal not found' },
                { status: 404 }
            )
        }

        if (signal.realm_id !== realm_id) {
            return NextResponse.json(
                { error: 'Signal does not belong to this realm' },
                { status: 403 }
            )
        }

        // Generate reflections
        const reflectionService = new ReflectionService()
        const results = await reflectionService.reflect(
            signal,
            realm_id,
            reflection_types
        )

        if (results.length === 0) {
            return NextResponse.json(
                { error: 'Failed to generate reflections' },
                { status: 500 }
            )
        }

        return NextResponse.json({
            success: true,
            reflections: results,
        })
    } catch (error) {
        console.error('Reflection API error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
