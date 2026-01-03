# Autonomy System State - January 2, 2026

## Built With Autonomy

**Cognitive infrastructure for signal documentation, pattern recognition, and epistemic fidelity.**

Autonomy is an open-source platform for capturing, processing, and synthesizing lived experience into coherent knowledge structures. It treats life as a continuous stream of signals — photos, videos, audio, text, locations — and uses AI-powered metadata extraction to identify patterns and preserve truth without distortion.

**Core principle:** Your reality should not be reframed, filtered, or flattened by systems that claim to help you.  
Autonomy maintains epistemic fidelity — what you document is what the system reflects, without protective overlays or institutional sanitization.

## Current State: PRODUCTION-READY ADMIN, PRE-MULTI-TENANT

### What Works ✅
- JWT authentication with httpOnly cookies
- Role-based permissions (OWNER/SANCTUM/GUEST)
- Full CRUD for Signals, Clusters, Synthesis, Users
- Unified site navigation (public + admin sections)
- Admin dashboard with stats and quick actions
- Separate model-specific forms (SignalForm, ClusterForm, SynthesisForm, UserForm)
- Database-agnostic location handling (PostGIS vs MySQL)
- Schema-driven form generation from Zod validation
- List/detail pages for all models with proper data fetching

### Tech Stack
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Database:** Prisma ORM (PostgreSQL or MySQL)
- **Auth:** JWT with jose library
- **Forms:** React Hook Form + Zod validation
- **Styling:** Tailwind CSS
- **Icons:** Lucide React (via custom Icon wrapper)

---

## Architecture

### File Structure
```
app/
  layout.tsx                    # Root layout (html/body only)
  page.tsx                      # Public homepage
  admin/
    layout.tsx                  # Passthrough (dynamic export)
    page.tsx                    # Admin dashboard
    login/page.tsx              # Login page
    signals/
      page.tsx                  # List view
      new/page.tsx              # Create form
      [id]/page.tsx             # Edit form
    clusters/
      page.tsx                  # List view
      new/page.tsx              # Create form
      [id]/page.tsx             # Edit form
    synthesis/
      page.tsx                  # List view
      new/page.tsx              # Create form
      [id]/page.tsx             # Edit form
    users/
      page.tsx                  # List view
      new/page.tsx              # Create form
      [id]/page.tsx             # Edit form
  api/admin
    auth/
      check/route.ts              # GET user role
      login/route.ts              # POST authentication
      logout/route.ts             # POST logout
    signals/
      route.ts                    # GET list, POST create
      [id]/route.ts               # GET, PATCH, DELETE
    clusters/
      route.ts                    # GET list, POST create
      [id]/route.ts               # GET, PATCH, DELETE
    synthesis/
      route.ts                    # GET list, POST create
      [id]/route.ts               # GET, PATCH, DELETE
    users/
      route.ts                    # GET list, POST create
      [id]/route.ts               # GET, PATCH, DELETE

components/
  Icon.tsx                      # Lucide icon wrapper with whitelist
  SiteNavigation.tsx            # Unified sidebar (public + admin)
  admin/
    form-types.ts               # FieldConfig, ModelConfig interfaces
    schema-to-form.ts           # Zod introspection for form generation
    form-config.ts              # Generated form configs (minimal, may be deprecated)
    debug-schema.ts             # Debug utility for schema inspection        
    forms/
      SignalForm.tsx            # Signal-specific form
      ClusterForm.tsx           # Cluster-specific form
      SynthesisForm.tsx         # Synthesis-specific form
      UserForm.tsx              # User-specific form
      FormSection.tsx           # Reusable section wrapper
      FormField.tsx             # Reusable field wrapper
      JsonEditor.tsx            # JSON textarea with validation

lib/
  constants.ts                  # SIGNAL_TYPES, CLUSTER_TYPES, etc.
  types.ts                      # TypeScript interfaces, isPostgres flag
  db.ts                         # Prisma client singleton
  queries/
    signal.ts                   # Signal CRUD (querySignals, createSignal, etc.)
    cluster.ts                  # Cluster CRUD + hierarchy queries
    synthesis.ts                # Synthesis CRUD + polymorphic queries
    user.ts                     # User CRUD + auth (renamed from users.ts)
  validation/
    signal.ts                   # Zod schemas for signals
    cluster.ts                  # Zod schemas for clusters
    synthesis.ts                # Zod schemas for synthesis (discriminated union)
    user.ts                     # Zod schemas for users
  utils/
    auth.ts                     # requireAuth, verifyToken
    password.ts                 # hashPassword, verifyPassword (bcrypt)
    permissions.ts              # requireOwner, requireSanctum
    ulid.ts                     # ULID generation
```

### Data Models

#### Signal
```typescript
{
  signal_id: ULID (PK)
  signal_type: ENUM (TEXT, PHOTO, VIDEO, AUDIO, LOCATION, DOCUMENT, CODE, LINK, NOTE, JOURNAL, OBSERVATION)
  signal_title: string
  signal_description?: string
  signal_author: string
  signal_status: ENUM (PENDING, PROCESSING, ACTIVE, ARCHIVED)
  signal_visibility: ENUM (PUBLIC, PRIVATE, SANCTUM, SHARED)
  
  // Location - database-specific
  signal_location?: JSON (PostGIS: GeoJSON Point)
  signal_latitude?: decimal (MySQL)
  signal_longitude?: decimal (MySQL)
  
  // JSON payloads - type-specific schemas needed
  signal_metadata?: JSON
  signal_payload?: JSON
  signal_tags?: JSON (array)
  
  signal_embedding?: array[1536] (for vector search)
  stamp_created: timestamp
  stamp_updated?: timestamp
  stamp_imported?: timestamp
}
```

#### Cluster
```typescript
{
  cluster_id: ULID (PK)
  cluster_type: ENUM (TEMPORAL, SPATIAL, THEMATIC, NARRATIVE, NETWORK, HYBRID, META)
  cluster_title: string
  cluster_depth: int (hierarchy level)
  cluster_state: ENUM (DRAFT, ACTIVE, PUBLISHED, ARCHIVED)
  
  cluster_annotations?: JSON
  cluster_metadata?: JSON
  cluster_payload?: JSON
  cluster_tags?: JSON (array)
  
  cluster_embedding?: array[1536]
  
  stamp_cluster_start?: timestamp
  stamp_cluster_end?: timestamp
  stamp_created: timestamp
  
  parent_cluster_id?: ULID (FK to clusters)
  
  // Pivot table: cluster_signals
  // - cluster_id, signal_id
  // - pivot_position (int)
  // - pivot_metadata (JSON)
}
```

#### Synthesis
```typescript
{
  synthesis_id: ULID (PK)
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
  synthesis_history?: JSON (array of actions)
  synthesis_errors?: JSON (array of errors)
  
  synthesis_embedding?: array[1536]
  
  stamp_created: timestamp
  stamp_updated?: timestamp
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
}
```

---

## Key Design Patterns

### Authentication Flow
1. User posts credentials to `/api/admin/auth/login`
2. Server validates, creates JWT with `{ user_id, email, role }`
3. JWT stored in httpOnly cookie
4. Protected routes call `requireAuth()` which verifies token
5. Role-based permissions via `requireOwner()` / `requireSanctum()`

### Form Architecture
- **Model-specific forms** (SignalForm, ClusterForm, etc.) - NOT generic DynamicModelForm
- Each form handles its own validation, JSON parsing, submission
- Forms use React Hook Form + Controller for JSON fields
- JSON fields pre-stringify in `formDefaults` to avoid hydration errors
- Database type detection via data structure (not isPostgres constant) to avoid SSR/client mismatch

### Schema Introspection
- `schema-to-form.ts` reads Zod schemas via `field.constructor.name`
- Detects field types: ZodEnum → select, ZodRecord/ZodArray → json, etc.
- Unwraps ZodOptional/ZodDefault/ZodNullable to get base type
- **Limitation:** Discriminated unions (synthesis) require manual config

### Query Patterns
- All queries in `lib/queries/*` use Prisma
- Filters use `Partial<FilterType>` to make all fields optional
- Role-based filtering in queries (e.g., non-owners see limited data)
- Polymorphic relations (synthesis → signal/cluster) handled manually

---

## Critical Issues & Known Limitations

### 🔴 NOT MULTI-TENANT YET
**Current state:** All data is global, no user ownership

**What's needed:**
1. Add `owner_user_id` column to signals, clusters, synthesis tables
2. Update all queries to filter by owner (except OWNER role sees all)
3. Respect `signal_visibility` in queries:
    - PUBLIC: visible to all
    - PRIVATE: owner only
    - SANCTUM: owner + sanctum role users
    - SHARED: owner + specific users (needs sharing table)
4. Migrate existing data to first user's user_id

### 🟡 JSON Field Validation Missing
**Current state:** JSON fields accept any valid JSON

**What's needed:**
- Type-specific schemas in `lib/validation/*` for:
    - `signal_metadata` (varies by signal_type)
    - `signal_payload` (varies by signal_type)
    - `synthesis_content` (varies by type + subtype)
- Helper functions: `getSignalMetadataSchema(signal_type)`, `getSynthesisContentSchema(type, subtype)`
- Form validation against these schemas
- Fallback to generic `z.record(z.string(), z.unknown())` for unknown types

**Example needed:**
```typescript
// lib/validation/signal.ts
export const videoMetadataSchema = z.object({
  youtube_id: z.string().optional(),
  duration: z.number().optional(),
  transcript: z.string().optional(),
})

export function getSignalMetadataSchema(signal_type: string) {
  switch (signal_type) {
    case 'VIDEO': return videoMetadataSchema
    case 'PHOTO': return photoMetadataSchema
    // ... etc
    default: return z.record(z.string(), z.unknown())
  }
}
```

### 🟡 Cluster Relationship Management Missing
**Current state:** Pivot table exists but no UI to manage signal/cluster relationships

**What's needed:**
- UI in ClusterForm to add/remove signals
- Display list of current signals with positions
- Drag-and-drop reordering (optional)
- Functions in `lib/queries/cluster.ts` already exist:
    - `addSignalToCluster()`
    - `removeSignalFromCluster()`
    - `updateClusterSignal()` (for position/metadata)

### 🟡 Synthesis Type-Dependent Subtype Dropdown
**Current state:** SynthesisForm shows all subtypes regardless of type

**What's working:**
- Form watches `synthesis_type` field
- Calls `getSubtypeOptions()` which filters based on type
- Should work but needs testing

### 🟢 Minor: datetime-local Input Format
**Issue:** `stamp_imported`, `stamp_cluster_start`, `stamp_cluster_end` use `<input type="datetime-local">`
**Problem:** Prisma dates come as ISO strings, need conversion for input value
**Fix needed:** Convert ISO to datetime-local format in form defaults

---

## Environment Variables

```bash
# Database
DATABASE_URL="postgresql://..." or "mysql://..."

# Auth
JWT_SECRET="your-secret-key-here"  # Required for production
JWT_EXPIRES_IN="7d"                # Optional, defaults to 7d

# Optional
NODE_ENV="production"
```

---

## Constants Reference

### Signal Types
```typescript
SIGNAL_TYPES = ['TEXT', 'PHOTO', 'VIDEO', 'AUDIO', 'LOCATION', 'DOCUMENT', 'CODE', 'LINK', 'NOTE', 'JOURNAL', 'OBSERVATION']
```

### Signal Status
```typescript
SIGNAL_STATUS = ['PENDING', 'PROCESSING', 'ACTIVE', 'ARCHIVED']
```

### Signal Visibility
```typescript
SIGNAL_VISIBILITY = ['PUBLIC', 'PRIVATE', 'SANCTUM', 'SHARED']
```

### Cluster Types
```typescript
CLUSTER_TYPES = ['TEMPORAL', 'SPATIAL', 'THEMATIC', 'NARRATIVE', 'NETWORK', 'HYBRID', 'META']
```

### Cluster States
```typescript
CLUSTER_STATES = ['DRAFT', 'ACTIVE', 'PUBLISHED', 'ARCHIVED']
```

### Synthesis Types & Subtypes
```typescript
SYNTHESIS_TYPES = ['METADATA', 'REFLECTION']

SYNTHESIS_SUBTYPES = {
  METADATA: ['SURFACE', 'STRUCTURE', 'PATTERNS'],
  REFLECTION: ['MIRROR', 'MYTH', 'NARRATIVE']
}
```

### Polymorphic Types
```typescript
POLYMORPHIC_TYPES = ['Signal', 'Cluster']
```

### User Roles
```typescript
USER_ROLES = ['OWNER', 'SANCTUM', 'GUEST']
```

---

## Immediate Next Steps

### 1. Multi-Tenant Migration (Week 1)
- [ ] Add migration: `owner_user_id VARCHAR(26)` to signals, clusters, synthesis
- [ ] Add indexes: `CREATE INDEX idx_signals_owner ON signals(owner_user_id)`
- [ ] Update all query functions to filter by owner (non-OWNER roles)
- [ ] Implement visibility filtering for signals
- [ ] Create first user account, migrate existing data to that user_id
- [ ] Test data isolation between users

### 2. JSON Schema Validation (Week 2)
- [ ] Define type-specific schemas in `lib/validation/signal.ts`:
    - videoMetadataSchema, photoMetadataSchema, audioMetadataSchema, etc.
- [ ] Define synthesis content schemas in `lib/validation/synthesis.ts`:
    - metadataSurfaceSchema, reflectionMythSchema, etc.
- [ ] Create helper functions: `getSignalMetadataSchema()`, `getSynthesisContentSchema()`
- [ ] Update forms to validate JSON against type-specific schemas
- [ ] Add real-time validation feedback in JsonEditor component

### 3. Cluster Relationship UI (Week 2-3)
- [ ] Build signal selector component for ClusterForm
- [ ] Display current cluster signals with positions
- [ ] Add/remove signals from cluster
- [ ] Update signal positions in pivot table
- [ ] Show signal count and relationship metadata

### 4. User Registration & Onboarding (Week 3)
- [ ] Create public registration page (`/register`)
- [ ] Email verification (optional but recommended)
- [ ] Default new users to GUEST role
- [ ] Admin UI to promote users to SANCTUM
- [ ] Welcome email with system overview

---

## Future Features (Post-MVP)

### Circles Architecture (Post Multi-Tenant)
**Purpose:** Consent-based collective synthesis across users

**Database:**
```sql
-- Circle entity
CREATE TABLE circles (
  circle_id VARCHAR(26) PRIMARY KEY,
  circle_name VARCHAR(100),
  circle_description TEXT,
  created_by VARCHAR(26) REFERENCES users(user_id),
  circle_type ENUM('PRIVATE', 'SHARED', 'PUBLIC'),
  synthesis_enabled BOOLEAN DEFAULT false,
  stamp_created TIMESTAMP
);

-- Membership
CREATE TABLE circle_members (
  circle_id VARCHAR(26),
  user_id VARCHAR(26),
  role ENUM('OWNER', 'CONTRIBUTOR', 'OBSERVER'),
  can_view_synthesis BOOLEAN DEFAULT true,
  can_contribute_signals BOOLEAN DEFAULT true,
  joined_at TIMESTAMP,
  PRIMARY KEY (circle_id, user_id)
);

-- Signal opt-in to circles
CREATE TABLE circle_signals (
  circle_id VARCHAR(26),
  signal_id VARCHAR(26),
  contributed_by VARCHAR(26),
  opted_in BOOLEAN DEFAULT true,
  consent_to_synthesis BOOLEAN DEFAULT false,
  consent_to_pattern_sharing BOOLEAN DEFAULT false,
  stamp_added TIMESTAMP,
  PRIMARY KEY (circle_id, signal_id)
);
```

**Key principles:**
- Explicit opt-in for each signal to each circle
- Synthesis scoped to circle membership
- Users can revoke signal participation anytime
- Three circle types:
    - PRIVATE: Single user + public signals
    - SHARED: Invited members, collective synthesis
    - PUBLIC: Open viewing, member contribution

### AI Synthesis Pipeline
**Current state:** Manual synthesis creation via admin

**Future:**
- Automated synthesis generation triggered by:
    - New signals added
    - Cluster completion
    - Scheduled batch processing
    - User-requested analysis
- Model selection:
    - Free tier: Claude Haiku (fast, lower fidelity)
    - Paid tier: Claude Sonnet (high fidelity)
    - Custom: User-provided models
- Synthesis modes based on type + subtype
- Reprocessing with different models/annotations

### API for External Access
**Purpose:** Allow rswfire.com and other sites to consume autonomy data

**Needed:**
- API key generation and management
- Rate limiting per key
- Read-only endpoints for public data
- Authenticated endpoints for user data
- Webhook support for real-time updates
- GraphQL layer (optional, REST first)

### Advanced Features
- [ ] Vector search (pgvector) for semantic signal discovery
- [ ] Embedding generation pipeline
- [ ] Signal import from external sources (YouTube, photos, documents)
- [ ] Automated transcription (video/audio → text signals)
- [ ] Image analysis (photo → metadata extraction)
- [ ] Cluster visualization (network graphs, timelines)
- [ ] Synthesis export (PDF reports, markdown, JSON)
- [ ] Collaborative editing (real-time signal updates)
- [ ] Signal versioning (track changes over time)

### Business Model
- **Free tier:** 100 signals/month, Haiku synthesis, private data only
- **SANCTUM tier ($10-20/mo):** Unlimited signals, Sonnet synthesis, public/shared visibility, API access
- **Custom tier:** White-label deployments, custom synthesis modes, consulting

---

## Decision Log

### Why Separate Forms Instead of DynamicModelForm?
- Initial attempt at generic form generator hit complexity wall
- Each model has unique needs:
    - Signals: Database-specific location handling
    - Clusters: Pivot table relationship management
    - Synthesis: Type-dependent subtype options
    - Users: Password handling, role management
- Separate forms allow model-specific customization without breaking others
- Shared components (FormField, JsonEditor, etc.) still provide reusability

### Why Schema Introspection?
- Single source of truth for validation rules
- Form fields auto-update when Zod schemas change
- No duplication between validation and UI
- **Limitation:** Discriminated unions need manual handling

### Why Not Generic JSON Editor?
- Different signal types need different metadata structures
- Type-specific validation prevents bad data
- Better UX with structured forms vs free-form JSON
- **Tradeoff:** More work upfront, better experience long-term

### Database Choice: Why Both PostgreSQL and MySQL?
- PostGIS for geospatial queries (better for location-based signals)
- MySQL for simpler deployments
- Prisma abstracts most differences
- Location handling is only divergence point
