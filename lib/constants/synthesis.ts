// lib/constants/synthesis.ts

export const SYNTHESIS_TYPES = [
    'METADATA',
    'REFLECTION',
] as const

export type SynthesisType = typeof SYNTHESIS_TYPES[number]

export const SYNTHESIS_SUBTYPES = {
    METADATA: ['SURFACE', 'STRUCTURE', 'PATTERNS'],
    REFLECTION: ['MIRROR', 'MYTH', 'NARRATIVE'],
} as const

export type MetadataSubtype = typeof SYNTHESIS_SUBTYPES.METADATA[number]
export type ReflectionSubtype = typeof SYNTHESIS_SUBTYPES.REFLECTION[number]
export type SynthesisSubtype = MetadataSubtype | ReflectionSubtype

export const POLYMORPHIC_TYPES = [
    'Signal',
    'Cluster',
] as const

export type PolymorphicType = typeof POLYMORPHIC_TYPES[number]
