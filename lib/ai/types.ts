// lib/ai/types.ts

export interface ReflectionResult {
    metadata: {
        themes: string[];
        entities: string[];
        locations: string[];
        keywords: string[];
        [key: string]: any;
    };
    patterns: {
        type: string;
        description: string;
        confidence: number;
    }[];
    sentiment: {
        emotional_markers: string[];
        cognitive_state: string;
        intensity: number;
        [key: string]: any;
    };
}

export interface AIProvider {
    name: string;
    reflect(content: string, signalType: string): Promise<ReflectionResult>;
}
