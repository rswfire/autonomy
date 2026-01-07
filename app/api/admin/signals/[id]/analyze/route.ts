// app/api/admin/signals/[id]/analyze/route.ts
import { NextRequest, NextResponse } from 'next/server'
import {requireAuthAPI} from '@/lib/utils/auth'
import { prisma } from '@/lib/db'
import { AnalysisService } from '@/lib/services/analysis'

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await requireAuthAPI()
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { id } = await params

        // Get signal and verify ownership
        const signal = await prisma.signal.findUnique({
            where: { signal_id: id },
            include: { realm: true },
        })

        if (!signal) {
            return NextResponse.json({ error: 'Signal not found' }, { status: 404 })
        }

        if (signal.realm.user_id !== user.user_id) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        // Run analysis
        const analysisService = new AnalysisService()
        const fields = await analysisService.analyze(signal, signal.realm_id)

        if (!fields) {
            return NextResponse.json({ error: 'Analysis failed' }, { status: 500 })
        }

        // Update signal with analysis results
        const updated = await prisma.signal.update({
            where: { signal_id: id },
            data: fields,
        })

        return NextResponse.json({
            success: true,
            fields: Object.keys(fields),
        })
    } catch (error) {
        console.error('Analysis API error:', error)
        return NextResponse.json(
            { error: 'Analysis failed' },
            { status: 500 }
        )
    }
}
