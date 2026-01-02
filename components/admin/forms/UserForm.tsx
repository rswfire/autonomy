// components/admin/forms/UserForm.tsx
'use client'

import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { FormSection } from './FormSection'
import { FormField } from './FormField'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'
import { USER_ROLES } from '@/lib/constants'

interface UserFormProps {
    mode: 'create' | 'edit'
    defaultValues?: any
    onSuccess?: () => void
}

export function UserForm({ mode, defaultValues, onSuccess }: UserFormProps) {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues,
    })

    const onSubmit = async (data: any) => {
        setIsSubmitting(true)
        setError(null)

        try {
            const url = mode === 'create'
                ? '/api/admin/users'
                : `/api/admin/users/${defaultValues?.user_id}`

            const response = await fetch(url, {
                method: mode === 'create' ? 'POST' : 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Failed to save user')
            }

            if (onSuccess) {
                onSuccess()
            } else {
                router.push('/admin/users')
                router.refresh()
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && (
                <div className="bg-red-50 border-l-4 border-red-400 text-red-700 px-4 py-3 rounded">
                    <p className="font-medium">Error</p>
                    <p className="text-sm mt-1">{error}</p>
                </div>
            )}

            <Card title={mode === 'create' ? 'Create User' : 'Edit User'}>
                <FormSection title="Core Information" description="Basic user details">
                    <FormField label="Email" name="user_email" required error={errors.user_email?.message as string}>
                        <Input
                            type="email"
                            {...register('user_email', { required: 'Email is required' })}
                            placeholder="user@example.com"
                        />
                    </FormField>

                    <FormField label="Name" name="user_name">
                        <Input {...register('user_name')} placeholder="Full name" />
                    </FormField>

                    <FormField
                        label={mode === 'create' ? 'Password' : 'Password (leave blank to keep current)'}
                        name="user_password"
                        required={mode === 'create'}
                        error={errors.user_password?.message as string}
                    >
                        <Input
                            type="password"
                            {...register('user_password', {
                                required: mode === 'create' ? 'Password is required' : false,
                                minLength: { value: 8, message: 'Password must be at least 8 characters' }
                            })}
                            placeholder="••••••••"
                        />
                    </FormField>
                </FormSection>

                <FormSection title="Permissions" description="Role and access settings">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField label="Role" name="user_role">
                            <Select {...register('user_role')}>
                                {USER_ROLES.map(role => (
                                    <option key={role} value={role}>{role}</option>
                                ))}
                            </Select>
                        </FormField>

                        <FormField label="Is Owner" name="is_owner">
                            <div className="flex items-center h-full">
                                <input
                                    type="checkbox"
                                    {...register('is_owner')}
                                    className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                                />
                                <span className="ml-2 text-sm text-gray-600">Grant owner privileges</span>
                            </div>
                        </FormField>
                    </div>
                </FormSection>

                <div className="flex gap-3 pt-8 border-t border-gray-200">
                    <Button type="submit" disabled={isSubmitting} variant="primary" size="lg">
                        {isSubmitting ? 'Saving...' : mode === 'create' ? 'Create User' : 'Save Changes'}
                    </Button>

                    <Button type="button" onClick={() => router.back()} variant="ghost" size="lg">
                        Cancel
                    </Button>
                </div>
            </Card>
        </form>
    )
}
