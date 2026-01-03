// lib/types.ts
import { Signal, Cluster, ClusterSignal, Synthesis, User, Realm, RealmUser, Prisma } from '@prisma/client'
export type { Signal, Cluster, ClusterSignal, Synthesis, User, Realm, RealmUser }

export type Coordinates = {
    latitude: number
    longitude: number
}

export type GeographyPoint = {
    type: 'Point'
    coordinates: [number, number] // [longitude, latitude] per GeoJSON spec
}

export type SignalWithSynthesis = Signal & {
    synthesis: Synthesis[]
}

export type SignalWithClusters = Signal & {
    clusters: (ClusterSignal & {
        cluster: Cluster
    })[]
}

export type SignalComplete = Signal & {
    synthesis: Synthesis[]
    clusters: (ClusterSignal & {
        cluster: Cluster
    })[]
}

export type ClusterWithSignals = Cluster & {
    signals: (ClusterSignal & {
        signal: Signal
    })[]
}

export type ClusterWithSynthesis = Cluster & {
    synthesis: Synthesis[]
}

export type ClusterWithHierarchy = Cluster & {
    parent_cluster: Cluster | null
    child_clusters: Cluster[]
}

export type ClusterComplete = Cluster & {
    signals: (ClusterSignal & {
        signal: Signal
    })[]
    synthesis: Synthesis[]
    parent_cluster: Cluster | null
    child_clusters: Cluster[]
}

export type SynthesisWithSignal = Synthesis & {
    signal: Signal | null
}

export type SynthesisWithCluster = Synthesis & {
    cluster: Cluster | null
}

export type SynthesisComplete = Synthesis & {
    signal: Signal | null
    cluster: Cluster | null
}

export type SignalMetadata = Record<string, unknown>
export type SignalPayload = Record<string, unknown>
export type SignalTags = string[]

export type ClusterMetadata = Record<string, unknown>
export type ClusterPayload = Record<string, unknown>
export type ClusterAnnotations = Record<string, unknown>
export type ClusterTags = string[]

export type SynthesisContent = Record<string, unknown>
export type SynthesisAnnotations = Record<string, unknown>
export type SynthesisHistory = Array<{
    timestamp: string
    action: string
    data?: Record<string, unknown>
}>
export type SynthesisErrors = Array<{
    timestamp: string
    error: string
    context?: Record<string, unknown>
}>

import type { USER_ROLES } from './constants'

export type UserRole = typeof USER_ROLES[number]

export type UserWithPermissions = User & {
    permissions: {
        can_create: boolean
        can_edit: boolean
        can_delete: boolean
        can_view_sanctum: boolean
        can_view_private: boolean
    }
}

export type RealmWithMembers = Realm & {
    members: RealmUser[]
}

export type RealmWithSignals = Realm & {
    signals: Signal[]
}

export type RealmComplete = Realm & {
    members: RealmUser[]
    signals: Signal[]
    clusters: Cluster[]
    synthesis: Synthesis[]
}

export type UserWithRealms = User & {
    created_realms: Realm[]
    realm_memberships: RealmUser[]
}

export type EmbeddingVector = number[] // 1536 dimensions for OpenAI ada-002

export const isPostgres = process.env.DATABASE_URL?.startsWith('postgres')

export type JsonValue = Prisma.JsonValue
export type JsonObject = Prisma.JsonObject
