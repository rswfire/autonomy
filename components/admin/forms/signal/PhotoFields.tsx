// components/admin/forms/signal-fields/PhotoFields.tsx
'use client'

import { UseFormRegister } from 'react-hook-form'
import { FormField } from '../FormField'
import { Input } from '../../ui/Input'

interface PhotoFieldsProps {
    register: UseFormRegister<any>
}

export function PhotoFields({ register }: PhotoFieldsProps) {
    return (
        <div className="space-y-6">
            <FormField
                label="File Path"
                name="payload_file_path"
                description="Local path or cloud storage URL"
                required
            >
                <Input
                    {...register('payload_file_path', { required: 'File path is required' })}
                    placeholder="/uploads/photos/2026/01/IMG_1234.jpg"
                />
            </FormField>

            <FormField
                label="Thumbnail Path"
                name="payload_thumbnail_path"
                description="Optimized thumbnail (optional)"
            >
                <Input
                    {...register('payload_thumbnail_path')}
                    placeholder="/uploads/photos/2026/01/IMG_1234_thumb.jpg"
                />
            </FormField>

            <FormField
                label="Original Filename"
                name="payload_original_filename"
            >
                <Input
                    {...register('payload_original_filename')}
                    placeholder="IMG_1234.jpg"
                />
            </FormField>

            <div className="border-t border-gray-200 pt-6 mt-6">
                <h4 className="text-sm font-semibold text-gray-700 mb-4">EXIF Metadata (Optional)</h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField label="Camera" name="metadata_camera">
                        <Input
                            {...register('metadata_camera')}
                            placeholder="e.g., iPhone 13 Pro"
                        />
                    </FormField>

                    <FormField label="Lens" name="metadata_lens">
                        <Input
                            {...register('metadata_lens')}
                            placeholder="e.g., iPhone 13 Pro back camera"
                        />
                    </FormField>

                    <FormField label="ISO" name="metadata_iso">
                        <Input
                            type="number"
                            {...register('metadata_iso', { valueAsNumber: true })}
                            placeholder="e.g., 100"
                        />
                    </FormField>

                    <FormField label="Aperture" name="metadata_aperture">
                        <Input
                            {...register('metadata_aperture')}
                            placeholder="e.g., f/1.5"
                        />
                    </FormField>

                    <FormField label="Shutter Speed" name="metadata_shutter_speed">
                        <Input
                            {...register('metadata_shutter_speed')}
                            placeholder="e.g., 1/120"
                        />
                    </FormField>

                    <FormField label="Focal Length (mm)" name="metadata_focal_length">
                        <Input
                            type="number"
                            {...register('metadata_focal_length', { valueAsNumber: true })}
                            placeholder="e.g., 26"
                        />
                    </FormField>

                    <FormField label="Width (px)" name="metadata_width">
                        <Input
                            type="number"
                            {...register('metadata_width', { valueAsNumber: true })}
                            placeholder="e.g., 4032"
                        />
                    </FormField>

                    <FormField label="Height (px)" name="metadata_height">
                        <Input
                            type="number"
                            {...register('metadata_height', { valueAsNumber: true })}
                            placeholder="e.g., 3024"
                        />
                    </FormField>

                    <FormField label="File Size (bytes)" name="metadata_file_size">
                        <Input
                            type="number"
                            {...register('metadata_file_size', { valueAsNumber: true })}
                            placeholder="e.g., 2048000"
                        />
                    </FormField>

                    <FormField label="MIME Type" name="metadata_mime_type">
                        <Input
                            {...register('metadata_mime_type')}
                            placeholder="e.g., image/jpeg"
                        />
                    </FormField>

                    <FormField label="Color Space" name="metadata_color_space">
                        <Input
                            {...register('metadata_color_space')}
                            placeholder="e.g., sRGB"
                        />
                    </FormField>

                    <FormField label="Original Timestamp" name="metadata_timestamp_original">
                        <Input
                            type="datetime-local"
                            {...register('metadata_timestamp_original')}
                        />
                    </FormField>

                    <FormField label="GPS Altitude (m)" name="metadata_gps_altitude">
                        <Input
                            type="number"
                            step="0.1"
                            {...register('metadata_gps_altitude', { valueAsNumber: true })}
                            placeholder="e.g., 42.5"
                        />
                    </FormField>
                </div>
            </div>
        </div>
    )
}
