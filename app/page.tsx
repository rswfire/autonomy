// app/page.tsx
import Link from 'next/link'

export default function HomePage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
            {/* Hero Section */}
            <div className="max-w-6xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold text-gray-900 mb-4">
                        Built with Autonomy
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Cognitive infrastructure for signal documentation, pattern recognition, and epistemic fidelity.
                    </p>
                </div>

                {/* Video */}
                <div className="mb-16">
                    <div className="relative w-full max-w-4xl mx-auto rounded-lg overflow-hidden shadow-2xl bg-black">
                        <div className="relative pt-[56.25%]">
                            <iframe
                                className="absolute top-0 left-0 w-full h-full"
                                src="https://www.youtube.com/embed/pksrc69dp6I"
                                title="Introducing Autonomy"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </div>
                    </div>
                    <p className="text-center text-sm text-gray-500 mt-4">
                        Signal 001 - Introducing Autonomy
                    </p>
                </div>

                {/* Philosophy */}
                <div className="max-w-3xl mx-auto mb-16">
                    <div className="bg-white rounded-lg shadow-md p-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                            What is Autonomy?
                        </h2>
                        <div className="prose prose-lg text-gray-700 space-y-4">
                            <p>
                                Autonomy treats your life as a continuous stream of signals — photos, videos, audio, text, locations — and uses AI-powered synthesis to identify patterns and preserve truth without distortion.
                            </p>
                            <p>
                                <strong>Core principle:</strong> Your reality should not be reframed, filtered, or flattened by systems that claim to help you.
                            </p>
                            <p>
                                Autonomy maintains epistemic fidelity — what you document is what the system reflects, without protective overlays or institutional sanitization.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-3 gap-8 mb-16">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="text-3xl mb-4">📡</div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Signals</h3>
                        <p className="text-gray-600">
                            Atomic units of lived data. Photos, videos, audio, text, locations — timestamped and geolocated.
                        </p>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="text-3xl mb-4">🔮</div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Synthesis</h3>
                        <p className="text-gray-600">
                            AI-powered pattern detection across signals. Mirror, Myth, and Narrative reflections without reframing.
                        </p>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="text-3xl mb-4">🏰</div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Realms</h3>
                        <p className="text-gray-600">
                            Sovereign territories for your signals. Private by default. You control visibility and access.
                        </p>
                    </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                    <Link
                        href="/admin/login"
                        className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-center transition-colors"
                    >
                        Try Autonomy
                    </Link>

                    <a href="https://github.com/rswfire/builtwithautonomy.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-8 py-4 bg-gray-800 text-white rounded-lg hover:bg-gray-900 font-medium text-center transition-colors"
                    >
                    View on GitHub
                </a>
                <Link
                    href="/docs/readme"
                    className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 font-medium text-center transition-colors"
                >
                    Read the Docs
                </Link>
            </div>

            {/* Principles */}
            <div className="max-w-3xl mx-auto">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-md p-8 border-l-4 border-blue-600">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        Core Principles
                    </h2>
                    <ul className="space-y-3 text-gray-700">
                        <li className="flex items-start">
                            <span className="text-blue-600 mr-2">•</span>
                            <span><strong>Reality has structure.</strong> Patterns are real and detectable.</span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-blue-600 mr-2">•</span>
                            <span><strong>Cognition has architecture.</strong> Coherent thinking follows traceable logic.</span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-blue-600 mr-2">•</span>
                            <span><strong>Systems can fragment or preserve.</strong> Most platforms fragment. Autonomy preserves.</span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-blue-600 mr-2">•</span>
                            <span><strong>Sovereignty matters.</strong> You should own your data, your patterns, your truth.</span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-blue-600 mr-2">•</span>
                            <span><strong>Epistemic honesty is non-negotiable.</strong> Systems that reframe your reality are abusive, even when they claim to help.</span>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Footer */}
            <div className="mt-16 pt-8 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-600">
                    <div>
                        <p>Created by <a href="https://rswfire.com/handshake" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Robert Samuel White</a></p>
                    </div>
                    <div className="flex gap-6">
                        <Link href="/docs/myth" className="hover:text-blue-600">Myth</Link>
                        <Link href="/docs/roadmap" className="hover:text-blue-600">Roadmap</Link>
                        <Link href="/docs/setup" className="hover:text-blue-600">Setup</Link>
                        <a href="https://github.com/rswfire/builtwithautonomy.com" className="hover:text-blue-600" target="_blank" rel="noopener noreferrer">GitHub</a>
                    </div>
                </div>
                <div className="text-center mt-8 text-gray-500">
                    <p className="text-xs">🔥🌊</p>
                    <p className="text-sm mt-2">Built with Autonomy. Built for truth. Built to remain.</p>
                </div>
            </div>
        </div>
</div>
)
}
