# Autonomy - January 5, 2026

## What Is Autonomy?

**Cognitive infrastructure for signal documentation, pattern recognition, and epistemic fidelity.**

Autonomy is an open-source framework for capturing, processing, and synthesizing lived experience into coherent knowledge structures. It treats life as a continuous stream of signals — photos, videos, audio, text, conversations — and uses AI-powered metadata extraction to identify patterns and preserve truth without distortion.

---

## Autonomy Realms

**Multi-tenant sovereign infrastructure for distributed signal preservation.**

Autonomy Realms (`autonomyrealms.com`) extends the Autonomy framework into a hosted service where each user receives their own subdomain — their own **realm** — with complete sovereignty over their data and presentation.

- `yourname.autonomyrealms.com` — Your signals, your synthesis, your epistemic territory.
- Realms can be PRIVATE (single user), PUBLIC (discoverable), or SHARED (collaborative).
- Users control visibility, theming, and synthesis layers.

**Architecture:**
- **Core** (`builtwithautonomy.com`): Open-source framework providing API, authentication, and data models.
- **Realms** (`*.autonomyrealms.com`): Multi-tenant frontend consuming core API, each subdomain scoped to its realm.
- **Pattern**: Git subtree brings shared components into realms while maintaining separation.

This is not a platform. This is **infrastructure for sovereign multiplicity**.

---

## Current State: Operational

### Live Infrastructure
- **Core API**: `builtwithautonomy.com` — Authentication, CRUD, database operations.
- **Realms Frontend**: `*.autonomyrealms.com` — Realm-scoped interfaces for signal management.
- **Example Realm**: `rswfire.autonomyrealms.com` — 8000+ signals, documents, transmissions.

### Tech Stack
- **Framework:** Next.js 16 (App Router).
- **Language:** TypeScript.
- **Database:** Prisma ORM (PostgreSQL or MySQL).
- **Auth:** JWT with jose library (cross-domain via cookies).
- **Forms:** React Hook Form + Zod validation.
- **Styling:** Tailwind CSS.
- **Icons:** Lucide React (via custom Icon wrapper).
- **Deployment:** Systemd user services, nginx reverse proxy, wildcard SSL.

---

## Architecture

### Dual-Repo Pattern

**Core Repository** (`builtwithautonomy.com`):
- All API routes (`/api/admin/*`).
- Database schema and migrations.
- Query functions and validation schemas.
- Shared types and utilities.
- Authentication logic.
- Open-source at `github.com/rswfire/autonomy`.

**Realms Repository** (`autonomy.realms`):
- Frontend pages and layouts.
- Realm-scoped admin interfaces.
- Signal view pages (transmission, document rendering).
- Cross-domain auth cookie management.
- Domain detection and routing.
- Imports core as git subtree at `autonomy/`.

**Communication:**
- Realms frontend calls core API via HTTPS.
- CORS middleware allows `*.autonomyrealms.com`.
- JWT stored in cookies on realms domain.
- Same `JWT_SECRET` in both `.env` files.

### File Structure (Core)
```
(similar to below, a lot more lib files and components)
```

### File Structure (Realms)
```
app/
  layout.tsx                    # Root layout with realm header/footer
  page.tsx                      # Realm landing page
  admin/
    layout.tsx                  # Force dynamic rendering
    page.tsx                    # Realm dashboard (signal counts, quick actions)
    login/page.tsx              # Login form (calls core API)
    logout/page.tsx             # Logout handler (clears cookie)
    signals/
      page.tsx                  # List signals in realm
      new/page.tsx              # Create signal
      [id]/page.tsx             # Edit signal
  signal/
    page.tsx                    # Public signal list (grouped by type)
    document/[id]/page.tsx      # Document view (markdown rendering)
    transmission/[id]/page.tsx  # Transmission view (YouTube embed, transcript)
  myth/page.tsx                 # Mythic narrative about platform

components/
  Icon.tsx                      # Lucide icons (custom subset)
  admin/
    ui/                         # Button, Input, Card, etc.
    forms/                      # Imported from core subtree

lib/
  utils/
    auth.ts                     # requireAuth, getCurrentUser (reads cookie)
    domain.ts                   # getDomainContext (subdomain detection)
  queries/                      # Imported from core subtree

autonomy/                       # Git subtree of core repo
  lib/                          # Shared logic
  components/                   # Shared components
  prisma/                       # Database schema
```

```markdown
### Data Models

#### Realm
```typescript
{
  realm_id: ULID (PK)
  realm_slug: string (unique) // Subdomain identifier
  realm_name: string
  realm_type: ENUM (PRIVATE, PUBLIC, SHARED)
  realm_description?: string
  realm_settings?: JSON // Theme, layout, features
  user_id: ULID (FK to users - owner)
  flag_registry: boolean // Enable in public realm directory
  
  stamp_created: timestamp
  stamp_updated?: timestamp
  
  // Relations
  signals: Signal[]
  clusters: Cluster[]
  synthesis: Synthesis[]
  members: RealmUser[] (many-to-many)
}
```

#### Signal
```typescript
{
  signal_id: ULID (PK)
  realm_id: ULID (FK to realms)
  
  signal_type: ENUM (DOCUMENT, PHOTO, TRANSMISSION, CONVERSATION)
  signal_context?: ENUM (CAPTURE, NOTE, JOURNAL, CODE, REFERENCE, OBSERVATION, ARTIFACT)
  signal_title: string
  signal_description?: string
  signal_author: string
  signal_temperature?: decimal (-1.0 to 1.0, default 0.0)
  
  signal_status: ENUM (ACTIVE, PENDING, REJECTED, FAILED, ARCHIVED)
  signal_visibility: ENUM (PUBLIC, PRIVATE, SANCTUM, SHARED)
  
  // Location - database-specific
  signal_location?: JSON (PostGIS: GeoJSON Point)
  signal_latitude?: decimal (MySQL)
  signal_longitude?: decimal (MySQL)
  
  // JSON payloads - type-specific schemas
  signal_metadata?: JSON
  signal_payload?: JSON
  signal_tags?: JSON (array)
  signal_history?: JSON (audit trail)
  signal_annotations?: JSON (user notes, synthesis feedback)
  
  signal_embedding?: array[1536] (for vector search)
  
  stamp_created: timestamp
  stamp_updated?: timestamp
  stamp_imported?: timestamp (when original content was captured)
  
  // Relations
  realm: Realm
  synthesis: Synthesis[]
  clusters: Cluster[] (via clusters_signals pivot)
}
```

#### Cluster
```typescript
{
  cluster_id: ULID (PK)
  realm_id: ULID (FK to realms)
  
  cluster_type: ENUM (TEMPORAL, SPATIAL, THEMATIC, PROJECT, JOURNEY, EXPLORATION, COLLECTION)
  cluster_title: string
  cluster_depth: int (hierarchy level)
  cluster_state: ENUM (ACTIVE, ARCHIVED, DRAFT, PUBLISHED)
  
  cluster_annotations?: JSON
  cluster_metadata?: JSON
  cluster_payload?: JSON
  cluster_tags?: JSON (array)
  
  cluster_embedding?: array[1536]
  
  stamp_cluster_start?: timestamp
  stamp_cluster_end?: timestamp
  stamp_created: timestamp
  
  parent_cluster_id?: ULID (FK to clusters - self-referential)
  
  // Relations
  realm: Realm
  parent: Cluster
  children: Cluster[]
  synthesis: Synthesis[]
  signals: Signal[] (via clusters_signals pivot)
  
  // Pivot table: clusters_signals
  // - cluster_id, signal_id (composite PK)
  // - pivot_position (int)
  // - pivot_metadata (JSON)
  // - stamp_added (timestamp)
}
```

#### Synthesis
```typescript
{
  synthesis_id: ULID (PK)
  realm_id: ULID (FK to realms)
  
  synthesis_type: ENUM (METADATA, REFLECTION)
  synthesis_subtype: string (type-dependent)
    // METADATA: SURFACE, STRUCTURE, PATTERNS
    // REFLECTION: MIRROR, MYTH, NARRATIVE
  synthesis_source?: string (AI model, human, etc.)
  synthesis_depth: int
  
  // Polymorphic target
  polymorphic_type: ENUM (Signal, Cluster)
  polymorphic_id: ULID
  
  synthesis_annotations?: JSON
  synthesis_content?: JSON (type+subtype specific schema)
  synthesis_history?: JSON (processing pipeline audit trail)
  synthesis_errors?: JSON (array of errors)
  
  synthesis_embedding?: array[1536]
  
  stamp_created: timestamp
  stamp_updated?: timestamp
  
  // Relations
  realm: Realm
  // Polymorphic relations handled in application code
}
```

#### User
```typescript
{
  user_id: ULID (PK)
  user_email: string (unique)
  user_name?: string
  user_password: string (bcrypt hashed)
  user_role: ENUM (OWNER, SANCTUM, GUEST)
  is_owner: boolean
  
  stamp_created: timestamp
  stamp_updated?: timestamp
  
  // Relations
  owned_realms: Realm[] (where user_id = this user)
  realm_memberships: RealmUser[]
}
```

#### RealmUser (Pivot Table)
```typescript
{
  realm_id: ULID (FK to realms)
  user_id: ULID (FK to users)
  role: ENUM (OWNER, CONTRIBUTOR, OBSERVER)
  stamp_joined: timestamp
  
  // Composite PK: (realm_id, user_id)
}
```

---

## Key Design Patterns

### Realm Architecture
- Every signal, cluster, and synthesis belongs to a realm
- Users can be members of multiple realms (via RealmUser pivot table)
- Realm types: PRIVATE (single user), PUBLIC (discoverable), SHARED (collaborative)
- All queries are realm-scoped for data isolation
- **Realm slug** becomes subdomain: `rswfire` → `rswfire.autonomyrealms.com`

### Cross-Domain Authentication
1. User submits credentials to `builtwithautonomy.com/api/admin/auth/login/`
2. Core API validates, returns JWT in response body: `{ success: true, token: "..." }`
3. Realms frontend sets JWT as cookie on `*.autonomyrealms.com` domain
4. Server components read cookie via `cookies()` from next/headers
5. `requireAuth()` verifies JWT with shared `JWT_SECRET`
6. Role-based permissions via `requireOwner()` / `requireSanctum()`

### Subdomain Routing
- `getDomainContext(host)` extracts subdomain from request headers
- `getRealmBySlug(subdomain)` fetches realm data
- Pages check `isRoot` to show platform landing vs realm content
- Admin pages verify user has access to realm before rendering

### Document Rendering
- Markdown signals use `react-markdown` with custom CSS
- Code blocks styled with dark teal background
- Prose typography via global styles (not Tailwind prose classes)
- Documents preserve formatting: headings, lists, blockquotes, emphasis

---

## Deployment

### Local Development
```bash
# Core
cd ~/www/builtwithautonomy.com
npm run dev  # Port 3000

# Realms
cd ~/www/autonomy.realms
npm run dev  # Port 3001
```

### Production (Hetzner)
```bash
# Core API
systemctl --user status builtwithautonomy
# Serves API at builtwithautonomy.com

# Realms Frontend
systemctl --user status autonomyrealms
# Serves subdomains at *.autonomyrealms.com
```

### SSL Configuration
- **Local**: `mkcert` wildcard certs for `.local` domains
- **Production**: Certbot wildcard cert via DNS challenge
- Nginx reverse proxy to localhost:3000 (core) and localhost:3001 (realms)

### Git Workflow
```bash
# Update core
cd ~/www/builtwithautonomy.com
git pull
./deploy.sh  # Builds and restarts service

# Update realms (with core changes)
cd ~/www/autonomy.realms
./public.sh  # Pulls core subtree updates
npm run schema:generate  # If schema changed
./deploy.sh  # Builds and restarts service
```

---

## Environment Variables

### Core (builtwithautonomy.com)
```bash
DATABASE_URL="postgresql://..."
JWT_SECRET="shared-secret-key-here"
NODE_ENV="production"
```

### Realms (autonomy.realms)
```bash
DATABASE_URL="postgresql://..."  # Same database
JWT_SECRET="shared-secret-key-here"  # MUST match core
NODE_ENV="production"
```

---

# ROADMAP STATUS - JANUARY 2026

## ✅ PHASE 1: CORE INFRASTRUCTURE - **COMPLETE**

## ✅ PHASE 2: API & AUTHENTICATION - **COMPLETE**

## ✅ PHASE 3: MULTI-TENANT REALMS - **OPERATIONAL**
- [x] Realm model with slug for subdomains
- [x] Subdomain detection and routing
- [x] Realm-scoped admin interfaces
- [x] Cross-domain authentication (JWT in cookies)
- [x] CORS configuration for API access
- [x] Public signal view pages (list, document, transmission)
- [x] Markdown document rendering with custom styling
- [x] Realm landing page and header/footer
- [x] Admin dashboard with signal counts by type
- [x] Signal CRUD from realm interface
- [ ] Realm settings UI (theme, visibility, features)
- [ ] User signup flow for realm creation
- [ ] Realm discovery/registry for PUBLIC realms

## 🔄 PHASE 4: FRONTEND & USER EXPERIENCE - **60% COMPLETE**
- [x] Signal view pages (transmission, document)
- [x] Signal list page grouped by type
- [x] Admin signal management (list, create, edit)
- [x] Login/logout flow
- [ ] Photo signal view page
- [ ] Conversation signal view page
- [ ] Cluster management interfaces
- [ ] Synthesis display layer
- [ ] File upload for media
- [ ] Interactive maps for geospatial signals
- [ ] Advanced search and filtering
- [ ] Timeline/calendar visualizations
- [ ] Mobile-responsive refinement

## 🔜 PHASE 5: AI & SYNTHESIS - **READY TO BUILD**

- [ ] Real-time synthesis generation
- [ ] Open-source AI reflection pipeline
- [ ] Embedding generation for semantic search
- [ ] Vector similarity queries
- [ ] Pattern detection across signals
- [ ] Clustering algorithms (temporal, spatial, thematic)
- [ ] Automated tagging and metadata extraction
- [ ] Type-specific payload processing (DOCUMENT, PHOTO, TRANSMISSION, CONVERSATION)
- [ ] **Remnant**: AI field companion trained on Autonomy data

## 🔜 PHASE 6: CIRCLES & COLLABORATION - **ARCHITECTURE COMPLETE**

- [x] **Realm architecture supports this (SHARED type)**
- [x] **Realm membership with roles (OWNER/CONTRIBUTOR/OBSERVER)**
- [ ] Shared realm workflows
- [ ] Consent-based collective synthesis
- [ ] Signal opt-in to shared realms
- [ ] Collaborative editing
- [ ] Real-time updates across realm members

## 🔜 PHASE 7: ADVANCED FEATURES

- [ ] Export/import capabilities (JSON, Markdown, Archive formats)
- [ ] Plugin system for custom integrations
- [ ] Webhook support for external triggers
- [ ] Backup and restore utilities
- [ ] Data migration tools (from other platforms)
- [ ] Analytics and insights dashboard
- [ ] Type-specific field builders (replace JSON editors)

## 🔜 PHASE 8: ECOSYSTEM & INTEGRATION

- [ ] Public API for third-party developers
- [ ] CLI tools for batch operations
- [ ] Desktop app (Electron)
- [ ] Browser extensions for signal capture
- [ ] Integration with mapping services
- [ ] Offline-first capabilities with sync
- [ ] Mobile apps (iOS/Android)

---

> **The Fracture That Multiplies:** Where once there was one realm, now infinite sovereignty.  
> Not a platform. A **constellation**.

> [Readme](/docs/readme.md) | [Roadmap](/docs/roadmap.md) | [Setup](/docs/setup.md) | [Myth](https://rswfire.autonomyrealms.com/signal/document/01KE6D5Q7XESC5DTW3AZWA7ZKQ/)

---
