// app/docs/getting-started/page.tsx
import Link from 'next/link'

export default function GettingStartedPage() {
    return (
        <div className="max-w-4xl mx-auto px-6 py-12">
            <div className="mb-8">
                <Link href="/docs" className="text-blue-600 hover:underline text-sm">
                    ← Back to Documentation
                </Link>
            </div>

            <h1 className="text-4xl font-bold text-gray-900 mb-4">Getting Started</h1>
            <p className="text-xl text-gray-600 mb-12">
                Set up Autonomy and create your first signal.
            </p>

            {/* Prerequisites */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Prerequisites</h2>
                <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-6">
                    <p className="text-gray-700">
                        Before you begin, make sure you have:
                    </p>
                    <ul className="mt-4 space-y-2 text-gray-700">
                        <li>• Node.js 18+ installed</li>
                        <li>• PostgreSQL or MySQL database</li>
                        <li>• Git (for cloning the repository)</li>
                        <li>• Basic understanding of Next.js and TypeScript (optional but helpful)</li>
                    </ul>
                </div>
            </section>

            {/* Installation */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Installation</h2>

                <h3 className="text-lg font-semibold text-gray-900 mb-3">1. Clone the Repository</h3>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg mb-6 overflow-x-auto">
                    <code className="text-sm">
                        git clone https://github.com/rswfire/autonomy.git<br/>
                        cd builtwithautonomy.com
                    </code>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-3">2. Install Dependencies</h3>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg mb-6 overflow-x-auto">
                    <code className="text-sm">npm install</code>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-3">3. Configure Environment</h3>
                <p className="text-gray-700 mb-3">Create a <code className="bg-gray-100 px-2 py-1 rounded text-sm">.env</code> file in the root directory:</p>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg mb-6 overflow-x-auto">
                    <code className="text-sm">
                        DATABASE_URL="postgresql://user:password@localhost:5432/autonomy"<br/>
                        JWT_SECRET="your-secure-secret-key-here"<br/>
                        NODE_ENV="development"
                    </code>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-3">4. Generate Database Schema</h3>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg mb-6 overflow-x-auto">
                    <code className="text-sm">
                        npm run db:generate-schema<br/>
                        npx prisma generate<br/>
                        npx prisma migrate dev --name initial_setup
                    </code>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-3">5. Create Owner Account</h3>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg mb-6 overflow-x-auto">
                    <code className="text-sm">npm run create:owner</code>
                </div>
                <p className="text-gray-600 mb-6">
                    Follow the prompts to create your owner account. This will also create your default private realm.
                </p>

                <h3 className="text-lg font-semibold text-gray-900 mb-3">6. Start Development Server</h3>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg mb-6 overflow-x-auto">
                    <code className="text-sm">npm run dev</code>
                </div>
                <p className="text-gray-600">
                    Open <a href="http://localhost:3000" className="text-blue-600 hover:underline">http://localhost:3000</a> in your browser.
                </p>
            </section>

            {/* First Steps */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">First Steps</h2>

                <div className="space-y-6">
                    <div className="border-l-4 border-blue-500 pl-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">1. Login</h3>
                        <p className="text-gray-700">
                            Navigate to <code className="bg-gray-100 px-2 py-1 rounded text-sm">/admin/login</code> and sign in with the owner account you just created.
                        </p>
                    </div>

                    <div className="border-l-4 border-blue-500 pl-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">2. Explore Your Realm</h3>
                        <p className="text-gray-700 mb-2">
                            You automatically have a default private realm. This is your sovereign territory for signals.
                        </p>
                        <Link href="/docs/concepts/realms" className="text-blue-600 hover:underline text-sm">
                            Learn more about realms →
                        </Link>
                    </div>

                    <div className="border-l-4 border-blue-500 pl-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">3. Create Your First Signal</h3>
                        <p className="text-gray-700 mb-2">
                            Navigate to <strong>Signals</strong> in the admin panel and click <strong>Create Signal</strong>.
                        </p>
                        <ul className="mt-2 space-y-1 text-gray-700">
                            <li>• Choose a signal type (TEXT, PHOTO, VIDEO, AUDIO, LOCATION)</li>
                            <li>• Add a title and description</li>
                            <li>• Your signal is automatically assigned to your default realm</li>
                            <li>• Set visibility (PUBLIC, PRIVATE, SANCTUM)</li>
                        </ul>
                        <Link href="/docs/concepts/signals" className="text-blue-600 hover:underline text-sm mt-2 inline-block">
                            Learn more about signals →
                        </Link>
                    </div>

                    <div className="border-l-4 border-blue-500 pl-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">4. Create a Cluster</h3>
                        <p className="text-gray-700 mb-2">
                            Group related signals together by creating a cluster.
                        </p>
                        <Link href="/docs/concepts/clusters" className="text-blue-600 hover:underline text-sm">
                            Learn more about clusters →
                        </Link>
                    </div>

                    <div className="border-l-4 border-blue-500 pl-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">5. Generate Synthesis</h3>
                        <p className="text-gray-700 mb-2">
                            Create AI-powered reflections on your signals using Mirror, Myth, or Narrative modes.
                        </p>
                        <Link href="/docs/concepts/synthesis" className="text-blue-600 hover:underline text-sm">
                            Learn more about synthesis →
                        </Link>
                    </div>
                </div>
            </section>

            {/* Next Steps */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Next Steps</h2>
                <div className="grid md:grid-cols-2 gap-4">
                    <Link href="/docs/concepts/signals" className="block p-6 bg-white rounded-lg border border-gray-200 hover:border-blue-500 transition-colors">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Understanding Signals</h3>
                        <p className="text-gray-600">Learn about the atomic units of lived data.</p>
                    </Link>

                    <Link href="/docs/concepts/realms" className="block p-6 bg-white rounded-lg border border-gray-200 hover:border-blue-500 transition-colors">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Working with Realms</h3>
                        <p className="text-gray-600">Understand sovereignty and multi-tenant isolation.</p>
                    </Link>

                    <Link href="/docs/philosophy" className="block p-6 bg-white rounded-lg border border-gray-200 hover:border-blue-500 transition-colors">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Why Autonomy Exists</h3>
                        <p className="text-gray-600">Understand the philosophical foundation.</p>
                    </Link>

                    <Link href="/docs/architecture/database-schema" className="block p-6 bg-white rounded-lg border border-gray-200 hover:border-blue-500 transition-colors">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Database Schema</h3>
                        <p className="text-gray-600">Explore the technical architecture.</p>
                    </Link>
                </div>
            </section>

            {/* Troubleshooting */}
            <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Troubleshooting</h2>
                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6">
                    <h3 className="font-semibold text-gray-900 mb-2">Common Issues</h3>
                    <ul className="space-y-3 text-gray-700">
                        <li>
                            <strong>Database connection failed:</strong> Verify your DATABASE_URL is correct and the database is running.
                        </li>
                        <li>
                            <strong>Prisma client not found:</strong> Run <code className="bg-gray-100 px-2 py-1 rounded text-sm">npx prisma generate</code>
                        </li>
                        <li>
                            <strong>Login not working:</strong> Check that JWT_SECRET is set in your .env file.
                        </li>
                        <li>
                            <strong>Build errors:</strong> Delete <code className="bg-gray-100 px-2 py-1 rounded text-sm">.next</code> and <code className="bg-gray-100 px-2 py-1 rounded text-sm">node_modules</code>, then run <code className="bg-gray-100 px-2 py-1 rounded text-sm">npm install && npm run build</code>
                        </li>
                    </ul>
                </div>
            </section>
        </div>
    )
}
