// app/page.tsx
import Link from 'next/link'
import Icon from '@/components/Icon'
import { VideoCarousel } from '@/components/VideoCarousel'

const autonomyVideos = [
    {
        id: '01KE0MJGY36CX4PZ9ZH1PF0N3V',
        title: 'Announcing Open Source Signal Processing System',
        youtube_id: 'pksrc69dp6I',
        thumbnail: 'https://i.ytimg.com/vi/pksrc69dp6I/maxresdefault.jpg',
    },
    {
        id: '01KE59PRNGK48FBJ30R84F8XFB',
        title: 'Demonstrating Autonomy Admin Interface and Signal Management',
        youtube_id: 'suJQC6pezDc',
        thumbnail: 'https://i.ytimg.com/vi/suJQC6pezDc/sddefault.jpg',
    },
]

export default function HomePage() {
    return (
        <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
            <div className="max-w-6xl mx-auto px-4 py-20 sm:px-6 lg:px-8">
                {/* Hero */}
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 mb-6">
                        Your documentation disappears into platforms you don't control
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        Every photo, note, and conversation fragments across proprietary systems. Platform algorithms decide what matters. AI tools reframe your reality instead of reflecting it. You lose access when policies change or services shut down.
                    </p>
                </div>

                {/* What Autonomy Does */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Autonomy preserves what platforms destroy</h2>
                    <div className="space-y-4 text-lg text-gray-700">
                        <p>
                            <strong>Open-source infrastructure for documenting lived experience.</strong> Capture signals (photos, documents, videos, conversations), extract metadata automatically, detect patterns across time and space, reflect with AI that doesn't reframe your reality.
                        </p>
                        <p>
                            You host it. You own the data. No platform intermediaries. No algorithmic curation. No interpretive distortion.
                        </p>
                    </div>
                </div>

                {/* Video Carousel */}
                <VideoCarousel videos={autonomyVideos} />

                {/* Proof */}
                <div className="mt-16 bg-gradient-to-br from-teal-50 to-teal-100 border border-teal-200 rounded-xl p-8 mb-16">
                    <h2 className="text-2xl font-bold text-teal-900 mb-3">This isn't theory. It's operational.</h2>
                    <p className="text-teal-800 text-lg mb-6">
                        Autonomy has processed <strong>800+ video transmissions</strong> with complete metadata extraction and AI reflection. Over <strong>8,000 signals</strong> documented across multiple realms. Running in production for 2+ years.
                    </p>

                    <a href="https://rswfire.autonomyrealms.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-6 py-3 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition"
                    >
                    View Live Example: rswfire.autonomyrealms.com
                    <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                    </svg>
                </a>
            </div>

            {/* How It Works */}
            <div className="mb-16">
                <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">How it works</h2>
                <div className="grid md:grid-cols-4 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                            <span className="text-2xl font-bold text-teal-600">1</span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Capture Signals</h3>
                        <p className="text-gray-600 text-sm">
                            Upload photos, documents, videos, or paste conversations. Each becomes an atomic signal with timestamps and location data.
                        </p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                            <span className="text-2xl font-bold text-teal-600">2</span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Extract Metadata</h3>
                        <p className="text-gray-600 text-sm">
                            AI processing extracts structure: topics, entities, timestamps, locations. No manual tagging required.
                        </p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                            <span className="text-2xl font-bold text-teal-600">3</span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Detect Patterns</h3>
                        <p className="text-gray-600 text-sm">
                            System identifies clusters across time, space, and themes. Patterns emerge from signal streams.
                        </p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                            <span className="text-2xl font-bold text-teal-600">4</span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Reflection</h3>
                        <p className="text-gray-600 text-sm">
                            Generate synthesis that mirrors your reality without interpretive reframing. Truth preserved, not managed.
                        </p>
                    </div>
                </div>
            </div>

            {/* Get Started */}
            <div className="mb-16">
                <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Get started</h2>
                <div className="grid md:grid-cols-3 gap-6">
                    <Link
                        href="/docs/getting-started"
                        className="flex flex-col bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition group"
                    >
                        <Icon name="Rocket" size={28} className="text-teal-500 mb-3" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-teal-600">
                            Run It Locally
                        </h3>
                        <p className="text-gray-600">
                            Clone the repo, start the server, add your first signal. Full setup in under 10 minutes.
                        </p>
                    </Link>

                    <a href="https://autonomyrealms.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition group"
                    >
                    <Icon name="Castle" size={28} className="text-teal-500 mb-3" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-teal-600">
                        Claim Your Realm
                    </h3>
                    <p className="text-gray-600">
                        Get your own subdomain at autonomyrealms.com. Hosted infrastructure, full sovereignty.
                    </p>
                </a>
                <Link
                    href="/docs"
                    className="flex flex-col bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition group"
                >
                    <Icon name="BookOpen" size={28} className="text-teal-500 mb-3" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-teal-600">
                        Read the Docs
                    </h3>
                    <p className="text-gray-600">
                        Architecture, concepts, deployment guides. Everything you need to understand the system.
                    </p>
                </Link>
            </div>
        </div>

    {/* Open Source CTA */}
    <div className="bg-gray-900 text-white rounded-xl p-8 text-center">
        <h2 className="text-2xl font-bold mb-3">Fully open source. MIT licensed.</h2>
        <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Clone it, fork it, modify it, deploy it. The code is yours. No gatekeeping, no vendor lock-in, no proprietary APIs.
        </p>

        <a href="https://github.com/rswfire/autonomy"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center px-6 py-3 bg-white text-gray-900 font-medium rounded-lg hover:bg-gray-100 transition"
        >
        <Icon name="Computer" size={20} className="mr-2" />
        View on GitHub
    </a>
</div>
</div>
</main>
)
}
