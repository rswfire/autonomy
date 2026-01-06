// lib/services/analysis.ts

import { ModelRouter } from './model-router'
import { getLlmAccount, getDefaultLlmAccount } from '@/lib/utils/realm-settings'
import type { Signal } from '@prisma/client'

interface AnalysisFields {
    // Surface layer
    signal_actions: string[] | null
    signal_environment: string | null
    signal_entities: {
        people: string[] | null
        animals: string[] | null
        places: string[] | null
        infrastructure: string[] | null
        organizations: string[] | null
        concepts: string[] | null
        media: string[] | null
    } | null
    signal_density: number | null

    // Structural layer
    signal_energy: string | null
    signal_state: string | null
    signal_orientation: string | null
    signal_substrate: string | null
    signal_ontological_states: string[] | null
    signal_symbolic_elements: string[] | null
    signal_subsystems: string[] | null
    signal_dominant_language: string[] | null
}

export class AnalysisService {
    private router: ModelRouter

    constructor() {
        this.router = new ModelRouter()
    }

    /**
     * Generate analysis for a signal
     */
    async analyze(
        signal: Signal,
        realmId: string,
        accountId?: string
    ): Promise<AnalysisFields> {
        // Get LLM account (specified or default)
        const account = accountId
            ? await getLlmAccount(realmId, accountId)
            : await getDefaultLlmAccount(realmId)

        if (!account) {
            throw new Error('No LLM account configured')
        }

        if (!account.enabled) {
            throw new Error('LLM account is disabled')
        }

        // Temporarily set API key for this request
        const originalKey = process.env.CLAUDE_API_KEY
        process.env.CLAUDE_API_KEY = account.api_key

        try {
            const { system, user } = this.buildPrompt(signal)
            const response = await this.router.generate(account.provider, user, system)

            return this.parseResponse(response.output)
        } finally {
            // Restore original key
            process.env.CLAUDE_API_KEY = originalKey
        }
    }

    /**
     * Build prompt from signal data
     */
    private buildPrompt(signal: Signal): { system: string; user: string } {
        const system = this.getSystemPrompt()
        const user = this.getUserPrompt(signal)

        return { system, user }
    }

    /**
     * System prompt for analysis
     */
    private getSystemPrompt(): string {
        return `You are an analysis engine for lived data signals. Your role is to extract surface and structural metadata from documented reality.

SURFACE LAYER - Observable elements:
- Actions: Concrete, visible activities
- Environment: Context at time of creation
- Entities: People, places, infrastructure, organizations, concepts, media
- Density: Recursion/complexity metric (-1.0 to 1.0)

STRUCTURAL LAYER - Underlying patterns:
- Energy: Energetic state (methodical, resolute, exhausted, etc.)
- State: Life/project state (infrastructure-building, crisis, integration, etc.)
- Orientation: Directional facing (toward sovereignty, toward extraction, etc.)
- Substrate: Foundational structure underlying the signal
- Ontological States: Being-states (sovereign, embedded, coherent, pressured, etc.)
- Symbolic Elements: Recurring motifs (mirror, trail, extraction, container, etc.)
- Subsystems: Engaged systems (cognitive, relational, infrastructural, ethical, etc.)
- Dominant Language: Semantic field shaping the signal

Respond ONLY with valid JSON matching this exact structure:
{
  "signal_actions": ["action1", "action2"],
  "signal_environment": "context description",
  "signal_entities": {
    "people": ["name1", "name2"],
    "animals": ["animal1"],
    "places": ["place1", "place2"],
    "infrastructure": ["platform1", "system1"],
    "organizations": ["org1"],
    "concepts": ["concept1", "concept2"],
    "media": ["book1", "article1"]
  },
  "signal_density": 0.5,
  "signal_energy": "methodical",
  "signal_state": "infrastructure-building",
  "signal_orientation": "toward sovereignty",
  "signal_substrate": "structural foundation description",
  "signal_ontological_states": ["sovereign", "embedded"],
  "signal_symbolic_elements": ["mirror", "trail"],
  "signal_subsystems": ["cognitive", "infrastructural"],
  "signal_dominant_language": ["sovereignty", "infrastructure"]
}

Use null for any field that doesn't apply. Be precise and honest. Do not invent data.`
    }

    /**
     * User prompt with signal data
     */
    private getUserPrompt(signal: Signal): string {
        const payload = signal.signal_payload as any
        const metadata = signal.signal_metadata as any

        let content = ''

        // Add title and summary
        content += `TITLE: ${signal.signal_title}\n`
        if (signal.signal_summary) {
            content += `SUMMARY: ${signal.signal_summary}\n`
        }
        content += `DATE: ${signal.stamp_created}\n`
        content += `TYPE: ${signal.signal_type}\n`
        if (signal.signal_context) {
            content += `CONTEXT: ${signal.signal_context}\n`
        }
        content += '\n'

        // Add type-specific content
        if (signal.signal_type === 'DOCUMENT' && payload?.content) {
            content += `CONTENT:\n${payload.content}\n`
        } else if (signal.signal_type === 'TRANSMISSION' && payload?.transcript) {
            content += `TRANSCRIPT:\n${payload.transcript}\n`
        } else if (signal.signal_type === 'CONVERSATION' && payload?.messages) {
            content += `CONVERSATION:\n`
            for (const msg of payload.messages) {
                content += `[${msg.role}]: ${msg.content}\n`
            }
        } else if (signal.signal_type === 'PHOTO') {
            content += `PHOTO METADATA:\n`
            if (metadata?.camera) content += `Camera: ${metadata.camera}\n`
            if (metadata?.timestamp_original) content += `Captured: ${metadata.timestamp_original}\n`
            if (signal.signal_summary) content += `Description: ${signal.signal_summary}\n`
        }

        content += '\n---\n\nAnalyze this signal and extract surface and structural metadata. Return ONLY valid JSON.'

        return content
    }

    /**
     * Parse LLM response into typed fields
     */
    private parseResponse(raw: string): AnalysisFields {
        // Remove markdown code fences if present
        let cleaned = raw.trim()
        cleaned = cleaned.replace(/^```json\s*/i, '')
        cleaned = cleaned.replace(/\s*```$/i, '')

        let parsed: any

        try {
            parsed = JSON.parse(cleaned)
        } catch (err) {
            // Try to extract JSON from response
            const jsonMatch = cleaned.match(/\{[\s\S]*\}/)
            if (jsonMatch) {
                parsed = JSON.parse(jsonMatch[0])
            } else {
                throw new Error('Failed to parse JSON from response')
            }
        }

        // Sanitize and validate
        return {
            signal_actions: this.sanitizeArray(parsed.signal_actions),
            signal_environment: this.sanitizeString(parsed.signal_environment),
            signal_entities: this.sanitizeEntities(parsed.signal_entities),
            signal_density: this.sanitizeNumber(parsed.signal_density),
            signal_energy: this.sanitizeString(parsed.signal_energy),
            signal_state: this.sanitizeString(parsed.signal_state),
            signal_orientation: this.sanitizeString(parsed.signal_orientation),
            signal_substrate: this.sanitizeString(parsed.signal_substrate),
            signal_ontological_states: this.sanitizeArray(parsed.signal_ontological_states),
            signal_symbolic_elements: this.sanitizeArray(parsed.signal_symbolic_elements),
            signal_subsystems: this.sanitizeArray(parsed.signal_subsystems),
            signal_dominant_language: this.sanitizeArray(parsed.signal_dominant_language),
        }
    }

    /**
     * Sanitize string field
     */
    private sanitizeString(value: any): string | null {
        if (!value || typeof value !== 'string') return null
        const trimmed = value.trim()
        return trimmed.length > 0 ? trimmed : null
    }

    /**
     * Sanitize array field
     */
    private sanitizeArray(value: any): string[] | null {
        if (!Array.isArray(value)) return null
        const cleaned = value
            .filter((item) => typeof item === 'string')
            .map((item) => item.trim())
            .filter((item) => item.length > 0)
        return cleaned.length > 0 ? cleaned : null
    }

    /**
     * Sanitize number field
     */
    private sanitizeNumber(value: any): number | null {
        if (value === null || value === undefined) return null
        const num = parseFloat(value)
        if (isNaN(num)) return null
        // Clamp to -1.0 to 1.0
        return Math.max(-1.0, Math.min(1.0, num))
    }

    /**
     * Sanitize entities object
     */
    private sanitizeEntities(value: any): AnalysisFields['signal_entities'] {
        if (!value || typeof value !== 'object') return null

        const sanitized = {
            people: this.sanitizeArray(value.people),
            animals: this.sanitizeArray(value.animals),
            places: this.sanitizeArray(value.places),
            infrastructure: this.sanitizeArray(value.infrastructure),
            organizations: this.sanitizeArray(value.organizations),
            concepts: this.sanitizeArray(value.concepts),
            media: this.sanitizeArray(value.media),
        }

        // Return null if all fields are null
        const hasAnyData = Object.values(sanitized).some((arr) => arr !== null)
        return hasAnyData ? sanitized : null
    }
}
