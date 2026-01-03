// components/admin/forms/signal/DocumentFields.tsx
'use client'

import { UseFormRegister } from 'react-hook-form'
import { FormField } from '../FormField'
import { Textarea } from '../../ui/Textarea'
import { Select } from '../../ui/Select'

interface DocumentFieldsProps {
    register: UseFormRegister<any>
}

export function DocumentFields({ register }: DocumentFieldsProps) {
    return (
        <div className="space-y-6">
            <FormField
                label="Content"
                name="payload_content"
                description="The actual text content"
                required
            >
                <Textarea
                    {...register('payload_content', { required: 'Content is required' })}
                    rows={12}
                    placeholder="Enter document content..."
                    className="font-mono text-sm"
                />
            </FormField>

            <FormField
                label="Format"
                name="payload_format"
                description="How to render this content"
            >
                <Select {...register('payload_format')}>
                    <option value="plain">Plain Text</option>
                    <option value="markdown">Markdown</option>
                    <option value="html">HTML</option>
                </Select>
            </FormField>

            <div className="border-t border-gray-200 pt-6 mt-6">
                <h4 className="text-sm font-semibold text-gray-700 mb-4">Metadata (Optional)</h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField label="Word Count" name="metadata_word_count">
                        <input
                            type="number"
                            {...register('metadata_word_count', { valueAsNumber: true })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            placeholder="e.g., 500"
                        />
                    </FormField>

                    <FormField label="Character Count" name="metadata_character_count">
                        <input
                            type="number"
                            {...register('metadata_character_count', { valueAsNumber: true })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            placeholder="e.g., 2500"
                        />
                    </FormField>

                    <FormField label="Language" name="metadata_language">
                        <input
                            type="text"
                            {...register('metadata_language')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            placeholder="e.g., en, es, fr"
                        />
                    </FormField>

                    <FormField label="File Extension" name="metadata_file_extension">
                        <input
                            type="text"
                            {...register('metadata_file_extension')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            placeholder="e.g., .md, .txt"
                        />
                    </FormField>

                    <FormField label="Encoding" name="metadata_encoding">
                        <input
                            type="text"
                            {...register('metadata_encoding')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            placeholder="e.g., utf-8"
                        />
                    </FormField>

                    <FormField label="MIME Type" name="metadata_mime_type">
                        <input
                            type="text"
                            {...register('metadata_mime_type')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            placeholder="e.g., text/plain"
                        />
                    </FormField>
                </div>
            </div>
        </div>
    )
}
