// scripts/generate-schema.js

require("dotenv").config();

const fs = require("fs");
const path = require("path");

const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
    console.error("ERROR: DATABASE_URL environment variable not set.");
    console.error("Please configure your database connection.");
    console.error("See docs/setup.md for instructions.");
    process.exit(1);
}

const isPostgres = dbUrl.startsWith("postgresql") || dbUrl.startsWith("postgres");

const baseSchema = `// prisma/schema.prisma

generator client {
  provider        = "prisma-client-js"
  ${isPostgres ? 'previewFeatures = ["postgresqlExtensions"]' : ''}
}

datasource db {
  provider   = "${isPostgres ? 'postgresql' : 'mysql'}"
  url        = env("DATABASE_URL")
  ${isPostgres ? 'extensions = [postgis]' : ''}
}


//
// REALM -- SOVEREIGN TERRITORY FOR SIGNALS AND SYNTHESIS
//

model Realm {
  realm_id          String   @id @db.VarChar(26)
  realm_type        String   @default("PRIVATE") @db.VarChar(20)
  realm_name        String   @db.VarChar(100)
  realm_slug        String   @unique @db.VarChar(100)
  realm_description String?  @db.Text
  realm_settings    Json?    ${isPostgres ? '@db.JsonB' : '@db.Json'}

  user_id           String   @db.VarChar(26)
  creator           User     @relation("RealmCreator", fields: [user_id], references: [user_id])

  flag_registry     Boolean @default(false)

  stamp_created     DateTime @default(now())
  stamp_updated     DateTime? @updatedAt

  members  RealmUser[]
  signals  Signal[]
  clusters Cluster[]
  synthesis Synthesis[]

  @@map("realms")
  @@index([realm_type], map: "idx_realm_realm-type")
  @@index([realm_slug], map: "idx_realm_realm-slug")
  @@index([user_id], map: "idx_realm_user-id")
  @@index([flag_registry], map: "idx_realm_flag-registry")
  @@index([stamp_created], map: "idx_realm_stamp-created")

}

model RealmUser {
  realm_id  String  @db.VarChar(26)
  user_id   String  @db.VarChar(26)

  realm     Realm  @relation(fields: [realm_id], references: [realm_id], onDelete: Cascade)
  user      User   @relation(fields: [user_id], references: [user_id], onDelete: Cascade)

  user_role                   String   @default("GUEST") @db.VarChar(20)  // OWNER | SANCTUM | GUEST
  sanctum_tier                String?  @db.VarChar(255)
  stripe_subscription_id      String?  @db.VarChar(255)
  stripe_subscription_status  String?  @db.VarChar(50)

  stamp_joined  DateTime @default(now())

  @@id([realm_id, user_id])
  @@map("realms_users")
  @@index([realm_id], map: "idx_realmuser_realm-id")
  @@index([user_id], map: "idx_realmuser_user-id")
  @@index([user_role], map: "idx_realmuser_user-role")
  @@index([stripe_subscription_id], map: "idx_realmuser_stripe-subscription-id")
  @@index([stripe_subscription_status], map: "idx_realmuser_stripe-subscription-status")
}


//
//  SIGNAL -- THE ATOMIC UNIT OF LIVED DATA
//

model Signal {

  signal_id           String   @id @db.VarChar(26)
  realm_id            String   @db.VarChar(26)
  realm               Realm    @relation(fields: [realm_id], references: [realm_id], onDelete: Cascade)

  signal_type         String   @db.VarChar(50)
  signal_title        String   @db.VarChar(100)
  signal_context      String?  @db.VarChar(50)
  signal_summary      String?  @db.Text
  signal_author       String   @db.VarChar(50)
  signal_tags         Json?  ${isPostgres ? '@db.JsonB' : '@db.Json'}

  signal_environment  String?  @db.Text
  signal_temperature  Decimal? @default(0.0) @db.Decimal(3, 2)
  signal_actions      Json?  ${isPostgres ? '@db.JsonB' : '@db.Json'}
  signal_entities     Json?  ${isPostgres ? '@db.JsonB' : '@db.Json'}
  signal_density      Decimal? @db.Decimal(3, 2)

  signal_energy       String?  @db.VarChar(100)
  signal_state        String?  @db.VarChar(100)
  signal_orientation  String?  @db.VarChar(100)
  signal_substrate    String?  @db.Text
  signal_ontological_states Json?  ${isPostgres ? '@db.JsonB' : '@db.Json'}
  signal_symbolic_elements  Json?  ${isPostgres ? '@db.JsonB' : '@db.Json'}
  signal_subsystems         Json?  ${isPostgres ? '@db.JsonB' : '@db.Json'}
  signal_dominant_language  Json?  ${isPostgres ? '@db.JsonB' : '@db.Json'}

  ${isPostgres ? 'signal_location Unsupported("geography(Point, 4326)")? @map("signal_location")' : 'signal_latitude Decimal? @db.Decimal(10, 8)\n  signal_longitude Decimal? @db.Decimal(11, 8)'}

  signal_status              String  @default("PENDING")
  signal_visibility          String  @default("PUBLIC")
  signal_visibility_sanctum  String?

  signal_metadata     Json?  ${isPostgres ? '@db.JsonB' : '@db.Json'}
  signal_payload      Json?  ${isPostgres ? '@db.JsonB' : '@db.Json'}
  signal_history      Json?  ${isPostgres ? '@db.JsonB' : '@db.Json'}
  signal_annotations  Json?  ${isPostgres ? '@db.JsonB' : '@db.Json'}

  ${isPostgres
    ? 'signal_embedding Unsupported("vector(1536)")?'
    : 'signal_embedding Json? @db.Json'
}

  stamp_created   DateTime   @default(now())
  stamp_updated   DateTime?  @updatedAt
  stamp_imported  DateTime?

  synthesis    Synthesis[]      @relation("SynthesisToSignal")
  clusters     ClusterSignal[]

  @@map("signals")
  @@index([realm_id], map: "idx_signal_realm-id")
  @@index([signal_type], map: "idx_signal-type")
  @@index([signal_title], map: "idx_signal-title")
  @@index([signal_author], map: "idx_signal-author")
  @@index([signal_environment], map: "idx_signal-environment")
  @@index([signal_temperature], map: "idx_signal-temperature")
  @@index([signal_density], map: "idx_signal-density")
  @@index([signal_energy], map: "idx_signal-energy")
  @@index([signal_state], map: "idx_signal-state")
  @@index([signal_orientation], map: "idx_signal-orientation")
  @@index([signal_status], map: "idx_signal-status")
  @@index([signal_visibility], map: "idx_signal-visibility")
  @@index([signal_visibility_sanctum], map: "idx_signal-visibility_sanctum")
  ${!isPostgres ? '@@index([signal_latitude], map: "idx_signal_signal-latitude")' : ''}
  ${!isPostgres ? '@@index([signal_longitude], map: "idx_signal_signal-longitude")' : ''}
  ${!isPostgres ? '@@index([signal_latitude, signal_longitude], map: "idx_signal_signal-latitude_signal_signal-longitude")' : ''}
  @@index([stamp_created], map: "idx_signal_stamp-created")
  @@index([stamp_imported], map: "idx_signal_stamp-imported")

}


//
// CLUSTER - STRUCTURED GROUPING OF RELATED SIGNALS
//

model Cluster {

  cluster_id     String  @id @db.VarChar(26)
  realm_id       String  @db.VarChar(26)
  realm          Realm   @relation(fields: [realm_id], references: [realm_id], onDelete: Cascade)

  cluster_type   String  @db.VarChar(50)
  cluster_title  String  @db.VarChar(100)
  cluster_depth  Int     @default(0)

  cluster_annotations  Json?   ${isPostgres ? '@db.JsonB' : '@db.Json'}
  cluster_metadata     Json?   ${isPostgres ? '@db.JsonB' : '@db.Json'}
  cluster_payload      Json?   ${isPostgres ? '@db.JsonB' : '@db.Json'}
  cluster_tags         Json?   ${isPostgres ? '@db.JsonB' : '@db.Json'}
  cluster_state        String  @db.VarChar(50)

  ${isPostgres
    ? 'cluster_embedding Unsupported("vector(1536)")?'
    : 'cluster_embedding Json? @db.Json'
}

  stamp_cluster_start DateTime?
  stamp_cluster_end   DateTime?
  stamp_created       DateTime  @default(now())

  parent_cluster_id  String?    @db.VarChar(26)
  parent_cluster     Cluster?   @relation("ClusterHierarchy", fields: [parent_cluster_id], references: [cluster_id])
  child_clusters     Cluster[]  @relation("ClusterHierarchy")

  signals    ClusterSignal[]
  synthesis  Synthesis[] @relation("SynthesisToCluster")

  @@map("clusters")
  @@index([realm_id], map: "idx_cluster_realm-id")
  @@index([cluster_type], map: "idx_cluster_cluster-type")
  @@index([cluster_title], map: "idx_cluster_cluster-title")
  @@index([cluster_depth], map: "idx_cluster_cluster-depth")
  @@index([cluster_state], map: "idx_cluster_cluster-state")
  @@index([stamp_cluster_start], map: "idx_cluster_stamp-cluster-start")
  @@index([stamp_cluster_end], map: "idx_cluster_stamp-cluster-end")
  @@index([stamp_cluster_start, stamp_cluster_end], map: "idx_cluster_stamp-cluster-start_cluster_stamp-cluster-end")
  @@index([parent_cluster_id], map: "idx_cluster_parent-cluster-id")

}

model ClusterSignal {

  cluster_id  String   @db.VarChar(26)
  signal_id   String   @db.VarChar(26)

  cluster  Cluster  @relation(fields: [cluster_id], references: [cluster_id], onDelete: Cascade)
  signal   Signal   @relation(fields: [signal_id], references: [signal_id], onDelete: Cascade)

  pivot_position  Int?
  pivot_metadata  Json?     ${isPostgres ? '@db.JsonB' : '@db.Json'}
  stamp_added     DateTime  @default(now())

  @@id([cluster_id, signal_id])
  @@map("clusters_signals")
  @@index([cluster_id], map: "idx_clustersignal_cluster-id")
  @@index([signal_id], map: "idx_clustersignal_signal-id")

}


//
// SYNTHESIS -- AI EXTRACTION LAYER
//

model Synthesis {

  synthesis_id       String   @id @db.VarChar(26)
  realm_id           String   @db.VarChar(26)
  realm              Realm    @relation(fields: [realm_id], references: [realm_id], onDelete: Cascade)

  synthesis_type     String   @db.VarChar(50)  // METADATA | REFLECTION
  synthesis_subtype  String   @db.VarChar(50)  // SURFACE, STRUCTURE, PATTERNS | MIRROR, MYTH, NARRATIVE
  synthesis_source   String?  @db.VarChar(100)
  synthesis_depth    Int      @default(0)

  polymorphic_id    String   @db.VarChar(26)
  polymorphic_type  String  @db.VarChar(50)

  signal   Signal?   @relation("SynthesisToSignal", fields: [polymorphic_id], references: [signal_id], onDelete: Cascade, map: "fkey_synthesis_signal-id")
  cluster  Cluster?  @relation("SynthesisToCluster", fields: [polymorphic_id], references: [cluster_id], onDelete: Cascade, map: "fkey_synthesis_cluster-id")

  synthesis_annotations  Json?  ${isPostgres ? '@db.JsonB' : '@db.Json'}
  synthesis_history      Json?  ${isPostgres ? '@db.JsonB' : '@db.Json'}
  synthesis_errors       Json?  ${isPostgres ? '@db.JsonB' : '@db.Json'}
  synthesis_content      Json?  ${isPostgres ? '@db.JsonB' : '@db.Json'}

  ${isPostgres
    ? 'synthesis_embedding Unsupported("vector(1536)")?'
    : 'synthesis_embedding Json? @db.Json'
}

  stamp_created  DateTime   @default(now())
  stamp_updated  DateTime?  @updatedAt

  @@map("synthesis")
  @@index([realm_id], map: "idx_synthesis_realm-id")
  @@index([synthesis_type], map: "idx_synthesis_synthesis-type")
  @@index([synthesis_subtype], map: "idx_synthesis_synthesis-subtype")
  @@index([synthesis_type, synthesis_subtype], map: "idx_synthesis_synthesis-type_synthesis-subtype")
  @@index([synthesis_source], map: "idx_synthesis_synthesis-source")
  @@index([polymorphic_id], map: "idx_synthesis_polymorphic-id")
  @@index([polymorphic_type], map: "idx_synthesis_polymorphic-type")
  @@index([polymorphic_id, polymorphic_type], map: "idx_synthesis_polymorphic-id_synthesis_polymorphic-type")
  @@index([stamp_created], map: "idx_synthesis_stamp_created")

}


//
// USER
//

model User {
  user_id        String   @id @db.VarChar(26)
  user_email     String   @unique
  user_name      String?
  user_password  String   @db.VarChar(255)  // Hashed password

  // Privilege levels
  user_role      String   @default("GUEST") @db.VarChar(20)  // OWNER | SANCTUM | GUEST

  // Ownership tracking
  is_owner       Boolean  @default(false)

  stamp_created  DateTime   @default(now())
  stamp_updated  DateTime?  @updatedAt

  created_realms  Realm[]        @relation("RealmCreator")
  realm_memberships RealmUser[]

  @@map("users")
  @@index([user_email], map: "idx_user_user-email")
  @@index([user_name], map: "idx_user_user-name")
  @@index([user_role], map: "idx_user_user-role")
  @@index([is_owner], map: "idx_user_is-owner")
  @@index([stamp_created], map: "idx_user_stamp-created")
}
`;

const prismaDir = path.join(__dirname, '..', 'prisma');
if (!fs.existsSync(prismaDir)) {
    fs.mkdirSync(prismaDir, { recursive: true });
}

fs.writeFileSync("prisma/schema.prisma", baseSchema, { flag: 'w' });
console.log(`Generated schema for ${isPostgres ? "PostgreSQL" : "MySQL or compatible database"}.`);

if (isPostgres) {
    console.log("⚠IMPORTANT: PostGIS and Embedding features need indexes manually created.");
    console.log("See docs/setup.md for instructions.");
}
