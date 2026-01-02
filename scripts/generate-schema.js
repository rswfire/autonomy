// scripts/generate-schema.js

require("dotenv").config();

const fs = require("fs");

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
//  SIGNAL -- THE ATOMIC UNIT OF LIVED DATA
//

model Signal {

  signal_id           String   @id @default(cuid()) @db.VarChar(26)
  signal_type         String   @db.VarChar(50)
  signal_title        String   @db.VarChar(100)
  signal_description  String?  @db.Text
  signal_author       String   @db.VarChar(50)

  ${isPostgres ? 'signal_location Unsupported("geography(Point, 4326)")? @map("signal_location")' : 'signal_latitude Decimal? @db.Decimal(10, 8)\n  signal_longitude Decimal? @db.Decimal(11, 8)'}

  signal_status      String  @default("PENDING")
  signal_visibility  String  @default("PUBLIC")

  signal_metadata  Json?  ${isPostgres ? '@db.JsonB' : '@db.Json'}
  signal_payload   Json?  ${isPostgres ? '@db.JsonB' : '@db.Json'}
  signal_tags      Json?  ${isPostgres ? '@db.JsonB' : '@db.Json'}

  ${isPostgres
    ? 'signal_embedding Unsupported("vector(1536)")?'
    : 'signal_embedding Json? @db.Json'
  }

  stamp_created   DateTime   @default(now())
  stamp_updated   DateTime?  @updatedAt
  stamp_imported  DateTime?  @default(now())

  metadata     Metadata[]       @relation("MetadataToSignal")
  reflections  Reflection[]     @relation("ReflectionToSignal")
  clusters     ClusterSignal[]

  @@map("signals")
  @@index([signal_type],       map: "idx_signal-type")
  @@index([signal_title],      map: "idx_signal-title")
  @@index([signal_author],     map: "idx_signal-author")
  @@index([signal_status],     map: "idx_signal-status")
  @@index([signal_visibility], map: "idx_signal-visibility")
  ${!isPostgres ? '@@index([signal_latitude], map: "idx_signal_signal-latitude")' : ''}
  ${!isPostgres ? '@@index([signal_longitude], map: "idx_signal_signal-longitude")' : ''}
  ${!isPostgres ? '@@index([signal_latitude, signal_longitude], map: "idx_signal_signal-latitude_signal_signal-longitude")' : ''}
  @@index([stamp_created],     map: "idx_signal_stamp-created")
  @@index([stamp_imported],    map: "idx_signal_stamp-imported")

}


//
// CLUSTER - STRUCTURED GROUPING OF RELATED SIGNALS
//

model Cluster {

  cluster_id     String  @id @default(cuid()) @db.VarChar(26)
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

  signals      ClusterSignal[]
  metadata     Metadata[] @relation("MetadataToCluster")
  reflections  Reflection[] @relation("ReflectionToCluster")

  @@map("clusters")
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

  cluster_id  String  @default(cuid()) @db.VarChar(26)
  signal_id   String  @default(cuid()) @db.VarChar(26)

  cluster  Cluster  @relation(fields: [cluster_id], references: [cluster_id], onDelete: Cascade)
  signal   Signal   @relation(fields: [signal_id], references: [signal_id], onDelete: Cascade)

  position        Int?
  pivot_metadata  Json?     ${isPostgres ? '@db.JsonB' : '@db.Json'}
  stamp_added     DateTime  @default(now())

  @@id([cluster_id, signal_id])
  @@map("clusters_signals")
  @@index([cluster_id], map: "idx_clustersignal_cluster-id")
  @@index([signal_id], map: "idx_clustersignal_signal-id")

}


//
// METADATA -- AI EXTRACTION LAYER
//

model Metadata {

  metadata_id      String   @id @default(cuid()) @db.VarChar(26)
  metadata_type    String   @db.VarChar(50)  // SURFACE, STRUCTURE, PATTERNS
  metadata_source  String?  @db.VarChar(100)
  metadata_depth   Int      @default(0)

  polymorphic_id    String  @default(cuid()) @db.VarChar(26)
  polymorphic_type  String  @db.VarChar(50)

  signal   Signal?   @relation("MetadataToSignal", fields: [polymorphic_id], references: [signal_id], onDelete: Cascade, map: "fkey_metadata_signal-id")
  cluster  Cluster?  @relation("MetadataToCluster", fields: [polymorphic_id], references: [cluster_id], onDelete: Cascade, map: "fkey_metadata_cluster-id")

  metadata_annotations  Json?  ${isPostgres ? '@db.JsonB' : '@db.Json'}
  metadata_history      Json?  ${isPostgres ? '@db.JsonB' : '@db.Json'}
  metadata_errors       Json?  ${isPostgres ? '@db.JsonB' : '@db.Json'}
  metadata_content      Json?  ${isPostgres ? '@db.JsonB' : '@db.Json'}

  ${isPostgres
    ? 'metadata_embedding Unsupported("vector(1536)")?'
    : 'metadata_embedding Json? @db.Json'
}

  stamp_created  DateTime   @default(now())
  stamp_updated  DateTime?  @updatedAt

  @@map("metadata")
  @@index([metadata_type], map: "idx_metadata_metadata-type")
  @@index([metadata_source], map: "idx_metadata_metadata-source")
  @@index([polymorphic_id], map: "idx_metadata_polymorphic-id")
  @@index([polymorphic_type], map: "idx_metadata_polymorphic-type")
  @@index([polymorphic_id, polymorphic_type], map: "idx_metadata_polymorphic-id_metadata_polymorphic-type")
  @@index([stamp_created], map: "idx_metadata_stamp_created")

}


//
// REFLECTION -- AI NARRATIVE SYNTHESIS LAYER
//

model Reflection {

  reflection_id      String   @id @default(cuid()) @db.VarChar(26)
  reflection_type    String   @db.VarChar(50)  // MIRROR, MYTH, NARRATIVE
  reflection_source  String?  @db.VarChar(100)
  reflection_depth   Int      @default(0)

  polymorphic_id    String  @default(cuid()) @db.VarChar(26)
  polymorphic_type  String  @db.VarChar(50)

  signal   Signal?   @relation("ReflectionToSignal", fields: [polymorphic_id], references: [signal_id], onDelete: Cascade, map: "fkey_reflection_signal-id")
  cluster  Cluster?  @relation("ReflectionToCluster", fields: [polymorphic_id], references: [cluster_id], onDelete: Cascade, map: "fkey_reflection_cluster-id")

  reflection_annotations  Json?  ${isPostgres ? '@db.JsonB' : '@db.Json'}
  reflection_history      Json?  ${isPostgres ? '@db.JsonB' : '@db.Json'}
  reflection_errors       Json?  ${isPostgres ? '@db.JsonB' : '@db.Json'}
  reflection_content      Json?  ${isPostgres ? '@db.JsonB' : '@db.Json'}

  ${isPostgres
    ? 'reflection_embedding Unsupported("vector(1536)")?'
    : 'reflection_embedding Json? @db.Json'
  }

  stamp_created  DateTime   @default(now())
  stamp_updated  DateTime?  @updatedAt

  @@map("reflections")
  @@index([reflection_type], map: "idx_reflection_reflection-type")
  @@index([reflection_source], map: "idx_reflection_reflection-source")
  @@index([polymorphic_id], map: "idx_reflection_polymorphic-id")
  @@index([polymorphic_type], map: "idx_reflection_polymorphic-type")
  @@index([polymorphic_id, polymorphic_type], map: "idx_reflection_polymorphic-id_reflection_polymorphic-type")
  @@index([stamp_created], map: "idx_reflection_stamp_created")

}


// ============================================================================
// USER - Basic user model
// ============================================================================

model User {
  user_id     String   @id @default(cuid()) @db.VarChar(26)
  user_email  String   @unique
  user_name   String?

  stamp_created  DateTime   @default(now())
  stamp_updated  DateTime?  @updatedAt

  @@map("users")
  @@index([user_email], map: "idx_user_user-email")
  @@index([user_name], map: "idx_user_user-name")
  @@index([stamp_created], map: "idx_user_stamp-created")
}
`;

fs.writeFileSync("prisma/schema.prisma", baseSchema);
console.log(`Generated schema for ${isPostgres ? "PostgreSQL" : "MySQL or compatible database"}.`);

if (isPostgres) {
    console.log("⚠IMPORTANT: PostGIS and Embedding features need indexes manually created.");
    console.log("See docs/setup.md for instructions.");
}
