// components/admin/forms/FormField.tsx
import { ReactNode } from 'react'
import { Label } from '../ui/Label'

interface FormFieldProps {
    label: string
    name: string
    description?: string
    required?: boolean
    error?: string
    hint?: string
    children: ReactNode
}

export function FormField({ label, name, required, error, hint, children }: FormFieldProps) {
    return (
        <div className="mb-6">
            <Label htmlFor={name} required={required}>
                {label}
            </Label>
            {children}
            {hint && !error && (
                <p className="mt-1 text-sm text-gray-500">{hint}</p>
            )}
            {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
        </div>
    )
}
