// app/docs/page.tsx
import Link from 'next/link'

export default function DocsPage() {
    return (
        <div className="max-w-4xl mx-auto px-6 py-12">
            <div className="mb-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    Documentation
                </h1>
                <p className="text-xl text-gray-600">
                    Cognitive infrastructure for signal documentation, pattern recognition, and epistemic fidelity.
                </p>
            </div>

            {/* Getting Started */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Getting Started</h2>
                <div className="grid gap-4">
                    <Link href="/docs/getting-started" className="block p-6 bg-white rounded-lg border border-gray-200 hover:border-blue-500 transition-colors">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Quick Start</h3>
                        <p className="text-gray-600">Set up Autonomy and create your first signal.</p>
                    </Link>
                </div>
            </section>

            {/* Core Concepts */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Core Concepts</h2>
                <div className="grid md:grid-cols-2 gap-4">
                    <Link href="/docs/concepts/signals" className="block p-6 bg-white rounded-lg border border-gray-200 hover:border-blue-500 transition-colors">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">📡 Signals</h3>
                        <p className="text-gray-600">Atomic units of lived data. Photos, videos, audio, text, locations.</p>
                    </Link>

                    <Link href="/docs/concepts/realms" className="block p-6 bg-white rounded-lg border border-gray-200 hover:border-blue-500 transition-colors">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">🏰 Realms</h3>
                        <p className="text-gray-600">Sovereign territories for your signals. Multi-tenant data isolation.</p>
                    </Link>

                    <Link href="/docs/concepts/clusters" className="block p-6 bg-white rounded-lg border border-gray-200 hover:border-blue-500 transition-colors">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">🔗 Clusters</h3>
                        <p className="text-gray-600">Hierarchical groupings of signals based on time, space, or theme.</p>
                    </Link>

                    <Link href="/docs/concepts/synthesis" className="block p-6 bg-white rounded-lg border border-gray-200 hover:border-blue-500 transition-colors">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">🔮 Synthesis</h3>
                        <p className="text-gray-600">AI-powered pattern detection and reflection without reframing.</p>
                    </Link>
                </div>
            </section>

            {/* Philosophy */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Philosophy</h2>
                <div className="grid gap-4">
                    <Link href="/docs/philosophy" className="block p-6 bg-white rounded-lg border border-gray-200 hover:border-blue-500 transition-colors">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Why Autonomy Exists</h3>
                        <p className="text-gray-600">Epistemic fidelity, sovereignty, and the refusal to reframe reality.</p>
                    </Link>

                    <Link href="/docs/myth" className="block p-6 bg-white rounded-lg border border-gray-200 hover:border-blue-500 transition-colors">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">The Cartographer and the Unnamed Thing</h3>
                        <p className="text-gray-600">Mythic documentation of Autonomy's purpose and structure.</p>
                    </Link>
                </div>
            </section>

            {/* Architecture */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Architecture</h2>
                <div className="grid md:grid-cols-2 gap-4">
                    <Link href="/docs/architecture/database-schema" className="block p-6 bg-white rounded-lg border border-gray-200 hover:border-blue-500 transition-colors">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Database Schema</h3>
                        <p className="text-gray-600">Complete schema documentation with realms, signals, and synthesis.</p>
                    </Link>

                    <Link href="/docs/architecture/authentication" className="block p-6 bg-white rounded-lg border border-gray-200 hover:border-blue-500 transition-colors">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Authentication</h3>
                        <p className="text-gray-600">JWT-based auth with typed payloads and realm access control.</p>
                    </Link>

                    <Link href="/docs/architecture/multi-tenancy" className="block p-6 bg-white rounded-lg border border-gray-200 hover:border-blue-500 transition-colors">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Multi-Tenancy</h3>
                        <p className="text-gray-600">Realm-based data isolation and sovereignty enforcement.</p>
                    </Link>
                </div>
            </section>

            {/* Deployment */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Deployment</h2>
                <div className="grid gap-4">
                    <Link href="/docs/deployment/self-hosting" className="block p-6 bg-white rounded-lg border border-gray-200 hover:border-blue-500 transition-colors">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Self-Hosting Guide</h3>
                        <p className="text-gray-600">Deploy Autonomy on your own infrastructure.</p>
                    </Link>
                </div>
            </section>

            {/* External Links */}
            <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Additional Resources</h2>
                <div className="grid gap-4">
                    <a href="https://github.com/rswfire/autonomy" target="_blank" rel="noopener noreferrer" className="block p-6 bg-white rounded-lg border border-gray-200 hover:border-blue-500 transition-colors">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">GitHub Repository</h3>
                        <p className="text-gray-600">View source code, contribute, or report issues.</p>
                    </a>

                    <a href="https://github.com/rswfire/autonomy/blob/main/docs/roadmap.md" target="_blank" rel="noopener noreferrer" className="block p-6 bg-white rounded-lg border border-gray-200 hover:border-blue-500 transition-colors">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Roadmap</h3>
                        <p className="text-gray-600">Current status and planned features.</p>
                    </a>
                </div>
            </section>
        </div>
    )
}
