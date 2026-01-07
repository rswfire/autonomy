// lib/services/model-router.ts

interface ModelResponse {
    content: string
    usage?: {
        input_tokens?: number
        output_tokens?: number
        total_tokens?: number
    }
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
        total_tokens: number
    }
}

interface LlmAccount {
    id: string
    name: string
    provider: 'claude' | 'openai' | 'local'
    api_key: string
    model: string
    enabled: boolean
}

export class ModelRouter {
    /**
     * Generate completion using account details
     */
    async generate(
        account: LlmAccount,
        userPrompt: string,
        systemPrompt?: string
    ): Promise<ModelResponse> {
        if (!account.enabled) {
            throw new Error('LLM account is disabled')
        }

        switch (account.provider) {
            case 'claude':
                return this.callClaude(account, systemPrompt || '', userPrompt)

            case 'openai':
                return this.callOpenAI(account, userPrompt, systemPrompt)

            case 'local':
                return this.callLocal(account, userPrompt, systemPrompt)

            default:
                throw new Error(`Unknown provider: ${account.provider}`)
        }
    }

    /**
     * Call Claude API (Anthropic)
     */
    private async callClaude(
        account: LlmAccount,
        systemPrompt: string,
        userPrompt: string
    ): Promise<ModelResponse> {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'x-api-key': account.api_key,
                'anthropic-version': '2023-06-01',
                'content-type': 'application/json',
            },
            body: JSON.stringify({
                model: account.model,
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
            content: json.content[0].text,
            usage: json.usage ? {
                input_tokens: json.usage.input_tokens,
                output_tokens: json.usage.output_tokens,
                total_tokens: json.usage.input_tokens + json.usage.output_tokens,
            } : undefined,
        }
    }

    /**
     * Call OpenAI API
     */
    private async callOpenAI(
        account: LlmAccount,
        userPrompt: string,
        systemPrompt?: string
    ): Promise<ModelResponse> {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${account.api_key}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: account.model,
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
            content: json.choices[0].message.content,
            usage: json.usage,
        }
    }

    /**
     * Call local model (Ollama, vLLM, etc.)
     */
    private async callLocal(
        account: LlmAccount,
        userPrompt: string,
        systemPrompt?: string
    ): Promise<ModelResponse> {
        // Assuming Ollama-compatible API
        const response = await fetch('http://localhost:11434/api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: account.model,
                prompt: systemPrompt ? `${systemPrompt}\n\n${userPrompt}` : userPrompt,
                stream: false,
            }),
        })

        if (!response.ok) {
            const errorText = await response.text()
            console.error('Local model API error:', errorText)
            throw new Error(`Local model API error: ${response.status} - ${errorText}`)
        }

        const json = await response.json()

        if (!json.response) {
            throw new Error('Local model response missing content')
        }

        return {
            content: json.response,
        }
    }
}
