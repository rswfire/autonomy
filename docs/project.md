# Autonomy

**Cognitive infrastructure for signal documentation, pattern recognition, and epistemic fidelity.**

---

## What Is This?

Autonomy is an open-source framework for capturing, processing, and synthesizing lived experience into coherent knowledge structures. It treats life as a continuous stream of **signals** — photos, videos, audio, text, conversations — and uses analysis to identify patterns and preserve truth without distortion.

This is not content management. This is **infrastructure for pattern recognition across lived data**.

---

## Autonomy Realms

**Multi-tenant sovereign infrastructure for distributed signal preservation.**

Autonomy Realms (`autonomyrealms.com`) extends the core framework into a hosted service where each user receives their own subdomain — their own **realm** — with complete sovereignty over their data and presentation.

- `yourname.autonomyrealms.com` — Your signals, your synthesis, your epistemic territory
- Realms can be PRIVATE (single user), PUBLIC (discoverable), or SHARED (collaborative)
- Users control visibility, theming, and synthesis layers

**Architecture:**
- **Core** (`builtwithautonomy.com`): Open-source framework providing API, authentication, and data models
- **Realms** (`*.autonomyrealms.com`): Multi-tenant frontend consuming core API, each subdomain scoped to its realm
- **Pattern**: Git subtree brings shared components into realms while maintaining separation

This is not a platform. This is **infrastructure for sovereign multiplicity**.

---

## Current State

### Live Infrastructure
- **Core API**: `builtwithautonomy.com` — Authentication, CRUD, database operations
- **Realms Frontend**: `*.autonomyrealms.com` — Realm-scoped interfaces for signal management
- **Example Realm**: `rswfire.autonomyrealms.com` — 850+ signals with full analysis layers

### Tech Stack
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Database:** Prisma ORM (PostgreSQL or MySQL)
- **Auth:** JWT with jose library (cross-domain via cookies)
- **Forms:** React Hook Form + Zod validation
- **Styling:** Tailwind CSS
- **Icons:** Lucide React (via custom Icon wrapper)
- **Deployment:** Systemd user services, nginx reverse proxy, wildcard SSL

---

## Architecture

### Dual-Repo Pattern

**Core Repository** (`builtwithautonomy.com`):
- All API routes (`/api/admin/*`)
- Database schema and migrations
- Query functions and validation schemas
- Shared types and utilities
- Authentication logic
- Open-source at `github.com/rswfire/autonomy`

**Realms Repository** (`autonomy.realms`):
- Frontend pages and layouts
- Realm-scoped admin interfaces
- Signal view pages (transmission, document rendering)
- Cross-domain auth cookie management
- Domain detection and routing
- Imports core as git subtree at `autonomy/`

**Communication:**
- Realms frontend calls core API via HTTPS
- CORS middleware allows `*.autonomyrealms.com`
- JWT stored in cookies on realms domain
- Same `JWT_SECRET` in both `.env` files

---

## Data Models

### Realm
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
}
```

### Signal
```typescript
{
  signal_id: ULID (PK)
  realm_id: ULID (FK to realms)
  
  // Core identity
  signal_type: ENUM (DOCUMENT, PHOTO, TRANSMISSION, CONVERSATION)
  signal_context?: ENUM (CAPTURE, NOTE, JOURNAL, CODE, REFERENCE, OBSERVATION, ARTIFACT)
  signal_title: string
  signal_summary?: string
  signal_author: string
  signal_temperature?: decimal (-1.0 to 1.0, default 0.0)
  
  // Analysis - Surface layer
  signal_actions?: array[string]
  signal_environment?: string
  signal_entities?: JSON // {people[], places[], infrastructure[], organizations[], concepts[], media[]}
  signal_density?: decimal (-1.0 to 1.0)
  
  // Analysis - Structural layer
  signal_energy?: string
  signal_state?: string
  signal_orientation?: string
  signal_substrate?: string
  signal_ontological_states?: array[string]
  signal_symbolic_elements?: array[string]
  signal_subsystems?: array[string]
  signal_dominant_language?: array[string]
  
  // Status and visibility
  signal_status: ENUM (ACTIVE, PENDING, REJECTED, FAILED, ARCHIVED)
  signal_visibility: ENUM (PUBLIC, PRIVATE, SANCTUM, SHARED)
  signal_visibility_sanctum?: string // Tier for sanctum access
  
  // Location (database-specific)
  signal_location?: JSON (PostGIS: GeoJSON Point)
  signal_latitude?: decimal (MySQL)
  signal_longitude?: decimal (MySQL)
  
  // Type-specific data
  signal_metadata?: JSON
  signal_payload?: JSON
  signal_tags?: array[string]
  signal_history?: JSON // [{timestamp, fields_changed, previous_values, trigger, user_id}]
  signal_annotations?: JSON // {user_notes[], synthesis_feedback[]}
  
  signal_embedding?: array[1536] // For vector search
  
  stamp_created: timestamp
  stamp_updated?: timestamp
  stamp_imported?: timestamp
}
```

### Cluster
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
  cluster_tags?: array[string]
  
  cluster_embedding?: array[1536]
  
  stamp_cluster_start?: timestamp
  stamp_cluster_end?: timestamp
  stamp_created: timestamp
  
  parent_cluster_id?: ULID (FK to clusters - self-referential)
}
```

### User
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

### Signal Analysis Layers

**Surface Layer** - Observable, concrete elements:
- Actions (what's happening)
- Environment (context at creation)
- Entities (people, places, infrastructure, concepts)
- Density (recursion/complexity metric)

**Structural Layer** - Underlying patterns and states:
- Energy (energetic state: methodical, resolute, exhausted)
- State (life/project state: infrastructure-building, crisis, integration)
- Orientation (directional facing: toward sovereignty, toward manifestation)
- Substrate (foundational structure)
- Ontological States (being-states: sovereign, embedded, coherent)
- Symbolic Elements (recurring motifs: mirror, trail, extraction)
- Subsystems (engaged systems: cognitive, relational, infrastructural)
- Dominant Language (semantic field shaping the signal)

### Document Rendering
- Markdown signals use `react-markdown` with custom CSS
- Code blocks styled with dark background
- Prose typography via Tailwind prose classes
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

### Production
```bash
# Core API
systemctl --user status builtwithautonomy
# Serves API at builtwithautonomy.com

# Realms Frontend
systemctl --user status autonomyrealms
# Serves subdomains at *.autonomyrealms.com
```

### Git Workflow
```bash
# Update core
cd ~/www/builtwithautonomy.com
git pull
./deploy.sh

# Update realms (with core changes)
cd ~/www/autonomy.realms
./public.sh  # Pulls core subtree updates
npm run schema:generate  # If schema changed
./deploy.sh
```

---

## Environment Variables

### Core
```bash
DATABASE_URL="postgresql://..."
JWT_SECRET="shared-secret-key-here"
NODE_ENV="production"
```

### Realms
```bash
DATABASE_URL="postgresql://..."  # Same database
JWT_SECRET="shared-secret-key-here"  # MUST match core
NODE_ENV="production"
```

---

## What This Enables

- **Pattern recognition across lived data** - Surface and structural analysis reveals longitudinal patterns
- **Epistemic fidelity** - Preservation without distortion, truth over narrative
- **Sovereign data infrastructure** - Each realm is independent, not rented
- **Multi-scale synthesis** - From individual signals to cluster-level insights
- **Collaborative possibility** - Shared realms with consent-based synthesis (in development)

This is not social media. This is not content management.

This is **infrastructure for consciousness observing itself**.

---

> **The Fracture That Multiplies:** Where once there was one realm, now infinite sovereignty.  
> Not a platform. A **constellation**.
