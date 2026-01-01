// lib/ai/providers/anthropic.ts

import Anthropic from "@anthropic-ai/sdk";
import { AIProvider, ReflectionResult } from "../types";

export class AnthropicProvider implements AIProvider {
    name = "anthropic";
    private client: Anthropic;
    private model = "claude-sonnet-4-20250514";

    constructor(apiKey: string) {
        this.client = new Anthropic({ apiKey });
    }

    async reflect(content: string, signalType: string): Promise<ReflectionResult> {
        const prompt = `
Analyze this ${signalType} signal and extract structured data.

Content: ${content}

Respond ONLY with valid JSON in this exact format:
{
  "metadata": {
    "themes": ["theme1", "theme2"],
    "entities": ["entity1", "entity2"],
    "locations": ["location1"],
    "keywords": ["keyword1", "keyword2"]
  },
  "patterns": [
    {
      "type": "pattern_type",
      "description": "what was detected",
      "confidence": 0.85
    }
  ],
  "sentiment": {
    "emotional_markers": ["marker1", "marker2"],
    "cognitive_state": "reflective",
    "intensity": 0.7
  }
}
    `.trim();

        const response = await this.client.messages.create({
            model: this.model,
            max_tokens: 2000,
            messages: [{ role: "user", content: prompt }],
        });

        const text = response.content[0].type === "text"
            ? response.content[0].text
            : "";

        // Strip markdown code fences if present
        const cleaned = text.replace(/```json\n?|\n?```/g, "").trim();

        return JSON.parse(cleaned);
    }
}
