// components/admin/AnalyzeButton.tsx
'use client'

import { useState } from 'react'
import { Button } from './ui/Button'
import { toast } from 'sonner'
import Icon from '../Icon'

export function AnalyzeButton({ signalId }: { signalId: string }) {
    const [isAnalyzing, setIsAnalyzing] = useState(false)

    const handleAnalyze = async () => {
        setIsAnalyzing(true)

        try {
            const response = await fetch(`/api/admin/signals/${signalId}/analyze`, {
                method: 'POST',
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Analysis failed')
            }

            toast.success('Analysis complete!', {
                description: `Updated ${data.fields.length} fields`,
            })

            // Refresh the page to show new analysis
            window.location.reload()
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Analysis failed'
            toast.error('Analysis failed', { description: message })
        } finally {
            setIsAnalyzing(false)
        }
    }

    return (
        <Button
            type="button"
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="flex items-center gap-2"
        >
            <Icon name={isAnalyzing ? 'Loader' : 'Sparkles'} size={16} className={isAnalyzing ? 'animate-spin' : ''} />
            {isAnalyzing ? 'Analyzing...' : 'Analyze Signal'}
        </Button>
    )
}
