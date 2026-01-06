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
                    Context describes <strong>why</strong> a signal was created. It's optional but provides valuable metadata for synthesis and pattern recognition.
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
                            <span className="col-span-2 text-gray-700">Brief title</span>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <code className="text-blue-600">signal_summary</code>
                            <span className="col-span-2 text-gray-700">Longer summary or description</span>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <code className="text-blue-600">signal_author</code>
                            <span className="col-span-2 text-gray-700">Who created/captured this signal</span>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <code className="text-blue-600">signal_temperature</code>
                            <span className="col-span-2 text-gray-700">Importance (-1.0 to 1.0, default 0.0)</span>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <code className="text-blue-600">signal_status</code>
                            <span className="col-span-2 text-gray-700">ACTIVE, PENDING, REJECTED, FAILED, or ARCHIVED</span>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <code className="text-blue-600">signal_visibility</code>
                            <span className="col-span-2 text-gray-700">PUBLIC, PRIVATE, SANCTUM, or SHARED</span>
                        </div>
                    </div>

                    <h3 className="font-semibold text-gray-900 mb-3 mt-6">Analysis Fields</h3>
                    <p className="text-sm text-gray-600 mb-4">Surface and structural metadata extracted through analysis.</p>

                    <h4 className="text-sm font-semibold text-gray-800 mb-2">Surface Layer</h4>
                    <div className="space-y-3 text-sm mb-4">
                        <div className="grid grid-cols-3 gap-4">
                            <code className="text-blue-600">signal_actions</code>
                            <span className="col-span-2 text-gray-700">Array of visible actions in the signal</span>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <code className="text-blue-600">signal_environment</code>
                            <span className="col-span-2 text-gray-700">Context at time of signal creation</span>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <code className="text-blue-600">signal_entities</code>
                            <span className="col-span-2 text-gray-700">Categorized entities: people, places, infrastructure, organizations, concepts, media</span>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <code className="text-blue-600">signal_density</code>
                            <span className="col-span-2 text-gray-700">Recursion/complexity metric (-1.0 to 1.0)</span>
                        </div>
                    </div>

                    <h4 className="text-sm font-semibold text-gray-800 mb-2">Structural Layer</h4>
                    <div className="space-y-3 text-sm">
                        <div className="grid grid-cols-3 gap-4">
                            <code className="text-blue-600">signal_energy</code>
                            <span className="col-span-2 text-gray-700">Energetic state (e.g., methodical, resolute, exhausted)</span>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <code className="text-blue-600">signal_state</code>
                            <span className="col-span-2 text-gray-700">Life/project state (e.g., infrastructure-building, crisis, integration)</span>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <code className="text-blue-600">signal_orientation</code>
                            <span className="col-span-2 text-gray-700">Directional facing (e.g., toward sovereignty, toward extraction)</span>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <code className="text-blue-600">signal_substrate</code>
                            <span className="col-span-2 text-gray-700">Structural/conceptual foundation underlying the signal</span>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <code className="text-blue-600">signal_ontological_states</code>
                            <span className="col-span-2 text-gray-700">Array of being-states (e.g., sovereign, embedded, coherent)</span>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <code className="text-blue-600">signal_symbolic_elements</code>
                            <span className="col-span-2 text-gray-700">Array of recurring motifs/symbols (e.g., mirror, archive, trail)</span>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <code className="text-blue-600">signal_subsystems</code>
                            <span className="col-span-2 text-gray-700">Array of engaged subsystems (e.g., cognitive, infrastructural, relational)</span>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <code className="text-blue-600">signal_dominant_language</code>
                            <span className="col-span-2 text-gray-700">Array of key semantic patterns shaping the signal</span>
                        </div>
                    </div>

                    <h3 className="font-semibold text-gray-900 mb-3 mt-6">Temporal Data</h3>
                    <div className="space-y-3 text-sm">
                        <div className="grid grid-cols-3 gap-4">
                            <code className="text-blue-600">stamp_created</code>
                            <span className="col-span-2 text-gray-700">When the original content was captured/created</span>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <code className="text-blue-600">stamp_imported</code>
                            <span className="col-span-2 text-gray-700">When signal was ingested into the system</span>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <code className="text-blue-600">stamp_updated</code>
                            <span className="col-span-2 text-gray-700">Last modification timestamp (auto-updated)</span>
                        </div>
                    </div>

                    <h3 className="font-semibold text-gray-900 mb-3 mt-6">Geospatial Data (Optional)</h3>
                    <div className="space-y-3 text-sm">
                        <div className="grid grid-cols-3 gap-4">
                            <code className="text-blue-600">signal_location</code>
                            <span className="col-span-2 text-gray-700">PostGIS Point (PostgreSQL) - GeoJSON format</span>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <code className="text-blue-600">signal_latitude / signal_longitude</code>
                            <span className="col-span-2 text-gray-700">Decimal coordinates (MySQL)</span>
                        </div>
                    </div>

                    <h3 className="font-semibold text-gray-900 mb-3 mt-6">Type-Specific Data</h3>
                    <div className="space-y-3 text-sm mb-4">
                        <div className="grid grid-cols-3 gap-4">
                            <code className="text-blue-600">signal_metadata</code>
                            <span className="col-span-2 text-gray-700">Technical/immutable facts about the signal</span>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <code className="text-blue-600">signal_payload</code>
                            <span className="col-span-2 text-gray-700">The actual content data</span>
                        </div>
                    </div>

                    {/* DOCUMENT */}
                    <details className="mb-4">
                        <summary className="font-medium text-gray-900 cursor-pointer hover:text-blue-600">
                            DOCUMENT - Metadata & Payload
                        </summary>
                        <div className="mt-3 pl-4 border-l-2 border-blue-200">
                            <p className="text-sm font-semibold text-gray-700 mb-2">Metadata:</p>
                            <ul className="text-sm text-gray-600 space-y-1 mb-3">
                                <li><code className="text-blue-600">word_count</code> - Number of words</li>
                                <li><code className="text-blue-600">character_count</code> - Number of characters</li>
                                <li><code className="text-blue-600">language</code> - Language code (e.g., 'en', 'es')</li>
                                <li><code className="text-blue-600">file_extension</code> - File extension (e.g., '.md', '.txt')</li>
                                <li><code className="text-blue-600">encoding</code> - Character encoding (e.g., 'utf-8')</li>
                                <li><code className="text-blue-600">mime_type</code> - MIME type (e.g., 'text/plain')</li>
                            </ul>
                            <p className="text-sm font-semibold text-gray-700 mb-2">Payload:</p>
                            <ul className="text-sm text-gray-600 space-y-1">
                                <li><code className="text-blue-600">content</code> - The actual text content</li>
                                <li><code className="text-blue-600">format</code> - Rendering format: 'plain', 'markdown', or 'html'</li>
                            </ul>
                        </div>
                    </details>

                    {/* PHOTO */}
                    <details className="mb-4">
                        <summary className="font-medium text-gray-900 cursor-pointer hover:text-blue-600">
                            PHOTO - Metadata & Payload
                        </summary>
                        <div className="mt-3 pl-4 border-l-2 border-blue-200">
                            <p className="text-sm font-semibold text-gray-700 mb-2">Metadata (EXIF & Properties):</p>
                            <ul className="text-sm text-gray-600 space-y-1 mb-3">
                                <li><code className="text-blue-600">camera</code> - Camera model</li>
                                <li><code className="text-blue-600">lens</code> - Lens information</li>
                                <li><code className="text-blue-600">iso</code> - ISO sensitivity</li>
                                <li><code className="text-blue-600">aperture</code> - Aperture value (e.g., 'f/1.5')</li>
                                <li><code className="text-blue-600">shutter_speed</code> - Shutter speed (e.g., '1/120')</li>
                                <li><code className="text-blue-600">focal_length</code> - Focal length in mm</li>
                                <li><code className="text-blue-600">width</code> - Image width in pixels</li>
                                <li><code className="text-blue-600">height</code> - Image height in pixels</li>
                                <li><code className="text-blue-600">file_size</code> - File size in bytes</li>
                                <li><code className="text-blue-600">mime_type</code> - MIME type (e.g., 'image/jpeg')</li>
                                <li><code className="text-blue-600">color_space</code> - Color space (e.g., 'sRGB')</li>
                                <li><code className="text-blue-600">timestamp_original</code> - Original capture timestamp from EXIF</li>
                                <li><code className="text-blue-600">gps_altitude</code> - GPS altitude in meters</li>
                            </ul>
                            <p className="text-sm font-semibold text-gray-700 mb-2">Payload:</p>
                            <ul className="text-sm text-gray-600 space-y-1">
                                <li><code className="text-blue-600">file_path</code> - Local path or cloud storage URL</li>
                                <li><code className="text-blue-600">thumbnail_path</code> - Optimized thumbnail path</li>
                                <li><code className="text-blue-600">original_filename</code> - Original filename when uploaded</li>
                            </ul>
                        </div>
                    </details>

                    {/* TRANSMISSION */}
                    <details className="mb-4">
                        <summary className="font-medium text-gray-900 cursor-pointer hover:text-blue-600">
                            TRANSMISSION - Metadata & Payload
                        </summary>
                        <div className="mt-3 pl-4 border-l-2 border-blue-200">
                            <p className="text-sm font-semibold text-gray-700 mb-2">Metadata:</p>
                            <ul className="text-sm text-gray-600 space-y-1 mb-3">
                                <li><code className="text-blue-600">source_type</code> - 'audio', 'video', or 'other'</li>
                                <li><code className="text-blue-600">source_url</code> - YouTube URL, file path, etc.</li>
                                <li><code className="text-blue-600">youtube_id</code> - YouTube video ID (if applicable)</li>
                                <li><code className="text-blue-600">youtube_channel</code> - YouTube channel name</li>
                                <li><code className="text-blue-600">youtube_published_at</code> - YouTube publish timestamp</li>
                                <li><code className="text-blue-600">youtube_thumbnail</code> - YouTube thumbnail URL</li>
                                <li><code className="text-blue-600">timestamps</code> - Array of topic markers: {`[{topic, timestamp}]`}</li>
                                <li><code className="text-blue-600">duration</code> - Duration in seconds</li>
                                <li><code className="text-blue-600">bitrate</code> - Bitrate in kbps</li>
                                <li><code className="text-blue-600">sample_rate</code> - Sample rate in Hz</li>
                                <li><code className="text-blue-600">channels</code> - Audio channels (1=mono, 2=stereo)</li>
                                <li><code className="text-blue-600">codec</code> - Codec (e.g., 'h264', 'aac')</li>
                                <li><code className="text-blue-600">file_size</code> - File size in bytes</li>
                                <li><code className="text-blue-600">mime_type</code> - MIME type (e.g., 'video/mp4')</li>
                                <li><code className="text-blue-600">width</code> - Video width in pixels</li>
                                <li><code className="text-blue-600">height</code> - Video height in pixels</li>
                                <li><code className="text-blue-600">framerate</code> - Framerate in fps</li>
                                <li><code className="text-blue-600">has_transcript</code> - Boolean</li>
                                <li><code className="text-blue-600">transcript_method</code> - 'ai', 'manual', or 'imported'</li>
                            </ul>
                            <p className="text-sm font-semibold text-gray-700 mb-2">Payload:</p>
                            <ul className="text-sm text-gray-600 space-y-1">
                                <li><code className="text-blue-600">file_path</code> - Local file or cloud storage URL</li>
                                <li><code className="text-blue-600">transcript</code> - Plain text transcript</li>
                                <li><code className="text-blue-600">timed_transcript</code> - Array of timestamped segments: {`[{text, start, end}]`}</li>
                            </ul>
                        </div>
                    </details>

                    {/* CONVERSATION */}
                    <details className="mb-4">
                        <summary className="font-medium text-gray-900 cursor-pointer hover:text-blue-600">
                            CONVERSATION - Metadata & Payload
                        </summary>
                        <div className="mt-3 pl-4 border-l-2 border-blue-200">
                            <p className="text-sm font-semibold text-gray-700 mb-2">Metadata:</p>
                            <ul className="text-sm text-gray-600 space-y-1 mb-3">
                                <li><code className="text-blue-600">platform</code> - 'claude', 'chatgpt', 'gemini', 'remnant', or 'other'</li>
                                <li><code className="text-blue-600">model</code> - Model identifier (e.g., 'claude-sonnet-4')</li>
                                <li><code className="text-blue-600">message_count</code> - Total number of messages</li>
                                <li><code className="text-blue-600">turn_count</code> - Number of back-and-forth exchanges</li>
                                <li><code className="text-blue-600">duration_minutes</code> - Estimated conversation duration</li>
                                <li><code className="text-blue-600">total_tokens</code> - Total token count (if available)</li>
                                <li><code className="text-blue-600">started_at</code> - First message timestamp</li>
                                <li><code className="text-blue-600">ended_at</code> - Last message timestamp</li>
                            </ul>
                            <p className="text-sm font-semibold text-gray-700 mb-2">Payload:</p>
                            <ul className="text-sm text-gray-600 space-y-1">
                                <li><code className="text-blue-600">messages</code> - Array of messages: {`[{role, content, timestamp, metadata}]`}</li>
                                <li><code className="text-blue-600">summary</code> - Generated conversation summary</li>
                                <li><code className="text-blue-600">key_points</code> - Array of extracted key insights</li>
                            </ul>
                        </div>
                    </details>

                    <h3 className="font-semibold text-gray-900 mb-3 mt-6">Additional Fields</h3>
                    <div className="space-y-3 text-sm">
                        <div className="grid grid-cols-3 gap-4">
                            <code className="text-blue-600">signal_tags</code>
                            <span className="col-span-2 text-gray-700">Array of tags for categorization</span>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <code className="text-blue-600">signal_embedding</code>
                            <span className="col-span-2 text-gray-700">Vector embedding (1536 dimensions) for semantic search</span>
                        </div>
                    </div>

                    <h3 className="font-semibold text-gray-900 mb-3 mt-6">History & Annotations</h3>
                    <div className="space-y-3 text-sm">
                        <div className="grid grid-cols-3 gap-4">
                            <code className="text-blue-600">signal_history</code>
                            <span className="col-span-2 text-gray-700">Audit trail: {`[{timestamp, fields_changed, previous_values, trigger, user_id}]`}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <code className="text-blue-600">signal_annotations</code>
                            <span className="col-span-2 text-gray-700">User notes and synthesis feedback: {`{user_notes[], synthesis_feedback[]}`}</span>
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

            {/* Analysis Layers */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Analysis Layers</h2>
                <div className="prose prose-lg text-gray-700 space-y-4">
                    <p>
                        Signals capture two distinct layers of analysis: <strong>surface</strong> and <strong>structural</strong>.
                    </p>

                    <div className="bg-white border border-gray-200 rounded-lg p-6 mt-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Surface Layer</h3>
                        <p className="text-gray-700 mb-3">
                            Observable, concrete elements of the signal. What's directly visible.
                        </p>
                        <ul className="space-y-2 text-gray-700">
                            <li><strong>Actions</strong> - What's happening in the signal</li>
                            <li><strong>Environment</strong> - Context at time of creation</li>
                            <li><strong>Entities</strong> - People, places, infrastructure, concepts mentioned</li>
                            <li><strong>Density</strong> - Measure of recursion and conceptual complexity</li>
                        </ul>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-6 mt-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Structural Layer</h3>
                        <p className="text-gray-700 mb-3">
                            Underlying patterns, states, and orientations. What the signal <em>is</em>, not just what it contains.
                        </p>
                        <ul className="space-y-2 text-gray-700">
                            <li><strong>Energy</strong> - Energetic state (methodical, resolute, exhausted)</li>
                            <li><strong>State</strong> - Life/project state (infrastructure-building, crisis, integration)</li>
                            <li><strong>Orientation</strong> - Directional facing (toward sovereignty, toward manifestation)</li>
                            <li><strong>Substrate</strong> - Foundational structure underlying the signal</li>
                            <li><strong>Ontological States</strong> - Being-states (sovereign, embedded, coherent)</li>
                            <li><strong>Symbolic Elements</strong> - Recurring motifs and symbols (mirror, trail, extraction)</li>
                            <li><strong>Subsystems</strong> - Which subsystems are engaged (cognitive, relational, infrastructural)</li>
                            <li><strong>Dominant Language</strong> - Semantic field shaping the signal</li>
                        </ul>
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
                            <strong>Analysis</strong> — Surface and structural layers are extracted and stored
                        </li>
                        <li>
                            <strong>Clustering</strong> — Can be grouped with related signals in clusters
                        </li>
                        <li>
                            <strong>Pattern Detection</strong> — Cross-signal analysis identifies longitudinal patterns
                        </li>
                        <li>
                            <strong>Synthesis</strong> — Higher-order insights generated at cluster level
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
                            Not content for consumption. Raw documentation of lived reality that analysis processes to identify patterns and generate insights.
                        </p>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h3 className="font-semibold text-gray-900 mb-2">Every signal belongs to a realm</h3>
                        <p className="text-gray-600">
                            Signals don't exist in isolation. They're always part of a realm, ensuring clear ownership and access control.
                        </p>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h3 className="font-semibold text-gray-900 mb-2">Analysis data can be manually edited</h3>
                        <p className="text-gray-600">
                            All analysis fields are editable. Changes are tracked in signal_history with trigger type (user_edit, re_synthesis, etc.).
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
                        <p className="text-gray-600">Pattern detection and insight generation.</p>
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
