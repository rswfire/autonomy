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

// Realm Settings Types
export interface LlmAccount {
    id: string
    name: string
    provider: 'claude' | 'openai' | 'local'
    api_key: string
    model: string
    enabled: boolean
}

export interface RealmLlmSettings {
    accounts: LlmAccount[]
    default_account_id: string | null
    auto_analyze: boolean
    realm_context?: string
    realm_holder_name?: string
}

export interface RealmSettings {
    llm?: RealmLlmSettings
    sanctum?: any
    theme?: any
    features?: any
}
