// lib/services/model-router.ts

interface ModelResponse {
    model: string
    output: string
}

interface LlmMessage {
    role: 'user' | 'assistant'
    content: string
}

interface ClaudeApiResponse {
    id: string
    model: string
    content: Array<{
        type: string
        text: string
    }>
    usage?: {
        input_tokens: number
        output_tokens: number
    }
}

interface OpenAiApiResponse {
    id: string
    model: string
    choices: Array<{
        message: {
            role: string
            content: string
        }
    }>
    usage?: {
        prompt_tokens: number
        completion_tokens: number
    }
}

export class ModelRouter {
    /**
     * Generate completion from specified model
     */
    async generate(
        model: string,
        userPrompt: string,
        systemPrompt?: string
    ): Promise<ModelResponse> {
        switch (model) {
            case 'claude':
                return this.callClaude(systemPrompt || '', userPrompt)

            // Future: Add OpenAI, local models, etc.
            // case 'gpt-4':
            //     return this.callOpenAI(userPrompt, systemPrompt)

            default:
                throw new Error(`Unknown model: ${model}`)
        }
    }

    /**
     * Call Claude API (Anthropic)
     */
    private async callClaude(
        systemPrompt: string,
        userPrompt: string
    ): Promise<ModelResponse> {
        const apiKey = process.env.CLAUDE_API_KEY

        if (!apiKey) {
            throw new Error('CLAUDE_API_KEY not set in environment')
        }

        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01',
                'content-type': 'application/json',
            },
            body: JSON.stringify({
                model: 'claude-sonnet-4-20250514',
                max_tokens: 8192,
                temperature: 0.5,
                system: systemPrompt,
                messages: [
                    {
                        role: 'user',
                        content: userPrompt,
                    },
                ] as LlmMessage[],
            }),
        })

        if (!response.ok) {
            const errorText = await response.text()
            console.error('Claude API error:', errorText)
            throw new Error(`Claude API error: ${response.status} - ${errorText}`)
        }

        const json = (await response.json()) as ClaudeApiResponse

        if (!json.content?.[0]?.text) {
            throw new Error('Claude response missing text content')
        }

        return {
            model: json.model || 'claude-sonnet-4-20250514',
            output: json.content[0].text,
        }
    }

    /**
     * Placeholder for OpenAI
     */
    private async callOpenAI(
        userPrompt: string,
        systemPrompt?: string
    ): Promise<ModelResponse> {
        const apiKey = process.env.OPENAI_API_KEY

        if (!apiKey) {
            throw new Error('OPENAI_API_KEY not set in environment')
        }

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'gpt-4',
                messages: [
                    ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
                    { role: 'user', content: userPrompt },
                ],
            }),
        })

        if (!response.ok) {
            const errorText = await response.text()
            console.error('OpenAI API error:', errorText)
            throw new Error(`OpenAI API error: ${response.status} - ${errorText}`)
        }

        const json = (await response.json()) as OpenAiApiResponse

        if (!json.choices?.[0]?.message?.content) {
            throw new Error('OpenAI response missing content')
        }

        return {
            model: json.model || 'gpt-4',
            output: json.choices[0].message.content,
        }
    }

    /**
     * Placeholder for local models (Ollama, vLLM, etc.)
     */
    private async callLocal(
        model: string,
        userPrompt: string,
        systemPrompt?: string
    ): Promise<ModelResponse> {
        throw new Error('Local model integration not yet implemented')
    }
}
