// app/page.tsx (updated with Anchor component)
import Link from 'next/link'
import Icon from '@/components/Icon'
import { VideoCarousel } from '@/components/VideoCarousel'
import { Anchor } from '@/components/Anchor'

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
        <>
            {/* Hero Section */}
            <div className="p-12 border-b border-gray-100">
                <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-4">
                    Your life isn’t lost &mdash; it’s just scattered, stripped of context, and rewritten by systems you don’t own.
                </h1>
                <p className="max-w-5xl mx-auto text-lg text-gray-700 leading-relaxed">
                    Every photo you take. Every message you send. Every idea you share. Scattered across platforms, stripped of context, sealed inside proprietary silos, and fed into training sets. Your data becomes their asset. Your patterns become their commodity. Your story is flattened, filtered, and monetized &mdash; without your consent.
                </p>

            </div>

            {/* What Autonomy Does */}
            <div className="p-12 border-b border-gray-100">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    Autonomy captures your experience &mdash; and returns it to your control.
                </h2>
                <div className="space-y-4 text-lg text-gray-700">
                    <p className="max-w-5xl mx-auto text-lg text-gray-700 leading-relaxed">
                        <strong>Autonomy captures the raw material of your life — photos, documents, audio, video — and organizes it into signals: contextual, structured fragments of your reality that remain yours, not the platform’s.</strong></p>
                    <p className="max-w-5xl mx-auto text-lg text-gray-700 leading-relaxed">Every photo, document, conversation, or video becomes a signal &mdash;
                        timestamped, geolocated, embedded with metadata. The system detects patterns and
                        synthesizes meaning without distortion.
                    </p>
                    <p className="max-w-5xl mx-auto text-lg text-gray-700 leading-relaxed">
                        You own the system. You own the data. No black-box algorithms. No third-party
                        gatekeepers. No therapeutic reframing of your experience. Just the raw, structured truth.
                    </p>
                </div>
            </div>

            {/* Video Carousel */}
            <div className="p-12 border-b border-gray-100 bg-gray-50">
                <VideoCarousel videos={autonomyVideos} />
            </div>

            {/* Proof Section */}
            <div className="p-12 border-b border-gray-100 bg-gradient-to-br from-teal-50 to-teal-100">
                <h2 className="max-w-4xl mx-auto text-2xl font-bold text-teal-900 mb-3">
                    This isn't theory. It's operational.
                </h2>
                <p className="max-w-4xl mx-auto text-teal-800 text-lg mb-6">
                    Autonomy has processed over <strong>800 longform video signals</strong> with full metadata
                    extraction and AI synthesis. <strong>Thousands of signals</strong> &mdash; documents,
                    conversations, images, routes &mdash; across active realms. Production-grade, running for 2+
                    years. This is a working system, not a whitepaper.
                </p>

                <div className="max-w-4xl mx-auto ">
                <Anchor
                    href="https://rswfire.autonomyrealms.com"
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
                </Anchor>
                </div>
            </div>

            {/* How It Works */}
            <div className="p-12 border-b border-gray-100">
                <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">How it works</h2>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                            <span className="text-xl font-bold text-teal-600">1</span>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">Capture Everything</h3>
                            <p className="text-gray-600 text-sm">
                                Photos from your phone. Videos you publish. Documents you write.
                                Conversations you have. Maps of where you've been. All of it becomes signals
                                with timestamps and locations.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                            <span className="text-xl font-bold text-teal-600">2</span>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">Extract Structure</h3>
                            <p className="text-gray-600 text-sm">
                                AI processing pulls out topics, people, places, timestamps. The structure of
                                your life becomes queryable without manual tagging.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                            <span className="text-xl font-bold text-teal-600">3</span>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">Find Patterns</h3>
                            <p className="text-gray-600 text-sm">
                                System clusters signals across time, geography, and themes. Recurring
                                patterns emerge. You see what actually happened, not what an algorithm wants
                                you to remember.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                            <span className="text-xl font-bold text-teal-600">4</span>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">Reflect Without
                                Reframing</h3>
                            <p className="text-gray-600 text-sm">
                                AI synthesis mirrors reality. No therapeutic language. No reinterpretation.
                                Just high-fidelity reflection of what's actually in your data.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Get Started */}
            <div className="p-12 border-b border-gray-100 bg-gray-50">
                <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Get started</h2>
                <div className="grid md:grid-cols-3 gap-6">
                    <Link
                        href="/docs/getting-started"
                        className="flex flex-col bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition group"
                    >
                        <Icon name="Rocket" size={28} className="text-teal-500 mb-3"/>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-teal-600">
                            Run It Locally
                        </h3>
                        <p className="text-gray-600 text-sm">
                            Clone the repo, start the server, add your first signal. Full setup in under 10
                            minutes.
                        </p>
                    </Link>

                    <Anchor
                        href="https://autonomyrealms.com"
                        className="flex flex-col bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition group"
                    >
                        <Icon name="Castle" size={28} className="text-teal-500 mb-3"/>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-teal-600">
                            Claim Your Realm
                        </h3>
                        <p className="text-gray-600 text-sm">
                            Get your own subdomain at autonomyrealms.com. Hosted infrastructure, full
                            sovereignty over your data.
                        </p>
                    </Anchor>

                    <Link
                        href="/docs"
                        className="flex flex-col bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition group"
                    >
                        <Icon name="BookOpen" size={28} className="text-teal-500 mb-3"/>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-teal-600">
                            Read the Docs
                        </h3>
                        <p className="text-gray-600 text-sm">
                            Architecture, concepts, deployment guides. Everything you need to understand the
                            system.
                        </p>
                    </Link>
                </div>
            </div>

            {/* Open Source CTA */}
            <div className="p-12 bg-gray-900 text-white">
                <h2 className="text-2xl font-bold mb-3 text-center">Fully open source. MIT licensed.</h2>
                <p className="text-gray-300 mb-6 text-center max-w-2xl mx-auto">
                    Clone it, fork it, modify it, deploy it. The code is yours. No gatekeeping, no vendor
                    lock-in, no proprietary APIs.
                </p>

                <div className="text-center">
                    <Anchor
                        href="https://github.com/rswfire/autonomy"
                        className="inline-flex items-center px-6 py-3 bg-white text-gray-900 font-medium rounded-lg hover:bg-gray-100 transition"
                    >
                        <Icon name="Computer" size={20} className="mr-2"/>
                        View on GitHub
                    </Anchor>
                </div>
            </div>
        </>
    )
}
