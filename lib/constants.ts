// lib/constants.ts

// Realm constants
export const REALM_TYPES = ['PRIVATE', 'PUBLIC', 'SHARED'] as const
export const REALM_USER_ROLES = ['OWNER', 'CONTRIBUTOR', 'OBSERVER'] as const

// Signal constants
export const SIGNAL_TYPES = [
    'TEXT',
    'PHOTO',
    'VIDEO',
    'AUDIO',
    'LOCATION',
    'DOCUMENT',
    'CODE',
    'LINK',
    'NOTE',
    'JOURNAL',
    'OBSERVATION',
] as const

export type SignalType = typeof SIGNAL_TYPES[number]

export const SIGNAL_STATUS = [
    'PENDING',
    'PROCESSING',
    'PROCESSED',
    'FAILED',
    'ARCHIVED',
] as const

export type SignalStatus = typeof SIGNAL_STATUS[number]

export const SIGNAL_VISIBILITY = [
    'PUBLIC',
    'PRIVATE',
    'SANCTUM',
    'SHARED',
] as const

export type SignalVisibility = typeof SIGNAL_VISIBILITY[number]

// Cluster constants
export const CLUSTER_TYPES = [
    'TEMPORAL',
    'SPATIAL',
    'THEMATIC',
    'PROJECT',
    'JOURNEY',
    'EXPLORATION',
    'COLLECTION',
] as const

export type ClusterType = typeof CLUSTER_TYPES[number]

export const CLUSTER_STATES = [
    'ACTIVE',
    'ARCHIVED',
    'DRAFT',
    'PUBLISHED',
] as const

export type ClusterState = typeof CLUSTER_STATES[number]

// Synthesis constants
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

// User constants
export const USER_ROLES = [
    'OWNER',    // Full control - can create/edit/delete everything
    'SANCTUM',  // Can view SANCTUM visibility signals
    'GUEST',    // Can only view PUBLIC signals
] as const

export const ROLE_PERMISSIONS = {
    OWNER: {
        can_create: true,
        can_edit: true,
        can_delete: true,
        can_view_sanctum: true,
        can_view_private: true,
    },
    SANCTUM: {
        can_create: false,
        can_edit: false,
        can_delete: false,
        can_view_sanctum: true,
        can_view_private: false,
    },
    GUEST: {
        can_create: false,
        can_edit: false,
        can_delete: false,
        can_view_sanctum: false,
        can_view_private: false,
    },
} as const

// Default values
export const DEFAULTS = {
    SIGNAL_STATUS: 'PENDING' as SignalStatus,
    SIGNAL_VISIBILITY: 'PUBLIC' as SignalVisibility,
    CLUSTER_DEPTH: 0,
    CLUSTER_STATE: 'DRAFT' as ClusterState,
    SYNTHESIS_DEPTH: 0,
} as const

// Limits
export const LIMITS = {
    SIGNAL_TITLE_MAX: 100,
    SIGNAL_AUTHOR_MAX: 50,
    CLUSTER_TITLE_MAX: 100,
    EMBEDDING_DIMENSIONS: 1536,
    MAX_CLUSTER_DEPTH: 10,
} as const

// Geospatial constants
export const GEO = {
    SRID: 4326, // WGS 84
    LATITUDE_MIN: -90,
    LATITUDE_MAX: 90,
    LONGITUDE_MIN: -180,
    LONGITUDE_MAX: 180,
} as const
