// app/docs/concepts/signals/page.tsx
import Link from 'next/link'

export default function SignalsPage() {
    return (
        <div className="max-w-4xl mx-auto px-6 py-12">
            <div className="mb-8">
                <Link href="/docs" className="text-blue-600 hover:underline text-sm">
                    ← Back to Documentation
                </Link>
            </div>

            <h1 className="text-4xl font-bold text-gray-900 mb-4">📡 Signals</h1>
            <p className="text-xl text-gray-600 mb-12">
                Atomic units of lived data. The foundation of pattern recognition and synthesis.
            </p>

            {/* What is a Signal */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">What is a Signal?</h2>
                <div className="prose prose-lg text-gray-700 space-y-4">
                    <p>
                        A signal is the atomic unit of lived data in Autonomy. It represents a single moment of documented reality — raw capture that forms the input layer for AI-powered pattern detection and synthesis.
                    </p>
                    <p>
                        Signals are not content. They're not posts. They're timestamped documentation, optionally geolocated, preserved with full structural fidelity.
                    </p>
                    <p className="mt-6">
                        Every signal belongs to a <strong>realm</strong> and has a <strong>type</strong> (the medium) and optional <strong>context</strong> (the intent).
                    </p>
                </div>
            </section>

            {/* Signal Types */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Signal Types (Medium)</h2>
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">DOCUMENT</h3>
                        <p className="text-gray-600">
                            Text in any form — writing, notes, code, references. The most common signal type.
                        </p>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">PHOTO</h3>
                        <p className="text-gray-600">
                            Visual capture. Images preserved with technical metadata when available.
                        </p>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">TRANSMISSION</h3>
                        <p className="text-gray-600">
                            Audio or video recordings. YouTube videos. Podcast episodes. Processed via transcript.
                        </p>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">CONVERSATION</h3>
                        <p className="text-gray-600">
                            Dialogue logs. AI chat transcripts. Co-created content from back-and-forth exchange.
                        </p>
                    </div>
                </div>
            </section>

            {/* Signal Context */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Signal Context (Intent)</h2>
                <p className="text-gray-700 mb-6">
                    Context describes <strong>why</strong> a signal was created. It's optional but provides valuable metadata for AI synthesis and pattern recognition.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h3 className="font-semibold text-gray-900 mb-1">CAPTURE</h3>
                        <p className="text-sm text-gray-600">Default — generic documentation, intent to be determined</p>
                    </div>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h3 className="font-semibold text-gray-900 mb-1">NOTE</h3>
                        <p className="text-sm text-gray-600">Quick capture, ephemeral thought</p>
                    </div>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h3 className="font-semibold text-gray-900 mb-1">JOURNAL</h3>
                        <p className="text-sm text-gray-600">Reflective writing, daily log</p>
                    </div>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h3 className="font-semibold text-gray-900 mb-1">CODE</h3>
                        <p className="text-sm text-gray-600">Technical artifact, implementation</p>
                    </div>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h3 className="font-semibold text-gray-900 mb-1">REFERENCE</h3>
                        <p className="text-sm text-gray-600">External source, citation</p>
                    </div>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h3 className="font-semibold text-gray-900 mb-1">OBSERVATION</h3>
                        <p className="text-sm text-gray-600">Field note, documented reality</p>
                    </div>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h3 className="font-semibold text-gray-900 mb-1">ARTIFACT</h3>
                        <p className="text-sm text-gray-600">Created work, finished piece</p>
                    </div>
                </div>
            </section>

            {/* Signal Structure */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Signal Structure</h2>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 mb-3">Core Fields</h3>
                    <div className="space-y-3 text-sm">
                        <div className="grid grid-cols-3 gap-4">
                            <code className="text-blue-600">signal_id</code>
                            <span className="col-span-2 text-gray-700">Unique identifier (ULID format)</span>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <code className="text-blue-600">realm_id</code>
                            <span className="col-span-2 text-gray-700">Which realm this signal belongs to</span>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <code className="text-blue-600">signal_type</code>
                            <span className="col-span-2 text-gray-700">Medium: DOCUMENT, PHOTO, TRANSMISSION, CONVERSATION</span>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <code className="text-blue-600">signal_context</code>
                            <span className="col-span-2 text-gray-700">Intent: CAPTURE, NOTE, JOURNAL, CODE, REFERENCE, OBSERVATION, ARTIFACT</span>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <code className="text-blue-600">signal_title</code>
                            <span className="col-span-2 text-gray-700">Brief title (initially from synthesis)</span>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <code className="text-blue-600">signal_description</code>
                            <span className="col-span-2 text-gray-700">Longer description (initially from synthesis)</span>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <code className="text-blue-600">signal_author</code>
                            <span className="col-span-2 text-gray-700">Who created/captured this signal</span>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <code className="text-blue-600">signal_temperature</code>
                            <span className="col-span-2 text-gray-700">Importance (-1.0 to 1.0)</span>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <code className="text-blue-600">signal_visibility</code>
                            <span className="col-span-2 text-gray-700">PUBLIC, PRIVATE, SANCTUM, or SHARED</span>
                        </div>
                    </div>

                    <h3 className="font-semibold text-gray-900 mb-3 mt-6">Temporal Data</h3>
                    <div className="space-y-3 text-sm">
                        <div className="grid grid-cols-3 gap-4">
                            <code className="text-blue-600">stamp_created</code>
                            <span className="col-span-2 text-gray-700">When the original content was captured</span>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <code className="text-blue-600">stamp_imported</code>
                            <span className="col-span-2 text-gray-700">When signal was created in the system</span>
                        </div>
                    </div>

                    <h3 className="font-semibold text-gray-900 mb-3 mt-6">Geospatial Data (Optional)</h3>
                    <div className="space-y-3 text-sm">
                        <div className="grid grid-cols-3 gap-4">
                            <code className="text-blue-600">signal_location</code>
                            <span className="col-span-2 text-gray-700">PostGIS Point (PostgreSQL)</span>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <code className="text-blue-600">signal_latitude / signal_longitude</code>
                            <span className="col-span-2 text-gray-700">Decimal coordinates (MySQL)</span>
                        </div>
                    </div>

                    <h3 className="font-semibold text-gray-900 mb-3 mt-6">Metadata & Payload (Type-Specific)</h3>
                    <div className="space-y-3 text-sm">
                        <div className="grid grid-cols-3 gap-4">
                            <code className="text-blue-600">signal_metadata</code>
                            <span className="col-span-2 text-gray-700">Technical metadata (EXIF data, duration, file size, etc.)</span>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <code className="text-blue-600">signal_payload</code>
                            <span className="col-span-2 text-gray-700">Content data (file paths, text content, transcripts)</span>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <code className="text-blue-600">signal_tags</code>
                            <span className="col-span-2 text-gray-700">Array of tags (initially from synthesis)</span>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <code className="text-blue-600">signal_embedding</code>
                            <span className="col-span-2 text-gray-700">Vector embedding for semantic search</span>
                        </div>
                    </div>

                    <h3 className="font-semibold text-gray-900 mb-3 mt-6">History & Annotations</h3>
                    <div className="space-y-3 text-sm">
                        <div className="grid grid-cols-3 gap-4">
                            <code className="text-blue-600">signal_history</code>
                            <span className="col-span-2 text-gray-700">Audit trail of edits and changes</span>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <code className="text-blue-600">signal_annotations</code>
                            <span className="col-span-2 text-gray-700">User notes and synthesis feedback</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Visibility Levels */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Visibility Levels</h2>
                <div className="space-y-4">
                    <div className="border-l-4 border-green-500 pl-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">PUBLIC</h3>
                        <p className="text-gray-700">
                            Anyone can view this signal (if they have access to the realm).
                        </p>
                    </div>

                    <div className="border-l-4 border-yellow-500 pl-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">SANCTUM</h3>
                        <p className="text-gray-700">
                            Only users with SANCTUM role or higher can view.
                        </p>
                    </div>

                    <div className="border-l-4 border-red-500 pl-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">PRIVATE</h3>
                        <p className="text-gray-700">
                            Only the realm owner can view this signal.
                        </p>
                    </div>

                    <div className="border-l-4 border-blue-500 pl-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">SHARED</h3>
                        <p className="text-gray-700">
                            Reserved for future multi-user realm features.
                        </p>
                    </div>
                </div>
            </section>

            {/* Signal Lifecycle */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Signal Lifecycle</h2>
                <div className="prose prose-lg text-gray-700 space-y-4">
                    <ol className="space-y-4">
                        <li>
                            <strong>Capture</strong> — Signal is created with minimal data: type, context, raw payload
                        </li>
                        <li>
                            <strong>Synthesis</strong> — AI processes signal and generates METADATA/SURFACE (title, description, tags)
                        </li>
                        <li>
                            <strong>Enrichment</strong> — Title/description/tags copied to signal table for display
                        </li>
                        <li>
                            <strong>Clustering</strong> — Can be grouped with related signals in clusters
                        </li>
                        <li>
                            <strong>Deep Synthesis</strong> — STRUCTURE, PATTERNS analysis for cross-signal insights
                        </li>
                        <li>
                            <strong>Reflection</strong> — MIRROR, MYTH, NARRATIVE generation at cluster level
                        </li>
                    </ol>
                </div>
            </section>

            {/* Key Principles */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Key Principles</h2>
                <div className="space-y-4">
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h3 className="font-semibold text-gray-900 mb-2">Signals are input for pattern recognition</h3>
                        <p className="text-gray-600">
                            Not content for consumption. Raw documentation of lived reality that AI synthesis processes to identify patterns and generate insights.
                        </p>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h3 className="font-semibold text-gray-900 mb-2">Every signal belongs to a realm</h3>
                        <p className="text-gray-600">
                            Signals don't exist in isolation. They're always part of a realm, ensuring clear ownership and access control.
                        </p>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h3 className="font-semibold text-gray-900 mb-2">Title/description/tags come from synthesis</h3>
                        <p className="text-gray-600">
                            These display fields are initially AI-generated, then user-editable. Changes are tracked in signal_history.
                        </p>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h3 className="font-semibold text-gray-900 mb-2">Location is metadata, not a signal type</h3>
                        <p className="text-gray-600">
                            Geographic coordinates attach to any signal. Places are clustering context, not signals themselves.
                        </p>
                    </div>
                </div>
            </section>

            {/* Related Concepts */}
            <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Related Concepts</h2>
                <div className="grid md:grid-cols-2 gap-4">
                    <Link href="/docs/concepts/realms" className="block p-6 bg-white rounded-lg border border-gray-200 hover:border-blue-500 transition-colors">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">🏰 Realms</h3>
                        <p className="text-gray-600">Understanding signal ownership and sovereignty.</p>
                    </Link>

                    <Link href="/docs/concepts/clusters" className="block p-6 bg-white rounded-lg border border-gray-200 hover:border-blue-500 transition-colors">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">🔗 Clusters</h3>
                        <p className="text-gray-600">Grouping related signals together.</p>
                    </Link>

                    <Link href="/docs/concepts/synthesis" className="block p-6 bg-white rounded-lg border border-gray-200 hover:border-blue-500 transition-colors">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">🔮 Synthesis</h3>
                        <p className="text-gray-600">AI-powered pattern detection and insight generation.</p>
                    </Link>

                    <Link href="/docs/getting-started" className="block p-6 bg-white rounded-lg border border-gray-200 hover:border-blue-500 transition-colors">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Get Started</h3>
                        <p className="text-gray-600">Create your first signal.</p>
                    </Link>
                </div>
            </section>
        </div>
    )
}
