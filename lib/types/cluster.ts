// lib/types/cluster.ts
import type { Cluster, ClusterSignal, Signal, Synthesis } from '@prisma/client'

export type ClusterMetadata = Record<string, unknown>
export type ClusterPayload = Record<string, unknown>
export type ClusterAnnotations = Record<string, unknown>
export type ClusterTags = string[]

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
