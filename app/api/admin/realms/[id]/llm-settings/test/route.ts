// app/api/admin/realms/[id]/llm-settings/test/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { requireAuthAPI } from '@/lib/utils/auth'

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await requireAuthAPI()
        const body = await req.json()
        const { provider, api_key, model } = body

        if (!api_key) {
            return NextResponse.json({ error: 'API key required' }, { status: 400 })
        }

        if (!provider) {
            return NextResponse.json({ error: 'Provider required' }, { status: 400 })
        }

        // Route to correct provider
        if (provider === 'claude') {
            return await testClaude(api_key, model)
        } else if (provider === 'openai') {
            return await testOpenAI(api_key, model)
        } else {
            return NextResponse.json({ error: 'Provider not supported yet' }, { status: 400 })
        }
    } catch (error) {
        console.error('LLM test error:', error)
        const message = error instanceof Error ? error.message : 'Connection test failed'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}

async function testClaude(apiKey: string, model?: string) {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
            'content-type': 'application/json',
        },
        body: JSON.stringify({
            model: model || 'claude-sonnet-4-20250514',
            max_tokens: 50,
            messages: [
                {
                    role: 'user',
                    content: 'Test connection. Respond with: "Connection successful"',
                },
            ],
        }),
    })

    if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Claude API error: ${response.status} - ${errorText}`)
    }

    const json = await response.json()

    return NextResponse.json({
        success: true,
        model: json.model,
        output: json.content?.[0]?.text || 'Test successful',
    })
}

async function testOpenAI(apiKey: string, model?: string) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: model || 'gpt-4',
            max_tokens: 50,
            messages: [
                {
                    role: 'user',
                    content: 'Test connection. Respond with: "Connection successful"',
                },
            ],
        }),
    })

    if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`OpenAI API error: ${response.status} - ${errorText}`)
    }

    const json = await response.json()

    return NextResponse.json({
        success: true,
        model: json.model,
        output: json.choices?.[0]?.message?.content || 'Test successful',
    })
}
