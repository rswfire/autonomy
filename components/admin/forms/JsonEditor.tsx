// components/admin/forms/JsonEditor.tsx
'use client'

import { Textarea } from '../ui/Textarea'
import { forwardRef, useState, useEffect } from 'react'

interface JsonEditorProps {
    value?: string
    onChange?: (value: string) => void
    onBlur?: () => void
    name?: string
    placeholder?: string
    rows?: number
    error?: string
}

export const JsonEditor = forwardRef<HTMLTextAreaElement, JsonEditorProps>(
    ({ value = '', onChange, error, rows = 6, placeholder = '{}', ...props }, ref) => {
        const [isValid, setIsValid] = useState(true)

        useEffect(() => {
            if (!value) {
                setIsValid(true)
                return
            }

            try {
                JSON.parse(value)
                setIsValid(true)
            } catch {
                setIsValid(false)
            }
        }, [value])

        return (
            <div>
                <Textarea
                    ref={ref}
                    value={value || ''}
                    onChange={(e) => onChange?.(e.target.value)}
                    rows={rows}
                    placeholder={placeholder}
                    error={error || (!isValid ? 'Invalid JSON' : undefined)}
                    className="font-mono text-xs"
                    {...props}
                />
                {!isValid && !error && (
                    <p className="mt-1 text-sm text-amber-600">⚠️ Invalid JSON format</p>
                )}
            </div>
        )
    }
)

JsonEditor.displayName = 'JsonEditor'
