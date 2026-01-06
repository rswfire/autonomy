// components/admin/forms/signal/AnalysisFields.tsx
import { UseFormRegister } from 'react-hook-form'
import { FormField } from '../FormField'
import { Input } from '../../ui/Input'
import { Textarea } from '../../ui/Textarea'

interface AnalysisFieldsProps {
    register: UseFormRegister<any>
}

export function AnalysisFields({ register }: AnalysisFieldsProps) {
    return (
        <div className="space-y-6">
            {/* Surface Layer */}
            <div className="space-y-4">
                <h4 className="text-sm font-semibold text-gray-700 border-b pb-2">Surface Layer</h4>

                <FormField
                    label="Actions"
                    name="signal_actions"
                    description="Comma-separated list of visible actions"
                >
                    <Input {...register('signal_actions')} placeholder="walking, recording, demonstrating" />
                </FormField>

                <FormField
                    label="Environment"
                    name="signal_environment"
                    description="Context at time of signal creation"
                >
                    <Textarea {...register('signal_environment')} rows={3} placeholder="Location, conditions, preoccupations..." />
                </FormField>

                <div className="space-y-3">
                    <h5 className="text-xs font-medium text-gray-600 uppercase tracking-wide">Entities</h5>
                    <div className="grid grid-cols-2 gap-4">
                        <FormField label="People" name="signal_entities_people">
                            <Input {...register('signal_entities_people')} placeholder="Names, comma-separated" />
                        </FormField>
                        <FormField label="Animals" name="signal_entities_animals">
                            <Input {...register('signal_entities_animals')} placeholder="Names, comma-separated" />
                        </FormField>
                        <FormField label="Places" name="signal_entities_places">
                            <Input {...register('signal_entities_places')} placeholder="Locations, comma-separated" />
                        </FormField>
                        <FormField label="Infrastructure" name="signal_entities_infrastructure">
                            <Input {...register('signal_entities_infrastructure')} placeholder="Systems, platforms, comma-separated" />
                        </FormField>
                        <FormField label="Organizations" name="signal_entities_organizations">
                            <Input {...register('signal_entities_organizations')} placeholder="Companies, institutions, comma-separated" />
                        </FormField>
                        <FormField label="Concepts" name="signal_entities_concepts">
                            <Input {...register('signal_entities_concepts')} placeholder="Abstract ideas, comma-separated" />
                        </FormField>
                        <FormField label="Media" name="signal_entities_media">
                            <Input {...register('signal_entities_media')} placeholder="Books, articles, content referenced, comma-separated" />
                        </FormField>
                    </div>
                </div>

                <FormField
                    label="Density"
                    name="signal_density"
                    description="Recursion/complexity metric (-1.0 to 1.0)"
                >
                    <Input type="number" step="0.1" {...register('signal_density')} placeholder="0.0" />
                </FormField>
            </div>

            {/* Structural Layer */}
            <div className="space-y-4">
                <h4 className="text-sm font-semibold text-gray-700 border-b pb-2">Structural Layer</h4>

                <div className="grid grid-cols-3 gap-4">
                    <FormField label="Energy" name="signal_energy" description="Energetic state">
                        <Input {...register('signal_energy')} placeholder="methodical, exhausted, etc." />
                    </FormField>
                    <FormField label="State" name="signal_state" description="Life/project state">
                        <Input {...register('signal_state')} placeholder="infrastructure-building, etc." />
                    </FormField>
                    <FormField label="Orientation" name="signal_orientation" description="Directional facing">
                        <Input {...register('signal_orientation')} placeholder="toward sovereignty, etc." />
                    </FormField>
                </div>

                <FormField
                    label="Substrate"
                    name="signal_substrate"
                    description="Structural/conceptual foundation"
                >
                    <Textarea {...register('signal_substrate')} rows={3} />
                </FormField>

                <FormField
                    label="Ontological States"
                    name="signal_ontological_states"
                    description="Being-states present (comma-separated)"
                >
                    <Input {...register('signal_ontological_states')} placeholder="sovereign, coherent, demonstrative" />
                </FormField>

                <FormField
                    label="Symbolic Elements"
                    name="signal_symbolic_elements"
                    description="Recurring motifs/symbols (comma-separated)"
                >
                    <Input {...register('signal_symbolic_elements')} placeholder="mirror, archive, container" />
                </FormField>

                <FormField
                    label="Subsystems"
                    name="signal_subsystems"
                    description="Engaged subsystems (comma-separated)"
                >
                    <Input {...register('signal_subsystems')} placeholder="cognitive, infrastructural, relational" />
                </FormField>

                <FormField
                    label="Dominant Language"
                    name="signal_dominant_language"
                    description="Key semantic patterns (comma-separated)"
                >
                    <Input {...register('signal_dominant_language')} placeholder="sovereignty, infrastructure, recursion" />
                </FormField>
            </div>
        </div>
    )
}
