// components/admin/AnnotationsPanel.tsx
'use client'

import { useState } from 'react'
import Icon from '../Icon'
import { Textarea } from './ui'

interface Annotation {
    timestamp: string
    note: string
}

interface AnnotationsPanelProps {
    annotations: { user_notes?: Annotation[] }
    newAnnotation: string
    onNewAnnotationChange: (value: string) => void
    triggerReanalysis: boolean
    onTriggerReanalysisChange: (value: boolean) => void
}

export function AnnotationsPanel({
                                     annotations,
                                     newAnnotation,
                                     onNewAnnotationChange,
                                     triggerReanalysis,
                                     onTriggerReanalysisChange
                                 }: AnnotationsPanelProps) {
    const [isExpanded, setIsExpanded] = useState(false)

    const hasAnnotations = annotations?.user_notes && annotations.user_notes.length > 0
    const hasNewAnnotation = newAnnotation && newAnnotation.trim().length > 0

    return (
        <div className="space-y-4">
            {/* Previous Annotations */}
            {hasAnnotations && (
                <div>
                    <button
                        type="button"
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3 hover:text-gray-900"
                    >
                        <Icon name={isExpanded ? 'ChevronDown' : 'ChevronRight'} size={16} />
                        Previous Annotations ({annotations.user_notes!.length})
                    </button>

                    {isExpanded && (
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border-2 border-blue-200 p-4 space-y-4 mb-4">
                            {annotations.user_notes!.map((note, idx) => (
                                <div
                                    key={idx}
                                    className="bg-white rounded-lg p-4 shadow-sm border border-blue-100"
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                                            <Icon name="MessageSquare" size={16} className="text-blue-600" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-xs text-gray-500 font-mono mb-2">
                                                {new Date(note.timestamp).toLocaleString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </div>
                                            <div className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
                                                {note.note}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Add New Annotation */}
            <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Add Annotation
                </label>
                <div className="mb-2 text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                        <Icon name="Info" size={16} className="text-gray-500 mt-0.5 flex-shrink-0" />
                        <div className="text-xs leading-relaxed">
                            <p className="font-medium text-gray-700 mb-1">High-priority context for AI analysis</p>
                            <p className="text-gray-600">
                                Use annotations to correct misunderstandings, add missing context, or clarify ambiguous details.
                                The AI will treat this as authoritative guidance.
                            </p>
                        </div>
                    </div>
                </div>

                <Textarea
                    value={newAnnotation}
                    onChange={(e) => onNewAnnotationChange(e.target.value)}
                    rows={4}
                    placeholder="Add clarifications, corrections, or additional context that will help the AI better understand this signal..."
                    className="font-mono text-sm"
                />

                {hasNewAnnotation && (
                    <div className="mt-3 space-y-3">
                        {/* Checkbox for re-analysis */}
                        <label className="flex items-start gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={triggerReanalysis}
                                onChange={(e) => onTriggerReanalysisChange(e.target.checked)}
                                className="mt-1 h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                            />
                            <div className="flex-1">
                                <span className="text-sm font-medium text-gray-900">
                                    Trigger re-analysis with this annotation
                                </span>
                                <p className="text-xs text-gray-600 mt-0.5">
                                    Run a new AI analysis including this context at highest priority
                                </p>
                            </div>
                        </label>

                        {/* Warning when checked */}
                        {triggerReanalysis && (
                            <div className="bg-gradient-to-r from-orange-50 to-amber-50 border-l-4 border-orange-400 p-4 rounded-r-lg">
                                <div className="flex items-start gap-3">
                                    <Icon name="Zap" size={20} className="text-orange-500 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <div className="text-sm font-semibold text-orange-900 mb-1">
                                            Re-analysis will be triggered automatically
                                        </div>
                                        <div className="text-xs text-orange-800 leading-relaxed">
                                            <p>
                                                Saving this annotation will run a new analysis (surface + structure) with your context
                                                included at the highest priority level. This will use tokens from your configured LLM account.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
