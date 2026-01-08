// app/docs/concepts/analysis/page.tsx
import Link from 'next/link'

export default function AnalysisPage() {
    return (
        <div className="max-w-4xl mx-auto px-6 py-12">
            <div className="mb-8">
                <Link href="/docs" className="text-blue-600 hover:underline text-sm">
                    ← Back to Documentation
                </Link>
            </div>

            <h1 className="text-4xl font-bold text-gray-900 mb-4">🔍 Analysis Architecture</h1>
            <p className="text-xl text-gray-600 mb-12">
                Two-pass reflection system for extracting surface and structural metadata from signals.
            </p>

            {/* What is Analysis */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">What is Analysis?</h2>
                <div className="prose prose-lg text-gray-700 space-y-4">
                    <p>
                        Analysis in Autonomy processes raw signal content through LLM-powered reflection to extract structured metadata. This metadata enables pattern recognition, clustering, and synthesis across signals.
                    </p>
                    <p>
                        Analysis operates in <strong>two distinct passes</strong>, each targeting a different layer of signal structure:
                    </p>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mt-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Pass 1: Surface Reflection</h3>
                        <p className="text-gray-700 mb-2">
                            Observable narrative elements — what happened, who/what was involved, where it occurred.
                        </p>
                        <p className="text-sm text-gray-600">
                            <strong>Output fields:</strong> title, summary, environment, temperature, density, actions, entities, tags
                        </p>
                    </div>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mt-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Pass 2: Structural Reflection</h3>
                        <p className="text-gray-700 mb-2">
                            Underlying architecture — energetic state, ontological position, symbolic elements, engaged subsystems.
                        </p>
                        <p className="text-sm text-gray-600">
                            <strong>Output fields:</strong> energy, state, orientation, substrate, ontological_states, symbolic_elements, subsystems, dominant_language
                        </p>
                    </div>
                </div>
            </section>

            {/* System Architecture */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">System Architecture</h2>

                <div className="space-y-6">
                    {/* Prompt Structure */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Prompt Structure</h3>
                        <p className="text-gray-700 mb-4">
                            Each analysis pass constructs prompts from multiple template files:
                        </p>
                        <div className="space-y-3">
                            <div className="border-l-4 border-blue-500 pl-4">
                                <code className="text-sm font-mono text-blue-600">invocation.md</code>
                                <p className="text-sm text-gray-600 mt-1">
                                    Universal framing — defines Autonomy Realms context, epistemic principles, prohibited reductions
                                </p>
                            </div>
                            <div className="border-l-4 border-blue-500 pl-4">
                                <code className="text-sm font-mono text-blue-600">realm.md</code>
                                <p className="text-sm text-gray-600 mt-1">
                                    Realm-specific instructions from <code>realm_llm_settings.realm_context</code>
                                </p>
                            </div>
                            <div className="border-l-4 border-blue-500 pl-4">
                                <code className="text-sm font-mono text-blue-600">surface/system.md</code> or <code className="text-sm font-mono text-blue-600">structure/system.md</code>
                                <p className="text-sm text-gray-600 mt-1">
                                    Pass-specific system instructions
                                </p>
                            </div>
                            <div className="border-l-4 border-blue-500 pl-4">
                                <code className="text-sm font-mono text-blue-600">surface/user.md</code> or <code className="text-sm font-mono text-blue-600">structure/user.md</code>
                                <p className="text-sm text-gray-600 mt-1">
                                    User prompt with signal content, questions, and response format
                                </p>
                            </div>
                            <div className="border-l-4 border-blue-500 pl-4">
                                <code className="text-sm font-mono text-blue-600">surface/questions.json</code> or <code className="text-sm font-mono text-blue-600">structure/questions.json</code>
                                <p className="text-sm text-gray-600 mt-1">
                                    Field-specific extraction prompts
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Response Format */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Response Format</h3>
                        <p className="text-gray-700 mb-4">
                            Both passes return structured JSON. The system strips markdown code fences and parses the response into database fields.
                        </p>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm font-semibold text-gray-800 mb-2">Surface Response:</p>
                                <pre className="bg-gray-50 p-3 rounded text-xs overflow-x-auto"><code>{`{
  "title": "...",
  "summary": "...",
  "environment": "...",
  "temperature": 0.5,
  "density": 0.7,
  "actions": ["..."],
  "entities": [
    {
      "name": "...",
      "type": "people|places|...",
      "context": "..."
    }
  ],
  "tags": ["..."]
}`}</code></pre>
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-800 mb-2">Structure Response:</p>
                                <pre className="bg-gray-50 p-3 rounded text-xs overflow-x-auto"><code>{`{
  "energy": "...",
  "state": "...",
  "orientation": "...",
  "substrate": "...",
  "ontological_states": ["..."],
  "symbolic_elements": ["..."],
  "subsystems": ["..."],
  "dominant_language": ["..."]
}`}</code></pre>
                            </div>
                        </div>
                    </div>

                    {/* Model Router */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Model Router</h3>
                        <p className="text-gray-700 mb-4">
                            <code className="text-blue-600 font-mono">ModelRouter</code> abstracts LLM API calls. Supports Claude (Anthropic), OpenAI, and local models (Ollama-compatible).
                        </p>
                        <p className="text-sm text-gray-600 mb-3">
                            Each realm configures LLM accounts in <code>realm_llm_accounts</code> table with provider, API key, model, and enabled status.
                        </p>
                        <div className="bg-gray-50 p-4 rounded">
                            <p className="text-sm font-semibold text-gray-800 mb-2">Supported Providers:</p>
                            <ul className="text-sm text-gray-700 space-y-1">
                                <li><code className="text-blue-600">claude</code> — Anthropic API (recommended)</li>
                                <li><code className="text-blue-600">openai</code> — OpenAI API</li>
                                <li><code className="text-blue-600">local</code> — Ollama or vLLM</li>
                            </ul>
                        </div>
                    </div>

                    {/* History Logging */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Analysis History</h3>
                        <p className="text-gray-700 mb-4">
                            Every analysis pass is logged to <code>signal_history</code> with full prompts, responses, token counts, and errors.
                        </p>
                        <pre className="bg-gray-50 p-3 rounded text-xs overflow-x-auto"><code>{`{
  "type": "analysis_surface" | "analysis_structure",
  "timestamp": "2025-01-07T...",
  "account_id": "...",
  "model": "claude-sonnet-4",
  "system_prompt": "...",
  "user_prompt": "...",
  "response": "...",
  "tokens": 1234,
  "fields_updated": ["title", "summary", ...],
  "error": null
}`}</code></pre>
                    </div>
                </div>
            </section>

            {/* Surface Layer Reference */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Surface Layer Fields</h2>
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Field</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200 text-sm">
                        <tr>
                            <td className="px-6 py-4 font-mono text-blue-600">signal_title</td>
                            <td className="px-6 py-4 text-gray-600">string</td>
                            <td className="px-6 py-4 text-gray-700">Clear, descriptive title (under 10 words)</td>
                        </tr>
                        <tr>
                            <td className="px-6 py-4 font-mono text-blue-600">signal_summary</td>
                            <td className="px-6 py-4 text-gray-600">string</td>
                            <td className="px-6 py-4 text-gray-700">Third-person narrative summary of what happened</td>
                        </tr>
                        <tr>
                            <td className="px-6 py-4 font-mono text-blue-600">signal_environment</td>
                            <td className="px-6 py-4 text-gray-600">string</td>
                            <td className="px-6 py-4 text-gray-700">Physical/digital setting description (max 500 chars)</td>
                        </tr>
                        <tr>
                            <td className="px-6 py-4 font-mono text-blue-600">signal_temperature</td>
                            <td className="px-6 py-4 text-gray-600">decimal</td>
                            <td className="px-6 py-4 text-gray-700">Intensity/volatility (0.0 = calm, 1.0 = highly charged)</td>
                        </tr>
                        <tr>
                            <td className="px-6 py-4 font-mono text-blue-600">signal_density</td>
                            <td className="px-6 py-4 text-gray-600">decimal</td>
                            <td className="px-6 py-4 text-gray-700">Information density (0.0 = sparse, 1.0 = compressed)</td>
                        </tr>
                        <tr>
                            <td className="px-6 py-4 font-mono text-blue-600">signal_actions</td>
                            <td className="px-6 py-4 text-gray-600">object</td>
                            <td className="px-6 py-4 text-gray-700">
                                Actions across temporal layers: performed (during signal), referenced (past actions discussed), planned (future intentions)
                            </td>
                        </tr>
                        <tr>
                            <td className="px-6 py-4 font-mono text-blue-600">signal_entities</td>
                            <td className="px-6 py-4 text-gray-600">array</td>
                            <td className="px-6 py-4 text-gray-700">Named entities with type and context</td>
                        </tr>
                        <tr>
                            <td className="px-6 py-4 font-mono text-blue-600">signal_tags</td>
                            <td className="px-6 py-4 text-gray-600">array</td>
                            <td className="px-6 py-4 text-gray-700">3-7 semantic tags for categorization</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Structural Layer Reference */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Structural Layer Fields</h2>
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Field</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200 text-sm">
                        <tr>
                            <td className="px-6 py-4 font-mono text-blue-600">signal_energy</td>
                            <td className="px-6 py-4 text-gray-600">string</td>
                            <td className="px-6 py-4 text-gray-700">Energetic quality (e.g., grounded, turbulent, focused)</td>
                        </tr>
                        <tr>
                            <td className="px-6 py-4 font-mono text-blue-600">signal_state</td>
                            <td className="px-6 py-4 text-gray-600">string</td>
                            <td className="px-6 py-4 text-gray-700">Condition/phase (e.g., stable, transitional, rupturing)</td>
                        </tr>
                        <tr>
                            <td className="px-6 py-4 font-mono text-blue-600">signal_orientation</td>
                            <td className="px-6 py-4 text-gray-600">string</td>
                            <td className="px-6 py-4 text-gray-700">Directional phrase (e.g., toward sovereignty, building infrastructure)</td>
                        </tr>
                        <tr>
                            <td className="px-6 py-4 font-mono text-blue-600">signal_substrate</td>
                            <td className="px-6 py-4 text-gray-600">string</td>
                            <td className="px-6 py-4 text-gray-700">2-3 sentence description of underlying thesis/architecture</td>
                        </tr>
                        <tr>
                            <td className="px-6 py-4 font-mono text-blue-600">signal_ontological_states</td>
                            <td className="px-6 py-4 text-gray-600">array</td>
                            <td className="px-6 py-4 text-gray-700">2-4 ontological conditions (e.g., sovereign, embedded, coherent)</td>
                        </tr>
                        <tr>
                            <td className="px-6 py-4 font-mono text-blue-600">signal_symbolic_elements</td>
                            <td className="px-6 py-4 text-gray-600">array</td>
                            <td className="px-6 py-4 text-gray-700">Symbolic/archetypal elements as field markers</td>
                        </tr>
                        <tr>
                            <td className="px-6 py-4 font-mono text-blue-600">signal_subsystems</td>
                            <td className="px-6 py-4 text-gray-600">array</td>
                            <td className="px-6 py-4 text-gray-700">
                                Engaged subsystems with contextual role (e.g., 'financial (constraint boundary)', 'relational (functional contrast)')
                            </td>
                        </tr>
                        <tr>
                            <td className="px-6 py-4 font-mono text-blue-600">signal_dominant_language</td>
                            <td className="px-6 py-4 text-gray-600">array</td>
                            <td className="px-6 py-4 text-gray-700">2-4 language domains (technical, architectural, ecological, etc.)</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Customization */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Customization</h2>
                <div className="space-y-6">
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Realm-Specific Instructions</h3>
                        <p className="text-gray-700 mb-3">
                            Configure <code className="text-blue-600">realm_context</code> in <code>realm_llm_settings</code> to provide realm-specific framing for analysis.
                        </p>
                        <p className="text-sm text-gray-600">
                            This context is injected into every analysis pass via <code>realm.md</code> template.
                        </p>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Signal Annotations</h3>
                        <p className="text-gray-700 mb-3">
                            User notes in <code className="text-blue-600">signal_annotations.user_notes</code> are automatically included in analysis prompts as high-priority context.
                        </p>
                        <p className="text-sm text-gray-600">
                            Format: <code>[{`{note: string, timestamp: ISO}`}]</code>
                        </p>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Modifying Prompts</h3>
                        <p className="text-gray-700 mb-3">
                            All prompt templates are in <code className="text-blue-600">lib/prompts/analyze/</code>
                        </p>
                        <div className="bg-gray-50 p-4 rounded mt-3">
                            <p className="text-sm font-semibold text-gray-800 mb-2">File Structure:</p>
                            <pre className="text-xs text-gray-700"><code>{`lib/prompts/analyze/
├── invocation.md
├── realm.md
├── surface/
│   ├── system.md
│   ├── user.md
│   └── questions.json
└── structure/
    ├── system.md
    ├── user.md
    └── questions.json`}</code></pre>
                        </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Adding Analysis Fields</h3>
                        <ol className="space-y-2 text-sm text-gray-700">
                            <li>1. Add field to <code>Signal</code> schema in <code>prisma/schema.prisma</code></li>
                            <li>2. Run <code className="text-blue-600">npx prisma migrate dev</code></li>
                            <li>3. Update <code>questions.json</code> to extract new field</li>
                            <li>4. Update response parser in <code>AnalysisService</code></li>
                            <li>5. Update UI to display new field</li>
                        </ol>
                    </div>
                </div>
            </section>

            {/* Synthesis Pattern */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Synthesis Pattern</h2>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <p className="text-gray-700 mb-3">
                        The analysis architecture is also used for <strong>synthesis</strong> — cluster-level pattern recognition that operates on aggregated signals.
                    </p>
                    <p className="text-gray-700 mb-4">
                        Synthesis uses the same prompt structure (invocation → realm → system → user → questions) but processes multiple signals to generate:
                    </p>
                    <ul className="space-y-2 text-sm text-gray-700">
                        <li><strong>Mirror synthesis:</strong> Structural reflection on patterns across signals</li>
                        <li><strong>Myth synthesis:</strong> Archetypal and symbolic pattern recognition</li>
                        <li><strong>Narrative synthesis:</strong> Coherent narrative construction from signal sequence</li>
                    </ul>
                    <p className="text-sm text-gray-600 mt-4">
                        See <Link href="/docs/concepts/synthesis" className="text-blue-600 hover:underline">Synthesis documentation</Link> for implementation details.
                    </p>
                </div>
            </section>

            {/* Key Principles */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Design Principles</h2>
                <div className="space-y-4">
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h3 className="font-semibold text-gray-900 mb-2">Two passes, not one unified analysis</h3>
                        <p className="text-gray-600">
                            Surface and structural layers serve distinct purposes. Separating them produces cleaner extraction and allows independent re-analysis.
                        </p>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h3 className="font-semibold text-gray-900 mb-2">Structural precision over narrative embellishment</h3>
                        <p className="text-gray-600">
                            Analysis prompts enforce factual field mapping and pattern recognition, not interpretation or emotional overlay.
                        </p>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h3 className="font-semibold text-gray-900 mb-2">Full auditability via history logging</h3>
                        <p className="text-gray-600">
                            Every analysis pass stores complete prompts and responses. Users can inspect what the model saw and regenerate if needed.
                        </p>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h3 className="font-semibold text-gray-900 mb-2">Realm sovereignty in framing</h3>
                        <p className="text-gray-600">
                            <code>realm_context</code> allows each realm to define its own analytical lens without modifying core prompts.
                        </p>
                    </div>
                </div>
            </section>

            {/* Related Concepts */}
            <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Related Concepts</h2>
                <div className="grid md:grid-cols-2 gap-4">
                    <Link href="/docs/concepts/signals" className="block p-6 bg-white rounded-lg border border-gray-200 hover:border-blue-500 transition-colors">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">📡 Signals</h3>
                        <p className="text-gray-600">Understanding what analysis operates on.</p>
                    </Link>
                    <Link href="/docs/concepts/synthesis" className="block p-6 bg-white rounded-lg border border-gray-200 hover:border-blue-500 transition-colors">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">🔮 Synthesis</h3>
                        <p className="text-gray-600">Cluster-level pattern recognition using same architecture.</p>
                    </Link>
                    <Link href="/docs/concepts/realms" className="block p-6 bg-white rounded-lg border border-gray-200 hover:border-blue-500 transition-colors">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">🏰 Realms</h3>
                        <p className="text-gray-600">Realm-specific configuration and context.</p>
                    </Link>
                    <Link href="/docs/getting-started" className="block p-6 bg-white rounded-lg border border-gray-200 hover:border-blue-500 transition-colors">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Get Started</h3>
                        <p className="text-gray-600">Set up your first analysis.</p>
                    </Link>
                </div>
            </section>
        </div>
    )
}
