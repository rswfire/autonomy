// lib/services/reflection.ts
import { ModelRouter } from './model-router'
import { getDefaultLlmAccount, getLlmAccount, getRealmLlmSettings } from '@/lib/utils/realm-settings'
import { prisma } from '@/lib/db'
import fs from 'fs/promises'
import path from 'path'
import { ulid } from 'ulid'

interface ReflectionResult {
    reflection_id: string
    reflection_type: string
    reflection_content: string
}

export class ReflectionService {
    private router: ModelRouter

    constructor() {
        this.router = new ModelRouter()
    }

    /**
     * Generate reflections for a signal
     * @param signal The signal to reflect on
     * @param realmId The realm ID
     * @param reflectionTypes Array of reflection types to generate (MIRROR, MYTH, NARRATIVE)
     * @param accountId Optional specific LLM account to use
     */
    public async reflect(
        signal: any,
        realmId: string,
        reflectionTypes: string[],
        accountId?: string
    ): Promise<ReflectionResult[]> {
        try {
            // Get LLM account
            const account = accountId
                ? await getLlmAccount(realmId, accountId)
                : await getDefaultLlmAccount(realmId)

            if (!account || !account.enabled) {
                console.error('No enabled LLM account found')
                return []
            }

            // Load realm settings for context
            const settings = await getRealmLlmSettings(realmId)
            const realmContext = (settings as any)?.realm_context || ''

            // Load shared prompts
            const invocation = await this.loadPrompt('invocation.md')
            const realmPrompt = await this.loadPrompt('realm.md')

            const results: ReflectionResult[] = []

            // Generate each reflection type
            for (const reflectionType of reflectionTypes) {
                try {
                    const result = await this.generateReflection(
                        signal,
                        reflectionType.toLowerCase(),
                        account,
                        invocation,
                        realmPrompt,
                        realmContext,
                        settings.realm_holder_name || 'the realm holder'
                    )

                    if (result) {
                        results.push(result)
                    }
                } catch (error) {
                    console.error(`Failed to generate ${reflectionType} reflection:`, error)
                    await this.logReflectionError(signal.signal_id, reflectionType, error)
                }
            }

            return results
        } catch (error) {
            console.error('Reflection error:', error)
            return []
        }
    }

    private async generateReflection(
        signal: any,
        reflectionType: string,
        account: any,
        invocation: string,
        realmPrompt: string,
        realmContext: string,
        realmHolderName: string
    ): Promise<ReflectionResult | null> {
        console.log(`Generating ${reflectionType} reflection...`)

        // Load reflection-specific prompts
        const systemPrompt = await this.loadPrompt(`${reflectionType}/system.md`)
        const userPrompt = await this.loadPrompt(`${reflectionType}/user.md`)

        // Build complete signal context including analysis data
        const signalContext = this.buildSignalContext(signal)
        const annotations = signal.signal_annotations?.user_notes?.length > 0
            ? `\n## User Notes\n${signal.signal_annotations.user_notes.map((note: any) =>
                `- ${note.note} (${new Date(note.timestamp).toLocaleDateString()})`
            ).join('\n')}\n`
            : ''

        // Build full system prompt
        const fullSystemPrompt = [
            invocation,
            realmPrompt
                .replace('{{realm_context}}', realmContext)
                .replace('{{realm_holder_name}}', realmHolderName),
            systemPrompt
        ].join('\n\n')

        // Build full user prompt with all signal data
        const fullUserPrompt = userPrompt
            .replace('{{signal_type}}', signal.signal_type)
            .replace('{{signal_context}}', signal.signal_context || 'CAPTURE')
            .replace('{{signal_title}}', signal.signal_title)
            .replace('{{signal_summary}}', signal.signal_summary || '')
            .replace('{{signal_date}}', signal.stamp_created?.toISOString() || new Date().toISOString())
            .replace('{{signal_annotations}}', annotations)
            .replace('{{surface_data}}', this.buildSurfaceData(signal))
            .replace('{{structure_data}}', this.buildStructureData(signal))
            .replace('{{signal_content}}', signalContext)

        // Generate reflection
        const response = await this.router.generate(
            account,
            fullUserPrompt,
            fullSystemPrompt
        )

        const reflectionContent = response.content.trim()

        // Create reflection record
        const reflectionId = ulid()
        await prisma.reflection.create({
            data: {
                reflection_id: reflectionId,
                realm_id: signal.realm_id,
                reflection_type: reflectionType.toUpperCase(),
                reflection_source: account.id,
                polymorphic_id: signal.signal_id,
                polymorphic_type: 'signal',
                reflection_content: reflectionContent,
                reflection_history: [
                    {
                        timestamp: new Date().toISOString(),
                        type: 'reflection_generated',
                        reflection_type: reflectionType.toUpperCase(),
                        account_id: account.id,
                        model: account.model,
                        system_prompt: fullSystemPrompt,
                        user_prompt: fullUserPrompt,
                        response: reflectionContent,
                        tokens: response.usage?.total_tokens || null,
                    }
                ] as any,
                stamp_created: new Date(),
            }
        })

        console.log(`${reflectionType} reflection generated:`, reflectionId)

        return {
            reflection_id: reflectionId,
            reflection_type: reflectionType.toUpperCase(),
            reflection_content: reflectionContent,
        }
    }

    private buildSignalContext(signal: any): string {
        const parts: string[] = []

        // Add main content based on signal type
        if (signal.signal_type === 'TRANSMISSION' && signal.signal_payload?.transcript) {
            parts.push('## TRANSCRIPT\n\n' + signal.signal_payload.transcript)
        } else if (signal.signal_payload?.content) {
            parts.push('## CONTENT\n\n' + signal.signal_payload.content)
        }

        return parts.join('\n\n')
    }

    private buildSurfaceData(signal: any): string {
        const parts: string[] = []

        if (signal.signal_environment) {
            parts.push(`**Environment:** ${signal.signal_environment}`)
        }

        if (signal.signal_temperature !== null && signal.signal_temperature !== undefined) {
            parts.push(`**Temperature:** ${signal.signal_temperature}`)
        }

        if (signal.signal_density !== null && signal.signal_density !== undefined) {
            parts.push(`**Density:** ${signal.signal_density}`)
        }

        if (signal.signal_actions && Array.isArray(signal.signal_actions) && signal.signal_actions.length > 0) {
            parts.push(`**Actions:** ${signal.signal_actions.join(', ')}`)
        }

        if (signal.signal_entities && Array.isArray(signal.signal_entities) && signal.signal_entities.length > 0) {
            const entities = signal.signal_entities.map((e: any) => `${e.name} (${e.type})`).join(', ')
            parts.push(`**Entities:** ${entities}`)
        }

        if (signal.signal_tags && Array.isArray(signal.signal_tags) && signal.signal_tags.length > 0) {
            parts.push(`**Tags:** ${signal.signal_tags.join(', ')}`)
        }

        return parts.length > 0 ? parts.join('\n') : 'No surface data available.'
    }

    private buildStructureData(signal: any): string {
        const parts: string[] = []

        if (signal.signal_energy) {
            parts.push(`**Energy:** ${signal.signal_energy}`)
        }

        if (signal.signal_state) {
            parts.push(`**State:** ${signal.signal_state}`)
        }

        if (signal.signal_orientation) {
            parts.push(`**Orientation:** ${signal.signal_orientation}`)
        }

        if (signal.signal_substrate) {
            parts.push(`**Substrate:** ${signal.signal_substrate}`)
        }

        if (signal.signal_ontological_states && Array.isArray(signal.signal_ontological_states) && signal.signal_ontological_states.length > 0) {
            parts.push(`**Ontological States:** ${signal.signal_ontological_states.join(', ')}`)
        }

        if (signal.signal_symbolic_elements && Array.isArray(signal.signal_symbolic_elements) && signal.signal_symbolic_elements.length > 0) {
            parts.push(`**Symbolic Elements:** ${signal.signal_symbolic_elements.join(', ')}`)
        }

        if (signal.signal_subsystems && Array.isArray(signal.signal_subsystems) && signal.signal_subsystems.length > 0) {
            parts.push(`**Subsystems:** ${signal.signal_subsystems.join(', ')}`)
        }

        if (signal.signal_dominant_language && Array.isArray(signal.signal_dominant_language) && signal.signal_dominant_language.length > 0) {
            parts.push(`**Dominant Language:** ${signal.signal_dominant_language.join(', ')}`)
        }

        return parts.length > 0 ? parts.join('\n') : 'No structure data available.'
    }

    private async loadPrompt(filename: string): Promise<string> {
        const filePath = path.join(process.cwd(), 'lib', 'prompts', 'reflect', filename)
        return await fs.readFile(filePath, 'utf-8')
    }

    private async logReflectionError(signalId: string, reflectionType: string, error: any): Promise<void> {
        try {
            const message = error instanceof Error ? error.message : 'Unknown error'
            console.error(`Reflection error for ${reflectionType}:`, message)
            // Could log to signal_history or separate error tracking
        } catch (err) {
            console.error('Failed to log reflection error:', err)
        }
    }
}
