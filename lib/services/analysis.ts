// lib/services/analysis.ts
import { ModelRouter } from './model-router'
import { getDefaultLlmAccount, getLlmAccount, getRealmLlmSettings } from '@/lib/utils/realm-settings'
import { prisma } from '@/lib/db'
import fs from 'fs/promises'
import path from 'path'
import type { SignalAnnotations } from '@/lib/types/signal'

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
                ? `\n*User notes about this signal (high-priority context):*\n${signal.signal_annotations.user_notes.map((note: any) =>
                    `- ${note.note} (${new Date(note.timestamp).toLocaleDateString()})`
                ).join('\n')}\n`
                : ''

            // Build surface prompts
            const surfaceSystemPrompt = [
                invocation,
                realmPrompt
                    .replace('{{realm_context}}', realmContext)
                    .replace('{{realm_holder_name}}', settings.realm_holder_name || 'the realm holder'),
                surfaceSystem
            ].join('\n\n')

            const surfaceUserPrompt = surfaceUser
                .replace('{{signal_type}}', signal.signal_type)
                .replace('{{signal_context}}', signal.signal_context || 'CAPTURE')
                .replace('{{signal_date}}', signal.stamp_created?.toISOString() || new Date().toISOString())
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
                realmPrompt
                    .replace('{{realm_context}}', realmContext)
                    .replace('{{realm_holder_name}}', settings.realm_holder_name || 'the realm holder'),
                structureSystem
            ].join('\n\n')

            const structureUserPrompt = structureUser
                .replace('{{signal_type}}', signal.signal_type)
                .replace('{{signal_context}}', signal.signal_context || 'CAPTURE')
                .replace('{{signal_date}}', signal.stamp_created?.toISOString() || new Date().toISOString())
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

    // lib/services/analysis.ts

    public async analyzeSelective(
        signalId: string,
        realmId: string,
        fields: string[]
    ): Promise<{ success: boolean; error?: string }> {
        try {
            console.log('Starting selective analysis:', { signalId, realmId, fields })

            const signal = await prisma.signal.findUnique({
                where: { signal_id: signalId },
            })

            if (!signal) {
                await this.logAnalysisHistory(signalId, {
                    type: 'analysis_selective_failed',
                    timestamp: new Date().toISOString(),
                    error: 'Signal not found',
                    fields_requested: fields,
                })
                return { success: false, error: 'Signal not found' }
            }

            // Determine which layers are needed
            const surfaceFields = [
                'signal_title', 'signal_summary', 'signal_environment',
                'signal_temperature', 'signal_density', 'signal_actions',
                'signal_entities', 'signal_tags'
            ]
            const structureFields = [
                'signal_energy', 'signal_state', 'signal_orientation',
                'signal_substrate', 'signal_ontological_states',
                'signal_symbolic_elements', 'signal_subsystems',
                'signal_dominant_language'
            ]

            const needsSurface = fields.some(f => surfaceFields.includes(f))
            const needsStructure = fields.some(f => structureFields.includes(f))

            // Get LLM account
            const account = await getDefaultLlmAccount(realmId)
            if (!account || !account.enabled) {
                await this.logAnalysisHistory(signal.signal_id, {
                    type: 'analysis_selective_failed',
                    timestamp: new Date().toISOString(),
                    error: 'No enabled LLM account found',
                    fields_requested: fields,
                })
                return { success: false, error: 'No enabled LLM account found' }
            }

            console.log('Using LLM account:', account.id, account.model)

            // Load realm settings
            const settings = await getRealmLlmSettings(realmId)
            const realmContext = (settings as any)?.realm_context || ''

            // Load prompts
            const invocation = await this.loadPrompt('invocation.md')
            const realmPrompt = await this.loadPrompt('realm.md')

            const signalContext = this.buildSignalContext(signal)
            const signalAnnotations = signal.signal_annotations as SignalAnnotations | null
            const annotations = signalAnnotations?.user_notes && signalAnnotations.user_notes.length > 0
                ? `\n*User notes about this signal (high-priority context):*\n${signalAnnotations.user_notes.map((note) =>
                    `- ${note.note} (${new Date(note.timestamp).toLocaleDateString()})`
                ).join('\n')}\n`
                : ''

            let analysisFields: any = {}

            // Run surface analysis if needed
            if (needsSurface) {
                try {
                    const surfaceSystem = await this.loadPrompt('surface/system.md')
                    const surfaceUser = await this.loadPrompt('surface/user.md')
                    const allQuestions = await this.loadQuestions('surface/questions.json')

                    // Filter questions to only selected fields
                    const filteredQuestions = this.filterQuestions(allQuestions, fields, surfaceFields)

                    const surfaceSystemPrompt = [
                        invocation,
                        realmPrompt
                            .replace('{{realm_context}}', realmContext)
                            .replace('{{realm_holder_name}}', (settings as any)?.realm_holder_name || 'the realm holder'),
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
                        .replace('{{questions}}', this.formatQuestions(filteredQuestions))

                    const surfaceResponse = await this.router.generate(
                        account,
                        surfaceUserPrompt,
                        surfaceSystemPrompt
                    )

                    const surfaceData = this.parseSurfaceResponse(surfaceResponse.content)

                    // Only keep requested fields
                    const filteredSurfaceFields = this.filterFields(surfaceData, fields)
                    analysisFields = filteredSurfaceFields

                    await this.logAnalysisHistory(signal.signal_id, {
                        type: 'analysis_surface_selective',
                        timestamp: new Date().toISOString(),
                        account_id: account.id,
                        model: account.model,
                        system_prompt: surfaceSystemPrompt,  // ← ADD
                        user_prompt: surfaceUserPrompt,      // ← ADD
                        fields_requested: fields.filter(f => surfaceFields.includes(f)),
                        fields_updated: Object.keys(filteredSurfaceFields),
                        response: surfaceResponse.content,
                        tokens: surfaceResponse.usage?.total_tokens || null,
                    })
                } catch (error) {
                    await this.logAnalysisHistory(signal.signal_id, {
                        type: 'analysis_surface_selective_failed',
                        timestamp: new Date().toISOString(),
                        account_id: account.id,
                        model: account.model,
                        error: error instanceof Error ? error.message : 'Surface analysis failed',
                        fields_requested: fields.filter(f => surfaceFields.includes(f)),
                    })
                    throw error
                }
            }

            // Run structure analysis if needed
            if (needsStructure) {
                try {
                    const structureSystem = await this.loadPrompt('structure/system.md')
                    const structureUser = await this.loadPrompt('structure/user.md')
                    const allQuestions = await this.loadQuestions('structure/questions.json')

                    // Filter questions to only selected fields
                    const filteredQuestions = this.filterQuestions(allQuestions, fields, structureFields)

                    const structureSystemPrompt = [
                        invocation,
                        realmPrompt
                            .replace('{{realm_context}}', realmContext)
                            .replace('{{realm_holder_name}}', (settings as any)?.realm_holder_name || 'the realm holder'),
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
                        .replace('{{questions}}', this.formatQuestions(filteredQuestions))

                    const structureResponse = await this.router.generate(
                        account,
                        structureUserPrompt,
                        structureSystemPrompt
                    )

                    const structureData = this.parseStructureResponse(structureResponse.content)

                    // Only keep requested fields
                    const filteredStructureFields = this.filterFields(structureData, fields)
                    analysisFields = {
                        ...analysisFields,
                        ...filteredStructureFields
                    }

                    await this.logAnalysisHistory(signal.signal_id, {
                        type: 'analysis_structure_selective',
                        timestamp: new Date().toISOString(),
                        account_id: account.id,
                        model: account.model,
                        system_prompt: structureSystemPrompt,  // ← ADD
                        user_prompt: structureUserPrompt,      // ← ADD
                        fields_requested: fields.filter(f => structureFields.includes(f)),
                        fields_updated: Object.keys(filteredStructureFields),
                        response: structureResponse.content,
                        tokens: structureResponse.usage?.total_tokens || null,
                    })
                } catch (error) {
                    await this.logAnalysisHistory(signal.signal_id, {
                        type: 'analysis_structure_selective_failed',
                        timestamp: new Date().toISOString(),
                        account_id: account.id,
                        model: account.model,
                        error: error instanceof Error ? error.message : 'Structure analysis failed',
                        fields_requested: fields.filter(f => structureFields.includes(f)),
                    })
                    throw error
                }
            }

            // Update signal with only the selected fields
            await prisma.signal.update({
                where: { signal_id: signalId },
                data: analysisFields,
            })

            await this.logAnalysisHistory(signal.signal_id, {
                type: 'analysis_selective_complete',
                timestamp: new Date().toISOString(),
                fields_updated: Object.keys(analysisFields),
            })

            console.log('Analysis complete, fields updated:', Object.keys(analysisFields))

            return { success: true }
        } catch (error) {
            console.error('Selective analysis error:', error)
            const message = error instanceof Error ? error.message : 'Unknown error'

            await this.logAnalysisHistory(signalId, {
                type: 'analysis_selective_failed',
                timestamp: new Date().toISOString(),
                error: message,
                fields_requested: fields,
            })

            return { success: false, error: message }
        }
    }

// Helper to filter questions
    private filterQuestions(
        allQuestions: Record<string, string>,
        requestedFields: string[],
        layerFields: string[]
    ): Record<string, string> {
        const filtered: Record<string, string> = {}

        // Map field names to question keys
        const fieldToQuestion: Record<string, string> = {
            'signal_title': 'title',
            'signal_summary': 'summary',
            'signal_environment': 'environment',
            'signal_temperature': 'temperature',
            'signal_density': 'density',
            'signal_actions': 'actions',
            'signal_entities': 'entities',
            'signal_tags': 'tags',
            'signal_energy': 'energy',
            'signal_state': 'state',
            'signal_orientation': 'orientation',
            'signal_substrate': 'substrate',
            'signal_ontological_states': 'ontological_states',
            'signal_symbolic_elements': 'symbolic_elements',
            'signal_subsystems': 'subsystems',
            'signal_dominant_language': 'dominant_language',
        }

        for (const field of requestedFields) {
            if (layerFields.includes(field)) {
                const questionKey = fieldToQuestion[field]
                if (questionKey && allQuestions[questionKey]) {
                    filtered[questionKey] = allQuestions[questionKey]
                }
            }
        }

        return filtered
    }

// Helper to filter fields
    private filterFields(data: any, requestedFields: string[]): any {
        const filtered: any = {}
        for (const field of requestedFields) {
            if (field in data) {
                filtered[field] = data[field]
            }
        }
        return filtered
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
        }
    }
}
