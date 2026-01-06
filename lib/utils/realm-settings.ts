// lib/utils/realm-settings.ts

import { prisma } from '@/lib/db'
import { randomBytes } from 'crypto'

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
}

export interface RealmSettings {
    llm?: RealmLlmSettings
    sanctum?: any
    theme?: any
    features?: any
}

/**
 * Load realm settings from database
 */
export async function loadRealmSettings(realmId: string): Promise<RealmSettings> {
    const realm = await prisma.realm.findUnique({
        where: { realm_id: realmId },
        select: { realm_settings: true },
    })

    if (!realm?.realm_settings) {
        return {}
    }

    return realm.realm_settings as RealmSettings
}

/**
 * Save realm settings to database
 */
export async function saveRealmSettings(
    realmId: string,
    settings: RealmSettings
): Promise<void> {
    await prisma.realm.update({
        where: { realm_id: realmId },
        data: { realm_settings: settings as any },
    })
}

/**
 * Get LLM settings for a realm
 */
export async function getRealmLlmSettings(realmId: string): Promise<RealmLlmSettings> {
    const settings = await loadRealmSettings(realmId)
    return settings.llm || {
        accounts: [],
        default_account_id: null,
        auto_analyze: false,
    }
}

/**
 * Update LLM settings for a realm
 */
export async function updateRealmLlmSettings(
    realmId: string,
    llmSettings: RealmLlmSettings
): Promise<void> {
    const currentSettings = await loadRealmSettings(realmId)
    await saveRealmSettings(realmId, {
        ...currentSettings,
        llm: llmSettings,
    })
}

/**
 * Generate unique LLM account ID
 */
export function generateLlmAccountId(): string {
    return `llm_${randomBytes(8).toString('hex')}`
}

/**
 * Get default LLM account for a realm
 */
export async function getDefaultLlmAccount(realmId: string): Promise<LlmAccount | null> {
    const settings = await getRealmLlmSettings(realmId)

    if (!settings.default_account_id) {
        return null
    }

    const account = settings.accounts.find(a => a.id === settings.default_account_id)
    return account || null
}

/**
 * Get LLM account by ID
 */
export async function getLlmAccount(realmId: string, accountId: string): Promise<LlmAccount | null> {
    const settings = await getRealmLlmSettings(realmId)
    const account = settings.accounts.find(a => a.id === accountId)
    return account || null
}
