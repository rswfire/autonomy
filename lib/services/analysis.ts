// lib/services/analysis.ts
import { ModelRouter } from './model-router'
import { getDefaultLlmAccount, getLlmAccount, getRealmLlmSettings } from '@/lib/utils/realm-settings'
import { prisma } from '@/lib/db'
import fs from 'fs/promises'
import path from 'path'

interface AnalysisFields {
    signal_title?: string | null
    signal_summary?: string | null
    signal_environment?: string | null
    signal_temperature?: number | null
    signal_density?: number | null
    signal_actions?: any
    signal_entities?: any
    signal_tags?: any
    signal_energy?: string | null
    signal_state?: string | null
    signal_orientation?: string | null
    signal_substrate?: string | null
    signal_ontological_states?: any
    signal_symbolic_elements?: any
    signal_subsystems?: any
    signal_dominant_language?: any
}

export class AnalysisService {
    private router: ModelRouter

    constructor() {
        this.router = new ModelRouter()
    }

    public async analyze(signal: any, realmId: string, accountId?: string): Promise<AnalysisFields | null> {
        try {
            // Get LLM account
            const account = accountId
                ? await getLlmAccount(realmId, accountId)
                : await getDefaultLlmAccount(realmId)

            if (!account || !account.enabled) {
                console.error('No enabled LLM account found')
                return null
            }

            // Load realm settings for context
            const settings = await getRealmLlmSettings(realmId)
            const realmContext = (settings as any)?.realm_context || ''

            // Load prompts
            const invocation = await this.loadPrompt('invocation.md')
            const realmPrompt = await this.loadPrompt('realm.md')
            const surfaceSystem = await this.loadPrompt('surface/system.md')
            const surfaceUser = await this.loadPrompt('surface/user.md')
            const surfaceQuestions = await this.loadQuestions('surface/questions.json')
            const structureSystem = await this.loadPrompt('structure/system.md')
            const structureUser = await this.loadPrompt('structure/user.md')
            const structureQuestions = await this.loadQuestions('structure/questions.json')

            // Build signal context
            const signalContext = this.buildSignalContext(signal)
            const annotations = signal.signal_annotations?.user_notes?.length > 0
                ? `\n**Annotations:**\n${signal.signal_annotations.user_notes.map((note: any) =>
                    `- ${note.note} (${new Date(note.timestamp).toLocaleDateString()})`
                ).join('\n')}\n\n*These are notes from the realm holder about this specific signal. Treat them as high-priority context.*\n`
                : ''

            // Build surface prompts
            const surfaceSystemPrompt = [
                invocation,
                realmPrompt.replace('{{realm_context}}', realmContext),
                surfaceSystem
            ].join('\n\n')

            const surfaceUserPrompt = surfaceUser
                .replace('{{signal_type}}', signal.signal_type)
                .replace('{{signal_title}}', signal.signal_title)
                .replace('{{signal_context}}', signal.signal_context || 'CAPTURE')
                .replace('{{signal_date}}', signal.stamp_created?.toISOString() || new Date().toISOString())
                .replace('{{signal_summary}}', signal.signal_summary || '')
                .replace('{{signal_annotations}}', annotations)
                .replace('{{signal_content}}', signalContext)
                .replace('{{questions}}', this.formatQuestions(surfaceQuestions))

            // Run surface analysis
            console.log('Running surface analysis...')
            let surfaceFields = {}
            let surfaceError = null
            let surfaceResponse = null

            try {
                surfaceResponse = await this.router.generate(
                    account,
                    surfaceUserPrompt,
                    surfaceSystemPrompt
                )
                surfaceFields = this.parseSurfaceResponse(surfaceResponse.content)
            } catch (error) {
                surfaceError = error instanceof Error ? error.message : 'Surface analysis failed'
                console.error('Surface analysis error:', error)
            }

            // Log surface analysis
            await this.logAnalysisHistory(signal.signal_id, {
                type: 'analysis_surface',
                timestamp: new Date().toISOString(),
                account_id: account.id,
                model: account.model,
                system_prompt: surfaceSystemPrompt,
                user_prompt: surfaceUserPrompt,
                response: surfaceResponse?.content || null,
                tokens: surfaceResponse?.usage?.total_tokens || null,
                fields_updated: Object.keys(surfaceFields),
                error: surfaceError,
            })

            // Build structure prompts
            const structureSystemPrompt = [
                invocation,
                realmPrompt.replace('{{realm_context}}', realmContext),
                structureSystem
            ].join('\n\n')

            const structureUserPrompt = structureUser
                .replace('{{signal_type}}', signal.signal_type)
                .replace('{{signal_title}}', signal.signal_title)
                .replace('{{signal_context}}', signal.signal_context || 'CAPTURE')
                .replace('{{signal_date}}', signal.stamp_created?.toISOString() || new Date().toISOString())
                .replace('{{signal_summary}}', signal.signal_summary || '')
                .replace('{{signal_annotations}}', annotations)
                .replace('{{signal_content}}', signalContext)
                .replace('{{questions}}', this.formatQuestions(structureQuestions))

            // Run structure analysis
            console.log('Running structure analysis...')
            let structureFields = {}
            let structureError = null
            let structureResponse = null

            try {
                structureResponse = await this.router.generate(
                    account,
                    structureUserPrompt,
                    structureSystemPrompt
                )
                structureFields = this.parseStructureResponse(structureResponse.content)
            } catch (error) {
                structureError = error instanceof Error ? error.message : 'Structure analysis failed'
                console.error('Structure analysis error:', error)
            }

            // Log structure analysis
            await this.logAnalysisHistory(signal.signal_id, {
                type: 'analysis_structure',
                timestamp: new Date().toISOString(),
                account_id: account.id,
                model: account.model,
                system_prompt: structureSystemPrompt,
                user_prompt: structureUserPrompt,
                response: structureResponse?.content || null,
                tokens: structureResponse?.usage?.total_tokens || null,
                fields_updated: Object.keys(structureFields),
                error: structureError,
            })

            // If both failed, return null
            if (surfaceError && structureError) {
                console.error('Both analysis passes failed')
                return null
            }

            const analysisFields = {
                ...surfaceFields,
                ...structureFields,
            }

            console.log('Analysis complete:', Object.keys(analysisFields))
            return analysisFields

        } catch (error) {
            console.error('Analysis error:', error)
            return null
        }
    }

    private async loadPrompt(filename: string): Promise<string> {
        const filePath = path.join(process.cwd(), 'lib', 'prompts', 'analyze', filename)
        return await fs.readFile(filePath, 'utf-8')
    }

    private async loadQuestions(filename: string): Promise<Record<string, string>> {
        const filePath = path.join(process.cwd(), 'lib', 'prompts', 'analyze', filename)
        const content = await fs.readFile(filePath, 'utf-8')
        return JSON.parse(content)
    }

    private formatQuestions(questions: Record<string, string>): string {
        return Object.entries(questions)
            .map(([key, question]) => `**${key}:** ${question}`)
            .join('\n\n')
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

    private parseSurfaceResponse(content: string): Partial<AnalysisFields> {
        try {
            const cleaned = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
            const parsed = JSON.parse(cleaned)

            return {
                signal_title: parsed.title || null,
                signal_summary: parsed.summary || null,
                signal_environment: parsed.environment || null,
                signal_temperature: parsed.temperature ? parseFloat(parsed.temperature) : null,
                signal_density: parsed.density ? parseFloat(parsed.density) : null,
                signal_actions: parsed.actions || null,
                signal_entities: parsed.entities || null,
                signal_tags: parsed.tags || null,
            }
        } catch (error) {
            console.error('Failed to parse surface response:', error)
            console.error('Content:', content)
            return {}
        }
    }

    private parseStructureResponse(content: string): Partial<AnalysisFields> {
        try {
            // Remove markdown code fences if present
            const cleaned = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
            const parsed = JSON.parse(cleaned)

            return {
                signal_energy: parsed.energy || null,
                signal_state: parsed.state || null,
                signal_orientation: parsed.orientation || null,
                signal_substrate: parsed.substrate || null,
                signal_ontological_states: parsed.ontological_states || null,
                signal_symbolic_elements: parsed.symbolic_elements || null,
                signal_subsystems: parsed.subsystems || null,
                signal_dominant_language: parsed.dominant_language || null,
            }
        } catch (error) {
            console.error('Failed to parse structure response:', error)
            console.error('Content:', content)
            return {}
        }
    }

    private async logAnalysisHistory(signalId: string, entry: any): Promise<void> {
        try {
            const signal = await prisma.signal.findUnique({
                where: { signal_id: signalId },
                select: { signal_history: true },
            })

            // Force it to be an array
            let history: any[] = []

            if (signal?.signal_history) {
                if (Array.isArray(signal.signal_history)) {
                    history = signal.signal_history
                } else {
                    // If it's an object or something else, wrap it in array
                    history = [signal.signal_history]
                }
            }

            history.push(entry)

            await prisma.signal.update({
                where: { signal_id: signalId },
                data: { signal_history: history as any },
            })

            console.log('Successfully logged analysis history')
        } catch (error) {
            console.error('Failed to log analysis history:', error)
            throw error
        }
    }
}
