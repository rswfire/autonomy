// lib/constants/cluster.ts

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
