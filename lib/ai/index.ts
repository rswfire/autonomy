// lib/ai/index.ts

import { AnthropicProvider } from './providers/anthropic';
import { AIProvider } from './types';

export function getAIProvider(): AIProvider {
    const provider = process.env.AI_PROVIDER || 'anthropic';

    switch (provider) {
        case 'anthropic':
            return new AnthropicProvider(process.env.ANTHROPIC_API_KEY!);

        // Add more providers later
        // case 'local':
        //   return new LocalProvider();

        default:
            throw new Error(`Unknown AI provider: ${provider}`);
    }
}
