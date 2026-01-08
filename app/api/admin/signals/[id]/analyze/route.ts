// app/api/admin/signals/[id]/analyze/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { requireAuthAPI } from '@/lib/utils/auth'
import { AnalysisService } from '@/lib/services/analysis'

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await requireAuthAPI()
        const { id: signalId } = await params
        const { realm_id, fields } = await req.json()

        if (!Array.isArray(fields) || fields.length === 0) {
            return NextResponse.json(
                { error: 'fields array required' },
                { status: 400 }
            )
        }

        const analysisService = new AnalysisService()
        const result = await analysisService.analyzeSelective(signalId, realm_id, fields)

        if (!result) {
            return NextResponse.json(
                { error: 'Analysis failed' },
                { status: 500 }
            )
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Analysis error:', error)
        return NextResponse.json(
            { error: 'Analysis failed' },
            { status: 500 }
        )
    }
}
