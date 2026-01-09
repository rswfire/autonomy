// lib/constants/reflection.ts

export const REFLECTION_DESCRIPTIONS = {
    MIRROR: "High-fidelity structural reflection",
    SYMBOLIC: "Archetypal/symbolic narrative",
    NARRATIVE: "Temporal/developmental story",
    LINEAGE: "Historical/genealogical context",
} as const;

export type ReflectionDescription = typeof REFLECTION_DESCRIPTIONS[keyof typeof REFLECTION_DESCRIPTIONS];

export const REFLECTION_TYPES = ["MIRROR", "SYMBOLIC", "NARRATIVE", "LINEAGE"] as const;

export type ReflectionType = typeof REFLECTION_TYPES[number];
