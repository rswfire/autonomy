// components/admin/SignalAnalysisForm.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/admin/ui/Button'
import { toast } from 'sonner'

interface AnalysisField {
    key: string
    label: string
    layer: 'surface' | 'structure'
}

const ANALYSIS_FIELDS: AnalysisField[] = [
    // Surface layer
    { key: 'signal_title', label: 'Title', layer: 'surface' },
    { key: 'signal_summary', label: 'Summary', layer: 'surface' },
    { key: 'signal_environment', label: 'Environment', layer: 'surface' },
    { key: 'signal_temperature', label: 'Temperature', layer: 'surface' },
    { key: 'signal_density', label: 'Density', layer: 'surface' },
    { key: 'signal_actions', label: 'Actions', layer: 'surface' },
    { key: 'signal_entities', label: 'Entities', layer: 'surface' },
    { key: 'signal_tags', label: 'Tags', layer: 'surface' },

    // Structure layer
    { key: 'signal_energy', label: 'Energy', layer: 'structure' },
    { key: 'signal_state', label: 'State', layer: 'structure' },
    { key: 'signal_orientation', label: 'Orientation', layer: 'structure' },
    { key: 'signal_substrate', label: 'Substrate', layer: 'structure' },
    { key: 'signal_ontological_states', label: 'Ontological States', layer: 'structure' },
    { key: 'signal_symbolic_elements', label: 'Symbolic Elements', layer: 'structure' },
    { key: 'signal_subsystems', label: 'Subsystems', layer: 'structure' },
    { key: 'signal_dominant_language', label: 'Dominant Language', layer: 'structure' },
]

export function SignalAnalysisForm({ signalId, realmId }: { signalId: string; realmId: string }) {
    const router = useRouter()
    const [selectedFields, setSelectedFields] = useState<string[]>([])
    const [isAnalyzing, setIsAnalyzing] = useState(false)

    const toggleField = (key: string) => {
        setSelectedFields(prev =>
            prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
        )
    }

    const selectAll = (layer: 'surface' | 'structure') => {
        const layerFields = ANALYSIS_FIELDS.filter(f => f.layer === layer).map(f => f.key)
        setSelectedFields(prev => {
            const otherLayerFields = prev.filter(k => !layerFields.includes(k))
            return [...otherLayerFields, ...layerFields]
        })
    }

    const deselectAll = (layer: 'surface' | 'structure') => {
        const layerFields = ANALYSIS_FIELDS.filter(f => f.layer === layer).map(f => f.key)
        setSelectedFields(prev => prev.filter(k => !layerFields.includes(k)))
    }

    const handleAnalyze = async () => {
        if (selectedFields.length === 0) {
            toast.error('Select at least one field to analyze')
            return
        }

        setIsAnalyzing(true)

        try {
            const response = await fetch(`/api/admin/signals/${signalId}/analyze`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    realm_id: realmId,
                    fields: selectedFields,
                }),
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.error || 'Analysis failed')
            }

            toast.success('Analysis complete')
            window.location.reload()
            setSelectedFields([])
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Analysis failed'
            toast.error(message)
        } finally {
            setIsAnalyzing(false)
        }
    }

    const surfaceFields = ANALYSIS_FIELDS.filter(f => f.layer === 'surface')
    const structureFields = ANALYSIS_FIELDS.filter(f => f.layer === 'structure')

    return (
        <div className="space-y-6">
            <div>
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                        Surface Layer
                    </h3>
                    <div className="flex gap-2">
                        <button
                            onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                selectAll('surface')
                            }}
                            className="text-xs text-blue-600 hover:underline"
                        >
                            Select All
                        </button>
                        <button
                            onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                deselectAll('surface')
                            }}
                            className="text-xs text-gray-600 hover:underline"
                        >
                            Deselect All
                        </button>
                    </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {surfaceFields.map(field => (
                        <label
                            key={field.key}
                            className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded cursor-pointer hover:bg-gray-100"
                        >
                            <input
                                type="checkbox"
                                checked={selectedFields.includes(field.key)}
                                onChange={() => toggleField(field.key)}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">{field.label}</span>
                        </label>
                    ))}
                </div>
            </div>

            <div>
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                        Structure Layer
                    </h3>
                    <div className="flex gap-2">
                        <button
                            onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                selectAll('structure')
                            }}
                            className="text-xs text-blue-600 hover:underline"
                        >
                            Select All
                        </button>
                        <button
                            onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                deselectAll('structure')
                            }}
                            className="text-xs text-gray-600 hover:underline"
                        >
                            Deselect All
                        </button>
                    </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {structureFields.map(field => (
                        <label
                            key={field.key}
                            className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded cursor-pointer hover:bg-gray-100"
                        >
                            <input
                                type="checkbox"
                                checked={selectedFields.includes(field.key)}
                                onChange={() => toggleField(field.key)}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">{field.label}</span>
                        </label>
                    ))}
                </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                    {selectedFields.length} field{selectedFields.length !== 1 ? 's' : ''} selected
                </div>
                <Button
                    onClick={handleAnalyze}
                    disabled={selectedFields.length === 0 || isAnalyzing}
                >
                    {isAnalyzing ? 'Analyzing...' : 'Run Analysis'}
                </Button>
            </div>
        </div>
    )
}
