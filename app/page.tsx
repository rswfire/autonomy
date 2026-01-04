// app/page.tsx
import Link from 'next/link'
import Icon from "@/components/Icon";
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

                <VideoCarousel videos={autonomyVideos} />

                {/* Philosophy */}
                <div className="mt-12 max-w-3xl mx-auto mb-16">
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
                <div className="grid md:grid-cols-4 gap-8 mb-16">
                    <Link href="/docs/concepts/signals" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                        <div className="text-3xl mb-4">
                            <Icon name="SquareActivity" size={30} className="text-teal-400" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Signals</h3>
                        <p className="text-gray-600">
                            Atomic units of lived data. Photos, videos, audio, text, locations — timestamped and geolocated.
                        </p>
                    </Link>

                    <Link href="/docs/concepts/clusters" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                        <div className="text-3xl mb-4">
                            <Icon name="SquareCode" size={30} className="text-teal-400" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Clusters</h3>
                        <p className="text-gray-600">
                            Hierarchical groupings of signals based on time, space, or theme.
                        </p>
                    </Link>

                    <Link href="/docs/concepts/synthesis" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                        <div className="text-3xl mb-4">
                            <Icon name="SquareAsterisk" size={30} className="text-teal-400" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Synthesis</h3>
                        <p className="text-gray-600">
                            AI-powered pattern detection across signals. Mirror, Myth, and Narrative reflections without reframing.
                        </p>
                    </Link>

                    <Link href="/docs/concepts/realms" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                        <div className="text-3xl mb-4">
                            <Icon name="SquareLibrary" size={30} className="text-teal-400" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Realms</h3>
                        <p className="text-gray-600">
                            Sovereign territories for your signals. Private by default. You control visibility and access.
                        </p>
                    </Link>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                    <Link
                        href="/admin/login"
                        className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-center transition-colors"
                    >
                        Try Autonomy
                    </Link>

                    <a href="https://github.com/rswfire/autonomy"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-8 py-4 bg-gray-800 text-white rounded-lg hover:bg-gray-900 font-medium text-center transition-colors"
                    >
                    View on GitHub
                </a>
                <Link
                    href="/docs/"
                    className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 font-medium text-center transition-colors"
                >
                    Read the Docs
                </Link>
            </div>

        </div>
</div>
)
}
