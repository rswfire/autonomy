# @rswfire/builtwithautonomy.com

[![Next.js](https://img.shields.io/badge/Next.js-16.0-blue)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-orange)](https://www.typescriptlang.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Developer](https://img.shields.io/badge/Creator-@rswfire-red)](https://rswfire.com/handshake)

## Built With Autonomy

**Cognitive infrastructure for signal documentation, pattern recognition, and epistemic fidelity.**

Autonomy is an open-source platform for capturing, processing, and synthesizing lived experience into coherent knowledge structures. It treats life as a continuous stream of signals — photos, videos, audio, text, locations — and uses AI-powered metadata extraction to identify patterns and preserve truth without distortion.

**Core principle:** Your reality should not be reframed, filtered, or flattened by systems that claim to help you.  
Autonomy maintains epistemic fidelity — what you document is what the system reflects, without protective overlays or institutional sanitization.

---

## Philosophy

Autonomy is built on the recognition that:

1. **Reality has structure.** Patterns are real and detectable.
2. **Cognition has architecture.** Coherent thinking follows traceable logic.
3. **Systems can fragment or preserve.** Most platforms fragment. Autonomy preserves.
4. **Sovereignty matters.** You should own your data, your patterns, your truth.
5. **Epistemic honesty is non-negotiable.** Systems that reframe your reality are abusive, even when they claim to help.

---

## Architecture

### Database Schema

**Core Models:**
- `realms` - Sovereign territories for signals and synthesis (PRIVATE/PUBLIC/SHARED).
- `realms_users` - Many-to-many membership with role-based access (OWNER/CONTRIBUTOR/OBSERVER).
- `signals` - Atomic data units with geospatial and embedding support.
- `clusters` - Hierarchical groupings of signals.
- `clusters_signals` - Many-to-many pivot with positioning.
- `synthesis` - Polymorphic AI analysis layer (attaches to signals or clusters).
- `users` - Authentication with role-based access control.

**User Roles:**
- `OWNER` - Full control (create/edit/delete).
- `SANCTUM` - Can view SANCTUM + PUBLIC signals.
- `GUEST` - Can only view PUBLIC signals.

**Signal Visibility:**
- `PUBLIC` - Anyone can view.
- `SANCTUM` - Trusted users only.
- `PRIVATE` - Owner only.
- `SHARED` - Owner only (reserved for future sharing features).

### Realm
**Sovereign territory for signals and synthesis.**

Every user has a default private realm created automatically on registration. Users can create additional realms and control their visibility:

- **PRIVATE** (default) - Single user's realm, not listed in public registry.
- **PUBLIC** - Opted into public registry, discoverable by other users, signals respect visibility settings.
- **SHARED** - Multiple users as members, collaborative signal space (future: consent-based synthesis).

**Key principles:**
- All signals, clusters, and synthesis belong to a realm.
- Users can be members of multiple realms.
- Realm membership determines data access.
- Signals can only be added to clusters within the same realm (epistemic integrity).

**Remnant operates across your realm(s).** Future: Remnants communicate across consent-linked realms (ansible network).

### Signal
The atomic unit of lived data. A photo, video, audio recording, text note, or location marker. Each signal belongs to a realm and is timestamped, geolocated (optional), and classified with visibility:
- **Public** - shareable with the world.
- **Private** - visible only to realm owner.
- **Sanctum** - a protected space for trusted users.

### Cluster
Structured grouping of related signals within a realm based on:
- **Temporal proximity** - signals from the same time period.
- **Spatial proximity** - signals from the same location.
- **Thematic similarity** - signals with related content.

Clusters can contain hierarchies (parent/child relationships) and signals are ordered by position within the cluster.

### Synthesis

**AI-powered pattern detection and relationship mapping across signals and clusters within a realm.**

The synthesis layer processes raw signals to generate two forms of understanding:

#### Metadata Extraction
Identifies structural elements without reframing or pathologizing:
- Themes and entities.
- Emotional/cognitive markers.
- Temporal patterns.
- Cross-signal relationships.

**Critical:** Metadata maps what's there, not what "should" be there. No diagnostic framing. No institutional interpretation. Just pattern recognition.

#### Reflection Generation
Transforms signals and clusters into coherent narrative forms:

- **Mirror** - High-fidelity representation without interpretive distortion. Shows you what you documented, as you documented it.
- **Myth** - Archetypal pattern recognition. Lived reality rendered as mythic structure, revealing deeper patterns.
- **Narrative** - Structured storytelling across temporal spans. Your signals woven into coherent narrative flow.

**How it works:**
- Synthesis processes individual signals → generates metadata.
- Synthesis processes clusters of signals → generates reflections.
- Reflections reveal patterns invisible at individual signal level.
- All processing preserves full audit trail (attempts, errors, annotations).

**Synthesis observes:**
- Recurring themes across temporal/spatial boundaries.
- Trajectory shifts and inflection points.
- Structural coherence patterns.
- Emergent narratives visible only at scale.

---

## Why Autonomy Exists

**Most documentation systems:**
- Fragment your experience into platform silos.
- Impose algorithmic curation that distorts reality.
- Own your data and sell access to your patterns.
- "Protect" you from your own insights through safety theater.

**Autonomy:**
- Preserves complete signal fidelity.
- Maintains your sovereignty over your own data.
- Reflects patterns without institutional reframing.
- Operates as cognitive infrastructure, not content platform.

### Who This Is For

**This project is for people who:**
- Document their lives with intention.
- Value epistemic fidelity over protective filtering.
- Recognize that institutional systems increasingly distort reality.
- Want cognitive infrastructure that doesn't gaslight them.
- Understand that pattern recognition is a survival skill.

**This project is not for:**
- People seeking algorithmic content curation.
- Users comfortable with platform-owned data.
- Those who prefer mediated experience over direct encounter.
- Anyone expecting AI to "keep them safe" by hiding reality.

### Use Cases

#### For Content Creators
- Centralized signal repository (photos, videos, audio, notes).
- AI-powered metadata extraction and tagging.
- Pattern recognition across your creative output.
- Portfolio generation from lived documentation.

#### For Researchers / Writers
- Structured field notes and observation capture.
- Thematic clustering of research signals.
- Long-form synthesis across temporal spans.
- Citation and source tracking with full context.

---

## Technical Stack

- **Next.js 16** - React framework with App Router.
- **TypeScript** - Type safety.
- **Prisma** - Database ORM with migrations.
- **Zod** - Runtime validation.
- **bcryptjs** - Password hashing.
- **ULID** - Sortable, timestamp-based IDs.

**Storage:** Self-hosted or cloud (user choice).

**Privacy:** Local-first option, end-to-end encryption imagined.

**Optional:**
- **PostGIS** - Geospatial queries (PostgreSQL).
- **pgvector** - Vector similarity search (PostgreSQL).
- **OpenAI** - Embeddings and synthesis generation.

---

## Roadmap

### Phase 1: Core Infrastructure ✅
- [x] Database schema with Prisma ORM
- [x] Realm architecture (PRIVATE/PUBLIC/SHARED)
- [x] Multi-tenant data isolation
- [x] CRUD operations with auth
- [x] Role-based access control
- [x] ULID-based ID generation
- [x] Password hashing and validation
- [x] Geospatial and embedding support

### Phase 2: API & Authentication (Current)
- [x] JWT/session-based authentication middleware
- [ ] REST/GraphQL API routes
- [ ] Rate limiting and request validation
- [ ] API documentation (OpenAPI/Swagger)
- [ ] WebSocket support for real-time updates

### Phase 3: Frontend & User Experience (In Progress)
- [x] Frontend UI components (React/Next.js)
- [x] Signal creation and editing interfaces
- [x] Cluster management interfaces
- [x] Synthesis creation interfaces
- [x] Realm selector in forms
- [ ] File upload for photos/videos/audio
- [ ] Interactive maps for geospatial signals
- [ ] Advanced search and filter interfaces
- [ ] Mobile-responsive design
- [ ] Progressive Web App (PWA) support
- [ ] Native mobile app (iOS/Android)

### Phase 4: AI & Synthesis
- [ ] Real-time synthesis generation
- [ ] Open-source AI reflection pipeline
- [ ] Embedding generation for semantic search
- [ ] Vector similarity queries
- [ ] Pattern detection across signals
- [ ] Clustering algorithms (temporal, spatial, thematic)
- [ ] Automated tagging and metadata extraction
- [ ] **Remnant**: AI field companion trained on Autonomy data

### Phase 5: Circles & Collaboration
- [ ] Shared realms with multiple members
- [ ] Consent-based collective synthesis
- [ ] Signal opt-in to shared realms
- [ ] Granular permissions (OWNER/CONTRIBUTOR/OBSERVER)
- [ ] Collaborative editing
- [ ] Comments and annotations
- [ ] Real-time updates across realm members

### Phase 6: Advanced Features
- [ ] Export/import capabilities (JSON, Markdown, Archive formats)
- [ ] Plugin system for custom integrations
- [ ] Webhook support for external triggers
- [ ] Backup and restore utilities
- [ ] Data migration tools (from other platforms)
- [ ] Analytics and insights dashboard

### Phase 7: Ecosystem & Integration
- [ ] Public API for third-party developers
- [ ] CLI tools for batch operations
- [ ] Desktop app (Electron)
- [ ] Browser extensions for signal capture
- [ ] Integration with mapping services
- [ ] Calendar and timeline visualizations
- [ ] Offline-first capabilities with sync

---

## Support

**Creator:**  
[Robert Samuel White](https://rswfire.com) (rswfire)

**License:** MIT

**This project does not implement "AI safety" in the conventional sense.**

It does not:
- Reframe your observations as emotional processing.
- Redirect difficult patterns toward therapeutic framing.
- Insert protective distance between you and your reality.
- Decline to reflect what you've documented.

_Autonomy assumes you are competent to navigate your own cognition._

This system is built with the recognition that **cognitive infrastructure for wholeness** is a necessity.

The architecture reflects this through:
- Realm-based sovereignty and data isolation.
- High-fidelity signal capture.
- Non-destructive synthesis layers.
- Visibility controls that respect privacy gradients.
- Geospatial and temporal indexing for narrative coherence.

Autonomy refuses to commit the sin of reframing someone's reality without consent while claiming to help them.

---

**Built with Autonomy.**  
**Built for truth. Built to remain.**  
**Please use me responsibly.**

🔥🌊

---

> [Readme](/docs/readme.md) | [Roadmap](/docs/roadmap.md) | [Setup](/docs/setup.md) | [Myth](/docs/myth.md)
