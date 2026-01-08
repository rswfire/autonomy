// lib/types/reflection.ts
import type { Reflection } from "@prisma/client"

export type ReflectionWithSignal = Reflection & {
    signal?: any
}

export type ReflectionWithCluster = Reflection & {
    cluster?: any
}

export type ReflectionAnnotations = {
    user_notes?: Array<{
        timestamp: string
        note: string
        user_id?: string
    }>
}

export type ReflectionHistory = Array<{
    timestamp: string
    type: string
    reflection_type?: string
    account_id?: string
    model?: string
    system_prompt?: string
    user_prompt?: string
    response?: string
    tokens?: number
    error?: string
}>
