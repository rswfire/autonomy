// lib/constants/signal.ts

export const SIGNAL_TYPES = [
    'DOCUMENT',      // Text content (writing, code, notes)
    'PHOTO',         // Visual capture
    'TRANSMISSION',  // Audio/video (processed via transcript)
    'CONVERSATION',  // Dialogue logs (Claude chats, etc.)
] as const

export type SignalType = typeof SIGNAL_TYPES[number]

export const SIGNAL_CONTEXT = [
    'CAPTURE',      // Default - generic documentation, intent TBD
    'NOTE',         // Quick capture, ephemeral thought
    'JOURNAL',      // Reflective writing, daily log
    'CODE',         // Technical artifact, implementation
    'REFERENCE',    // External source, citation
    'OBSERVATION',  // Field note, documented reality
    'ARTIFACT',     // Created work, finished piece
] as const

export type SignalContext = typeof SIGNAL_CONTEXT[number]

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
