// lib/constants/common.ts
import type { SignalStatus, SignalVisibility, SignalContext } from './signal'
import type { ClusterState } from './cluster'

// Default values
export const DEFAULTS = {
    SIGNAL_STATUS: 'PENDING' as SignalStatus,
    SIGNAL_VISIBILITY: 'PUBLIC' as SignalVisibility,
    SIGNAL_CONTEXT: 'CAPTURE' as SignalContext,
    SIGNAL_TEMPERATURE: 0.0,
    CLUSTER_DEPTH: 0,
    CLUSTER_STATE: 'DRAFT' as ClusterState,
    SYNTHESIS_DEPTH: 0,
} as const

// Limits
export const LIMITS = {
    SIGNAL_TITLE_MAX: 100,
    SIGNAL_AUTHOR_MAX: 50,
    SIGNAL_TEMPERATURE_MIN: -1.0,
    SIGNAL_TEMPERATURE_MAX: 1.0,
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
