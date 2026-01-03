// lib/types/realm.ts
import type { Realm, RealmUser, Signal, Cluster, Synthesis } from '@prisma/client'

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
