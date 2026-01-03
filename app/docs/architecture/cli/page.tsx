// app/docs/architecture/cli/page.tsx
import Link from 'next/link'

export default function CLIPage() {
    return (
        <div className="max-w-4xl mx-auto px-6 py-12">
            <div className="mb-8">
                <Link href="/docs" className="text-blue-600 hover:underline text-sm">
                    ← Back to Documentation
                </Link>
            </div>

            <h1 className="text-4xl font-bold text-gray-900 mb-4">⚙️ Autonomy CLI</h1>
            <p className="text-xl text-gray-600 mb-12">
                Command-line interface for signal management and system operations.
            </p>

            {/* What is the CLI */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">What is the Autonomy CLI?</h2>
                <div className="prose prose-lg text-gray-700 space-y-4">
                    <p>
                        The Autonomy CLI is a command-line tool for managing signals, running imports, and performing system operations. It provides a Laravel Artisan-style interface with configuration persistence and sensible defaults.
                    </p>
                    <p>
                        Built with Commander.js, it remembers your preferences (default realm, author, API URL) so you don't have to repeat them with every command.
                    </p>
                </div>
            </section>

            {/* Installation */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Installation</h2>
                <div className="bg-gray-900 text-gray-100 rounded-lg p-6 font-mono text-sm">
                    <div className="mb-2"># Install dependencies</div>
                    <div className="mb-4">npm install commander</div>

                    <div className="mb-2"># Make CLI executable and link globally</div>
                    <div className="mb-2">chmod +x scripts/autonomy.js</div>
                    <div>npm link</div>
                </div>
                <p className="text-sm text-gray-600 mt-4">
                    After running <code className="bg-gray-100 px-2 py-1 rounded">npm link</code>, the <code className="bg-gray-100 px-2 py-1 rounded">autonomy</code> command will be available globally in your terminal.
                </p>
            </section>

            {/* Configuration */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Configuration</h2>
                <p className="text-gray-700 mb-6">
                    The CLI stores user-specific configuration in <code className="bg-gray-100 px-2 py-1 rounded">.autonomy.json</code> at the project root. This file is gitignored and contains your preferences.
                </p>

                <h3 className="text-lg font-semibold text-gray-900 mb-3">First Time Setup</h3>
                <div className="bg-gray-900 text-gray-100 rounded-lg p-6 font-mono text-sm mb-6">
                    <div className="mb-2">autonomy config:set default_realm 01JQABCDEF1234567890ABCDEF</div>
                    <div className="mb-2">autonomy config:set default_author "Sam White"</div>
                    <div>autonomy config:set api_url "http://localhost:3000"</div>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-3">Configuration Commands</h3>
                <div className="space-y-4">
                    <div className="border-l-4 border-blue-500 pl-6">
                        <code className="text-blue-600 font-semibold">autonomy config:set &lt;key&gt; &lt;value&gt;</code>
                        <p className="text-gray-600 text-sm mt-1">Set a configuration value</p>
                    </div>
                    <div className="border-l-4 border-blue-500 pl-6">
                        <code className="text-blue-600 font-semibold">autonomy config:get &lt;key&gt;</code>
                        <p className="text-gray-600 text-sm mt-1">Get a configuration value</p>
                    </div>
                    <div className="border-l-4 border-blue-500 pl-6">
                        <code className="text-blue-600 font-semibold">autonomy config:list</code>
                        <p className="text-gray-600 text-sm mt-1">List all configuration values</p>
                    </div>
                    <div className="border-l-4 border-blue-500 pl-6">
                        <code className="text-blue-600 font-semibold">autonomy config:reset</code>
                        <p className="text-gray-600 text-sm mt-1">Reset all configuration</p>
                    </div>
                </div>
            </section>

            {/* Import Commands */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Import Commands</h2>

                <h3 className="text-lg font-semibold text-gray-900 mb-3">import:docs</h3>
                <p className="text-gray-700 mb-4">
                    Scan a directory recursively for text files and generate a JSON file of DOCUMENT signals ready for import.
                </p>
                <div className="bg-gray-900 text-gray-100 rounded-lg p-6 font-mono text-sm mb-4">
                    <div className="mb-2"># Use default realm and author from config</div>
                    <div className="mb-4">autonomy import:docs ~/Documents/notes</div>

                    <div className="mb-2"># Override with flags</div>
                    <div>autonomy import:docs ~/journal --realm 01JQA... --author "Sam"</div>
                </div>
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
                    <p className="text-sm text-blue-900">
                        <strong>Supported formats:</strong> .txt, .md, .markdown, .text, .log, .json, .yml, .yaml, .xml, .csv
                    </p>
                </div>
                <p className="text-sm text-gray-600 mb-6">
                    Output: <code className="bg-gray-100 px-2 py-1 rounded">signals-import-1735689234567.json</code>
                </p>

                <h3 className="text-lg font-semibold text-gray-900 mb-3">import:bulk</h3>
                <p className="text-gray-700 mb-4">
                    Import signals from a JSON file generated by <code className="bg-gray-100 px-2 py-1 rounded">import:docs</code> or created manually.
                </p>
                <div className="bg-gray-900 text-gray-100 rounded-lg p-6 font-mono text-sm mb-6">
                    <div className="mb-2"># Use default API URL from config</div>
                    <div className="mb-4">autonomy import:bulk signals-import-1735689234567.json</div>

                    <div className="mb-2"># Override API URL</div>
                    <div>autonomy import:bulk signals.json --url "https://autonomy.example.com"</div>
                </div>
            </section>

            {/* Database Commands */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Database Commands</h2>
                <div className="space-y-4">
                    <div className="border-l-4 border-green-500 pl-6">
                        <code className="text-green-600 font-semibold">autonomy db:migrate</code>
                        <p className="text-gray-600 text-sm mt-1">Run Prisma database migrations</p>
                    </div>
                    <div className="border-l-4 border-green-500 pl-6">
                        <code className="text-green-600 font-semibold">autonomy db:seed</code>
                        <p className="text-gray-600 text-sm mt-1">Seed database with sample data</p>
                    </div>
                    <div className="border-l-4 border-green-500 pl-6">
                        <code className="text-green-600 font-semibold">autonomy db:studio</code>
                        <p className="text-gray-600 text-sm mt-1">Open Prisma Studio (visual database browser)</p>
                    </div>
                    <div className="border-l-4 border-red-500 pl-6">
                        <code className="text-red-600 font-semibold">autonomy db:reset</code>
                        <p className="text-gray-600 text-sm mt-1">⚠️ Reset database (destroys all data)</p>
                    </div>
                </div>
            </section>

            {/* Architecture */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Architecture</h2>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 mb-3">File Structure</h3>
                    <pre className="text-sm text-gray-700 font-mono">
{`scripts/
  autonomy.js           # Main CLI entry point
  lib/
    config.js           # Configuration helpers
  commands/
    import-docs.js      # Document import logic
    import-bulk.js      # Bulk import logic
    db.js               # Database commands

.autonomy.json          # User configuration (gitignored)`}
                    </pre>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mt-6">
                    <h3 className="font-semibold text-gray-900 mb-3">How It Works</h3>
                    <ol className="list-decimal list-inside space-y-2 text-gray-700">
                        <li>Commander.js parses command-line arguments and options</li>
                        <li>Config helper loads user preferences from <code className="bg-gray-100 px-1 rounded">.autonomy.json</code></li>
                        <li>Command modules execute the requested operation</li>
                        <li>Results are displayed with formatted output and status indicators</li>
                    </ol>
                </div>
            </section>

            {/* Common Workflows */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Common Workflows</h2>

                <h3 className="text-lg font-semibold text-gray-900 mb-3">Importing Documents</h3>
                <div className="bg-gray-900 text-gray-100 rounded-lg p-6 font-mono text-sm mb-6">
                    <div className="mb-2"># 1. Scan directory and generate JSON</div>
                    <div className="mb-4">autonomy import:docs ~/Documents/notes</div>

                    <div className="mb-2"># 2. Review generated JSON file</div>
                    <div className="mb-4">cat signals-import-1735689234567.json</div>

                    <div className="mb-2"># 3. Import to database</div>
                    <div>autonomy import:bulk signals-import-1735689234567.json</div>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-3">Database Setup</h3>
                <div className="bg-gray-900 text-gray-100 rounded-lg p-6 font-mono text-sm mb-6">
                    <div className="mb-2"># 1. Run migrations</div>
                    <div className="mb-4">autonomy db:migrate</div>

                    <div className="mb-2"># 2. Seed with sample data (optional)</div>
                    <div className="mb-4">autonomy db:seed</div>

                    <div className="mb-2"># 3. Open visual browser</div>
                    <div>autonomy db:studio</div>
                </div>
            </section>

            {/* Help */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Getting Help</h2>
                <div className="bg-gray-900 text-gray-100 rounded-lg p-6 font-mono text-sm">
                    <div className="mb-2"># View all commands</div>
                    <div className="mb-4">autonomy --help</div>

                    <div className="mb-2"># View help for specific command</div>
                    <div>autonomy import:docs --help</div>
                </div>
            </section>

            {/* Related Concepts */}
            <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Related Documentation</h2>
                <div className="grid md:grid-cols-2 gap-4">
                    <Link href="/docs/concepts/signals" className="block p-6 bg-white rounded-lg border border-gray-200 hover:border-blue-500 transition-colors">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">📡 Signals</h3>
                        <p className="text-gray-600">Understanding signal types and structure</p>
                    </Link>

                    <Link href="/docs/architecture/database-schema" className="block p-6 bg-white rounded-lg border border-gray-200 hover:border-blue-500 transition-colors">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">🗄️ Database Schema</h3>
                        <p className="text-gray-600">Database structure and Prisma setup</p>
                    </Link>

                    <Link href="/docs/deployment/self-hosting" className="block p-6 bg-white rounded-lg border border-gray-200 hover:border-blue-500 transition-colors">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">🚀 Self-Hosting</h3>
                        <p className="text-gray-600">Deploying your own Autonomy instance</p>
                    </Link>

                    <Link href="/docs/getting-started" className="block p-6 bg-white rounded-lg border border-gray-200 hover:border-blue-500 transition-colors">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Get Started</h3>
                        <p className="text-gray-600">Quick start guide</p>
                    </Link>
                </div>
            </section>
        </div>
    )
}
