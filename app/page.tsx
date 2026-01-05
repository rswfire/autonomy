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
                    <h1 className="text-6xl font-extrabold tracking-tight text-gray-900 mb-6">
                        Infrastructure for Sovereign Cognition
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Autonomy is a recursive system for capturing signals, detecting patterns, and reflecting lived experience — without distortion.
                    </p>
                </div>

                {/* Video Carousel */}
                <VideoCarousel videos={autonomyVideos} />

                {/* Actions */}
                <div className="mt-16 grid md:grid-cols-3 gap-6">
                    <Link
                        href="/admin/login"
                        className="flex flex-col items-start bg-white p-6 rounded-lg border hover:shadow-md transition"
                    >
                        <Icon name="SquareTerminal" size={24} className="text-blue-500 mb-3" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">Try It Now</h3>
                        <p className="text-gray-600 text-sm">Launch a local instance. Add signals. Watch the system reflect.</p>
                    </Link>
                    <a
                        href="https://github.com/rswfire/autonomy"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col items-start bg-white p-6 rounded-lg border hover:shadow-md transition"
                    >
                        <Icon name="Github" size={24} className="text-gray-800 mb-3" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">Clone the Core</h3>
                        <p className="text-gray-600 text-sm">Full source code. No distortion. Yours to fork, run, and extend.</p>
                    </a>
                    <Link
                        href="/docs"
                        className="flex flex-col items-start bg-white p-6 rounded-lg border hover:shadow-md transition"
                    >
                        <Icon name="BookOpen" size={24} className="text-green-500 mb-3" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">Explore the Docs</h3>
                        <p className="text-gray-600 text-sm">Understand the system. Learn how signals become structure.</p>
                    </Link>
                </div>

                {/* Core Concepts */}
                <div className="mt-24 mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">
                        Core Concepts
                    </h2>
                    <div className="grid md:grid-cols-4 gap-8">
                        <Link href="/docs/concepts/signals" className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
                            <Icon name="Radio" size={28} className="text-teal-500 mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Signals</h3>
                            <p className="text-gray-600 text-sm">Photos, notes, conversations — the atomic units of documentation.</p>
                        </Link>
                        <Link href="/docs/concepts/clusters" className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
                            <Icon name="Network" size={28} className="text-teal-500 mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Clusters</h3>
                            <p className="text-gray-600 text-sm">Patterns across time, space, and theme. Recurrence mapped.</p>
                        </Link>
                        <Link href="/docs/concepts/synthesis" className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
                            <Icon name="Sparkles" size={28} className="text-teal-500 mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Synthesis</h3>
                            <p className="text-gray-600 text-sm">AI reflections. Mirror, Myth, Narrative. No reframing.</p>
                        </Link>
                        <Link href="/docs/concepts/realms" className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
                            <Icon name="Castle" size={28} className="text-teal-500 mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Realms</h3>
                            <p className="text-gray-600 text-sm">Sovereign subdomains for documentation and reflection.</p>
                        </Link>
                    </div>
                </div>

                {/* Realms CTA */}
                <div className="bg-gradient-to-br from-teal-100 to-teal-50 border border-teal-200 p-8 rounded-xl text-center">
                    <h2 className="text-2xl font-bold text-teal-900 mb-3">
                        Ready to stake your realm?
                    </h2>
                    <p className="text-teal-800 mb-4 max-w-xl mx-auto">
                        Every realm is a sovereign archive. Spin up your own subdomain, document reality, and reflect without distortion.
                    </p>
                    <a
                        href="https://autonomyrealms.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-6 py-3 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition"
                    >
                        Visit Autonomy Realms
                        <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                    </a>
                </div>
            </div>
        </main>
    )
}
