// components/admin/AnalysisHistory.tsx
'use client'

import { useState } from 'react'
import Icon from '../Icon'

interface HistoryEntry {
    type: string
    timestamp: string
    model: string
    account_id: string
    error: string | null
    response: string | null
    user_prompt?: string
    system_prompt?: string
    tokens: number | null
    fields_updated?: string[]
}

export function AnalysisHistory({ history }: { history: any[] }) {
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null)
    const [activeTabs, setActiveTabs] = useState<{ [key: string]: 'response' | 'user_prompt' | 'system_prompt' }>({})

    if (!history || history.length === 0) {
        return (
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-6 text-center">
                <Icon name="History" size={32} className="text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No analysis history yet</p>
                <p className="text-xs text-gray-400 mt-1">Run your first analysis to see results here</p>
            </div>
        )
    }

    const analysisEntries = history.filter((entry: any) =>
        entry.type === 'analysis_surface' || entry.type === 'analysis_structure'
    ).reverse()

    const groupedEntries: { [key: string]: HistoryEntry[] } = {}
    analysisEntries.forEach((entry: HistoryEntry) => {
        const timestamp = new Date(entry.timestamp).toISOString().split('.')[0]
        if (!groupedEntries[timestamp]) {
            groupedEntries[timestamp] = []
        }
        groupedEntries[timestamp].push(entry)
    })

    return (
        <div className="space-y-4">
            {Object.entries(groupedEntries).map(([timestamp, groupEntries], groupIndex) => {
                const hasError = groupEntries.some(e => e.error)
                const totalTokens = groupEntries.reduce((sum, e) => sum + (e.tokens || 0), 0)
                const allFieldsUpdated = groupEntries.flatMap(e => e.fields_updated || [])

                return (
                    <div key={timestamp} className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden">
                        <button
                            type="button"
                            onClick={() => setExpandedIndex(expandedIndex === groupIndex ? null : groupIndex)}
                            className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`p-2 rounded-lg ${hasError ? 'bg-red-100' : 'bg-green-100'}`}>
                                    <Icon
                                        name={hasError ? 'AlertCircle' : 'CheckCircle'}
                                        size={20}
                                        className={hasError ? 'text-red-600' : 'text-green-600'}
                                    />
                                </div>
                                <div className="text-left">
                                    <div className="text-sm font-semibold text-gray-900">
                                        Analysis Run #{Object.keys(groupedEntries).length - groupIndex}
                                    </div>
                                    <div className="text-xs text-gray-500 space-x-3 mt-0.5">
                                        <span>{new Date(timestamp).toLocaleString()}</span>
                                        <span>•</span>
                                        <span>{groupEntries[0].model}</span>
                                        {totalTokens > 0 && (
                                            <>
                                                <span>•</span>
                                                <span>{totalTokens.toLocaleString()} tokens</span>
                                                <span className="text-gray-400">
                                                    (~${(totalTokens * 0.003 / 1000).toFixed(4)})
                                                </span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                {!hasError && allFieldsUpdated.length > 0 && (
                                    <span className="text-xs bg-teal-100 text-teal-700 px-2 py-1 rounded font-medium">
                                        {allFieldsUpdated.length} fields updated
                                    </span>
                                )}
                                {hasError && (
                                    <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded font-medium">
                                        Error
                                    </span>
                                )}
                                <Icon
                                    name={expandedIndex === groupIndex ? 'ChevronUp' : 'ChevronDown'}
                                    size={20}
                                    className="text-gray-400"
                                />
                            </div>
                        </button>

                        {expandedIndex === groupIndex && (
                            <div className="border-t border-gray-200">
                                {groupEntries.map((entry, entryIndex) => {
                                    const tabKey = `${timestamp}-${entryIndex}`
                                    const currentTab = activeTabs[tabKey] || 'response'

                                    return (
                                        <div key={entryIndex} className="border-b border-gray-100 last:border-0">
                                            <div className="bg-gray-50 px-5 py-3 flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Icon
                                                        name={entry.type === 'analysis_surface' ? 'FileText' : 'Layers'}
                                                        size={16}
                                                        className="text-gray-500"
                                                    />
                                                    <span className="text-sm font-medium text-gray-700">
                                                        {entry.type === 'analysis_surface' ? 'Surface Analysis' : 'Structure Analysis'}
                                                    </span>
                                                </div>
                                                {entry.tokens && (
                                                    <span className="text-xs text-gray-500 font-mono">
                                                        {entry.tokens} tokens
                                                    </span>
                                                )}
                                            </div>

                                            <div className="p-5 space-y-4">
                                                {entry.error && (
                                                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                                        <div className="flex items-start gap-2">
                                                            <Icon name="XCircle" size={16} className="text-red-600 mt-0.5 flex-shrink-0" />
                                                            <div>
                                                                <div className="text-sm font-medium text-red-900 mb-1">
                                                                    Analysis Failed
                                                                </div>
                                                                <div className="text-sm text-red-700 font-mono">
                                                                    {entry.error}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                {entry.fields_updated && entry.fields_updated.length > 0 && (
                                                    <div>
                                                        <div className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
                                                            Fields Updated ({entry.fields_updated.length})
                                                        </div>
                                                        <div className="flex flex-wrap gap-2">
                                                            {entry.fields_updated.map((field: string) => (
                                                                <span
                                                                    key={field}
                                                                    className="text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded font-mono"
                                                                >
                                                                    {field.replace('signal_', '')}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {(entry.response || entry.user_prompt || entry.system_prompt) && (
                                                    <div>
                                                        <div className="flex gap-1 border-b border-gray-200 mb-3">
                                                            <button
                                                                type="button"
                                                                onClick={() => setActiveTabs({ ...activeTabs, [tabKey]: 'response' })}
                                                                className={`px-4 py-2 text-sm font-medium transition-colors ${
                                                                    currentTab === 'response'
                                                                        ? 'text-teal-700 border-b-2 border-teal-700'
                                                                        : 'text-gray-500 hover:text-gray-700'
                                                                }`}
                                                            >
                                                                Response
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => setActiveTabs({ ...activeTabs, [tabKey]: 'user_prompt' })}
                                                                className={`px-4 py-2 text-sm font-medium transition-colors ${
                                                                    currentTab === 'user_prompt'
                                                                        ? 'text-teal-700 border-b-2 border-teal-700'
                                                                        : 'text-gray-500 hover:text-gray-700'
                                                                }`}
                                                            >
                                                                Input
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => setActiveTabs({ ...activeTabs, [tabKey]: 'system_prompt' })}
                                                                className={`px-4 py-2 text-sm font-medium transition-colors ${
                                                                    currentTab === 'system_prompt'
                                                                        ? 'text-teal-700 border-b-2 border-teal-700'
                                                                        : 'text-gray-500 hover:text-gray-700'
                                                                }`}
                                                            >
                                                                System Prompt
                                                            </button>
                                                        </div>

                                                        <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
                                                            {currentTab === 'response' && entry.response && (
                                                                <pre className="text-xs p-4 overflow-x-auto max-h-96 overflow-y-auto whitespace-pre-wrap font-mono">
                                                                    {entry.response}
                                                                </pre>
                                                            )}
                                                            {currentTab === 'user_prompt' && entry.user_prompt && (
                                                                <pre className="text-xs p-4 overflow-x-auto max-h-96 overflow-y-auto whitespace-pre-wrap font-mono">
                                                                    {entry.user_prompt}
                                                                </pre>
                                                            )}
                                                            {currentTab === 'system_prompt' && entry.system_prompt && (
                                                                <pre className="text-xs p-4 overflow-x-auto max-h-96 overflow-y-auto whitespace-pre-wrap font-mono">
                                                                    {entry.system_prompt}
                                                                </pre>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                )
            })}
        </div>
    )
}
