// components/admin/forms/signal-fields/ConversationFields.tsx
'use client'

import { UseFormRegister, Control, Controller, useFieldArray } from 'react-hook-form'
import { FormField } from '../FormField'
import { Input } from '../../ui/Input'
import { Textarea } from '../../ui/Textarea'
import { Select } from '../../ui/Select'
import { Button } from '../../ui/Button'
import Icon from '@/components/Icon'

interface ConversationFieldsProps {
    register: UseFormRegister<any>
    control: Control<any>
}

export function ConversationFields({ register, control }: ConversationFieldsProps) {
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'payload_messages',
    })

    return (
        <div className="space-y-6">
            {/* Messages Array */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-semibold text-gray-700">Messages</h4>
                    <Button
                        type="button"
                        onClick={() => append({ role: 'user', content: '', timestamp: '' })}
                        variant="secondary"
                        size="sm"
                    >
                        <Icon name="Plus" size={16} />
                        <span className="ml-2">Add Message</span>
                    </Button>
                </div>

                <div className="space-y-4">
                    {fields.map((field, index) => (
                        <div key={field.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-sm font-medium text-gray-600">Message {index + 1}</span>
                                <button
                                    type="button"
                                    onClick={() => remove(index)}
                                    className="text-red-600 hover:text-red-800"
                                >
                                    <Icon name="X" size={16} />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                                <FormField label="Role" name={`payload_messages.${index}.role`} required>
                                    <Select {...register(`payload_messages.${index}.role`)}>
                                        <option value="user">User</option>
                                        <option value="assistant">Assistant</option>
                                    </Select>
                                </FormField>

                                <FormField label="Timestamp" name={`payload_messages.${index}.timestamp`}>
                                    <Input
                                        type="datetime-local"
                                        {...register(`payload_messages.${index}.timestamp`)}
                                    />
                                </FormField>
                            </div>

                            <FormField label="Content" name={`payload_messages.${index}.content`} required>
                                <Textarea
                                    {...register(`payload_messages.${index}.content`, { required: 'Content is required' })}
                                    rows={4}
                                    placeholder="Message content..."
                                />
                            </FormField>
                        </div>
                    ))}

                    {fields.length === 0 && (
                        <p className="text-sm text-gray-500 italic text-center py-8">
                            No messages yet. Click "Add Message" to start.
                        </p>
                    )}
                </div>
            </div>

            {/* Summary & Key Points */}
            <div className="border-t border-gray-200 pt-6 mt-6">
                <FormField
                    label="Summary"
                    name="payload_summary"
                    description="AI-generated conversation summary (optional)"
                >
                    <Textarea
                        {...register('payload_summary')}
                        rows={4}
                        placeholder="Overall conversation summary..."
                    />
                </FormField>

                <FormField
                    label="Key Points"
                    name="payload_key_points"
                    description="Comma-separated key insights"
                >
                    <Textarea
                        {...register('payload_key_points')}
                        rows={3}
                        placeholder="Key point 1, Key point 2, Key point 3"
                    />
                </FormField>
            </div>

            {/* Metadata Section */}
            <div className="border-t border-gray-200 pt-6 mt-6">
                <h4 className="text-sm font-semibold text-gray-700 mb-4">Metadata</h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField label="Platform" name="metadata_platform">
                        <Select {...register('metadata_platform')}>
                            <option value="">Select Platform</option>
                            <option value="claude">Claude</option>
                            <option value="chatgpt">ChatGPT</option>
                            <option value="gemini">Gemini</option>
                            <option value="remnant">Remnant</option>
                            <option value="other">Other</option>
                        </Select>
                    </FormField>

                    <FormField label="Model" name="metadata_model">
                        <Input
                            {...register('metadata_model')}
                            placeholder="e.g., claude-sonnet-4, gpt-4"
                        />
                    </FormField>

                    <FormField label="Message Count" name="metadata_message_count">
                        <Input
                            type="number"
                            {...register('metadata_message_count', { valueAsNumber: true })}
                            placeholder="e.g., 42"
                        />
                    </FormField>

                    <FormField label="Turn Count" name="metadata_turn_count">
                        <Input
                            type="number"
                            {...register('metadata_turn_count', { valueAsNumber: true })}
                            placeholder="e.g., 21"
                        />
                    </FormField>

                    <FormField label="Duration (minutes)" name="metadata_duration_minutes">
                        <Input
                            type="number"
                            {...register('metadata_duration_minutes', { valueAsNumber: true })}
                            placeholder="e.g., 15"
                        />
                    </FormField>

                    <FormField label="Total Tokens" name="metadata_total_tokens">
                        <Input
                            type="number"
                            {...register('metadata_total_tokens', { valueAsNumber: true })}
                            placeholder="e.g., 5000"
                        />
                    </FormField>

                    <FormField label="Started At" name="metadata_started_at">
                        <Input
                            type="datetime-local"
                            {...register('metadata_started_at')}
                        />
                    </FormField>

                    <FormField label="Ended At" name="metadata_ended_at">
                        <Input
                            type="datetime-local"
                            {...register('metadata_ended_at')}
                        />
                    </FormField>
                </div>
            </div>
        </div>
    )
}
